let usuario = null;
let pancs = [];
let jardim = [];

const lista = document.getElementById("lista");
const busca = document.getElementById("busca");

function render() {
  const q = busca.value.trim().toLowerCase();
  const filtradas = !q
    ? pancs
    : pancs.filter(
        (p) =>
          p.nome.toLowerCase().includes(q) || (p.nome_cientifico || "").toLowerCase().includes(q),
      );

  if (filtradas.length === 0) {
    lista.innerHTML = '<p class="empty">Nenhuma planta encontrada.</p>';
    return;
  }

  lista.innerHTML = filtradas
    .map((p) => {
      const salva = jardim.includes(p.id);
      return `<article class="plant-card">
        <img class="plant-thumb" src="${plantImage(p.imagem)}" alt="${esc(p.nome)}" loading="lazy">
        <div class="plant-body">
          <h3>${esc(p.nome)}</h3>
          <p class="sci">${esc(p.nome_cientifico)}</p>
          <p class="desc">${esc(p.descricao)}</p>
          <div class="result-block"><h4>Usos</h4><p class="result-text">${esc(p.usos)}</p></div>
          <div class="result-block" style="margin-bottom:0.85rem"><h4>Cuidados</h4><p class="result-text">${esc(p.cuidados)}</p></div>
          <button class="plant-btn ${salva ? "saved" : "add"}" data-id="${esc(p.id)}" data-salva="${salva}">
            ${salva ? "✓ No meu jardim" : "+ Adicionar ao jardim"}
          </button>
        </div>
      </article>`;
    })
    .join("");

  lista.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      try {
        await alternarJardim(usuario.id, btn.dataset.id, btn.dataset.salva === "true");
        jardim = await carregarJardim();
        render();
      } catch (e) {
        btn.disabled = false;
        alert(e.message || "Não foi possível atualizar seu jardim.");
      }
    });
  });
}

busca.addEventListener("input", render);

(async () => {
  usuario = await requireAuth();
  if (!usuario) return;
  try {
pancs = await carregarPancs();

/*
  Por enquanto, o modelo de identificação do Growly
  reconhece apenas as espécies treinadas.

  Azedinha e Capuchinha continuam cadastradas no banco,
  mas não aparecem no Explorar até serem adicionadas
  ao modelo de IA.
*/
pancs = pancs.filter((p) => {
  const nome = p.nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return nome !== "azedinha" && nome !== "capuchinha";
});

jardim = await carregarJardim();

render();
  } catch (e) {
    lista.innerHTML = '<p class="empty">Não foi possível carregar as plantas.</p>';
  }
})();
