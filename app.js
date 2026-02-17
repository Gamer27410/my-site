// ====== 1) SHU YERDAN FAYL QO‘SHASAN ======
// Fayl yo‘li: files/ ichidagi nomi bilan bir xil bo‘lsin.
const FILES = [
  {
    title: "Rufus 4.12",
    filename: "rufus-4.12.exe",
    path: "files/rufus-4.12.exe",
    about: "Kompyuter uchun kerakli utilitalar to‘plami. O‘rnatish bo‘yicha qisqa yo‘riqnoma ichida.",
    tags: [".EXE", "Tools"],
    size: "28 MB",
    date: "2026-02-17"
  },
  {
    title: "Setup Installer",
    filename: "setup.exe",
    path: "files/setup.exe",
    about: "Dastur o‘rnatish fayli. Antivirus ogohlantirsa, manbasini tekshirib keyin ishlating.",
    tags: ["EXE", "Installer"],
    size: "12 MB",
    date: "2026-02-10"
  },
  {
    title: "Qo‘llanma (PDF)",
    filename: "guide.pdf",
    path: "files/guide.pdf",
    about: "Fayllardan foydalanish bo‘yicha PDF yo‘riqnoma.",
    tags: ["PDF", "Guide"],
    size: "1.2 MB",
    date: "2026-01-28"
  }
];

// ====== 2) UI LOGIC ======
const listEl = document.getElementById("list");
const searchEl = document.getElementById("search");
const sortEl = document.getElementById("sort");
const countPill = document.getElementById("countPill");
const yearEl = document.getElementById("year");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

yearEl.textContent = new Date().getFullYear();

let page = 1;
const perPage = 6;

function safeText(s){
  return String(s ?? "").replace(/[<>]/g, "");
}

function normalize(s){
  return String(s ?? "").toLowerCase().trim();
}

function applySort(arr, mode){
  const copy = [...arr];
  if (mode === "az") copy.sort((a,b)=> normalize(a.title).localeCompare(normalize(b.title)));
  if (mode === "za") copy.sort((a,b)=> normalize(b.title).localeCompare(normalize(a.title)));
  if (mode === "new") copy.sort((a,b)=> (b.date||"").localeCompare(a.date||""));
  if (mode === "old") copy.sort((a,b)=> (a.date||"").localeCompare(b.date||""));
  return copy;
}

function applyFilter(arr, q){
  const query = normalize(q);
  if (!query) return arr;
  return arr.filter(x => {
    const hay = [
      x.title, x.filename, x.about,
      ...(x.tags || [])
    ].map(normalize).join(" ");
    return hay.includes(query);
  });
}

function paginate(arr, p){
  const totalPages = Math.max(1, Math.ceil(arr.length / perPage));
  const current = Math.min(Math.max(1, p), totalPages);
  const start = (current - 1) * perPage;
  const slice = arr.slice(start, start + perPage);
  return { slice, totalPages, current };
}

function render(){
  const q = searchEl.value;
  const mode = sortEl.value;

  const filtered = applyFilter(FILES, q);
  const sorted = applySort(filtered, mode);

  const { slice, totalPages, current } = paginate(sorted, page);
  page = current;

  countPill.textContent = `${filtered.length} ta fayl`;
  pageInfo.textContent = `${current} / ${totalPages}`;

  prevBtn.disabled = current <= 1;
  nextBtn.disabled = current >= totalPages;

  listEl.innerHTML = slice.map(item => cardHTML(item)).join("") || emptyHTML();
}

function emptyHTML(){
  return `
    <div class="card">
      <h3>Hech narsa topilmadi</h3>
      <p class="desc">Qidiruv so‘zini o‘zgartiring yoki ro‘yxatga yangi fayl qo‘shing (app.js ichidan).</p>
      <div class="actions">
        <button class="btn ghost" onclick="resetSearch()">Qidiruvni tozalash</button>
        <span class="small">🔎</span>
      </div>
    </div>
  `;
}

function cardHTML(item){
  const title = safeText(item.title);
  const filename = safeText(item.filename);
  const about = safeText(item.about);
  const size = safeText(item.size || "");
  const date = safeText(item.date || "");

  const tags = (item.tags || []).slice(0, 6).map(t => `<span class="tag">${safeText(t)}</span>`).join("");

  // Download: <a href="..." download> — statik hostingda ishlaydi (Netlify/GitHub Pages)
  return `
    <article class="card">
      <h3>${title}</h3>
      <div class="meta">
        ${tags}
        ${size ? `<span class="tag">📦 ${size}</span>` : ""}
        ${date ? `<span class="tag">📅 ${date}</span>` : ""}
      </div>
      <p class="desc">${about}</p>
      <div class="actions">
        <a class="btn primary" href="${item.path}" download>
          ⬇️ Yuklab olish
        </a>
        <span class="small">${filename}</span>
      </div>
    </article>
  `;
}

function resetSearch(){
  searchEl.value = "";
  page = 1;
  render();
}

searchEl.addEventListener("input", () => { page = 1; render(); });
sortEl.addEventListener("change", () => { page = 1; render(); });

prevBtn.addEventListener("click", () => { page -= 1; render(); });
nextBtn.addEventListener("click", () => { page += 1; render(); });

render();
