
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
  const seguro = esc(String(texto ?? ""));

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
    console.error(
      "ERRO: elemento #mensagens não encontrado."
    );
    return;
  }

  box.innerHTML =
    mensagens
      .map((m) => {
        const usuario = m.role === "user";

        const avatar = usuario
          ? ""
          : '<div class="avatar"><img src="assets/logo-eden.png" alt="Logo da Eden"></div>';

        return (
          `<div class="msg ${usuario ? "user" : "eden"}">` +
          avatar +
          `<div class="bubble">${formatarMarkdown(m.content)}</div>` +
          `</div>`
        );
      })
      .join("") +

    (pensando
      ? `
        <div class="msg eden">
          <div class="avatar">
            <img
              src="assets/logo-eden.png"
              alt="Logo da Eden"
            >
          </div>
          <div class="bubble">Pensando…</div>
        </div>
      `
      : "") +

    (mensagens.length === 1
      ? '<div class="chips">' +
        SUGESTOES.map(
          (s) => `
            <button
              class="chip"
              type="button"
              data-s="${esc(s)}"
            >
              ${esc(s)}
            </button>
          `
        ).join("") +
        "</div>"
      : "");


  // ========================================
  // BOTÕES DE SUGESTÃO
  // ========================================

  box.querySelectorAll("button[data-s]").forEach((botao) => {
    botao.addEventListener("click", () => {
      enviar(botao.dataset.s);
    });
  });


  // Desce automaticamente para a última mensagem
  box.scrollTop = box.scrollHeight;

  atualizarSetaChat();
}


// ==========================================
// ENVIO DE MENSAGEM PARA A EDEN
// ==========================================

async function enviar(pergunta) {
  const conteudo = (pergunta || "").trim();

  if (!conteudo || pensando) {
    return;
  }

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
    // VALIDAÇÃO DO USUÁRIO
    // ========================================

    const {
      data: { user },
      error: authError,
    } = await db.auth.getUser();

    if (authError || !user) {
      throw new Error(
        "Sua sessão expirou. Faça login novamente para conversar com a Eden."
      );
    }


    // ========================================
    // OBTÉM A SESSÃO
    // ========================================

    const {
      data: { session },
      error: sessionError,
    } = await db.auth.getSession();

    if (
      sessionError ||
      !session?.access_token
    ) {
      throw new Error(
        "Sessão inválida. Faça login novamente."
      );
    }


    // ========================================
    // ENVIA PARA A EDGE FUNCTION
    // ========================================

    const resposta = await fetch(EDEN_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
      },

      body: JSON.stringify({
        messages: mensagens.slice(-12),
      }),
    });


    // ========================================
    // RECEBE A RESPOSTA
    // ========================================

    let json;

    try {
      json = await resposta.json();
    } catch {
      throw new Error(
        "A Eden recebeu uma resposta inválida do servidor."
      );
    }

    if (!resposta.ok) {
      throw new Error(
        json?.error ||
        "Não consegui responder agora."
      );
    }

    if (
      typeof json?.resposta !== "string" ||
      !json.resposta.trim()
    ) {
      throw new Error(
        "A Eden não conseguiu gerar uma resposta."
      );
    }


    // ========================================
    // ADICIONA A RESPOSTA DA EDEN
    // ========================================

    mensagens = mensagens.concat({
      role: "assistant",
      content: json.resposta,
    });

  } catch (erro) {
    console.error(
      "Erro ao conversar com a Eden:",
      erro
    );

    mensagens = mensagens.concat({
      role: "assistant",
      content:
        erro.message ||
        "Não consegui responder agora. Tente novamente.",
    });

  } finally {
    pensando = false;
    render();
  }
}


// ==========================================
// ENVIO PELO FORMULÁRIO
// ==========================================

form?.addEventListener("submit", (evento) => {
  evento.preventDefault();

  enviar(campo.value);
});


// ==========================================
// SETA PARA DESCER O CHAT
// ==========================================

const mensagensChat =
  document.getElementById("mensagens");

const btnDescerChat =
  document.getElementById("btnDescerChat");


function atualizarSetaChat() {
  if (!mensagensChat || !btnDescerChat) {
    return;
  }

  const distanciaDoFinal =
    mensagensChat.scrollHeight -
    mensagensChat.scrollTop -
    mensagensChat.clientHeight;

  btnDescerChat.hidden = distanciaDoFinal < 80;
}


// ==========================================
// DETECTA A ROLAGEM DO CHAT
// ==========================================

mensagensChat?.addEventListener(
  "scroll",
  atualizarSetaChat
);


// ==========================================
// CLIQUE NA SETA
// ==========================================

btnDescerChat?.addEventListener("click", () => {
  mensagensChat?.scrollTo({
    top: mensagensChat.scrollHeight,
    behavior: "smooth",
  });
});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

(async () => {
  const user = await requireAuth();

  if (!user) {
    return;
  }

  render();
})();
