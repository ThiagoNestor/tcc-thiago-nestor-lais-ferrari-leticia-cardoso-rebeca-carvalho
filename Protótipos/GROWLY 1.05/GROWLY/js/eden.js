const SUGESTOES = [
  "Quais PANCs posso plantar em vaso?",
  "Como cuidar da ora-pro-nóbis?",
  "Receitas com taioba",
];

const EDEN_URL = SUPABASE_URL + "/functions/v1/eden";

const box = document.getElementById("mensagens");
const form = document.getElementById("form-eden");
const campo = document.getElementById("texto");

let mensagens = [{ role: "assistant", content: "Olá! Sou a Eden 🌱 Como posso te ajudar hoje?" }];
let pensando = false;

function render() {
  box.innerHTML =
    mensagens
      .map(
        (m) =>
          `<div class="msg ${m.role === "user" ? "user" : "eden"}">` +
          (m.role === "assistant" ? '<div class="avatar">E</div>' : "") +
          `<div class="bubble">${esc(m.content)}</div></div>`,
      )
      .join("") +
    (pensando ? '<div class="msg eden"><div class="avatar">E</div><div class="bubble">Pensando…</div></div>' : "") +
    (mensagens.length === 1
      ? '<div class="chips">' +
        SUGESTOES.map((s) => `<button class="chip" type="button" data-s="${esc(s)}">${esc(s)}</button>`).join("") +
        "</div>"
      : "");

  box.querySelectorAll("button[data-s]").forEach((b) =>
    b.addEventListener("click", () => enviar(b.dataset.s)),
  );
  box.scrollTop = box.scrollHeight;
}

async function enviar(pergunta) {
  const conteudo = (pergunta || "").trim();
  if (!conteudo || pensando) return;

  mensagens = mensagens.concat({ role: "user", content: conteudo });
  campo.value = "";
  pensando = true;
  render();

  try {
    const { data } = await db.auth.getSession();
    const resposta = await fetch(EDEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: "Bearer " + (data.session ? data.session.access_token : SUPABASE_KEY),
      },
      body: JSON.stringify({ messages: mensagens.slice(-12) }),
    });
    const json = await resposta.json();
    if (!resposta.ok) throw new Error(json.error || "Não consegui responder agora.");
    mensagens = mensagens.concat({ role: "assistant", content: json.resposta });
  } catch (e) {
    mensagens = mensagens.concat({
      role: "assistant",
      content: e.message || "Não consegui responder agora. Tente de novo.",
    });
  } finally {
    pensando = false;
    render();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  enviar(campo.value);
});

(async () => {
  const user = await requireAuth();
  if (!user) return;
  render();
})();
