# Growly — versão HTML/CSS/JS puro

Sem React, sem Vite, **sem `npm install`**. São só arquivos estáticos.

## Como rodar

Por causa da câmera e do modelo de IA, use um servidor local simples (não abra por `file://`):

```bash
cd growly-html
python3 -m http.server 8000
# abra http://localhost:8000
```

Ou publique a pasta em qualquer hospedagem estática (Netlify, GitHub Pages, Vercel, etc.).

## Estrutura

- `index.html`, `login.html`, `cadastro.html`, `home.html`, `explorar.html`, `jardim.html`,
  `identificar.html`, `eden.html`, `suporte.html`, `configuracoes.html`
- `css/styles.css` — design system do Growly (CSS puro)
- `js/app.js` — cliente do banco/auth, navegação, helpers compartilhados
- `js/panc-model.js` — carrega o modelo Teachable Machine com TensorFlow.js
- `assets/` — imagens do app
- `model/` — `model.json` + pesos do modelo de IA

## Bibliotecas (via CDN, sem instalar nada)

- `@supabase/supabase-js` — autenticação e banco de dados
- `@tensorflow/tfjs` — inferência do modelo, direto no navegador

## Funcionalidades

Cadastro/login, painel inicial, catálogo de PANCs com busca, Meu Jardim (salvar/remover),
identificação por câmera ou galeria com percentual de confiança e histórico salvo,
chat com a Eden IA e tela de configurações de perfil.
