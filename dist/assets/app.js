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
  const keywords = Array.isArray(lib.keywords) ? lib.keywords.slice(0, 5) : [];
  return `
    <article class="card">
      <div class="card-head">
        <h3><a href="${escapeHtml(lib.detailPage)}">${escapeHtml(lib.title)}</a></h3>
        <span class="badge">${escapeHtml(lib.latestVersion || "N/A")}</span>
      </div>
      <p class="card-desc">${escapeHtml(lib.description || "")}</p>
      <div class="tag-list">
        ${keywords.map(k => `<span class="tag">${escapeHtml(k)}</span>`).join("")}
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
  if (!q) return [];

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
    const brand = document.getElementById("brand");
    const heroTitle = document.getElementById("heroTitle");
    if (brand) brand.textContent = siteConfig.siteName;
    if (heroTitle) heroTitle.textContent = siteConfig.siteName;
  }

  const formLink = document.getElementById("formLink");
  if (formLink && siteConfig?.formUrl) {
    formLink.href = siteConfig.formUrl;
  }

  const libraries = librariesPayload.libraries || [];
  const searchItemsData = searchPayload.items || [];
  const featured = libraries.filter(lib => lib.featured);

  setHtml(
    "featuredLibraries",
    featured.length ? featured.map(libraryCard).join("") : ""
  );

  setHtml(
    "allLibraryList",
    libraries.length ? libraries.map(libraryCard).join("") : ""
  );

  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  function renderSearch(keyword) {
    if (!searchResults) return;

    const result = searchItems(searchItemsData, keyword);

    if (!keyword) {
      searchResults.innerHTML = "";
      return;
    }

    if (!result.length) {
      searchResults.innerHTML = `<div class="empty-state">未找到结果</div>`;
      return;
    }

    const libraryMap = new Map(libraries.map(lib => [lib.name, lib]));
    searchResults.innerHTML = result
      .map(item => libraryMap.get(item.name))
      .filter(Boolean)
      .map(libraryCard)
      .join("");
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderSearch(e.target.value || "");
    });
  }
}

main().catch((err) => {
  console.error(err);
});