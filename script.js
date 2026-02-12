const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

const form = document.getElementById("contactForm");
const hint = document.getElementById("hint");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  hint.textContent = "✅ Xabar qabul qilindi (hozircha demo). Keyin serverga ulaymiz!";
  form.reset();
});
// ===== PRODUCTS MODAL + SEARCH + PAGINATION =====
const openProducts = document.getElementById("openProducts");
const productsModal = document.getElementById("productsModal");
const closeProducts = document.getElementById("closeProducts");
const xClose = document.getElementById("xClose");

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

const pageSize = 10;
let currentPage = 1;

function openModal(){
  productsModal.classList.add("show");
  productsModal.setAttribute("aria-hidden", "false");
  currentPage = 1;
  searchInput.value = "";
  renderProducts();
}

function closeModal(){
  productsModal.classList.remove("show");
  productsModal.setAttribute("aria-hidden", "true");
}

openProducts?.addEventListener("click", openModal);
closeProducts?.addEventListener("click", closeModal);
xClose?.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && productsModal.classList.contains("show")) closeModal();
});

function getAllProducts(){
  return Array.from(productsGrid.querySelectorAll(".product"));
}

function filterProducts(items){
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return items;

  return items.filter(el => {
    const name = (el.dataset.name || "").toLowerCase();
    const price = (el.dataset.price || "").toLowerCase();
    return name.includes(q) || price.includes(q);
  });
}

function renderProducts(){
  const all = getAllProducts();
  const filtered = filterProducts(all);

  // nechta page chiqishini hisoblaymiz
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;

  // hammasini yashiramiz
  all.forEach(el => el.style.display = "none");

  // shu page dagilarni ko'rsatamiz
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  filtered.slice(start, end).forEach(el => el.style.display = "block");

  // pager yangilash
  pageInfo.textContent = `${currentPage} / ${totalPages}`;
  prevPage.disabled = currentPage === 1;
  nextPage.disabled = currentPage === totalPages;
}

searchInput?.addEventListener("input", () => {
  currentPage = 1;
  renderProducts();
});

prevPage?.addEventListener("click", () => {
  currentPage = Math.max(1, currentPage - 1);
  renderProducts();
});

nextPage?.addEventListener("click", () => {
  currentPage = currentPage + 1;
  renderProducts();
});

