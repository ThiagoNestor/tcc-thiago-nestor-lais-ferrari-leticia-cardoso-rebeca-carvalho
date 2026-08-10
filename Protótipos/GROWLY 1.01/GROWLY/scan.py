from tensorflow.keras.models import load_model
from PIL import Image, ImageOps
import numpy as np


# Carrega o modelo treinado no Teachable Machine
model = load_model("treinamento/keras_model.h5", compile=False)

# Carrega os nomes das espécies
with open("treinamentp/labels.txt", "r", encoding="utf-8") as arquivo:
    labels = arquivo.readlines()

# Carrega a imagem que será analisada
image = Image.open("testes/tst.jpg").convert("RGB")

# Ajusta a imagem para o tamanho usado pelo modelo
image = ImageOps.fit(image, (224, 224), Image.Resampling.LANCZOS)

# Transforma a imagem em dados numéricos
image_array = np.asarray(image)

# Normaliza a imagem
normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1

# Prepara os dados para o modelo
data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
data[0] = normalized_image_array

# Faz a previsão
prediction = model.predict(data)

print("Resultado da análise:\n")


for i, score in enumerate(prediction[0]):
    porcentagem = score * 100
    print(f"{labels[i].strip()}: {porcentagem:.2f}%")

maior = np.argmax(prediction[0])

print("\nEspécie identificada:")
print(f"{labels[maior].strip()} - {prediction[0][maior] * 100:.2f}%")