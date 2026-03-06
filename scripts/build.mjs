import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

const rootDir = process.cwd();
const srcDir = path.join(rootDir, "src");
const libDir = path.join(rootDir, "lib");
const distDir = path.join(rootDir, "dist");
const dataDir = path.join(distDir, "data");
const librariesPageDir = path.join(distDir, "libraries");

const configPath = path.join(rootDir, "site.config.json");

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeSlashes(p) {
  return p.replace(/\\/g, "/");
}

function ensureLeadingSlash(p) {
  return p.startsWith("/") ? p : `/${p}`;
}

function stripTrailingSlash(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function joinUrl(base, pathname) {
  return `${stripTrailingSlash(base)}${ensureLeadingSlash(pathname)}`;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function cleanDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await ensureDir(dir);
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await ensureDir(path.dirname(destPath));
      await fs.copyFile(srcPath, destPath);
    }
  }
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

function isVersionDirName(name) {
  if (!name) return false;
  if (name.startsWith(".")) return false;
  return !name.endsWith(".json");
}

function parseVersionForSort(version) {
  const parts = String(version)
    .replace(/^v/i, "")
    .split(/[\.-]/)
    .map((part) => {
      const n = Number(part);
      return Number.isFinite(n) ? n : part;
    });
  return parts;
}

function compareVersionsDesc(a, b) {
  const aa = parseVersionForSort(a);
  const bb = parseVersionForSort(b);
  const len = Math.max(aa.length, bb.length);

  for (let i = 0; i < len; i++) {
    const av = aa[i] ?? 0;
    const bv = bb[i] ?? 0;

    const aNum = typeof av === "number";
    const bNum = typeof bv === "number";

    if (aNum && bNum) {
      if (av !== bv) return bv - av;
      continue;
    }

    const as = String(av);
    const bs = String(bv);
    if (as !== bs) return bs.localeCompare(as);
  }

  return 0;
}

function guessFileType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".css") return "css";
  if (ext === ".js" || ext === ".mjs") return "js";
  return "file";
}

function pickLatestVersion(meta, versionNames) {
  if (meta.latestVersion && versionNames.includes(meta.latestVersion)) {
    return meta.latestVersion;
  }
  const sorted = [...versionNames].sort(compareVersionsDesc);
  return sorted[0] || "";
}

function buildSnippetExamples(latestFiles, siteUrl) {
  const cssFiles = latestFiles.filter((f) => f.type === "css");
  const jsFiles = latestFiles.filter((f) => f.type === "js");

  const cssExample = cssFiles[0]
    ? `<link rel="stylesheet" href="${joinUrl(siteUrl, cssFiles[0].urlPath)}">`
    : "";

  const jsExample = jsFiles[0]
    ? `<script src="${joinUrl(siteUrl, jsFiles[0].urlPath)}"></script>`
    : "";

  return { cssExample, jsExample };
}

function renderListItems(items) {
  if (!items.length) return `<li>暂无</li>`;
  return items.map((item) => `<li>${item}</li>`).join("\n");
}

function renderFileTableRows(files, siteUrl) {
  if (!files.length) {
    return `<tr><td colspan="3">暂无文件</td></tr>`;
  }

  return files.map((file) => {
    const fullUrl = joinUrl(siteUrl, file.urlPath);
    return `
      <tr>
        <td><code>${escapeHtml(file.version)}</code></td>
        <td><code>${escapeHtml(file.relativePath)}</code></td>
        <td><a href="${escapeHtml(fullUrl)}">${escapeHtml(fullUrl)}</a></td>
      </tr>
    `;
  }).join("\n");
}

function replaceTokens(template, tokens) {
  let output = template;
  for (const [key, value] of Object.entries(tokens)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }
  return output;
}

async function generateLibraryPages({ libraries, template, config }) {
  for (const lib of libraries) {
    const libraryDir = path.join(librariesPageDir, lib.name);
    await ensureDir(libraryDir);

    const latestVersionObj = lib.versions.find((v) => v.version === lib.latestVersion);
    const latestFiles = latestVersionObj ? latestVersionObj.files : [];
    const { cssExample, jsExample } = buildSnippetExamples(latestFiles, config.siteUrl);

    const versionsHtml = renderListItems(
      lib.versions.map((v) => {
        return `<code>${escapeHtml(v.version)}</code>（${v.files.length} 个文件）`;
      })
    );

    const fileTableRows = renderFileTableRows(lib.files, config.siteUrl);
    const keywordsHtml = lib.keywords.length
      ? lib.keywords.map((k) => `<span class="tag">${escapeHtml(k)}</span>`).join(" ")
      : `<span class="tag">暂无关键词</span>`;

    const seoDescription = escapeHtml(lib.description || `${lib.title} 静态资源镜像`);
    const seoTitle = escapeHtml(`${lib.title} - ${config.siteName}`);
    const canonicalUrl = joinUrl(config.siteUrl, lib.detailPage);
    const jsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: lib.title,
      description: lib.description,
      url: canonicalUrl,
      codeRepository: lib.homepage || canonicalUrl,
      license: lib.license || "",
      keywords: lib.keywords || []
    });

    const html = replaceTokens(template, {
      SEO_TITLE: seoTitle,
      SEO_DESCRIPTION: seoDescription,
      SEO_KEYWORDS: escapeHtml([lib.name, ...lib.keywords].join(", ")),
      CANONICAL_URL: escapeHtml(canonicalUrl),
      SITE_NAME: escapeHtml(config.siteName),
      PAGE_TITLE: escapeHtml(lib.title),
      LIB_NAME: escapeHtml(lib.name),
      LIB_DESCRIPTION: escapeHtml(lib.description),
      LIB_HOMEPAGE: escapeHtml(lib.homepage || "#"),
      LIB_LICENSE: escapeHtml(lib.license || "未知"),
      LIB_LATEST_VERSION: escapeHtml(lib.latestVersion || "未知"),
      LIB_KEYWORDS_HTML: keywordsHtml,
      LIB_VERSIONS_HTML: versionsHtml,
      LIB_FILE_ROWS: fileTableRows,
      CSS_EXAMPLE: escapeHtml(cssExample || "暂无 CSS 引用示例"),
      JS_EXAMPLE: escapeHtml(jsExample || "暂无 JS 引用示例"),
      JSON_LD: escapeHtml(jsonLd),
      HOME_URL: escapeHtml(joinUrl(config.siteUrl, "/")),
      HOME_PATH: "/"
    });

    await fs.writeFile(path.join(libraryDir, "index.html"), html, "utf8");
  }
}

function buildSearchIndex(libraries) {
  return libraries.map((lib) => ({
    name: lib.name,
    title: lib.title,
    description: lib.description,
    keywords: lib.keywords,
    license: lib.license,
    latestVersion: lib.latestVersion,
    detailPage: lib.detailPage
  }));
}

function buildSitemapXml(urls) {
  const items = urls.map((url) => {
    return `<url><loc>${escapeHtml(url)}</loc></url>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${items}
</urlset>
`;
}

async function scanLibraries(config) {
  if (!existsSync(libDir)) {
    return [];
  }

  const entries = await fs.readdir(libDir, { withFileTypes: true });
  const libraries = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const name = entry.name;
    const libraryRoot = path.join(libDir, name);
    const metaPath = path.join(libraryRoot, "meta.json");

    if (!existsSync(metaPath)) {
      throw new Error(`缺少元数据文件: ${normalizeSlashes(path.relative(rootDir, metaPath))}`);
    }

    const meta = await readJson(metaPath);
    const dirEntries = await fs.readdir(libraryRoot, { withFileTypes: true });
    const versionNames = dirEntries
      .filter((d) => d.isDirectory() && isVersionDirName(d.name))
      .map((d) => d.name)
      .sort(compareVersionsDesc);

    const latestVersion = pickLatestVersion(meta, versionNames);

    const versions = [];
    const allFiles = [];

    for (const version of versionNames) {
      const versionDir = path.join(libraryRoot, version);
      const files = await walkFiles(versionDir, versionDir);

      const mappedFiles = files.map((file) => {
        const urlPath = normalizeSlashes(path.join("lib", name, version, file.relativePath));
        return {
          version,
          relativePath: file.relativePath,
          urlPath: ensureLeadingSlash(urlPath),
          type: guessFileType(file.relativePath)
        };
      });

      versions.push({
        version,
        files: mappedFiles
      });

      allFiles.push(...mappedFiles);
    }

    const item = {
      name: meta.name || name,
      title: meta.title || name,
      description: meta.description || "",
      keywords: Array.isArray(meta.keywords) ? meta.keywords : [],
      license: meta.license || "",
      homepage: meta.homepage || "",
      featured: Boolean(meta.featured),
      detailPage: `/libraries/${name}/`,
      latestVersion,
      versions,
      files: allFiles
    };

    libraries.push(item);
  }

  libraries.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
  return libraries;
}

async function main() {
  const config = await readJson(configPath);

  await cleanDir(distDir);
  await ensureDir(dataDir);
  await ensureDir(librariesPageDir);

  const assetsSrc = path.join(srcDir, "assets");
  const assetsDist = path.join(distDir, "assets");
  if (existsSync(assetsSrc)) {
    await copyDir(assetsSrc, assetsDist);
  }

  const staticFiles = ["index.html", "404.html"];
  for (const fileName of staticFiles) {
    const srcPath = path.join(srcDir, fileName);
    const distPath = path.join(distDir, fileName);
    if (existsSync(srcPath)) {
      await fs.copyFile(srcPath, distPath);
    }
  }

  if (existsSync(libDir)) {
    await copyDir(libDir, path.join(distDir, "lib"));
  }

  const libraries = await scanLibraries(config);
  const searchIndex = buildSearchIndex(libraries);

  await fs.writeFile(
    path.join(dataDir, "libraries.json"),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      site: {
        name: config.siteName,
        description: config.siteDescription,
        url: config.siteUrl
      },
      libraries
    }, null, 2),
    "utf8"
  );

  await fs.writeFile(
    path.join(dataDir, "search.json"),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      items: searchIndex
    }, null, 2),
    "utf8"
  );

  const detailTemplate = await fs.readFile(path.join(srcDir, "templates", "detail.html"), "utf8");
  await generateLibraryPages({ libraries, template: detailTemplate, config });

  const allDistFiles = await walkFiles(distDir, distDir);
  const sitemapUrls = allDistFiles
    .map((item) => {
      const rel = normalizeSlashes(item.relativePath);
      if (rel.endsWith(".html")) {
        if (rel === "index.html") return joinUrl(config.siteUrl, "/");
        if (rel === "404.html") return null;
        if (rel.endsWith("/index.html")) {
          return joinUrl(config.siteUrl, rel.replace(/index\.html$/, ""));
        }
      }
      return joinUrl(config.siteUrl, `/${rel}`);
    })
    .filter(Boolean);

  const sitemapXml = buildSitemapXml([...new Set(sitemapUrls)]);
  await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemapXml, "utf8");

  console.log(`Build completed.`);
  console.log(`Libraries: ${libraries.length}`);
  console.log(`Output: ${distDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});