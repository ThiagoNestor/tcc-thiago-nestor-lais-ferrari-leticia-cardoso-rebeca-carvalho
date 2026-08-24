let usuario = null;
let pancs = [];
let jardim = [];
let stream = null;

const MAX_FOTOS = 4;

let fotosDataUrl = [];
let predicoes = [];
let modeloPronto = false;


// =============================
// ELEMENTOS DA TELA
// =============================

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

const erroCam = document.getElementById("erro-cam");
const erro = document.getElementById("erro");
const carregandoIa = document.getElementById("carregando-ia");

const acoesCaptura = document.getElementById("acoes-captura");
const acoesFoto = document.getElementById("acoes-foto");

const telaCamera = document.getElementById("tela-camera");
const telaAnalisando = document.getElementById("tela-analisando");
const telaResultado = document.getElementById("tela-resultado");

const btnCapturar = document.getElementById("btn-capturar");
const btnIdentificar = document.getElementById("btn-identificar");
const btnSalvar = document.getElementById("btn-salvar");

const arquivo = document.getElementById("arquivo");

const previews = document.getElementById("previews");
const contadorFotos = document.getElementById("contador-fotos");
const btnLimparFotos = document.getElementById("btn-limpar-fotos");


mostrarEtapa("camera");


// =============================
// CONTROLE DE TELAS
// =============================

function mostrarEtapa(etapa) {

  telaCamera.setAttribute("hidden", "");
  telaAnalisando.setAttribute("hidden", "");
  telaResultado.setAttribute("hidden", "");

  switch (etapa) {

    case "camera":
      telaCamera.removeAttribute("hidden");
      break;

    case "analisando":
      telaAnalisando.removeAttribute("hidden");
      break;

    case "resultado":
      telaResultado.removeAttribute("hidden");
      break;
  }
}


// =============================
// LOCALIZAR PANC NO BANCO NOVO
// =============================

function normalizarPanc(valor) {

  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}


function encontrarPanc(pancId, rotulo = "") {

  if (!pancId && !rotulo) {
    return null;
  }

  const idNormalizado =
    normalizarPanc(pancId);

  const rotuloNormalizado =
    normalizarPanc(rotulo);


  /*
    O modelo pode utilizar um nome e o banco outro slug.

    Exemplo:

    Modelo:
    "Peixinho-da-horta"

    Banco:
    "peixinho"
  */

  const aliases = {

    "peixinho":
      "peixinho",

    "peixinho-da-horta":
      "peixinho",

    "tanchagem":
      "tanchagem",

    "ora":
      "ora-pro-nobis",

    "ora-pro-nobis":
      "ora-pro-nobis",

    "vinagreira":
      "vinagreira",

    "taioba":
      "taioba"
  };


  const slugEsperado =
    aliases[idNormalizado] ||
    aliases[rotuloNormalizado] ||
    idNormalizado ||
    rotuloNormalizado;


  const encontrada =
    pancs.find((p) => {

      const slugBanco =
        normalizarPanc(p.slug);

      const nomeBanco =
        normalizarPanc(p.nome);

      return (

        String(p.id) ===
          String(pancId)

        ||

        slugBanco ===
          slugEsperado

        ||

        nomeBanco ===
          rotuloNormalizado

        ||

        nomeBanco ===
          idNormalizado

      );
    });


  return encontrada || null;
}


// =============================
// CÂMERA
// =============================

function pararCamera() {

  if (stream) {
    stream
      .getTracks()
      .forEach((t) => t.stop());
  }

  stream = null;
}


async function iniciarCamera() {

  if (fotosDataUrl.length >= MAX_FOTOS) {
    return;
  }

  if (stream) {
    return;
  }

  erroCam.hidden = true;

  try {

    stream =
      await navigator.mediaDevices.getUserMedia({

        video: {
          facingMode: "environment",
        },

        audio: false,
      });


    video.srcObject = stream;
    video.hidden = false;

    await video.play();


  } catch (e) {

    console.error(e);

    video.hidden = true;
    erroCam.hidden = false;

    erroCam.textContent =
      "Não foi possível acessar a câmera. Conceda a permissão no navegador ou envie fotos da galeria.";

    btnCapturar.disabled = true;
  }
}


// =============================
// INTERFACE DAS 4 FOTOS
// =============================

function atualizarInterfaceFotos() {

  const quantidade =
    fotosDataUrl.length;


  contadorFotos.textContent =
    `Fotos selecionadas: ${quantidade}/${MAX_FOTOS}`;


  // Só permite identificar quando:
  // 1. modelo estiver carregado
  // 2. exatamente 4 fotos existirem

  btnIdentificar.disabled =
    !modeloPronto ||
    quantidade !== MAX_FOTOS;


  // Não permite capturar mais de 4

  btnCapturar.disabled =
    quantidade >= MAX_FOTOS;


  // Esconde os controles de captura
  // quando chegar em 4 fotos

  acoesCaptura.hidden =
    quantidade >= MAX_FOTOS;


  // Mostra ações das fotos

  acoesFoto.hidden =
    quantidade === 0;


  // =============================
  // PREVIEWS
  // =============================

  if (quantidade === 0) {

    previews.hidden = true;
    previews.innerHTML = "";

  } else {

    previews.hidden = false;


    previews.innerHTML =
      fotosDataUrl

        .map((foto, index) => {

          return `

            <div
              style="
                position: relative;
                aspect-ratio: 1;
                overflow: hidden;
                border-radius: 14px;
                background: #eee;
              "
            >

              <img
                src="${foto}"
                alt="Foto ${index + 1}"

                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                "
              >

              <div
                style="
                  position: absolute;
                  bottom: 6px;
                  left: 6px;

                  background: rgba(0,0,0,.65);

                  color: white;

                  padding: 3px 8px;

                  border-radius: 10px;

                  font-size: 12px;
                "
              >

                Foto ${index + 1}

              </div>


              <button
                type="button"

                data-remover-foto="${index}"

                style="
                  position: absolute;
                  top: 6px;
                  right: 6px;

                  width: 30px;
                  height: 30px;

                  border: none;
                  border-radius: 50%;

                  cursor: pointer;

                  font-size: 18px;
                  font-weight: bold;

                  background: white;
                  color: #333;
                "
              >

                ×

              </button>

            </div>

          `;
        })

        .join("");
  }


  // =============================
  // CONTROLE DA CÂMERA
  // =============================

  if (quantidade >= MAX_FOTOS) {

    pararCamera();

    video.hidden = true;

  } else {

    video.hidden = false;

    if (!stream) {
      iniciarCamera();
    }
  }
}


// =============================
// ADICIONAR FOTO
// =============================

function adicionarFoto(dataUrl) {

  if (!dataUrl) {
    return;
  }

  if (
    fotosDataUrl.length >=
    MAX_FOTOS
  ) {
    return;
  }

  fotosDataUrl.push(
    dataUrl
  );

  erro.hidden = true;

  atualizarInterfaceFotos();
}


// =============================
// REMOVER FOTO
// =============================

function removerFoto(index) {

  if (
    index < 0 ||
    index >= fotosDataUrl.length
  ) {
    return;
  }

  fotosDataUrl.splice(
    index,
    1
  );

  predicoes = [];

  atualizarInterfaceFotos();
}


// =============================
// LIMPAR TODAS AS FOTOS
// =============================

function limparFotos() {

  fotosDataUrl = [];

  predicoes = [];

  arquivo.value = "";

  erro.hidden = true;

  pararCamera();

  mostrarEtapa(
    "camera"
  );

  atualizarInterfaceFotos();
}


// =============================
// CAPTURAR FOTO DA CÂMERA
// =============================

btnCapturar.addEventListener(
  "click",
  () => {

    if (!video.videoWidth) {
      return;
    }

    if (
      fotosDataUrl.length >=
      MAX_FOTOS
    ) {
      return;
    }


    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;


    canvas
      .getContext("2d")
      .drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );


    const foto =
      canvas.toDataURL(
        "image/jpeg",
        0.92
      );


    adicionarFoto(
      foto
    );
  }
);


// =============================
// ESCOLHER FOTOS DA GALERIA
// =============================

arquivo.addEventListener(
  "change",
  (event) => {

    const arquivos =
      Array.from(
        event.target.files || []
      );


    if (!arquivos.length) {
      return;
    }


    const quantidadeDisponivel =
      MAX_FOTOS -
      fotosDataUrl.length;


    const arquivosSelecionados =
      arquivos.slice(
        0,
        quantidadeDisponivel
      );


    // Aviso se selecionar fotos demais

    if (
      arquivos.length >
      quantidadeDisponivel
    ) {

      erro.textContent =
        `Você pode usar no máximo ${MAX_FOTOS} fotos. ` +
        `Foram adicionadas apenas ${quantidadeDisponivel}.`;

      erro.hidden = false;
    }


    arquivosSelecionados
      .forEach((file) => {

        if (
          !file.type.startsWith(
            "image/"
          )
        ) {
          return;
        }


        const reader =
          new FileReader();


        reader.onload =
          () => {

            adicionarFoto(
              String(
                reader.result
              )
            );
          };


        reader.readAsDataURL(
          file
        );
      });


    // Permite selecionar o mesmo arquivo novamente

    arquivo.value = "";
  }
);


// =============================
// REMOVER FOTO PELO X
// =============================

previews.addEventListener(
  "click",
  (event) => {

    const botao =
      event.target.closest(
        "[data-remover-foto]"
      );


    if (!botao) {
      return;
    }


    const index =
      Number(
        botao.dataset.removerFoto
      );


    removerFoto(
      index
    );
  }
);


// =============================
// LIMPAR
// =============================

btnLimparFotos.addEventListener(
  "click",
  limparFotos
);


// =============================
// CONVERTER DATA URL EM IMAGEM
// =============================

async function carregarImagem(
  dataUrl
) {

  const img =
    new Image();


  img.src =
    dataUrl;


  await img.decode();


  return img;
}


// =============================
// COMBINAR RESULTADOS DAS 4 FOTOS
// =============================

function combinarPredicoes(
  predicoesPorFoto
) {

  const mapa =
    new Map();


  // Percorre as previsões
  // retornadas para cada foto

  predicoesPorFoto.forEach(
    (resultadoFoto) => {

      resultadoFoto.forEach(
        (previsao) => {

          /*
            pancId é usado como identificador.

            Para classes sem pancId,
            usamos o rótulo.
          */

          const chave =
            previsao.pancId ??
            `rotulo:${previsao.rotulo}`;


          if (
            !mapa.has(chave)
          ) {

            mapa.set(
              chave,
              {

                pancId:
                  previsao.pancId,

                rotulo:
                  previsao.rotulo,

                soma:
                  0,
              }
            );
          }


          const classe =
            mapa.get(chave);


          classe.soma +=
            Number(
              previsao.confianca
            ) || 0;
        }
      );
    }
  );


  /*
    Média:

    confiança foto 1
    + confiança foto 2
    + confiança foto 3
    + confiança foto 4
    ---------------------------
                 4
  */


  return Array

    .from(
      mapa.values()
    )

    .map(
      (classe) => {

        return {

          pancId:
            classe.pancId,

          rotulo:
            classe.rotulo,

          confianca:
            classe.soma /
            predicoesPorFoto.length,
        };
      }
    )

    .sort(
      (a, b) =>
        b.confianca -
        a.confianca
    );
}


// =============================
// SALVAR HISTÓRICO
// =============================

async function salvarIdentificacao(
  previsao
) {

  /*
    IMPORTANTE:

    O modelo retorna pancId como
    "taioba", "peixinho", etc.

    A tabela identificacoes precisa
    receber o ID NUMÉRICO da PANC.
  */

  const pancIdentificada =
    encontrarPanc(
      previsao.pancId,
      previsao.rotulo
    );


  const {
    error: erroIdentificacao
  } =
    await db
      .from(
        "identificacoes"
      )
      .insert({

        user_id:
          usuario.id,

        panc_id:
          pancIdentificada
            ? pancIdentificada.id
            : null,

        resultado:
          previsao.rotulo,

        confiabilidade:
          Number(
            (
              previsao.confianca *
              100
            ).toFixed(2)
          ),
      });


  /*
    Se o histórico falhar,
    NÃO interrompemos o scanner.

    Isso é importante porque o usuário
    ainda precisa conseguir salvar a
    planta no jardim.
  */

  if (
    erroIdentificacao
  ) {

    console.error(
      "Erro ao salvar identificação:",
      erroIdentificacao
    );

    return false;
  }


  console.log(
    "Identificação salva no histórico."
  );


  return true;
}


// =============================
// ANALISAR AS QUATRO FOTOS
// =============================

btnIdentificar.addEventListener(
  "click",
  async () => {

    if (
      fotosDataUrl.length !==
      MAX_FOTOS
    ) {

      erro.textContent =
        "Adicione 4 fotos da planta antes de analisar.";

      erro.hidden = false;

      return;
    }


    if (!modeloPronto) {

      erro.textContent =
        "A IA ainda está carregando.";

      erro.hidden = false;

      return;
    }


    erro.hidden = true;


    mostrarEtapa(
      "analisando"
    );


    pararCamera();


    try {

      const predicoesPorFoto =
        [];


      /*
        Cada foto é enviada
        separadamente para o modelo.
      */

      for (
        const foto of fotosDataUrl
      ) {

        const img =
          await carregarImagem(
            foto
          );


        const resultado =
          await classificarImagem(
            img
          );


        predicoesPorFoto.push(
          resultado
        );
      }


      /*
        Agora combinamos
        as quatro previsões.
      */

      predicoes =
        combinarPredicoes(
          predicoesPorFoto
        );


      if (!predicoes.length) {

        throw new Error(
          "Nenhuma previsão foi retornada."
        );
      }


      console.log(
        "Resultados individuais:",
        predicoesPorFoto
      );


      console.log(
        "Resultado combinado:",
        predicoes
      );


      /*
        PRIMEIRO exibimos o resultado.

        O botão Salvar no jardim é
        configurado dentro de renderResultado().
      */

      renderResultado();


      mostrarEtapa(
        "resultado"
      );


      /*
        Depois tentamos salvar o histórico.

        Mesmo se houver erro nessa operação,
        o resultado e o botão do jardim
        continuam funcionando.
      */

      try {

        await salvarIdentificacao(
          predicoes[0]
        );

      } catch (
        erroHistorico
      ) {

        console.error(
          "Erro inesperado ao salvar histórico:",
          erroHistorico
        );
      }


    } catch (e) {

      console.error(e);


      erro.textContent =
        "Não foi possível analisar as fotos. Tente novamente.";


      erro.hidden = false;


      mostrarEtapa(
        "camera"
      );


      atualizarInterfaceFotos();
    }
  }
);


// =============================
// RESULTADO
// =============================

function renderResultado() {

  const topo =
    predicoes[0];


  /*
    CORREÇÃO DO SUPABASE NOVO.

    Antes:

    p.id === topo.pancId

    Exemplo que não funcionava:

    p.id = 5
    topo.pancId = "taioba"

    Agora a busca aceita ID,
    slug e nome da espécie.
  */

  const panc =
    encontrarPanc(
      topo.pancId,
      topo.rotulo
    );


  console.log(
    "Resultado principal:",
    topo
  );


  console.log(
    "PANC correspondente no banco:",
    panc
  );


  const percentual =
    Math.round(
      topo.confianca *
      100
    );


  const jaNoJardim =
    panc

      ? jardim.includes(
          panc.id
        )

      : false;


  // =============================
  // MINIATURAS DAS 4 FOTOS
  // =============================

  const fotosHtml =
    fotosDataUrl

      .map(
        (foto, index) => `

          <img
            src="${foto}"
            alt="Foto ${index + 1} analisada"

            style="
              width: 100%;
              aspect-ratio: 1;
              object-fit: cover;
              border-radius: 12px;
            "
          >

        `
      )

      .join("");


  // =============================
  // CARD
  // =============================

  document
    .getElementById(
      "resultado"
    )
    .innerHTML = `

      <div
        class="result-card"
        style="margin-top:1rem"
      >

        <div
          style="
            display: grid;

            grid-template-columns:
              repeat(2, minmax(0,1fr));

            gap: .5rem;
            padding: .5rem;
          "
        >

          ${fotosHtml}

        </div>


        <div class="result-body">


          <h3>

            ${esc(
              panc
                ? panc.nome
                : topo.rotulo
            )}

          </h3>


          <p class="scientific">

            ${esc(
              panc
                ? panc.nome_cientifico
                : "Espécie não catalogada"
            )}

          </p>


          <div class="confidence">

            <div
              class="confidence-top"
            >

              <span>
                Confiabilidade média
              </span>

              <strong>
                ${percentual}%
              </strong>

            </div>


            <div
              class="confidence-bar"
            >

              <span
                style="
                  width:
                  ${Math.min(
                    percentual,
                    100
                  )}%
                "
              >
              </span>

            </div>

          </div>


          <p
            class="
              badge
              ${
                panc
                  ? ""
                  : "badge-danger"
              }
            "
          >

            ${
              panc

                ? "PANC comestível"

                : "Não confirmado — não consuma"
            }

          </p>


          <p class="result-text">

            ${esc(

              panc

                ? panc.descricao

                :
                "A IA não reconheceu uma PANC do catálogo nas quatro fotos. Tente novamente com outros ângulos, boa iluminação e foco nas folhas."

            )}

          </p>


          ${
            panc

              ? `

                <div
                  class="result-block"
                >

                  <h4>
                    Usos
                  </h4>

                  <p
                    class="result-text"
                  >

                    ${esc(
                      panc.usos
                    )}

                  </p>

                </div>


                <div
                  class="result-block"
                >

                  <h4>
                    Cuidados
                  </h4>

                  <p
                    class="result-text"
                  >

                    ${esc(
                      panc.cuidados
                    )}

                  </p>

                </div>

              `

              : ""
          }


          <div
            class="result-block"
          >

            <h4>
              Outras possibilidades
            </h4>


            <ul class="alt-list">

              ${predicoes

                .slice(
                  1,
                  4
                )

                .map(
                  (p) => `

                    <li>

                      <strong>
                        ${esc(
                          p.rotulo
                        )}
                      </strong>

                      <span>

                        ${
                          (
                            p.confianca *
                            100
                          ).toFixed(1)
                        }%

                      </span>

                    </li>

                  `
                )

                .join("")}

            </ul>

          </div>


          <p
            class="subtitle"
            style="margin-top:1rem"
          >

            Resultado calculado
            combinando as quatro fotos.

          </p>


        </div>

      </div>

    `;


  // =============================
  // SALVAR NO JARDIM
  // =============================

  btnSalvar.disabled =
    !panc ||
    jaNoJardim;


  btnSalvar.textContent =
    jaNoJardim

      ? "✓ No meu jardim"

      : "Salvar no jardim";


  btnSalvar.onclick =
    async () => {

      if (!panc) {

        console.error(
          "Não foi possível salvar: a PANC não foi encontrada no banco.",
          topo
        );

        return;
      }


      btnSalvar.disabled =
        true;


      try {

        console.log(
          "Tentando salvar no jardim:",
          {
            user_id:
              usuario.id,

            panc_id:
              panc.id,

            slug:
              panc.slug,
          }
        );


        /*
          Usa a MESMA função
          utilizada pelo Explorar.

          Essa função já funciona,
          conforme o teste feito.
        */

        await alternarJardim(
          usuario.id,
          panc.id,
          false
        );


        jardim =
          await carregarJardim();


        btnSalvar.textContent =
          "✓ No meu jardim";


        btnSalvar.disabled =
          true;


        console.log(
          "PANC salva no jardim com sucesso."
        );


      } catch (e) {

        console.error(
          "Erro ao salvar no jardim:",
          e
        );


        alert(
          e.message ||
          "Não foi possível salvar no jardim."
        );


        btnSalvar.disabled =
          false;
      }
    };
}


// =============================
// NOVA IDENTIFICAÇÃO
// =============================

document
  .getElementById(
    "btn-nova"
  )
  .addEventListener(
    "click",
    limparFotos
  );


// =============================
// FECHAR CÂMERA AO SAIR
// =============================

window.addEventListener(
  "beforeunload",
  pararCamera
);


// =============================
// INICIALIZAÇÃO
// =============================

(async () => {

  usuario =
    await requireAuth();


  if (!usuario) {
    return;
  }


  // =============================
  // BANCO
  // =============================

  try {

    pancs =
      await carregarPancs();


    jardim =
      await carregarJardim();


    console.log(
      "PANCs carregadas:",
      pancs
    );


    console.log(
      "Jardim carregado:",
      jardim
    );


  } catch (e) {

    console.error(
      "Erro ao carregar dados:",
      e
    );
  }


  // =============================
  // IA
  // =============================

  try {

    await getModel();


    modeloPronto =
      true;


    carregandoIa.hidden =
      true;


    atualizarInterfaceFotos();


  } catch (e) {

    console.error(e);


    carregandoIa.hidden =
      true;


    erro.textContent =
      "Não foi possível carregar o modelo de IA.";


    erro.hidden =
      false;
  }

})();