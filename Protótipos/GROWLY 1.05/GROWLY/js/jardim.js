let usuario = null;
let pancs = [];
let jardim = [];

const lista = document.getElementById("lista");

function render() {
  const plantas = pancs.filter((p) => jardim.includes(p.id));

  if (plantas.length === 0) {
    lista.innerHTML =
      '<div class="empty-box"><p>Seu jardim está vazio.</p><a class="pill-btn primary" href="explorar.html">Explorar plantas</a></div>';
    return;
  }

  lista.innerHTML = plantas
    .map(
      (p) => `<article class="plant-card">
        <img class="plant-thumb" src="${plantImage(p.imagem)}" alt="${esc(p.nome)}" loading="lazy">
        <div class="plant-body">
          <h3>${esc(p.nome)}</h3>
          <p class="sci">${esc(p.nome_cientifico)}</p>
          <p class="desc">${esc(p.descricao)}</p>
          <button class="plant-btn remove" data-id="${esc(p.id)}">Remover do jardim</button>
        </div>
      </article>`,
    )
    .join("");

  lista.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await alternarJardim(usuario.id, btn.dataset.id, true);
        jardim = await carregarJardim();
        render();
      } catch (e) {
        btn.disabled = false;
        alert(e.message || "Não foi possível remover a planta.");
      }
    });
  });
}

(async () => {
  usuario = await requireAuth();
  if (!usuario) return;
  try {
    pancs = await carregarPancs();
    jardim = await carregarJardim();
    render();
  } catch (e) {
    lista.innerHTML = '<p class="empty">Não foi possível carregar seu jardim.</p>';
  }
})();
