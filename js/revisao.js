// ==========================================
// GROWLY
// REVISÃO ADMINISTRATIVA DE IMAGENS
// ==========================================


// ==========================================
// CONFIGURAÇÕES
// ==========================================

const BUCKET_TREINAMENTO =
  "imagens-treinamento";

const LIMITE_SWIPE =
  110;

const TEMPO_URL_ASSINADA =
  60 * 60;

const QUANTIDADE_PRELOAD =
  3;


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

const cacheImagens =
  new Map();

const preloadEmAndamento =
  new Map();


// ==========================================
// ELEMENTOS
// ==========================================

const card =
  document.getElementById(
    "revisao-card"
  );

const cardArea =
  document.getElementById(
    "revisao-card-area"
  );

const imagem =
  document.getElementById(
    "revisao-imagem"
  );

const especie =
  document.getElementById(
    "revisao-especie"
  );

const rotulo =
  document.getElementById(
    "revisao-rotulo"
  );

const confianca =
  document.getElementById(
    "revisao-confianca"
  );

const barraConfianca =
  document.getElementById(
    "revisao-confianca-preenchimento"
  );

const contador =
  document.getElementById(
    "contador-revisao"
  );

const pendentes =
  document.getElementById(
    "pendentes-revisao"
  );

const carregando =
  document.getElementById(
    "revisao-carregando"
  );

const vazio =
  document.getElementById(
    "revisao-vazio"
  );

const negado =
  document.getElementById(
    "revisao-negado"
  );

const acoes =
  document.getElementById(
    "revisao-acoes"
  );

const btnAprovar =
  document.getElementById(
    "btn-aprovar"
  );

const btnRejeitar =
  document.getElementById(
    "btn-rejeitar"
  );

const btnCorrigir =
  document.getElementById(
    "btn-corrigir-especie"
  );

const btnDesfazer =
  document.getElementById(
    "btn-desfazer-revisao"
  );

const overlayAprovar =
  document.getElementById(
    "overlay-aprovar"
  );

const overlayRejeitar =
  document.getElementById(
    "overlay-rejeitar"
  );


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

let arrastando =
  false;

let pointerIdAtual =
  null;

let inicioX =
  0;

let inicioY =
  0;

let deslocamentoX =
  0;

let deslocamentoY =
  0;


// ==========================================
// AUXILIARES
// ==========================================

function encontrarPancRevisao(
  pancId
) {

  return (
    pancsRevisao.find(
      (panc) =>
        String(panc.id) ===
        String(pancId)
    ) ||
    null
  );
}


function nomePanc(
  pancId
) {

  const panc =
    encontrarPancRevisao(
      pancId
    );


  return panc
    ? panc.nome
    : "Espécie não encontrada";
}


// ==========================================
// TELAS
// ==========================================

function esconderTudo() {

  card.hidden =
    true;

  carregando.hidden =
    true;

  vazio.hidden =
    true;

  negado.hidden =
    true;

  acoes.hidden =
    true;

  btnCorrigir.hidden =
    true;
}


function mostrarCarregando() {

  esconderTudo();

  carregando.hidden =
    false;
}


function mostrarNegado() {

  esconderTudo();

  negado.hidden =
    false;
}


function mostrarVazio() {

  esconderTudo();

  vazio.hidden =
    false;

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


  if (
    totalInicial === 0
  ) {

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
// VERIFICAR ADMIN
// ==========================================

async function verificarAdmin(
  userId
) {

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
// CARREGAR PANCS
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
// CARREGAR IMAGENS PENDENTES
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


  totalRevisado =
    0;


  atualizarContadores();
}


// ==========================================
// URL TEMPORÁRIA DA FOTO
// ==========================================

async function obterUrlImagem(
  caminho
) {

  if (
    cacheImagens.has(
      caminho
    )
  ) {

    return cacheImagens.get(
      caminho
    );
  }


  if (
    preloadEmAndamento.has(
      caminho
    )
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

        console.error(
          "Erro ao gerar URL da imagem:",
          error
        );

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
// PRELOAD REAL DOS PIXELS
// ==========================================

function preloadImagemNavegador(
  url
) {

  return new Promise(
    (resolve, reject) => {

      const img =
        new Image();


      img.onload =
        () => resolve();


      img.onerror =
        () =>
          reject(
            new Error(
              "Falha no preload da imagem."
            )
          );


      img.src =
        url;
    }
  );
}


// ==========================================
// PREPARAR PRÓXIMAS 3
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
        cacheImagens.has(
          caminho
        ) ||
        preloadEmAndamento.has(
          caminho
        )
      ) {

        return;
      }


      obterUrlImagem(
        caminho
      )
        .then(() => {

          console.log(
            "Imagem pré-carregada:",
            item.id
          );

        })
        .catch(
          (error) => {

            console.warn(
              "Não foi possível pré-carregar a imagem:",
              item.id,
              error
            );
          }
        );
    }
  );
}


// ==========================================
// PRÓXIMA IMAGEM
// ==========================================

async function mostrarProximaImagem() {

  resetarCard();


  if (
    imagensPendentes.length ===
    0
  ) {

    imagemAtual =
      null;

    mostrarVazio();

    return;
  }


  imagemAtual =
    imagensPendentes.shift();


  atualizarContadores();


  try {

    const url =
      await obterUrlImagem(
        imagemAtual
          .caminho_storage
      );


    imagem.src =
      url;


    especie.textContent =
      nomePanc(
        imagemAtual.panc_id
      );


    rotulo.textContent =
      imagemAtual.rotulo_ia ||
      "Sem rótulo";


    const valorConfianca =
      Number(
        imagemAtual
          .confiabilidade
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


    carregando.hidden =
      true;

    vazio.hidden =
      true;

    negado.hidden =
      true;

    card.hidden =
      false;

    acoes.hidden =
      false;

    btnCorrigir.hidden =
      false;


    prepararProximasImagens();


  } catch (error) {

    console.error(
      "Erro ao abrir imagem:",
      error
    );


    imagensPendentes.push(
      imagemAtual
    );


    imagemAtual =
      null;


    alert(
      "Não foi possível abrir uma das imagens."
    );


    mostrarProximaImagem();
  }
}


// ==========================================
// LIMPAR CACHE
// ==========================================

function removerImagemDoCache(
  item
) {

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


  card.style.transition =
    "";


  card.style.transform =
    "";


  card.style.opacity =
    "";


  overlayAprovar.classList.remove(
    "ativo"
  );

  overlayRejeitar.classList.remove(
    "ativo"
  );


  overlayAprovar.style.opacity =
    "";

  overlayRejeitar.style.opacity =
    "";

  overlayAprovar.style.transform =
    "";

  overlayRejeitar.style.transform =
    "";
}


// ==========================================
// ORGANIZAÇÃO DO STORAGE
// ==========================================

function nomeArquivoStorage(
  caminho
) {

  return caminho
    .split("/")
    .pop();
}


function slugSeguro(
  valor
) {

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
    nomeOriginal
      .lastIndexOf(".");


  const extensao =
    ponto !== -1
      ? nomeOriginal.substring(
          ponto
        )
      : ".jpg";


  const identificador =
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"

      ? crypto.randomUUID()

      : `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`;


  return `${identificador}${extensao}`;
}


function obterSlugPanc(
  pancId
) {

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
// MOVER ARQUIVO
// ==========================================

async function moverArquivoStorage(
  caminhoAtual,
  caminhoNovo
) {

  if (
    caminhoAtual ===
    caminhoNovo
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
      "Erro ao mover imagem no Storage:",
      error
    );

    throw error;
  }
}


// ==========================================
// CAMINHOS FINAIS
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


function caminhoImagemRejeitada(
  item
) {

  const nome =
    gerarNomeUnico(
      item.caminho_storage
    );


  return (
    `rejeitadas/${nome}`
  );
}


// ==========================================
// SALVAR STATUS
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
// REVISAR + ORGANIZAR STORAGE
// ==========================================

async function salvarRevisaoComStorage(
  item,
  novoStatus,
  pancIdFinal = item.panc_id
) {

  const caminhoOriginal =
    item.caminho_storage;


  let caminhoNovo;


  if (
    novoStatus ===
    "aprovada"
  ) {

    caminhoNovo =
      caminhoImagemAprovada(
        item,
        pancIdFinal
      );

  } else {

    caminhoNovo =
      caminhoImagemRejeitada(
        item
      );
  }


  await moverArquivoStorage(
    caminhoOriginal,
    caminhoNovo
  );


  try {

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
      "Banco falhou após mover a imagem. Tentando reverter...",
      error
    );


    try {

      await moverArquivoStorage(
        caminhoNovo,
        caminhoOriginal
      );

    } catch (
      erroRollback
    ) {

      console.error(
        "ERRO CRÍTICO AO RESTAURAR STORAGE:",
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


  processandoRevisao =
    true;


  const item =
    imagemAtual;


  try {

    const movimentacao =
      await salvarRevisaoComStorage(
        item,
        novoStatus,
        item.panc_id
      );


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


    btnDesfazer.hidden =
      false;


    totalRevisado++;


    const classeSaida =
      novoStatus ===
      "aprovada"

        ? "saindo-direita"

        : "saindo-esquerda";


    card.classList.add(
      classeSaida
    );


    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          330
        )
    );


    removerImagemDoCache(
      item
    );


    imagemAtual =
      null;


    await mostrarProximaImagem();


  } catch (error) {

    console.error(
      "Erro ao revisar imagem:",
      error
    );


    alert(
      "Não foi possível organizar e salvar esta imagem. Ela continuará pendente."
    );


    resetarCard();


  } finally {

    processandoRevisao =
      false;
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


  modal.hidden =
    false;
}


function fecharModalCorrecao() {

  modal.hidden =
    true;
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


      processandoRevisao =
        true;


      const item =
        imagemAtual;


      try {

        const movimentacao =
          await salvarRevisaoComStorage(
            item,
            "aprovada",
            pancIdCorreta
          );


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


        fecharModalCorrecao();


        card.classList.add(
          "saindo-direita"
        );


        await new Promise(
          (resolve) =>
            setTimeout(
              resolve,
              330
            )
        );


        removerImagemDoCache(
          item
        );


        imagemAtual =
          null;


        await mostrarProximaImagem();


      } catch (error) {

        console.error(
          "Erro ao corrigir espécie:",
          error
        );


        alert(
          "Não foi possível corrigir esta imagem."
        );


        resetarCard();


      } finally {

        processandoRevisao =
          false;
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
        historicoRevisao.length ===
          0
      ) {

        return;
      }


      processandoRevisao =
        true;


      const ultimaAcao =
        historicoRevisao.pop();


      try {

        // ====================================
        // 1. MOVE DE VOLTA NO STORAGE
        // ====================================

        await moverArquivoStorage(
          ultimaAcao.caminhoNovo,
          ultimaAcao.caminhoAnterior
        );


        try {

          // ==================================
          // 2. RESTAURA O BANCO
          // ==================================

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
            Se o banco falhar,
            tenta colocar a imagem de volta
            no caminho revisado.
          */

          console.error(
            "Erro ao restaurar banco. Revertendo Storage...",
            erroBanco
          );


          try {

            await moverArquivoStorage(
              ultimaAcao
                .caminhoAnterior,

              ultimaAcao
                .caminhoNovo
            );

          } catch (
            erroRollback
          ) {

            console.error(
              "ERRO CRÍTICO AO REVERTER DESFAZER:",
              erroRollback
            );
          }


          throw erroBanco;
        }


        // ====================================
        // 3. DEVOLVE CARD ATUAL PARA FILA
        // ====================================

        if (imagemAtual) {

          imagensPendentes.unshift(
            imagemAtual
          );
        }


        imagemAtual =
          null;


        // ====================================
        // 4. COLOCA A DESFEITA NO TOPO
        // ====================================

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
          historicoRevisao.length ===
          0
        ) {

          btnDesfazer.hidden =
            true;
        }


        await mostrarProximaImagem();


      } catch (error) {

        console.error(
          "Erro ao desfazer revisão:",
          error
        );


        historicoRevisao.push(
          ultimaAcao
        );


        alert(
          "Não foi possível desfazer a última ação."
        );


      } finally {

        processandoRevisao =
          false;
      }
    }
  );


// ==========================================
// SWIPE
// ==========================================

function iniciarArraste(
  event
) {

  if (
    processandoRevisao ||
    !imagemAtual
  ) {

    return;
  }


  arrastando =
    true;


  pointerIdAtual =
    event.pointerId;


  inicioX =
    event.clientX;


  inicioY =
    event.clientY;


  deslocamentoX =
    0;


  deslocamentoY =
    0;


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
    // Alguns navegadores podem ignorar.
  }
}


function moverArraste(
  event
) {

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
    deslocamentoX /
    18;


  card.style.transform =
    `translate(${deslocamentoX}px, ${deslocamentoY * 0.12}px) rotate(${rotacao}deg)`;


  const intensidade =
    Math.min(
      Math.abs(
        deslocamentoX
      ) /
      LIMITE_SWIPE,
      1
    );


  if (
    deslocamentoX >
    0
  ) {

    overlayAprovar
      .classList
      .add(
        "ativo"
      );


    overlayRejeitar
      .classList
      .remove(
        "ativo"
      );


    overlayAprovar.style.opacity =
      String(
        intensidade
      );


  } else if (
    deslocamentoX <
    0
  ) {

    overlayRejeitar
      .classList
      .add(
        "ativo"
      );


    overlayAprovar
      .classList
      .remove(
        "ativo"
      );


    overlayRejeitar.style.opacity =
      String(
        intensidade
      );
  }
}


async function terminarArraste(
  event
) {

  if (
    !arrastando ||
    event.pointerId !==
      pointerIdAtual
  ) {

    return;
  }


  arrastando =
    false;


  pointerIdAtual =
    null;


  card.classList.remove(
    "arrastando"
  );


  card.style.transition =
    "transform 0.22s ease, opacity 0.22s ease";


  // ========================================
  // DIREITA = APROVAR
  // ========================================

  if (
    deslocamentoX >=
    LIMITE_SWIPE
  ) {

    card.style.transform =
      "translateX(130%) rotate(18deg)";


    overlayAprovar
      .classList
      .add(
        "ativo"
      );


    await revisarImagem(
      "aprovada"
    );


    return;
  }


  // ========================================
  // ESQUERDA = REJEITAR
  // ========================================

  if (
    deslocamentoX <=
    -LIMITE_SWIPE
  ) {

    card.style.transform =
      "translateX(-130%) rotate(-18deg)";


    overlayRejeitar
      .classList
      .add(
        "ativo"
      );


    await revisarImagem(
      "rejeitada"
    );


    return;
  }


  // ========================================
  // VOLTA PARA O CENTRO
  // ========================================

  card.style.transform =
    "translate(0,0) rotate(0deg)";


  overlayAprovar
    .classList
    .remove(
      "ativo"
    );


  overlayRejeitar
    .classList
    .remove(
      "ativo"
    );


  overlayAprovar.style.opacity =
    "";


  overlayRejeitar.style.opacity =
    "";
}


// ==========================================
// EVENTOS DO SWIPE
// ==========================================

card?.addEventListener(
  "pointerdown",
  iniciarArraste
);


card?.addEventListener(
  "pointermove",
  moverArraste
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
        event.key ===
        "Escape"
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
      event.key ===
      "ArrowLeft"
    ) {

      revisarImagem(
        "rejeitada"
      );
    }


    if (
      event.key ===
      "ArrowRight"
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
      imagensPendentes.length ===
      0
    ) {

      mostrarVazio();

      return;
    }


    prepararProximasImagens();


    await mostrarProximaImagem();


  } catch (error) {

    console.error(
      "Erro ao iniciar revisão:",
      error
    );


    carregando.hidden =
      true;


    alert(
      "Não foi possível carregar a área de revisão."
    );
  }

})();