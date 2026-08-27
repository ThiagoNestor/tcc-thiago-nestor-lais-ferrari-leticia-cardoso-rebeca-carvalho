// ==========================================
// GROWLY
// REVISÃO ADMINISTRATIVA DE IMAGENS
// ==========================================


// ==========================================
// CONFIGURAÇÕES
// ==========================================

const BUCKET_TREINAMENTO = "imagens-treinamento";

const LIMITE_SWIPE = 110;

const TEMPO_URL_ASSINADA = 60 * 60;

const QUANTIDADE_PRELOAD = 3;

const TEMPO_ANIMACAO = 230;


// ==========================================
// ESTADO
// ==========================================

let usuarioAdmin = null;

let imagensPendentes = [];

let pancsRevisao = [];

let imagemAtual = null;

let totalInicial = 0;

let totalRevisado = 0;

let processandoRevisao = false;

let historicoRevisao = [];


// ==========================================
// CACHE / PRELOAD
// ==========================================

const cacheImagens = new Map();

const preloadEmAndamento = new Map();


// ==========================================
// ELEMENTOS
// ==========================================

const card =
  document.getElementById("revisao-card");

const imagem =
  document.getElementById("revisao-imagem");

const especie =
  document.getElementById("revisao-especie");

const rotulo =
  document.getElementById("revisao-rotulo");

const confianca =
  document.getElementById("revisao-confianca");

const barraConfianca =
  document.getElementById(
    "revisao-confianca-preenchimento"
  );

const contador =
  document.getElementById("contador-revisao");

const pendentes =
  document.getElementById("pendentes-revisao");

const carregando =
  document.getElementById("revisao-carregando");

const vazio =
  document.getElementById("revisao-vazio");

const negado =
  document.getElementById("revisao-negado");

const acoes =
  document.getElementById("revisao-acoes");

const btnAprovar =
  document.getElementById("btn-aprovar");

const btnRejeitar =
  document.getElementById("btn-rejeitar");

const btnCorrigir =
  document.getElementById(
    "btn-corrigir-especie"
  );

const btnDesfazer =
  document.getElementById(
    "btn-desfazer-revisao"
  );

const overlayAprovar =
  document.getElementById("overlay-aprovar");

const overlayRejeitar =
  document.getElementById("overlay-rejeitar");


// ==========================================
// MODAL
// ==========================================

const modal =
  document.getElementById(
    "modal-corrigir-especie"
  );

const selectEspecie =
  document.getElementById(
    "select-especie-correta"
  );

const btnConfirmarCorrecao =
  document.getElementById(
    "btn-confirmar-correcao"
  );

const btnFecharCorrecao =
  document.getElementById(
    "btn-fechar-correcao"
  );

const modalBackdrop =
  modal?.querySelector(
    ".revisao-modal-backdrop"
  );


// ==========================================
// SWIPE
// ==========================================

let arrastando = false;

let pointerIdAtual = null;

let inicioX = 0;

let inicioY = 0;

let deslocamentoX = 0;

let deslocamentoY = 0;


// ==========================================
// AUXILIARES
// ==========================================

function esperar(ms) {

  return new Promise(
    (resolve) =>
      setTimeout(resolve, ms)
  );
}


function esperarPintura() {

  return new Promise(
    (resolve) => {

      requestAnimationFrame(
        () => {

          requestAnimationFrame(
            resolve
          );

        }
      );

    }
  );
}


function encontrarPancRevisao(pancId) {

  return (
    pancsRevisao.find(
      (panc) =>
        String(panc.id) ===
        String(pancId)
    ) || null
  );
}


function nomePanc(pancId) {

  const panc =
    encontrarPancRevisao(pancId);

  return panc
    ? panc.nome
    : "Espécie não encontrada";
}


// ==========================================
// TELAS
// ==========================================

function esconderTudo() {

  card.hidden = true;

  carregando.hidden = true;

  vazio.hidden = true;

  negado.hidden = true;

  acoes.hidden = true;

  btnCorrigir.hidden = true;
}


function mostrarCarregando() {

  esconderTudo();

  carregando.hidden = false;
}


function mostrarNegado() {

  esconderTudo();

  negado.hidden = false;
}


function mostrarVazio() {

  esconderTudo();

  vazio.hidden = false;

  atualizarContadores();
}


// ==========================================
// CONTADORES
// ==========================================

function atualizarContadores() {

  const restantes =
    imagensPendentes.length +
    (imagemAtual ? 1 : 0);


  pendentes.textContent =
    `${restantes} ${
      restantes === 1
        ? "pendente"
        : "pendentes"
    }`;


  if (totalInicial === 0) {

    contador.textContent =
      "0 de 0";

    return;
  }


  const posicao =
    Math.min(
      totalRevisado + 1,
      totalInicial
    );


  contador.textContent =
    restantes > 0
      ? `${posicao} de ${totalInicial}`
      : `${totalInicial} de ${totalInicial}`;
}


// ==========================================
// ADMIN
// ==========================================

async function verificarAdmin(userId) {

  const {
    data,
    error
  } =
    await db
      .from("admins")
      .select("user_id")
      .eq(
        "user_id",
        userId
      )
      .maybeSingle();


  if (error) {

    console.error(
      "Erro ao verificar administrador:",
      error
    );

    return false;
  }


  return Boolean(data);
}


// ==========================================
// PANCS
// ==========================================

async function carregarPancsRevisao() {

  const {
    data,
    error
  } =
    await db
      .from("pancs")
      .select(
        "id, nome, slug"
      )
      .order(
        "nome",
        {
          ascending: true
        }
      );


  if (error) {
    throw error;
  }


  pancsRevisao =
    data || [];


  preencherSelectPancs();
}


// ==========================================
// SELECT DE CORREÇÃO
// ==========================================

function preencherSelectPancs() {

  if (!selectEspecie) {
    return;
  }


  selectEspecie.innerHTML = `

    <option value="">
      Selecione uma espécie
    </option>

    ${pancsRevisao
      .map(
        (panc) => `

          <option
            value="${panc.id}"
          >
            ${esc(panc.nome)}
          </option>

        `
      )
      .join("")}

  `;
}


// ==========================================
// IMAGENS PENDENTES
// ==========================================

async function carregarPendentes() {

  const {
    data,
    error
  } =
    await db
      .from(
        "imagens_treinamento"
      )
      .select(`
        id,
        user_id,
        panc_id,
        identificacao_id,
        caminho_storage,
        rotulo_ia,
        confiabilidade,
        autorizado,
        status,
        criado_em
      `)
      .eq(
        "status",
        "pendente"
      )
      .eq(
        "autorizado",
        true
      )
      .order(
        "criado_em",
        {
          ascending: true
        }
      );


  if (error) {
    throw error;
  }


  imagensPendentes =
    data || [];


  totalInicial =
    imagensPendentes.length;


  totalRevisado = 0;


  atualizarContadores();
}


// ==========================================
// PRELOAD DA IMAGEM
// ==========================================

function preloadImagemNavegador(url) {

  return new Promise(
    (resolve, reject) => {

      const img = new Image();


      img.onload =
        () => resolve();


      img.onerror =
        () =>
          reject(
            new Error(
              "Falha no preload da imagem."
            )
          );


      img.src = url;

    }
  );
}


// ==========================================
// URL TEMPORÁRIA
// ==========================================

async function obterUrlImagem(caminho) {

  if (
    cacheImagens.has(caminho)
  ) {

    return cacheImagens.get(
      caminho
    );
  }


  if (
    preloadEmAndamento.has(caminho)
  ) {

    return preloadEmAndamento.get(
      caminho
    );
  }


  const promessa =
    (async () => {

      const {
        data,
        error
      } =
        await db.storage
          .from(
            BUCKET_TREINAMENTO
          )
          .createSignedUrl(
            caminho,
            TEMPO_URL_ASSINADA
          );


      if (error) {
        throw error;
      }


      const url =
        data.signedUrl;


      await preloadImagemNavegador(
        url
      );


      cacheImagens.set(
        caminho,
        url
      );


      preloadEmAndamento.delete(
        caminho
      );


      return url;

    })();


  preloadEmAndamento.set(
    caminho,
    promessa
  );


  try {

    return await promessa;

  } catch (error) {

    preloadEmAndamento.delete(
      caminho
    );

    throw error;
  }
}


// ==========================================
// PRÓXIMAS 3 IMAGENS
// ==========================================

function prepararProximasImagens() {

  const proximas =
    imagensPendentes.slice(
      0,
      QUANTIDADE_PRELOAD
    );


  proximas.forEach(
    (item) => {

      const caminho =
        item.caminho_storage;


      if (
        cacheImagens.has(caminho) ||
        preloadEmAndamento.has(caminho)
      ) {

        return;
      }


      obterUrlImagem(caminho)
        .then(
          () => {

            console.log(
              "Imagem pré-carregada:",
              item.id
            );

          }
        )
        .catch(
          (error) => {

            console.warn(
              "Falha no preload:",
              item.id,
              error
            );

          }
        );

    }
  );
}


// ==========================================
// RESETAR CARD
// ==========================================

function resetarCard() {

  if (!card) {
    return;
  }


  card.classList.remove(
    "arrastando",
    "saindo-direita",
    "saindo-esquerda"
  );


  card.style.transition = "";

  card.style.transform = "";

  card.style.opacity = "";


  overlayAprovar
    .classList
    .remove("ativo");

  overlayRejeitar
    .classList
    .remove("ativo");


  overlayAprovar.style.opacity = "";

  overlayRejeitar.style.opacity = "";

  overlayAprovar.style.transform = "";

  overlayRejeitar.style.transform = "";
}


// ==========================================
// MOSTRAR PRÓXIMA
// ==========================================

async function mostrarProximaImagem() {

  resetarCard();


  if (
    imagensPendentes.length === 0
  ) {

    imagemAtual = null;

    mostrarVazio();

    return;
  }


  imagemAtual =
    imagensPendentes.shift();


  atualizarContadores();


  try {

    const url =
      await obterUrlImagem(
        imagemAtual.caminho_storage
      );


    imagem.src = url;


    especie.textContent =
      nomePanc(
        imagemAtual.panc_id
      );


    rotulo.textContent =
      imagemAtual.rotulo_ia ||
      "Sem rótulo";


    const valorConfianca =
      Number(
        imagemAtual.confiabilidade
      ) || 0;


    confianca.textContent =
      `${valorConfianca.toFixed(1)}%`;


    barraConfianca.style.width =
      `${Math.min(
        Math.max(
          valorConfianca,
          0
        ),
        100
      )}%`;


    carregando.hidden = true;

    vazio.hidden = true;

    negado.hidden = true;

    card.hidden = false;

    acoes.hidden = false;

    btnCorrigir.hidden = false;


    prepararProximasImagens();


  } catch (error) {

    console.error(
      "Erro ao abrir imagem:",
      error
    );


    imagensPendentes.push(
      imagemAtual
    );


    imagemAtual = null;


    alert(
      "Não foi possível abrir uma das imagens."
    );


    mostrarProximaImagem();
  }
}


// ==========================================
// CACHE
// ==========================================

function removerImagemDoCache(item) {

  if (
    !item ||
    !item.caminho_storage
  ) {
    return;
  }


  cacheImagens.delete(
    item.caminho_storage
  );


  preloadEmAndamento.delete(
    item.caminho_storage
  );
}


// ==========================================
// STORAGE - NOMES E SLUGS
// ==========================================

function nomeArquivoStorage(caminho) {

  return caminho
    .split("/")
    .pop();
}


function slugSeguro(valor) {

  return String(
    valor || "sem-especie"
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );
}


function gerarNomeUnico(
  caminhoOriginal
) {

  const nomeOriginal =
    nomeArquivoStorage(
      caminhoOriginal
    );


  const ponto =
    nomeOriginal.lastIndexOf(".");


  const extensao =
    ponto !== -1
      ? nomeOriginal.substring(
          ponto
        )
      : ".jpg";


  const identificador =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"

      ? crypto.randomUUID()

      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;


  return (
    `${identificador}${extensao}`
  );
}


function obterSlugPanc(pancId) {

  const panc =
    encontrarPancRevisao(
      pancId
    );


  if (!panc) {

    return "sem-especie";
  }


  return slugSeguro(
    panc.slug ||
    panc.nome
  );
}


// ==========================================
// CAMINHOS
// ==========================================

function caminhoImagemAprovada(
  item,
  pancId
) {

  const slug =
    obterSlugPanc(
      pancId
    );


  const nome =
    gerarNomeUnico(
      item.caminho_storage
    );


  return (
    `aprovadas/${slug}/${nome}`
  );
}


function caminhoImagemRejeitada(item) {

  const nome =
    gerarNomeUnico(
      item.caminho_storage
    );


  return (
    `rejeitadas/${nome}`
  );
}


// ==========================================
// MOVER STORAGE
// ==========================================

async function moverArquivoStorage(
  caminhoAtual,
  caminhoNovo
) {

  if (
    caminhoAtual === caminhoNovo
  ) {
    return;
  }


  const {
    error
  } =
    await db.storage
      .from(
        BUCKET_TREINAMENTO
      )
      .move(
        caminhoAtual,
        caminhoNovo
      );


  if (error) {

    console.error(
      "Erro ao mover arquivo:",
      error
    );

    throw error;
  }
}


// ==========================================
// ATUALIZAR BANCO
// ==========================================

async function atualizarImagem(
  id,
  alteracoes
) {

  const {
    error
  } =
    await db
      .from(
        "imagens_treinamento"
      )
      .update(
        alteracoes
      )
      .eq(
        "id",
        id
      );


  if (error) {
    throw error;
  }
}


// ==========================================
// STORAGE + BANCO
// ==========================================

async function salvarRevisaoComStorage(
  item,
  novoStatus,
  pancIdFinal = item.panc_id
) {

  const caminhoOriginal =
    item.caminho_storage;


  const caminhoNovo =
    novoStatus === "aprovada"

      ? caminhoImagemAprovada(
          item,
          pancIdFinal
        )

      : caminhoImagemRejeitada(
          item
        );


  // Primeiro move fisicamente.
  await moverArquivoStorage(
    caminhoOriginal,
    caminhoNovo
  );


  try {

    // Depois atualiza o registro.
    await atualizarImagem(
      item.id,
      {

        status:
          novoStatus,

        panc_id:
          pancIdFinal,

        caminho_storage:
          caminhoNovo

      }
    );


  } catch (error) {

    console.error(
      "Banco falhou após mover. Revertendo Storage...",
      error
    );


    try {

      await moverArquivoStorage(
        caminhoNovo,
        caminhoOriginal
      );

    } catch (erroRollback) {

      console.error(
        "ERRO CRÍTICO NO ROLLBACK:",
        erroRollback
      );
    }


    throw error;
  }


  return {
    caminhoOriginal,
    caminhoNovo
  };
}


// ==========================================
// ANIMAÇÃO DE DECISÃO
// ==========================================

async function animarDecisao(
  novoStatus
) {

  const aprovando =
    novoStatus === "aprovada";


  card.style.transition =
    `transform ${TEMPO_ANIMACAO}ms cubic-bezier(.22,.8,.3,1), opacity ${TEMPO_ANIMACAO}ms ease`;


  if (aprovando) {

    overlayAprovar
      .classList
      .add("ativo");

    overlayRejeitar
      .classList
      .remove("ativo");


    overlayAprovar.style.opacity =
      "1";


    card.style.transform =
      "translate3d(130%, 0, 0) rotate(18deg)";


  } else {

    overlayRejeitar
      .classList
      .add("ativo");

    overlayAprovar
      .classList
      .remove("ativo");


    overlayRejeitar.style.opacity =
      "1";


    card.style.transform =
      "translate3d(-130%, 0, 0) rotate(-18deg)";
  }


  /*
    Dá oportunidade para o navegador
    desenhar emoji/card ANTES da rede.
  */

  await esperarPintura();
}


// ==========================================
// APROVAR / REJEITAR
// ==========================================

async function revisarImagem(
  novoStatus
) {

  if (
    !imagemAtual ||
    processandoRevisao
  ) {
    return;
  }


  processandoRevisao = true;


  const item =
    imagemAtual;


  try {

    /*
      Começa visualmente na hora.
    */

    await animarDecisao(
      novoStatus
    );


    /*
      Storage/banco acontecem enquanto
      a animação termina.
    */

    const [
      movimentacao
    ] =
      await Promise.all([

        salvarRevisaoComStorage(
          item,
          novoStatus,
          item.panc_id
        ),

        esperar(
          TEMPO_ANIMACAO
        )

      ]);


    historicoRevisao.push({

      imagem: {
        ...item
      },

      statusAnterior:
        item.status,

      pancAnterior:
        item.panc_id,

      caminhoAnterior:
        movimentacao
          .caminhoOriginal,

      caminhoNovo:
        movimentacao
          .caminhoNovo,

      statusNovo:
        novoStatus

    });


    btnDesfazer.hidden = false;


    totalRevisado++;


    removerImagemDoCache(
      item
    );


    imagemAtual = null;


    await mostrarProximaImagem();


  } catch (error) {

    console.error(
      "Erro ao revisar imagem:",
      error
    );


    /*
      Se o servidor falhar,
      devolve visualmente o card.
    */

    card.style.transition =
      "transform 180ms ease";


    card.style.transform =
      "translate3d(0,0,0) rotate(0deg)";


    overlayAprovar
      .classList
      .remove("ativo");


    overlayRejeitar
      .classList
      .remove("ativo");


    overlayAprovar.style.opacity =
      "";


    overlayRejeitar.style.opacity =
      "";


    alert(
      "Não foi possível salvar esta revisão. A imagem continuará pendente."
    );


  } finally {

    processandoRevisao = false;
  }
}


// ==========================================
// BOTÕES
// ==========================================

btnAprovar?.addEventListener(
  "click",
  () => {

    revisarImagem(
      "aprovada"
    );

  }
);


btnRejeitar?.addEventListener(
  "click",
  () => {

    revisarImagem(
      "rejeitada"
    );

  }
);


// ==========================================
// MODAL DE CORREÇÃO
// ==========================================

function abrirModalCorrecao() {

  if (!imagemAtual) {
    return;
  }


  selectEspecie.value =
    String(
      imagemAtual.panc_id ||
      ""
    );


  modal.hidden = false;
}


function fecharModalCorrecao() {

  modal.hidden = true;
}


btnCorrigir?.addEventListener(
  "click",
  abrirModalCorrecao
);


btnFecharCorrecao
  ?.addEventListener(
    "click",
    fecharModalCorrecao
  );


modalBackdrop
  ?.addEventListener(
    "click",
    fecharModalCorrecao
  );


// ==========================================
// CONFIRMAR CORREÇÃO
// ==========================================

btnConfirmarCorrecao
  ?.addEventListener(
    "click",
    async () => {

      if (
        !imagemAtual ||
        processandoRevisao
      ) {
        return;
      }


      const pancIdCorreta =
        Number(
          selectEspecie.value
        );


      if (!pancIdCorreta) {

        alert(
          "Selecione a espécie correta."
        );

        return;
      }


      processandoRevisao = true;


      const item =
        imagemAtual;


      try {

        fecharModalCorrecao();


        /*
          Correção sempre resulta
          em uma imagem aprovada.
        */

        await animarDecisao(
          "aprovada"
        );


        const [
          movimentacao
        ] =
          await Promise.all([

            salvarRevisaoComStorage(
              item,
              "aprovada",
              pancIdCorreta
            ),

            esperar(
              TEMPO_ANIMACAO
            )

          ]);


        historicoRevisao.push({

          imagem: {
            ...item
          },

          statusAnterior:
            item.status,

          pancAnterior:
            item.panc_id,

          caminhoAnterior:
            movimentacao
              .caminhoOriginal,

          caminhoNovo:
            movimentacao
              .caminhoNovo,

          statusNovo:
            "aprovada",

          pancNova:
            pancIdCorreta

        });


        btnDesfazer.hidden =
          false;


        totalRevisado++;


        removerImagemDoCache(
          item
        );


        imagemAtual = null;


        await mostrarProximaImagem();


      } catch (error) {

        console.error(
          "Erro ao corrigir espécie:",
          error
        );


        card.style.transition =
          "transform 180ms ease";


        card.style.transform =
          "translate3d(0,0,0) rotate(0deg)";


        overlayAprovar
          .classList
          .remove("ativo");


        overlayAprovar.style.opacity =
          "";


        alert(
          "Não foi possível corrigir esta imagem."
        );


      } finally {

        processandoRevisao = false;
      }
    }
  );


// ==========================================
// DESFAZER
// ==========================================

btnDesfazer
  ?.addEventListener(
    "click",
    async () => {

      if (
        processandoRevisao ||
        historicoRevisao.length === 0
      ) {
        return;
      }


      processandoRevisao = true;


      const ultimaAcao =
        historicoRevisao.pop();


      try {

        // Move de volta.
        await moverArquivoStorage(
          ultimaAcao.caminhoNovo,
          ultimaAcao.caminhoAnterior
        );


        try {

          // Restaura banco.
          await atualizarImagem(
            ultimaAcao.imagem.id,
            {

              status:
                "pendente",

              panc_id:
                ultimaAcao
                  .pancAnterior,

              caminho_storage:
                ultimaAcao
                  .caminhoAnterior

            }
          );


        } catch (erroBanco) {

          /*
            Banco falhou:
            devolve novamente o arquivo
            para o local revisado.
          */

          try {

            await moverArquivoStorage(
              ultimaAcao
                .caminhoAnterior,

              ultimaAcao
                .caminhoNovo
            );

          } catch (erroRollback) {

            console.error(
              "Erro crítico ao reverter desfazer:",
              erroRollback
            );
          }


          throw erroBanco;
        }


        /*
          O card atual volta para o
          começo da fila.
        */

        if (imagemAtual) {

          imagensPendentes.unshift(
            imagemAtual
          );
        }


        imagemAtual = null;


        /*
          A foto desfeita passa a ser
          a próxima novamente.
        */

        imagensPendentes.unshift(
          {

            ...ultimaAcao.imagem,

            status:
              "pendente",

            panc_id:
              ultimaAcao
                .pancAnterior,

            caminho_storage:
              ultimaAcao
                .caminhoAnterior

          }
        );


        totalRevisado =
          Math.max(
            0,
            totalRevisado - 1
          );


        if (
          historicoRevisao.length === 0
        ) {

          btnDesfazer.hidden = true;
        }


        await mostrarProximaImagem();


      } catch (error) {

        console.error(
          "Erro ao desfazer:",
          error
        );


        historicoRevisao.push(
          ultimaAcao
        );


        alert(
          "Não foi possível desfazer a última ação."
        );


      } finally {

        processandoRevisao = false;
      }
    }
  );


// ==========================================
// SWIPE
// ==========================================

function iniciarArraste(event) {

  if (
    processandoRevisao ||
    !imagemAtual
  ) {
    return;
  }


  arrastando = true;

  pointerIdAtual =
    event.pointerId;

  inicioX =
    event.clientX;

  inicioY =
    event.clientY;

  deslocamentoX = 0;

  deslocamentoY = 0;


  card.classList.add(
    "arrastando"
  );


  card.style.transition =
    "none";


  try {

    card.setPointerCapture(
      event.pointerId
    );

  } catch (_) {
    // Alguns navegadores ignoram.
  }
}


function moverArraste(event) {

  if (
    !arrastando ||
    event.pointerId !==
      pointerIdAtual
  ) {
    return;
  }


  deslocamentoX =
    event.clientX -
    inicioX;


  deslocamentoY =
    event.clientY -
    inicioY;


  const rotacao =
    deslocamentoX / 18;


  /*
    translate3d costuma ter desempenho
    melhor no celular.
  */

  card.style.transform =
    `translate3d(${deslocamentoX}px, ${deslocamentoY * 0.12}px, 0) rotate(${rotacao}deg)`;


  const intensidade =
    Math.min(
      Math.abs(
        deslocamentoX
      ) /
      LIMITE_SWIPE,
      1
    );


  if (deslocamentoX > 0) {

    overlayAprovar
      .classList
      .add("ativo");


    overlayRejeitar
      .classList
      .remove("ativo");


    /*
      O emoji reage diretamente
      à posição do dedo.
    */

    overlayAprovar.style.opacity =
      String(intensidade);


    overlayAprovar.style.transform =
      `scale(${0.78 + intensidade * 0.22}) translateZ(0)`;


  } else if (
    deslocamentoX < 0
  ) {

    overlayRejeitar
      .classList
      .add("ativo");


    overlayAprovar
      .classList
      .remove("ativo");


    overlayRejeitar.style.opacity =
      String(intensidade);


    overlayRejeitar.style.transform =
      `scale(${0.78 + intensidade * 0.22}) translateZ(0)`;
  }
}


async function terminarArraste(event) {

  if (
    !arrastando ||
    event.pointerId !==
      pointerIdAtual
  ) {
    return;
  }


  arrastando = false;

  pointerIdAtual = null;


  card.classList.remove(
    "arrastando"
  );


  // ========================================
  // DIREITA
  // ========================================

  if (
    deslocamentoX >=
    LIMITE_SWIPE
  ) {

    await revisarImagem(
      "aprovada"
    );

    return;
  }


  // ========================================
  // ESQUERDA
  // ========================================

  if (
    deslocamentoX <=
    -LIMITE_SWIPE
  ) {

    await revisarImagem(
      "rejeitada"
    );

    return;
  }


  // ========================================
  // VOLTA
  // ========================================

  card.style.transition =
    "transform 160ms ease-out";


  card.style.transform =
    "translate3d(0,0,0) rotate(0deg)";


  overlayAprovar
    .classList
    .remove("ativo");


  overlayRejeitar
    .classList
    .remove("ativo");


  overlayAprovar.style.opacity = "";

  overlayRejeitar.style.opacity = "";

  overlayAprovar.style.transform = "";

  overlayRejeitar.style.transform = "";
}


// ==========================================
// EVENTOS DO SWIPE
// ==========================================

card?.addEventListener(
  "pointerdown",
  iniciarArraste,
  {
    passive: true
  }
);


card?.addEventListener(
  "pointermove",
  moverArraste,
  {
    passive: true
  }
);


card?.addEventListener(
  "pointerup",
  terminarArraste
);


card?.addEventListener(
  "pointercancel",
  terminarArraste
);


// ==========================================
// TECLADO
// ==========================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      modal &&
      !modal.hidden
    ) {

      if (
        event.key === "Escape"
      ) {

        fecharModalCorrecao();
      }

      return;
    }


    if (
      processandoRevisao ||
      !imagemAtual
    ) {
      return;
    }


    if (
      event.key === "ArrowLeft"
    ) {

      revisarImagem(
        "rejeitada"
      );
    }


    if (
      event.key === "ArrowRight"
    ) {

      revisarImagem(
        "aprovada"
      );
    }
  }
);


// ==========================================
// INICIALIZAÇÃO
// ==========================================

(async () => {

  mostrarCarregando();


  try {

    usuarioAdmin =
      await requireAuth();


    if (!usuarioAdmin) {
      return;
    }


    const admin =
      await verificarAdmin(
        usuarioAdmin.id
      );


    if (!admin) {

      console.warn(
        "Usuário sem permissão administrativa."
      );


      mostrarNegado();

      return;
    }


    console.log(
      "Administrador autorizado:",
      usuarioAdmin.id
    );


    await carregarPancsRevisao();


    await carregarPendentes();


    if (
      imagensPendentes.length === 0
    ) {

      mostrarVazio();

      return;
    }


    /*
      Já começa preparando as primeiras
      imagens antes da revisão.
    */

    prepararProximasImagens();


    await mostrarProximaImagem();


  } catch (error) {

    console.error(
      "Erro ao iniciar revisão:",
      error
    );


    carregando.hidden = true;


    alert(
      "Não foi possível carregar a área de revisão."
    );
  }

})();