<div align="center">

# 🌱 Growly — Site

### Branch de publicação da aplicação web

**Versão atual: 1.05.6**

[![Produção](https://img.shields.io/badge/produção-growly.com.br-315b45?style=flat-square)](https://growly.com.br/)
[![Versão](https://img.shields.io/badge/versão-1.05.6-315b45?style=flat-square)](https://growly.com.br/)
[![Branch](https://img.shields.io/badge/branch-site-6f8f72?style=flat-square)](https://github.com/ThiagoNestor/tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho/tree/site)

**[Acessar o Growly](https://growly.com.br/) · [Documentação completa na main](https://github.com/ThiagoNestor/tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho/tree/main)**

</div>

---

## Sobre esta branch

A branch `site` contém a estrutura utilizada pela versão web publicada do **Growly**.

Enquanto a branch `main` preserva o histórico de desenvolvimento, as versões do TCC e a documentação técnica completa do projeto, a `site` é voltada à **aplicação em produção**.

Este README, portanto, possui uma finalidade mais prática. Ele explica:

- como utilizar as principais funcionalidades do Growly;
- como executar o site localmente;
- como funciona o scanner;
- quais serviços são necessários;
- como a estrutura publicada se relaciona com a `main`;
- cuidados ao atualizar a versão em produção;
- problemas comuns durante desenvolvimento e testes.

> Para arquitetura detalhada, banco de dados, Inteligência Artificial, metodologia, segurança, histórico completo e documentação acadêmica, consulte o README da branch `main`.

---

## Sumário

1. [Acessando o Growly](#acessando-o-growly)
2. [Como utilizar](#como-utilizar)
3. [Identificando uma planta](#identificando-uma-planta)
4. [Entendendo o resultado](#entendendo-o-resultado)
5. [Explorar](#explorar)
6. [Meu Jardim](#meu-jardim)
7. [Eden IA](#eden-ia)
8. [Contribuição de imagens](#contribuição-de-imagens)
9. [Aviso sobre identificação](#aviso-sobre-identificação)
10. [Funcionamento técnico resumido](#funcionamento-técnico-resumido)
11. [Executando localmente](#executando-localmente)
12. [Serviços utilizados](#serviços-utilizados)
13. [Estrutura da aplicação](#estrutura-da-aplicação)
14. [Branches](#branches)
15. [Atualizando a versão publicada](#atualizando-a-versão-publicada)
16. [Testando antes de publicar](#testando-antes-de-publicar)
17. [Problemas comuns](#problemas-comuns)
18. [Segurança](#segurança)
19. [Status atual](#status-atual)
20. [Documentação](#documentação)
21. [Equipe](#equipe)

---

# Acessando o Growly

A versão pública está disponível em:

## https://growly.com.br/

O Growly é uma **aplicação web responsiva**, portanto não é necessário instalar um aplicativo para utilizar a versão publicada.

O acesso pode ser realizado por navegadores modernos em:

- smartphones;
- tablets;
- notebooks;
- computadores.

Algumas funcionalidades dependem de permissões do navegador, principalmente o acesso à câmera.

---

# Como utilizar

O Growly reúne diferentes funcionalidades relacionadas às Plantas Alimentícias Não Convencionais.

O fluxo básico de utilização pode ser representado por:

```text
Acessar o Growly
       │
       ├── Explorar espécies
       │
       ├── Criar conta / Entrar
       │
       ├── Identificar uma planta
       │       │
       │       ├── selecionar 4 fotos
       │       ├── executar análise
       │       ├── consultar resultado
       │       └── contribuir com imagens
       │
       ├── Organizar Meu Jardim
       │
       └── Conversar com a Eden IA
```

---

# Criando uma conta

Algumas funcionalidades dependem de autenticação.

Na área de cadastro, informe os dados solicitados e crie uma senha válida.

A senha deve possuir:

```text
mínimo de 6 caracteres
+ uma letra maiúscula
+ um número
+ um caractere especial
```

A interface informa quais requisitos já foram cumpridos.

Também é necessário confirmar a senha antes de finalizar o cadastro.

Dependendo da configuração de autenticação ativa, poderá ser necessário confirmar o endereço de e-mail.

Após a autenticação, o Growly mantém uma sessão para relacionar a conta às funcionalidades personalizadas.

---

# Identificando uma planta

A identificação é uma das principais funcionalidades da aplicação.

## 1. Abra o scanner

Acesse a área de identificação do Growly.

## 2. Forneça quatro imagens

O sistema utiliza **quatro fotografias da mesma planta**.

As imagens podem ser:

- capturadas pela câmera;
- selecionadas da galeria do dispositivo.

Para obter entradas melhores para o classificador, procure utilizar fotografias nítidas, com a planta visível e sem obstruções desnecessárias.

As quatro fotografias devem representar **a mesma planta**.

## 3. Confira a pré-visualização

Antes de iniciar a análise, o Growly apresenta as imagens selecionadas.

Verifique se:

```text
[1] todas pertencem à mesma planta
[2] a planta está visível
[3] não há imagem selecionada por engano
[4] as quatro posições foram preenchidas
```

Se necessário, remova uma imagem e selecione outra.

## 4. Inicie a análise

Depois que as quatro imagens estiverem prontas, inicie a identificação.

O modelo processa cada fotografia individualmente.

## 5. Aguarde o resultado

O Growly combina as previsões das quatro análises e apresenta a espécie com maior pontuação média.

---

# Entendendo o resultado

O resultado pode apresentar:

- espécie sugerida;
- nível de confiança;
- imagens utilizadas;
- outras previsões relevantes;
- ações relacionadas à espécie;
- opção de contribuição das fotografias.

## O que significa a confiança?

A confiança representa a pontuação calculada pelo modelo para aquela classe.

Ela **não representa uma confirmação botânica**.

Por exemplo, um resultado com confiança elevada significa que, entre as classes conhecidas pelo modelo, aquela recebeu a maior probabilidade de acordo com as imagens analisadas.

Isso não garante que a planta realmente pertença à espécie indicada.

---

# Como o scanner chega ao resultado

Cada uma das quatro fotografias produz probabilidades para as classes conhecidas.

De forma simplificada:

```text
Foto 1 ──> previsões
Foto 2 ──> previsões
Foto 3 ──> previsões
Foto 4 ──> previsões
              │
              ▼
       média por classe
              │
              ▼
        maior resultado
              │
              ▼
       espécie sugerida
```

Para uma classe `c`:

```text
P(c) = (p1 + p2 + p3 + p4) / 4
```

A utilização de quatro fotografias foi adotada depois de testes com uma única imagem apresentarem maior variação nos resultados.

---

# Espécies reconhecidas

A versão atual do modelo trabalha principalmente com cinco PANCs:

| Espécie | Classe interna |
|---|---|
| Peixinho-da-horta | `peixinho` |
| Tanchagem | `tanchagem` |
| Ora-pro-nóbis | `ora` |
| Vinagreira | `vinagreira` |
| Taioba | `taioba` |

Também existem classes auxiliares utilizadas pelo classificador para lidar com entradas diferentes das cinco espécies principais.

O escopo do modelo é limitado às classes para as quais ele foi treinado.

---

# Explorar

A área **Explorar** permite consultar as espécies disponíveis no Growly sem utilizar o scanner.

Ela funciona como um catálogo conectado ao banco de dados.

Esse recurso é útil para quem deseja:

- conhecer as PANCs cadastradas;
- consultar informações de uma espécie;
- navegar pelo conteúdo sem realizar uma identificação.

O catálogo também é utilizado internamente por outras funcionalidades. Quando o scanner identifica uma classe, o resultado é relacionado ao registro correspondente no banco.

---

# Meu Jardim

O **Meu Jardim** funciona como uma coleção pessoal de PANCs.

Depois de autenticado, o usuário pode adicionar espécies ao Jardim e consultar posteriormente os itens salvos.

O Jardim não cria uma cópia completa das informações da planta para cada usuário.

De maneira simplificada:

```text
Usuário
   │
   ▼
Meu Jardim
   │
   ▼
Referência à PANC
   │
   ▼
Catálogo
```

Isso permite manter as informações gerais da espécie centralizadas.

## Quando a planta já está no Jardim

Uma espécie já salva não impede necessariamente uma nova contribuição.

Depois de uma nova identificação, a aplicação pode disponibilizar:

```text
Enviar novas fotos
```

permitindo contribuir novamente com imagens sem remover a espécie do Jardim.

---

# Eden IA

A **Eden** é a assistente conversacional do Growly.

Ela permite fazer perguntas relacionadas às PANCs por meio de uma interface de chat.

## Fluxo simplificado

```text
Usuário
   │
   ▼
Eden
   │
   ▼
Supabase Edge Function
   │
   ▼
Gemini API
   │
   ▼
Edge Function
   │
   ▼
Resposta no chat
```

A comunicação com a Gemini API não é realizada diretamente pelo navegador.

Uma Edge Function atua como intermediária, mantendo a credencial do serviço fora do código público do front-end.

Parte do histórico recente da conversa é enviada junto com a mensagem atual para manter contexto entre as interações.

## Falhas temporárias

Serviços externos podem ficar temporariamente indisponíveis.

A integração possui tratamento para determinadas respostas `HTTP 503` e pode realizar novas tentativas antes de informar uma falha ao usuário.

## Importante

A Eden utiliza Inteligência Artificial generativa.

Suas respostas podem conter erros ou imprecisões e não substituem fontes especializadas.

---

# Contribuição de imagens

O Growly possui um processo opcional de contribuição de fotografias.

Depois de uma identificação, o usuário pode autorizar o envio das imagens utilizadas para uma área privada destinada ao aprimoramento futuro do modelo.

## O que acontece com uma contribuição?

```text
4 imagens
   │
   ▼
autorização do usuário
   │
   ▼
armazenamento privado
   │
   ▼
registro dos metadados
   │
   ▼
fila de revisão
   │
   ▼
análise pela equipe
```

As imagens não devem ser tratadas automaticamente como exemplos corretos da espécie prevista pelo modelo.

Antes de serem consideradas para futuros datasets, existe um processo de revisão.

A contribuição é opcional e não é necessária para utilizar normalmente o scanner.

---

# Aviso sobre identificação

> **O Growly é uma ferramenta educacional e assistiva. O resultado do scanner não constitui confirmação botânica absoluta.**

Modelos de classificação podem errar.

O resultado pode ser influenciado por:

- iluminação;
- foco;
- enquadramento;
- distância;
- fundo;
- ângulo;
- qualidade da câmera;
- aparência da planta;
- semelhança entre espécies;
- limitações do dataset.

## Não consuma uma planta exclusivamente com base no resultado do Growly.

Antes de qualquer decisão relacionada ao consumo, confirme a espécie utilizando fontes confiáveis e, quando necessário, profissionais adequados.

---

# Funcionamento técnico resumido

A versão publicada utiliza a seguinte arquitetura:

```text
┌──────────────────────────────────────────────────┐
│                    NAVEGADOR                     │
│              HTML + CSS + JavaScript             │
└───────────────┬──────────────────┬───────────────┘
                │                  │
                ▼                  ▼
       ┌────────────────┐   ┌─────────────────────┐
       │ TensorFlow.js  │   │      Supabase       │
       │                │   │                     │
       │ modelo local   │   │ Auth                │
       │ classificação │   │ PostgreSQL          │
       └────────────────┘   │ Storage             │
                            │ RLS                 │
                            │ Edge Functions      │
                            └──────────┬──────────┘
                                       │
                                       ▼
                               ┌──────────────┐
                               │ Gemini API   │
                               │   Eden IA    │
                               └──────────────┘
```

A classificação visual e a Eden são recursos de IA diferentes.

### Scanner

```text
browser → TensorFlow.js → modelo → resultado
```

### Eden

```text
browser → Supabase → Edge Function → Gemini
```

---

# Serviços utilizados

## TensorFlow.js

Executa o modelo de classificação diretamente no navegador.

## Teachable Machine

Foi utilizado para treinamento e exportação do modelo de reconhecimento.

## Supabase

Fornece a infraestrutura de backend da versão atual.

São utilizados:

```text
Supabase
├── Auth
├── PostgreSQL
├── Storage
├── Row Level Security
└── Edge Functions
```

## Gemini API

Utilizada pela Eden para geração das respostas conversacionais.

A credencial é mantida no backend.

---

# Estrutura da aplicação

A organização exata pode evoluir entre versões. Conceitualmente, a branch publicada contém:

```text
/
├── páginas HTML
├── css/
│   └── estilos da aplicação
├── js/
│   └── lógica e integrações
├── assets/
│   └── recursos visuais
├── model/
│   ├── model.json
│   ├── metadata.json
│   └── weights.bin
├── docs/
│   └── documentação disponibilizada pelo projeto
└── outros recursos utilizados pela aplicação
```

> Essa árvore é uma representação funcional e não deve ser interpretada como listagem exata de todos os arquivos existentes na versão atual.

---

# Modelo local

O classificador exportado para TensorFlow.js utiliza principalmente:

```text
model.json
metadata.json
weights.bin
```

Os metadados atuais definem uma entrada de imagem de:

```text
224 × 224 px
```

O carregamento desses arquivos deve ocorrer por HTTP/HTTPS.

---

# Executando localmente

## 1. Clone o repositório

```bash
git clone https://github.com/ThiagoNestor/tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho.git
```

## 2. Entre no repositório

```bash
cd tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho
```

## 3. Acesse a branch do site

```bash
git switch site
```

## 4. Confirme a branch

```bash
git branch
```

A saída deve indicar:

```text
* site
  main
```

## 5. Inicie um servidor local

Utilize um servidor HTTP local.

No Visual Studio Code, uma alternativa prática é a extensão **Live Server**.

Abra o arquivo inicial da aplicação por meio do endereço fornecido pelo servidor.

Exemplo conceitual:

```text
http://127.0.0.1:...
```

ou:

```text
http://localhost:...
```

O endereço e a porta dependem da ferramenta utilizada.

---

# Por que não abrir com file:///

Abrir diretamente:

```text
file:///caminho/do/projeto/index.html
```

pode causar problemas relacionados à política de origem do navegador.

Entre os recursos que podem ser afetados estão:

- carregamento do modelo;
- requisições;
- arquivos JSON;
- câmera;
- integrações externas.

Durante o desenvolvimento, utilize um servidor HTTP.

---

# Uso no celular durante desenvolvimento

Para testar a interface em um dispositivo móvel, o celular precisa conseguir acessar o servidor utilizado pelo computador.

Dependendo da configuração de rede e do servidor local, pode ser necessário disponibilizar o servidor para outros dispositivos da mesma rede.

Alguns recursos, principalmente câmera e APIs sensíveis do navegador, também podem possuir restrições adicionais fora de um contexto seguro.

Para testes finais, a versão publicada em HTTPS deve ser utilizada sempre que possível.

---

# Branches

O repositório utiliza `main` e `site` com finalidades diferentes.

## main

A `main` preserva o projeto dentro da estrutura histórica do TCC.

Ela contém as versões e a documentação técnica principal.

Exemplo da organização utilizada:

```text
Protótipos/
└── GROWLY 1.05/
    └── GROWLY/
        └── projeto
```

## site

A `site` mantém a estrutura necessária para a versão publicada.

Os arquivos ficam organizados a partir da raiz adequada ao deploy.

## Resumo

```text
main
│
├── documentação
├── histórico
└── versões do TCC
        │
        │ arquivos selecionados
        ▼
site
│
└── versão publicada
        │
        ▼
growly.com.br
```

---

# Atualizando a versão publicada

A separação entre as branches exige atenção.

Antes de executar comandos, sempre confirme em qual branch você está:

```bash
git branch
```

ou:

```bash
git status
```

## Transferindo um arquivo da main para a site

Quando um arquivo atualizado está na versão preservada na `main`, ele pode ser obtido sem misturar todo o histórico das branches.

Primeiro:

```bash
git switch site
```

Depois:

```bash
git show main:"Protótipos/GROWLY 1.05/GROWLY/<arquivo>" > <arquivo>
```

Exemplo conceitual:

```bash
git show main:"Protótipos/GROWLY 1.05/GROWLY/js/arquivo.js" > js/arquivo.js
```

Depois confira:

```bash
git status
```

Se estiver correto:

```bash
git add .
git commit -m "Atualiza versão publicada"
git push origin site
```

## Transferindo um arquivo da site para a main

Quando uma correção foi realizada primeiro na `site`:

```bash
git switch main
```

Depois:

```bash
git show site:<arquivo> > "Protótipos/GROWLY 1.05/GROWLY/<arquivo>"
```

Confira:

```bash
git diff
git status
```

E, após validar:

```bash
git add .
git commit -m "Sincroniza correção da versão publicada"
git push origin main
```

---

# Atenção ao sincronizar branches

`main` e `site` possuem estruturas diferentes.

Por isso, não trate as duas branches como se fossem cópias idênticas.

Evite executar operações de merge ou rebase sem antes entender quais arquivos serão afetados.

Em especial, não utilize automaticamente:

```bash
git pull --rebase origin main
```

enquanto estiver trabalhando na `site` apenas para "atualizar o projeto".

Isso pode tentar reaplicar históricos diferentes e gerar conflitos desnecessários.

Quando o objetivo é copiar arquivos específicos entre as estruturas, prefira operações explícitas e revise o `git diff` antes do commit.

---

# Checklist antes de publicar

Antes de enviar uma alteração para a `site`, verifique:

```text
[ ] Estou na branch site?
[ ] O site abre normalmente?
[ ] Não existem erros inesperados no console?
[ ] Login funciona?
[ ] Sessão permanece corretamente?
[ ] Explorar carrega as PANCs?
[ ] Meu Jardim funciona?
[ ] Scanner carrega o modelo?
[ ] As 4 imagens são aceitas?
[ ] O resultado corresponde ao label correto?
[ ] Eden responde?
[ ] Layout funciona no desktop?
[ ] Layout funciona no celular?
[ ] Links e caminhos relativos estão corretos?
[ ] Nenhuma chave privada foi adicionada ao código?
[ ] git diff contém apenas alterações esperadas?
```

Depois da publicação, realize pelo menos um teste rápido diretamente em:

```text
https://growly.com.br/
```

---

# Testando antes de publicar

## Console

Abra as ferramentas de desenvolvimento do navegador e verifique o Console.

Erros JavaScript podem impedir funcionalidades mesmo quando a página aparentemente carregou corretamente.

## Network

A aba Network é útil para verificar:

- arquivos não encontrados;
- `model.json`;
- `metadata.json`;
- `weights.bin`;
- requisições ao Supabase;
- Edge Functions;
- respostas HTTP.

## Responsividade

Teste pelo menos:

```text
desktop
   +
viewport mobile no DevTools
   +
dispositivo móvel real
```

A simulação do navegador ajuda, mas não substitui completamente um dispositivo real.

## Scanner

Não valide o scanner apenas verificando se a tela abre.

Faça o fluxo completo:

```text
selecionar 4 imagens
        ↓
processar
        ↓
observar probabilidades
        ↓
verificar label
        ↓
abrir resultado
        ↓
testar Jardim/contribuição
```

---

# Problemas comuns

## CORS ao abrir localmente

### Sintoma

Erros semelhantes a:

```text
Cross origin requests are only supported...
```

### Causa provável

O projeto foi aberto diretamente com `file:///`.

### Solução

Execute a aplicação por um servidor HTTP local.

---

## Modelo não carrega

Verifique:

```text
model/model.json
model/metadata.json
model/weights.bin
```

Também confirme:

- caminhos relativos;
- erros `404`;
- erros no console;
- se os três arquivos pertencem à mesma versão do modelo.

---

## Resultado parece pertencer à espécie errada

Antes de concluir que o modelo precisa ser treinado novamente, verifique:

1. ordem das classes;
2. `metadata.json`;
3. mapeamento utilizado pelo JavaScript;
4. normalização do label;
5. registro encontrado no banco.

O projeto já apresentou anteriormente um problema em que a classificação estava correta, mas o mapeamento dos rótulos na aplicação estava incorreto.

---

## Câmera não abre

Verifique:

- permissão do navegador;
- permissão do sistema operacional;
- HTTPS no ambiente publicado;
- disponibilidade de câmera no dispositivo;
- console do navegador.

O usuário também pode utilizar a seleção de imagens da galeria quando disponível.

---

## Eden não responde

Verifique:

- conexão com a internet;
- requisição para a Edge Function;
- status HTTP;
- logs da função;
- disponibilidade do serviço externo.

Respostas `503` podem representar indisponibilidade temporária.

---

## Dados do usuário não carregam

Verifique:

- sessão atual;
- autenticação;
- UUID;
- políticas RLS;
- consulta ao banco;
- console/network.

Não desative RLS apenas para contornar um erro sem antes identificar a causa.

---

## Alteração aparece localmente, mas não no site

Verifique:

```bash
git branch
git status
git log -1
```

Confirme se:

- a alteração foi feita na `site`;
- houve commit;
- o push foi enviado;
- o deploy terminou;
- o navegador não está exibindo conteúdo em cache.

---

# Cache

Depois de atualizar arquivos estáticos, o navegador pode continuar utilizando uma versão anterior em determinadas situações.

Antes de diagnosticar um problema como erro de código:

- recarregue a página;
- faça um hard refresh;
- teste em janela privada;
- confira no Network qual arquivo foi realmente recebido.

Evite utilizar cache como explicação automática: primeiro confirme a versão carregada.

---

# Segurança

A branch `site` é pública e todo código executado no navegador pode ser inspecionado.

## Nunca coloque no front-end

```text
API keys privadas
service_role keys
senhas
tokens administrativos
credenciais de banco
segredos de backend
```

A chave da Gemini API deve permanecer protegida no backend utilizado pela Edge Function.

## Supabase

Uma chave destinada ao uso público do cliente não substitui políticas de autorização.

A proteção efetiva dos registros depende das regras configuradas no backend, incluindo **Row Level Security**.

## Administração

Esconder um link administrativo não é um mecanismo de segurança.

O privilégio deve ser validado pelo sistema antes de permitir operações administrativas.

---

# Arquivos do modelo

Ao atualizar o classificador, trate os arquivos exportados como um conjunto:

```text
model.json
metadata.json
weights.bin
```

Misturar arquivos de versões diferentes pode produzir erros ou resultados inconsistentes.

Depois de substituir o modelo:

1. confirme os labels;
2. confira o tamanho de entrada;
3. teste todas as classes;
4. teste entradas inválidas;
5. verifique o mapeamento para o catálogo;
6. teste no ambiente publicado.

---

# Status atual

**Versão:** `1.05.6`

| Recurso | Estado |
|---|---|
| Aplicação web responsiva | Implementado |
| Cadastro e login | Implementado |
| Catálogo | Implementado |
| Jardim Virtual | Implementado |
| Scanner de quatro imagens | Implementado |
| TensorFlow.js | Implementado / em aprimoramento |
| Eden IA | Implementado |
| Supabase | Implementado |
| PostgreSQL | Implementado |
| Storage privado | Implementado |
| RLS | Implementado |
| Contribuição de imagens | Implementado |
| Revisão administrativa | Implementado |
| Ampliação do dataset | Em andamento |
| Novas espécies | Planejado |

---

# Limitações da versão atual

O classificador reconhece um conjunto limitado de espécies.

A qualidade da previsão depende do dataset e das condições da fotografia.

Durante os testes do projeto, Tanchagem e Vinagreira apresentaram maior instabilidade em determinadas situações.

O modelo continuará sendo aprimorado conforme novas imagens adequadas forem obtidas, revisadas e utilizadas em treinamentos futuros.

A aplicação também depende de serviços externos para determinadas funcionalidades, como autenticação, persistência e Eden.

---

# Documentação

Este README é específico da **branch `site`** e prioriza utilização, execução, manutenção e publicação.

A documentação técnica completa do Growly está disponível na branch:

## `main`

Ela contém explicações aprofundadas sobre:

- arquitetura;
- banco de dados;
- Inteligência Artificial;
- pipeline de inferência;
- autenticação;
- autorização;
- RLS;
- Storage;
- Eden;
- testes;
- decisões técnicas;
- metodologia;
- evolução do projeto;
- dataset;
- pesquisa de campo;
- instituições;
- documentação acadêmica.

**[Abrir a branch main](https://github.com/ThiagoNestor/tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho/tree/main)**

---

# Equipe

Projeto desenvolvido pelos estudantes do **3º ano do curso Técnico em Desenvolvimento de Sistemas — período da tarde — da ETEC Professor Camargo Aranha**:

| Integrante |
|---|
| **Thiago Nestor Afonso dos Santos** |
| **Laís Silva Ferrari** |
| **Letícia Rodrigues Cardoso** |
| **Rebeca Carvalho Trindade** |

**Orientação:** Prof. Ricardo Faria Palhares.

---

# Links

**Aplicação:**  
https://growly.com.br/

**Repositório:**  
https://github.com/ThiagoNestor/tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho

**Documentação técnica completa:**  
branch `main`

**Versão de produção:**  
branch `site`

---

<div align="center">

## Growly

*Onde cada planta encontra seu caminho para florescer.*

**Branch `site` · versão 1.05.6**

</div>
