/* Growly — núcleo compartilhado (JS puro, sem build) */
const SUPABASE_URL = "https://gjsweqyckjxycbwzzqys.supabase.co";

const SUPABASE_KEY = "sb_publishable_MKPsiIWRlD_aVnRwiMY1Cg_MSeatyF0";

const db = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const ASSETS = {
  cardExplorar: "assets/card-explorar.png",
  cardIdentificar: "assets/card-identificar.png",
  cardJardim: "assets/card-jardim.png",
  cardSuporte: "assets/card-suporte.png",
  iconCamera: "assets/icon-camera.png",
  iconConfig: "assets/icon-config.png",
  iconEden: "assets/icon-eden.png",
  iconHome: "assets/icon-home.png",
  iconPesquisar: "assets/icon-pesquisar.png",
  iconSuporte: "assets/icon-suporte.png",
  iconVoltar: "assets/icon-voltar.png",
  leavesBottomRight: "assets/leaves-bottom-right.png",
  leavesTopLeft: "assets/leaves-top-left.png",
  leavesTopRight: "assets/leaves-top-right.png",
  logoInicio: "assets/logo-inicio.png",
  logoMenu: "assets/logo-menu.png",
};

const PLANT_IMAGES = {
  azedinha: "assets/Azedinha.png",
  "ora-pro-nobis": "assets/Ora-Pro-Nobis.jpg",
  taioba: "assets/Taioba.png",
  vinagreira: "assets/Vinagreira.jpg",
  capuchinha: "assets/capuchinha.jpg",
  peixinho: "assets/peixinho-da-horta.jpg",
  tanchagem: "assets/tanchagem.jpg",
};

function plantImage(slug) {
  return PLANT_IMAGES[slug] || PLANT_IMAGES.tanchagem;
}

/** Escapa texto vindo do banco antes de injetar no HTML. */
function esc(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const NAV_ITEMS = [
  { href: "home.html", label: "Início", icon: ASSETS.iconHome },
  { href: "explorar.html", label: "Explorar", icon: ASSETS.iconPesquisar },
  { href: "eden.html", label: "Eden IA", icon: ASSETS.iconEden },
  { href: "suporte.html", label: "Suporte", icon: ASSETS.iconSuporte },
  { href: "configuracoes.html", label: "Config", icon: ASSETS.iconConfig },
];

/** Renderiza a barra inferior dentro de <nav class="bottom-nav" data-nav>. */
function mountNav() {
  const nav = document.querySelector("[data-nav]");
  if (!nav) return;
  const atual = location.pathname.split("/").pop() || "index.html";
  nav.innerHTML =
    "<ul>" +
    NAV_ITEMS.map(
      (item) =>
        `<li><a href="${item.href}" class="${item.href === atual ? "active" : ""}">` +
        `<img src="${item.icon}" alt=""><span>${item.label}</span></a></li>`,
    ).join("") +
    "</ul>";
}

/** Preenche as folhas decorativas marcadas com data-leaf="top-left|top-right|bottom-right". */
function mountLeaves() {
  document.querySelectorAll("[data-leaf]").forEach((el) => {
    const pos = el.getAttribute("data-leaf");
    const src =
      pos === "top-left"
        ? ASSETS.leavesTopLeft
        : pos === "top-right"
          ? ASSETS.leavesTopRight
          : ASSETS.leavesBottomRight;
    el.src = src;
    el.className = "leaf " + pos;
    el.alt = "";
    el.setAttribute("aria-hidden", "true");
  });
}

/** Cabeçalho com botão voltar. */
function mountHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;
  const titulo = header.getAttribute("data-header");
  header.className = "page-header";
  header.innerHTML =
    `<button type="button" class="back-btn" aria-label="Voltar"><img src="${ASSETS.iconVoltar}" alt=""></button>` +
    `<h1 class="page-title">${esc(titulo)}</h1><div style="width:2rem"></div>`;
  header.querySelector("button").addEventListener("click", () => {
    if (history.length > 1) history.back();
    else location.href = "home.html";
  });
}

/** Garante sessão ativa; redireciona para login.html se não houver. */
async function requireAuth() {
  const { data } = await db.auth.getSession();
  if (!data.session) {
    location.replace("login.html");
    return null;
  }
  return data.session.user;
}

async function carregarPancs() {
  const { data, error } = await db.from("pancs").select("*").order("nome");
  if (error) throw error;
  return data;
}

async function carregarJardim() {
  const { data, error } = await db.from("jardim").select("panc_id");
  if (error) throw error;
  return data.map((row) => row.panc_id);
}

async function alternarJardim(userId, pancId, salvo) {
  if (salvo) {
    const { error } = await db.from("jardim").delete().eq("user_id", userId).eq("panc_id", pancId);
    if (error) throw error;
  } else {
    const { error } = await db.from("jardim").insert({ user_id: userId, panc_id: pancId });
    if (error) throw error;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  mountLeaves();
  mountHeader();
  mountNav();
});
