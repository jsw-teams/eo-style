import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import zlib from "node:zlib";

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, "libraries.manifest.json");
const libDir = path.join(rootDir, "lib");
const tempRoot = path.join(os.tmpdir(), "eo-style-sync");
const NPM_REGISTRY = "https://registry.npmjs.org";

function normalizeSlashes(p) {
  return p.replace(/\\/g, "/");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function cleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const text = raw.trim();
  if (!text) {
    throw new Error(`JSON 文件为空: ${normalizeSlashes(path.relative(rootDir, filePath))}`);
  }
  return JSON.parse(text);
}

function parseVersionForSort(version) {
  return String(version)
    .replace(/^v/i, "")
    .split(/[\.-]/)
    .map((part) => {
      const n = Number(part);
      return Number.isFinite(n) ? n : part;
    });
}

function compareVersionsAsc(a, b) {
  const aa = parseVersionForSort(a);
  const bb = parseVersionForSort(b);
  const len = Math.max(aa.length, bb.length);

  for (let i = 0; i < len; i++) {
    const av = aa[i] ?? 0;
    const bv = bb[i] ?? 0;

    const aNum = typeof av === "number";
    const bNum = typeof bv === "number";

    if (aNum && bNum) {
      if (av !== bv) return av - bv;
      continue;
    }

    const as = String(av);
    const bs = String(bv);
    if (as !== bs) return as.localeCompare(bs);
  }

  return 0;
}

function compareVersionsDesc(a, b) {
  return compareVersionsAsc(b, a);
}

function escapeRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function globToRegExp(glob) {
  let re = "^";
  let i = 0;

  while (i < glob.length) {
    const c = glob[i];

    if (c === "*") {
      if (glob[i + 1] === "*") {
        if (glob[i + 2] === "/") {
          re += "(?:.*/)?";
          i += 3;
        } else {
          re += ".*";
          i += 2;
        }
      } else {
        re += "[^/]*";
        i += 1;
      }
      continue;
    }

    if (c === "?") {
      re += ".";
      i += 1;
      continue;
    }

    re += escapeRegExp(c);
    i += 1;
  }

  re += "$";
  return new RegExp(re);
}

function matchGlob(filePath, glob) {
  return globToRegExp(normalizeSlashes(glob)).test(normalizeSlashes(filePath));
}

function shouldInclude(filePath, includes, excludes) {
  const normalized = normalizeSlashes(filePath);
  const ext = path.extname(normalized).toLowerCase();

  if (![".js", ".mjs", ".css"].includes(ext)) {
    return false;
  }

  const included = includes.length
    ? includes.some((g) => matchGlob(normalized, g))
    : true;

  if (!included) return false;

  const excluded = excludes.some((g) => matchGlob(normalized, g));
  return !excluded;
}

async function walkFiles(dir, baseDir = dir) {
  const result = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...await walkFiles(fullPath, baseDir));
    } else {
      result.push({
        fullPath,
        relativePath: normalizeSlashes(path.relative(baseDir, fullPath))
      });
    }
  }

  return result;
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { accept: "application/json" }
  });

  if (!res.ok) {
    throw new Error(`请求失败: ${url} -> ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function downloadFile(url, destPath) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`下载失败: ${url} -> ${res.status} ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  await ensureDir(path.dirname(destPath));
  await fs.writeFile(destPath, Buffer.from(arrayBuffer));
}

function getRegistryPackageUrl(pkg) {
  return `${NPM_REGISTRY}/${encodeURIComponent(pkg)}`;
}

async function getPackageMeta(pkg) {
  return fetchJson(getRegistryPackageUrl(pkg));
}

function resolveVersions(library, packageMeta) {
  const allVersions = Object.keys(packageMeta.versions || {}).sort(compareVersionsAsc);

  if (!allVersions.length) {
    throw new Error(`npm registry 未返回版本: ${library.package}`);
  }

  if (library.versions === "all") {
    return allVersions;
  }

  if (typeof library.versions === "string" && /^latest-\d+$/i.test(library.versions)) {
    const keep = Number(library.versions.split("-")[1]);
    return allVersions.slice(-keep);
  }

  if (Array.isArray(library.versions)) {
    return library.versions.filter((v) => allVersions.includes(v));
  }

  return allVersions;
}

function getTarballUrl(packageMeta, version, pkgName) {
  const versionMeta = packageMeta.versions?.[version];
  const tarball = versionMeta?.dist?.tarball;

  if (!tarball) {
    throw new Error(`未找到 tarball 地址: ${pkgName}@${version}`);
  }

  return tarball;
}

function readString(buf, start, length) {
  return buf
    .subarray(start, start + length)
    .toString("utf8")
    .replace(/\0.*$/, "")
    .trim();
}

function readOctal(buf, start, length) {
  const text = readString(buf, start, length).replace(/\0/g, "").trim();
  if (!text) return 0;
  return parseInt(text, 8) || 0;
}

async function extractTarGzPureNode(tgzPath, destDir) {
  await ensureDir(destDir);

  const gz = await fs.readFile(tgzPath);
  const tar = zlib.gunzipSync(gz);

  let offset = 0;
  const blockSize = 512;

  while (offset + blockSize <= tar.length) {
    const header = tar.subarray(offset, offset + blockSize);

    let isEmpty = true;
    for (let i = 0; i < header.length; i++) {
      if (header[i] !== 0) {
        isEmpty = false;
        break;
      }
    }
    if (isEmpty) break;

    const name = readString(header, 0, 100);
    const prefix = readString(header, 345, 155);
    const typeflag = readString(header, 156, 1) || "0";
    const size = readOctal(header, 124, 12);

    const entryName = normalizeSlashes(prefix ? `${prefix}/${name}` : name);
    const dataStart = offset + blockSize;
    const dataEnd = dataStart + size;

    const safeName = entryName.replace(/^\/+/, "");
    const outPath = path.join(destDir, safeName);

    if (typeflag === "5") {
      await ensureDir(outPath);
    } else if (typeflag === "0" || typeflag === "\0" || typeflag === "") {
      await ensureDir(path.dirname(outPath));
      await fs.writeFile(outPath, tar.subarray(dataStart, dataEnd));
    }

    offset = dataStart + Math.ceil(size / blockSize) * blockSize;
  }
}

async function copyFilePreserve(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

async function writeMeta(library, versions) {
  const latestVersion = [...versions].sort(compareVersionsDesc)[0] || "";

  const meta = {
    name: library.name,
    title: library.title || library.name,
    description: library.description || `${library.title || library.name} 静态资源镜像`,
    keywords: Array.isArray(library.keywords) ? library.keywords : [],
    license: library.license || "",
    homepage: library.homepage || "",
    featured: Boolean(library.featured),
    latestVersion
  };

  await fs.writeFile(
    path.join(libDir, library.name, "meta.json"),
    JSON.stringify(meta, null, 2),
    "utf8"
  );
}

async function syncLibrary(library) {
  if (!library.name || !library.package) {
    throw new Error(`manifest 条目缺少 name 或 package: ${JSON.stringify(library)}`);
  }

  const includes = Array.isArray(library.include) ? library.include : [];
  const excludes = Array.isArray(library.exclude) ? library.exclude : [];

  console.log(`\n==> Sync ${library.name}`);

  const packageMeta = await getPackageMeta(library.package);
  const versions = resolveVersions(library, packageMeta);

  if (!versions.length) {
    throw new Error(`没有可同步版本: ${library.name}`);
  }

  const libraryRoot = path.join(libDir, library.name);
  await cleanDir(libraryRoot);

  let copiedAnyVersion = false;

  for (const version of versions) {
    console.log(`  -> ${library.package}@${version}`);

    const versionTempDir = path.join(tempRoot, library.name, version);
    await cleanDir(versionTempDir);

    const tarballUrl = getTarballUrl(packageMeta, version, library.package);
    const tarballPath = path.join(versionTempDir, `${library.name}-${version}.tgz`);

    await downloadFile(tarballUrl, tarballPath);

    const extractDir = path.join(versionTempDir, "extract");
    await extractTarGzPureNode(tarballPath, extractDir);

    const packageRoot = path.join(extractDir, "package");
    if (!existsSync(packageRoot)) {
      throw new Error(`解压后未找到 package 目录: ${library.name}@${version}`);
    }

    const files = await walkFiles(packageRoot, packageRoot);
    const selected = files.filter((file) => shouldInclude(file.relativePath, includes, excludes));

    if (!selected.length) {
      console.log("     no matched files");
      continue;
    }

    for (const file of selected) {
      const dest = path.join(libraryRoot, version, file.relativePath);
      await copyFilePreserve(file.fullPath, dest);
    }

    copiedAnyVersion = true;
    console.log(`     copied ${selected.length} files`);
  }

  if (!copiedAnyVersion) {
    console.log("     warning: no versions produced matched files");
  }

  await writeMeta(library, versions);
}

async function main() {
  const manifest = await readJson(manifestPath);
  const libraries = Array.isArray(manifest.libraries) ? manifest.libraries : [];

  if (!libraries.length) {
    throw new Error("libraries.manifest.json 中没有 libraries");
  }

  await ensureDir(libDir);
  await cleanDir(tempRoot);

  for (const library of libraries) {
    await syncLibrary(library);
  }

  await fs.rm(tempRoot, { recursive: true, force: true });
  console.log("\nAll libraries synced.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});