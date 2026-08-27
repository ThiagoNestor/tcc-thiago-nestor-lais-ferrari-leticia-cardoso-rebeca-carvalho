const SUGESTOES = [
  "Quais PANCs posso plantar em vaso?",
  "Como cuidar da ora-pro-nóbis?",
  "Receitas com taioba",
];

const EDEN_URL = SUPABASE_URL + "/functions/v1/eden";

const box = document.getElementById("mensagens");
const form = document.getElementById("form-eden");
const campo = document.getElementById("texto");

let mensagens = [
  {
    role: "assistant",
    content: "Olá! Sou a Eden 🌱 Como posso te ajudar hoje?",
  },
];

let pensando = false;


// ==========================================
// FORMATAÇÃO DAS RESPOSTAS DA EDEN
// ==========================================

function formatarMarkdown(texto) {
  const seguro = esc(texto);

  return seguro
    // **texto** -> negrito
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")

    // Quebras de linha
    .replace(/\n/g, "<br>");
}


// ==========================================
// RENDERIZAÇÃO DO CHAT
// ==========================================

function render() {

  if (!box) {
    console.error("ERRO: elemento #mensagens não encontrado.");
    return;
  }

  box.innerHTML =
    mensagens
      .map(
        (m) =>
          `<div class="msg ${m.role === "user" ? "user" : "eden"}">` +
          (m.role === "assistant"
            ? '<div class="avatar">E</div>'
            : "") +
          `<div class="bubble">${formatarMarkdown(m.content)}</div>` +
          `</div>`
      )
      .join("") +

    (pensando
      ? `
        <div class="msg eden">
          <div class="avatar">E</div>
          <div class="bubble">Pensando…</div>
        </div>
      `
      : "") +

    (mensagens.length === 1
      ? '<div class="chips">' +
        SUGESTOES.map(
          (s) =>
            `<button
              class="chip"
              type="button"
              data-s="${esc(s)}"
            >
              ${esc(s)}
            </button>`
        ).join("") +
        "</div>"
      : "");


  // ========================================
  // BOTÕES DE SUGESTÃO
  // ========================================

  box.querySelectorAll("button[data-s]").forEach((b) => {

    b.addEventListener("click", () => {
      enviar(b.dataset.s);
    });

  });


  // Desce automaticamente para a mensagem nova
  box.scrollTop = box.scrollHeight;
}


// ==========================================
// ENVIO DE MENSAGEM PARA A EDEN
// ==========================================

async function enviar(pergunta) {

  const conteudo = (pergunta || "").trim();

  if (!conteudo || pensando) return;


  // Adiciona a mensagem do usuário
  mensagens = mensagens.concat({
    role: "user",
    content: conteudo,
  });


  // Limpa o campo
  campo.value = "";

  pensando = true;

  render();


  try {

    // ========================================
    // BUSCA A SESSÃO DO USUÁRIO
    // ========================================

    const { data } = await db.auth.getSession();


    // ========================================
    // ENVIA PARA A EDGE FUNCTION
    // ========================================

    const resposta = await fetch(EDEN_URL, {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

        apikey: SUPABASE_KEY,

        Authorization:
          "Bearer " +
          (data.session
            ? data.session.access_token
            : SUPABASE_KEY),

      },

      body: JSON.stringify({
        messages: mensagens.slice(-12),
      }),

    });


    // ========================================
    // RECEBE A RESPOSTA
    // ========================================

    const json = await resposta.json();


    if (!resposta.ok) {

      throw new Error(
        json.error ||
        "Não consegui responder agora."
      );

    }


    // ========================================
    // ADICIONA RESPOSTA DA EDEN
    // ========================================

    mensagens = mensagens.concat({

      role: "assistant",

      content: json.resposta,

    });


  } catch (e) {

    // ========================================
    // ERRO
    // ========================================

    mensagens = mensagens.concat({

      role: "assistant",

      content:
        e.message ||
        "Não consegui responder agora. Tente de novo.",

    });


  } finally {

    pensando = false;

    render();

  }
}


// ==========================================
// ENVIO PELO FORMULÁRIO
// ==========================================

form.addEventListener("submit", (e) => {

  e.preventDefault();

  enviar(campo.value);

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

(async () => {

  const user = await requireAuth();

  if (!user) return;

  render();

})();


// ==========================================
// SETA PARA DESCER O CHAT
// ==========================================

const mensagensChat =
  document.getElementById("mensagens");

const btnDescerChat =
  document.getElementById("btnDescerChat");


function atualizarSetaChat() {

  if (!mensagensChat || !btnDescerChat) return;


  const distanciaDoFinal =

    mensagensChat.scrollHeight -

    mensagensChat.scrollTop -

    mensagensChat.clientHeight;


  // Se estiver mais de 80px acima do final,
  // mostramos a seta.

  btnDescerChat.hidden =
    distanciaDoFinal < 80;

}


// ==========================================
// DETECTA O SCROLL DO CHAT
// ==========================================

mensagensChat?.addEventListener(
  "scroll",
  atualizarSetaChat
);


// ==========================================
// CLIQUE NA SETA
// ==========================================

btnDescerChat?.addEventListener(
  "click",
  () => {

    mensagensChat.scrollTo({

      top: mensagensChat.scrollHeight,

      behavior: "smooth",

    });

  }
);


// ==========================================
// VERIFICAÇÃO INICIAL
// ==========================================

atualizarSetaChat();