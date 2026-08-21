/* Modelo Teachable Machine (TensorFlow.js) — roda 100% no navegador */

const MODEL_URL = "model/model.json";

const MODEL_LABELS = [
  { rotulo: "Vinagreira", pancId: "vinagreira" },
  { rotulo: "Tanchagem", pancId: "tanchagem" },
  { rotulo: "Peixinho-da-horta", pancId: "peixinho" },
  { rotulo: "Ora-pro-nóbis", pancId: "ora-pro-nobis" },
  { rotulo: "Taioba", pancId: "taioba" },
  { rotulo: "Não identificado", pancId: null },
  { rotulo: "Pessoa", pancId: null },
];

let modelPromise = null;

function getModel() {
  if (!modelPromise) {
    modelPromise = tf.ready().then(() => tf.loadLayersModel(MODEL_URL));
  }
  return modelPromise;
}

/** Classifica uma <img> já carregada e devolve as classes ordenadas por confiança. */
async function classificarImagem(img) {
  const model = await getModel();
  const tensor = tf.tidy(() =>
    tf.browser.fromPixels(img).resizeBilinear([224, 224]).toFloat().div(127.5).sub(1).expandDims(),
  );
  try {
    const output = await model.predict(tensor).data();
    return Array.from(output)
      .map((confianca, index) => ({
        rotulo: (MODEL_LABELS[index] || {}).rotulo || "Classe " + index,
        pancId: (MODEL_LABELS[index] || {}).pancId || null,
        confianca: Number(confianca),
      }))
      .sort((a, b) => b.confianca - a.confianca);
  } finally {
    tensor.dispose();
  }
}
