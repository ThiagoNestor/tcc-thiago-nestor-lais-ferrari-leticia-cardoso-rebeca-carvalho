let usuario = null;
let pancs = [];
let jardim = [];
let stream = null;
let fotoDataUrl = null;
let predicoes = [];
let modeloPronto = false;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const fotoEl = document.getElementById("foto");
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

mostrarEtapa("camera");

function mostrarEtapa(etapa) {

  // Esconde todas
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

function pararCamera() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
}

async function iniciarCamera() {
  erroCam.hidden = true;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    });
    video.srcObject = stream;
    video.hidden = false;
    await video.play();
  } catch (e) {
    video.hidden = true;
    erroCam.hidden = false;
    erroCam.textContent =
      "Não foi possível acessar a câmera. Conceda a permissão no navegador ou envie uma foto da galeria.";
    btnCapturar.disabled = true;
  }
}

function definirFoto(dataUrl) {
  fotoDataUrl = dataUrl;
  pararCamera();
  video.hidden = true;
  erroCam.hidden = true;
  fotoEl.hidden = false;
  fotoEl.src = dataUrl;
  acoesCaptura.hidden = true;
  acoesFoto.hidden = false;
  btnIdentificar.disabled = !modeloPronto;
}

function novaFoto() {

  fotoDataUrl = null;
  predicoes = [];

  fotoEl.hidden = true;
  fotoEl.src = "";

  video.hidden = false;

  acoesCaptura.hidden = false;
  acoesFoto.hidden = true;

  btnCapturar.disabled = false;
  btnIdentificar.disabled = !modeloPronto;

  mostrarEtapa("camera");

  iniciarCamera();
}

btnCapturar.addEventListener("click", () => {
  if (!video.videoWidth) return;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  definirFoto(canvas.toDataURL("image/jpeg", 0.92));
});

document.getElementById("arquivo").addEventListener("change", (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => definirFoto(String(reader.result));
  reader.readAsDataURL(file);
});

document.getElementById("btn-outra").addEventListener("click", novaFoto);
document.getElementById("btn-nova").addEventListener("click", novaFoto);

btnIdentificar.addEventListener("click", async () => {
  if (!fotoDataUrl) return;
  erro.hidden = true;
  mostrarEtapa("analisando");
  try {
    const img = new Image();
    img.src = fotoDataUrl;
    await img.decode();
    predicoes = await classificarImagem(img);
    renderResultado();
    mostrarEtapa("resultado");

    await db.from("identificacoes").insert({
      user_id: usuario.id,
      panc_id: predicoes[0].pancId,
      rotulo: predicoes[0].rotulo,
      confianca: Number(predicoes[0].confianca.toFixed(4)),
    });
  } catch (e) {
    console.error(e);
    erro.textContent = "Não foi possível analisar a imagem. Tente novamente.";
    erro.hidden = false;
    mostrarEtapa("camera");
  }
});

function renderResultado() {
  const topo = predicoes[0];
  const panc = topo.pancId ? pancs.find((p) => p.id === topo.pancId) : null;
  const percentual = Math.round(topo.confianca * 100);
  const jaNoJardim = panc ? jardim.includes(panc.id) : false;

  document.getElementById("resultado").innerHTML = `
    <div class="result-card" style="margin-top:1rem">
      <img class="result-photo" src="${fotoDataUrl}" alt="Foto analisada">
      <div class="result-body">
        <h3>${esc(panc ? panc.nome : topo.rotulo)}</h3>
        <p class="scientific">${esc(panc ? panc.nome_cientifico : "Espécie não catalogada")}</p>
        <div class="confidence">
          <div class="confidence-top"><span>Confiabilidade</span><strong>${percentual}%</strong></div>
          <div class="confidence-bar"><span style="width:${percentual}%"></span></div>
        </div>
        <p class="badge ${panc ? "" : "badge-danger"}">${panc ? "PANC comestível" : "Não confirmado — não consuma"}</p>
        <p class="result-text">${esc(
          panc
            ? panc.descricao
            : "A IA não reconheceu uma PANC do catálogo nesta imagem. Tente uma foto mais próxima da folha, com boa iluminação e fundo limpo.",
        )}</p>
        ${
          panc
            ? `<div class="result-block"><h4>Usos</h4><p class="result-text">${esc(panc.usos)}</p></div>
               <div class="result-block"><h4>Cuidados</h4><p class="result-text">${esc(panc.cuidados)}</p></div>`
            : ""
        }
        <div class="result-block">
          <h4>Outras possibilidades</h4>
          <ul class="alt-list">
            ${predicoes
              .slice(1, 4)
              .map(
                (p) =>
                  `<li><strong>${esc(p.rotulo)}</strong><span>${(p.confianca * 100).toFixed(1)}%</span></li>`,
              )
              .join("")}
          </ul>
        </div>
      </div>
    </div>`;

  btnSalvar.disabled = !panc || jaNoJardim;
  btnSalvar.textContent = jaNoJardim ? "✓ No meu jardim" : "Salvar no jardim";
  btnSalvar.onclick = async () => {
    if (!panc) return;
    btnSalvar.disabled = true;
    try {
      await alternarJardim(usuario.id, panc.id, false);
      jardim = await carregarJardim();
      btnSalvar.textContent = "✓ No meu jardim";
    } catch (e) {
      alert(e.message || "Não foi possível salvar no jardim.");
    }
  };
}

window.addEventListener("beforeunload", pararCamera);

(async () => {
  usuario = await requireAuth();
  if (!usuario) return;
  iniciarCamera();
  try {
    pancs = await carregarPancs();
    jardim = await carregarJardim();
  } catch (e) {
    console.error(e);
  }
  try {
    await getModel();
    modeloPronto = true;
    carregandoIa.hidden = true;
    btnIdentificar.disabled = !fotoDataUrl;
  } catch (e) {
    console.error(e);
    carregandoIa.hidden = true;
    erro.textContent = "Não foi possível carregar o modelo de IA.";
    erro.hidden = false;
  }
})();
