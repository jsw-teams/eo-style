async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  return res.json();
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function libraryCard(lib) {
  const keywords = Array.isArray(lib.keywords) ? lib.keywords.slice(0, 6) : [];
  return `
    <article class="card">
      <div class="card-head">
        <h3><a href="${escapeHtml(lib.detailPage)}">${escapeHtml(lib.title)}</a></h3>
        <span class="badge">${escapeHtml(lib.latestVersion || "N/A")}</span>
      </div>
      <p class="card-desc">${escapeHtml(lib.description || "暂无简介")}</p>
      <div class="tag-list">
        ${keywords.length ? keywords.map(k => `<span class="tag">${escapeHtml(k)}</span>`).join("") : `<span class="tag">暂无关键词</span>`}
      </div>
      <div class="card-meta">
        <span>许可：${escapeHtml(lib.license || "未知")}</span>
        <a href="${escapeHtml(lib.detailPage)}">查看详情</a>
      </div>
    </article>
  `;
}

function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function normalizeText(v) {
  return String(v || "").trim().toLowerCase();
}

function scoreItem(item, keyword) {
  const q = normalizeText(keyword);
  if (!q) return 0;

  const name = normalizeText(item.name);
  const title = normalizeText(item.title);
  const desc = normalizeText(item.description);
  const license = normalizeText(item.license);
  const version = normalizeText(item.latestVersion);
  const keywords = (item.keywords || []).map(normalizeText);

  let score = 0;
  if (name === q) score += 100;
  if (title === q) score += 90;
  if (name.includes(q)) score += 60;
  if (title.includes(q)) score += 50;
  if (keywords.some(k => k === q)) score += 40;
  if (keywords.some(k => k.includes(q))) score += 25;
  if (desc.includes(q)) score += 15;
  if (license.includes(q)) score += 10;
  if (version.includes(q)) score += 8;

  return score;
}

function searchItems(items, keyword) {
  const q = normalizeText(keyword);
  if (!q) return items;

  return items
    .map(item => ({ item, score: scoreItem(item, q) }))
    .filter(row => row.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "zh-CN"))
    .map(row => row.item);
}

async function main() {
  const [siteConfig, librariesPayload, searchPayload] = await Promise.all([
    fetchJson("/data/site.json"),
    fetchJson("/data/libraries.json"),
    fetchJson("/data/search.json")
  ]);

  if (siteConfig?.siteName) {
    document.title = siteConfig.siteName;
    const brand = document.querySelector(".brand");
    if (brand) brand.textContent = siteConfig.siteName;
  }

  if (siteConfig?.siteDescription) {
    const desc = document.getElementById("siteDesc");
    if (desc) desc.textContent = siteConfig.siteDescription;
  }

  const formLink = document.getElementById("formLink");
  if (formLink && siteConfig?.formUrl) {
    formLink.href = siteConfig.formUrl;
  }

  const footerText = document.getElementById("footerText");
  if (footerText && siteConfig?.footerText) {
    footerText.textContent = siteConfig.footerText;
  }

  const libraries = librariesPayload.libraries || [];
  const searchItemsData = searchPayload.items || [];
  const featured = libraries.filter(lib => lib.featured);

  setHtml(
    "featuredLibraries",
    featured.length
      ? featured.map(libraryCard).join("")
      : `<div class="empty-state">暂无热门推荐，请在对应库的 meta.json 中设置 "featured": true。</div>`
  );

  setHtml(
    "allLibraryList",
    libraries.length
      ? libraries.map(libraryCard).join("")
      : `<div class="empty-state">当前还没有任何库，请向 lib/ 中添加库目录后重新构建。</div>`
  );

  const libraryCount = document.getElementById("libraryCount");
  if (libraryCount) {
    libraryCount.textContent = `${libraries.length} 个库`;
  }

  const searchInput = document.getElementById("searchInput");
  const searchMeta = document.getElementById("searchMeta");
  const searchResults = document.getElementById("searchResults");

  function renderSearch(keyword) {
    const result = searchItems(searchItemsData, keyword);

    if (searchMeta) {
      searchMeta.textContent = keyword
        ? `搜索“${keyword}”共匹配 ${result.length} 项`
        : `已加载 ${searchItemsData.length} 项搜索索引`;
    }

    if (!searchResults) return;

    if (!keyword) {
      searchResults.innerHTML = `<div class="empty-state">输入关键词后即可在本地搜索索引中即时检索，无需任何后端接口。</div>`;
      return;
    }

    if (!result.length) {
      searchResults.innerHTML = `<div class="empty-state">没有找到匹配项，请尝试更短的关键词。</div>`;
      return;
    }

    const libraryMap = new Map(libraries.map(lib => [lib.name, lib]));
    searchResults.innerHTML = result
      .map(item => libraryMap.get(item.name))
      .filter(Boolean)
      .map(libraryCard)
      .join("");
  }

  renderSearch("");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderSearch(e.target.value || "");
    });
  }
}

main().catch((err) => {
  console.error(err);
  const meta = document.getElementById("searchMeta");
  if (meta) {
    meta.textContent = "加载失败，请检查 /data/site.json、/data/libraries.json、/data/search.json 是否已正确生成。";
  }
});