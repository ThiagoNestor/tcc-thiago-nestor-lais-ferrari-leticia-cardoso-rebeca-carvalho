<div align="center">

# 🌱 Growly

### Onde cada planta encontra seu caminho para florescer.

**Aplicação web responsiva para identificação e conhecimento sobre Plantas Alimentícias Não Convencionais (PANCs)**

[![Versão](https://img.shields.io/badge/versão-1.05.6-315b45?style=flat-square)](https://growly.com.br/)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-6f8f72?style=flat-square)](https://growly.com.br/)
[![Front-end](https://img.shields.io/badge/front--end-HTML%20%7C%20CSS%20%7C%20JavaScript-315b45?style=flat-square)](#stack-tecnológica)
[![Backend](https://img.shields.io/badge/backend-Supabase-315b45?style=flat-square)](#backend-e-persistência)
[![IA](https://img.shields.io/badge/IA-TensorFlow.js%20%7C%20Gemini-315b45?style=flat-square)](#inteligência-artificial)

**[Acessar a aplicação](https://growly.com.br/) · [Repositório](https://github.com/ThiagoNestor/tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho)**

</div>

---

## Sobre o projeto

O **Growly** é uma aplicação web responsiva desenvolvida como Trabalho de Conclusão de Curso do Técnico em Desenvolvimento de Sistemas da **ETEC Professor Camargo Aranha**.

O projeto utiliza Inteligência Artificial para auxiliar na identificação de **Plantas Alimentícias Não Convencionais (PANCs)** a partir de imagens e reúne, em uma mesma plataforma, recursos de consulta, organização e interação relacionados às espécies cadastradas.

A proposta surgiu a partir de um problema observado durante a pesquisa: apesar de apresentarem potencial alimentício, nutricional, cultural e ambiental, diversas PANCs ainda são pouco conhecidas ou utilizadas. A dificuldade de reconhecer essas espécies e o acesso limitado a informações contribuem para sua subutilização.

O Growly procura aproximar tecnologia e conhecimento sobre PANCs por meio de uma experiência acessível em navegadores desktop e mobile. Atualmente, o sistema integra:

- classificação de imagens com **TensorFlow.js**;
- modelo treinado e exportado pelo **Teachable Machine**;
- catálogo de espécies;
- Jardim Virtual por usuário;
- autenticação com **Supabase Auth**;
- persistência em **PostgreSQL**;
- armazenamento privado de imagens com **Supabase Storage**;
- políticas de acesso com **Row Level Security (RLS)**;
- backend serverless por **Supabase Edge Functions**;
- assistente conversacional **Eden IA**, integrada à **Gemini API**;
- coleta consentida de imagens para aprimoramentos futuros;
- fluxo administrativo de revisão das contribuições.

> O Growly não é apenas um classificador de imagens. A identificação é uma das partes de uma plataforma voltada ao acesso, organização e ampliação do conhecimento sobre PANCs.

---

## Sumário

1. [Problema e objetivo](#problema-e-objetivo)
2. [PANCs](#pancs)
3. [Funcionalidades](#funcionalidades)
4. [Arquitetura do sistema](#arquitetura-do-sistema)
5. [Stack tecnológica](#stack-tecnológica)
6. [Sistema de identificação](#sistema-de-identificação)
7. [Modelo de Inteligência Artificial](#modelo-de-inteligência-artificial)
8. [Catálogo e Jardim Virtual](#catálogo-e-jardim-virtual)
9. [Eden IA](#eden-ia)
10. [Backend e persistência](#backend-e-persistência)
11. [Banco de dados](#banco-de-dados)
12. [Autenticação e autorização](#autenticação-e-autorização)
13. [Storage e contribuição de imagens](#storage-e-contribuição-de-imagens)
14. [Revisão administrativa](#revisão-administrativa)
15. [Interface e responsividade](#interface-e-responsividade)
16. [Segurança](#segurança)
17. [Testes](#testes)
18. [Decisões técnicas](#decisões-técnicas)
19. [Limitações conhecidas](#limitações-conhecidas)
20. [Evolução do projeto](#evolução-do-projeto)
21. [Execução local](#execução-local)
22. [Versionamento e deploy](#versionamento-e-deploy)
23. [Roadmap](#roadmap)
24. [Documentação acadêmica](#documentação-acadêmica)
25. [Equipe](#equipe)

---

## Problema e objetivo

### Problema de pesquisa

O projeto parte da seguinte questão:

> Como uma aplicação baseada em Inteligência Artificial, capaz de identificar PANCs por meio da análise de imagens, pode auxiliar no reconhecimento dessas plantas e ampliar o acesso da população às informações sobre elas?

### Objetivo geral

Desenvolver uma **aplicação web responsiva baseada em Inteligência Artificial** capaz de identificar PANCs por meio da análise de imagens e disponibilizar informações sobre as espécies identificadas.

### Objetivos técnicos e funcionais

O desenvolvimento envolve:

- estudar técnicas de Inteligência Artificial e visão computacional;
- produzir e organizar um dataset de imagens;
- treinar um modelo de classificação;
- executar o modelo diretamente no navegador;
- desenvolver uma interface responsiva;
- integrar autenticação, banco de dados e armazenamento;
- estruturar informações das espécies em uma base centralizada;
- implementar recursos personalizados por usuário;
- integrar uma assistente conversacional;
- testar o sistema em diferentes dispositivos e condições;
- criar um processo de coleta e curadoria de novas imagens.

---

## PANCs

PANC é a sigla para **Planta Alimentícia Não Convencional**.

O conceito abrange plantas que possuem uma ou mais partes com potencial alimentício, mas não fazem parte da alimentação cotidiana da maior parte da população em determinado contexto. O caráter "não convencional" depende também de fatores regionais e culturais.

O Growly trabalha atualmente com cinco espécies principais:

| Espécie | Classe utilizada pelo modelo |
|---|---|
| Peixinho-da-horta | `peixinho` |
| Tanchagem | `tanchagem` |
| Ora-pro-nóbis | `ora` |
| Vinagreira | `vinagreira` |
| Taioba | `taioba` |

O modelo também utiliza as classes auxiliares:

| Classe | Finalidade |
|---|---|
| `nd` | auxiliar no tratamento de entradas que não correspondem às espécies treinadas |
| `pessoa` | auxiliar no tratamento de imagens contendo pessoas |

---

# Funcionalidades

## Identificação por imagens

O usuário fornece **quatro fotografias da mesma planta**, obtidas pela câmera do dispositivo ou selecionadas da galeria.

Antes da análise, as imagens aparecem em uma grade de pré-visualização e podem ser removidas ou substituídas.

Após a classificação, a interface apresenta:

- as quatro imagens utilizadas;
- espécie sugerida;
- nível de confiança;
- previsões consideradas relevantes;
- ações relacionadas ao Jardim;
- possibilidade de contribuição das fotografias, mediante autorização.

## Explorar

O catálogo permite consultar as PANCs cadastradas sem executar o classificador.

As informações gerais das espécies ficam centralizadas no banco de dados e são reutilizadas por outras funcionalidades.

## Meu Jardim

O Jardim Virtual representa a coleção pessoal do usuário.

Em vez de duplicar os dados completos de uma PANC para cada conta, o sistema registra a relação entre o usuário e o registro da espécie existente no catálogo.

## Eden IA

Interface conversacional integrada à Gemini API por uma Edge Function.

A Eden complementa o conteúdo estruturado do catálogo permitindo perguntas em linguagem natural.

## Contribuição para o dataset

Depois de uma identificação, o usuário pode autorizar o armazenamento privado das fotografias para contribuir com versões futuras do modelo.

A contribuição é opcional e independente do funcionamento normal do scanner.

## Administração

As imagens contribuídas podem passar por revisão da equipe antes de serem consideradas para futuros datasets.

---

# Arquitetura do sistema

A arquitetura atual pode ser dividida em quatro camadas:

```text
┌──────────────────────────────────────────────────────────────┐
│                         CLIENTE                              │
│                    Navegador Web                             │
└─────────────────────────────┬────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                    │
│                                                              │
│              HTML5 + CSS3 + JavaScript                       │
│                                                              │
│  Login | Explorar | Scanner | Jardim | Eden | Configurações │
└──────────────┬───────────────────────────────┬───────────────┘
               │                               │
               │                               │
      Inferência local                  Serviços remotos
               │                               │
               ▼                               ▼
┌──────────────────────────┐       ┌───────────────────────────┐
│      TensorFlow.js       │       │         SUPABASE          │
│                          │       │                           │
│ model.json               │       │ Auth                      │
│ metadata.json            │       │ PostgreSQL                │
│ weights.bin              │       │ Storage                   │
│                          │       │ Row Level Security        │
│ Classificação no browser │       │ Edge Functions            │
└──────────────────────────┘       └─────────────┬─────────────┘
                                                │
                                                │ HTTPS
                                                ▼
                                    ┌───────────────────────────┐
                                    │        GEMINI API         │
                                    │                           │
                                    │          Eden IA          │
                                    └───────────────────────────┘
```

### 1. Apresentação

O front-end é executado no navegador e utiliza **HTML5, CSS3 e JavaScript**.

Essa camada é responsável por:

- estrutura das páginas;
- componentes visuais;
- navegação;
- validações de interface;
- interação com câmera/galeria;
- scanner;
- apresentação dos resultados;
- chamadas aos serviços do Supabase;
- interação com a Eden.

### 2. Serviços

O **Supabase** atua como infraestrutura principal de backend.

Nele são utilizados:

- autenticação;
- banco de dados;
- Storage;
- políticas de acesso;
- funções server-side.

### 3. Persistência

Os dados estruturados são armazenados em **PostgreSQL**.

Arquivos que precisam permanecer privados, principalmente imagens contribuídas, utilizam **Supabase Storage**.

### 4. Inteligência Artificial

O Growly utiliza duas arquiteturas de IA diferentes:

**Classificação visual:** executada localmente no navegador com TensorFlow.js.

**IA generativa:** executada por um serviço externo, com a comunicação intermediada por uma Edge Function.

Essa separação evita tratar os dois recursos como se fossem um único sistema de IA.

---

# Stack tecnológica

| Camada | Tecnologia | Utilização |
|---|---|---|
| Estrutura | HTML5 | Estrutura semântica das páginas |
| Interface | CSS3 | Layout, identidade visual e responsividade |
| Lógica | JavaScript | Eventos, scanner, integração e manipulação da interface |
| ML no cliente | TensorFlow.js | Execução do classificador no navegador |
| Treinamento | Teachable Machine | Treinamento e exportação do modelo |
| Backend | Supabase | Serviços de backend |
| Banco | PostgreSQL | Persistência dos dados estruturados |
| Autenticação | Supabase Auth | Cadastro, login e sessões |
| Arquivos | Supabase Storage | Armazenamento privado de imagens |
| Autorização | RLS | Controle de acesso aos registros |
| Serverless | Edge Functions | Operações protegidas no backend |
| IA generativa | Gemini API | Geração das respostas da Eden |
| Versionamento | Git | Histórico e branches |
| Repositório | GitHub | Código e publicação |
| Editor principal | Visual Studio Code | Desenvolvimento |
| Debug | Chrome DevTools | Inspeção e diagnóstico |

Tecnologias utilizadas ou estudadas em outras etapas do projeto incluem MySQL, MySQL Workbench, XAMPP, phpMyAdmin, PHP, PyCharm e React Native.

---

# Sistema de identificação

## Pipeline de inferência

O scanner foi projetado para utilizar **quatro imagens** da mesma planta.

O pipeline pode ser representado por:

```text
1. Aquisição
      │
      ├── Câmera
      └── Galeria
      │
      ▼
2. Validação das 4 imagens
      │
      ▼
3. Pré-visualização
      │
      ▼
4. Processamento individual
      │
      ├── imagem_1 → modelo → vetor P1
      ├── imagem_2 → modelo → vetor P2
      ├── imagem_3 → modelo → vetor P3
      └── imagem_4 → modelo → vetor P4
      │
      ▼
5. Agregação por classe
      │
      ▼
6. Ranking das probabilidades médias
      │
      ▼
7. Normalização do label
      │
      ▼
8. Associação ao registro em `pancs`
      │
      ▼
9. Renderização do resultado
```

## Agregação das previsões

Para cada fotografia, o classificador retorna um conjunto de probabilidades.

Se uma classe `c` possuir as probabilidades:

```text
p1(c), p2(c), p3(c), p4(c)
```

a pontuação utilizada pelo Growly é:

```text
P(c) = [p1(c) + p2(c) + p3(c) + p4(c)] / 4
```

Em notação matemática:

\[
P(c)=\frac{1}{4}\sum_{i=1}^{4}p_i(c)
\]

A classe com maior média é utilizada como a principal sugestão.

### Por que quatro imagens?

As primeiras implementações trabalhavam com uma única imagem. Durante os testes foram observadas variações significativas dependendo de fatores como ângulo, iluminação e enquadramento.

A estratégia de quatro fotografias foi adotada para reduzir a dependência de uma única captura.

Ela **não elimina erros de classificação** e não substitui a necessidade de melhorar o dataset.

---

# Modelo de Inteligência Artificial

## Treinamento

O classificador foi desenvolvido utilizando **Teachable Machine** e exportado para TensorFlow.js.

O modelo atual utiliza:

```text
model/
├── model.json
├── metadata.json
└── weights.bin
```

### Responsabilidade dos arquivos

`model.json`  
Define a arquitetura e referencia os pesos utilizados pelo modelo.

`metadata.json`  
Contém metadados relacionados ao modelo e às classes.

`weights.bin`  
Contém os pesos aprendidos durante o treinamento.

## Entrada

Os metadados da versão atual indicam uma entrada de:

```text
224 × 224 px
```

O TensorFlow.js utiliza essa representação durante o processamento das imagens.

## Dataset

A construção do dataset buscou incluir variação em:

- ângulo;
- distância;
- iluminação;
- fundo;
- enquadramento;
- aparência das plantas.

A equipe também produziu registros fotográficos próprios, incluindo imagens obtidas a partir da parceria com a **Horta das Flores**.

## Classes atuais

```text
vinagreira
tanchagem
peixinho
ora
taioba
nd
pessoa
```

## Normalização dos labels

A saída do classificador não pode ser utilizada diretamente em todas as operações do sistema.

Depois da inferência, o label precisa ser relacionado ao registro correspondente no catálogo.

O sistema utiliza normalização e informações como:

- nome;
- slug;
- nomes alternativos.

Essa etapa desacopla o nome interno da classe do identificador utilizado pelo banco.

## Problema de mapeamento identificado nos testes

Durante o desenvolvimento, algumas classificações aparentemente incorretas não eram causadas pelo modelo.

Foi identificado um problema no mapeamento entre a saída do classificador e os rótulos utilizados pela aplicação. Após a correção, parte das divergências deixou de ocorrer.

Esse caso levou a uma distinção importante durante o diagnóstico:

```text
erro de classificação ≠ erro de integração
```

Antes de retreinar o modelo, é necessário verificar se:

1. o modelo retornou a classe correta;
2. os metadados estão alinhados;
3. o JavaScript interpreta o índice correto;
4. a normalização aponta para a espécie correta;
5. o registro correspondente existe no banco.

## Instabilidade observada

Mesmo após a correção da integração, alguns testes continuaram apresentando inconsistências.

As classes que demonstraram maior instabilidade em determinadas condições foram:

- Tanchagem;
- Vinagreira.

Isso direcionou a continuidade do trabalho para ampliação e melhor balanceamento do dataset.

---

# Catálogo e Jardim Virtual

## Catálogo

A tabela de PANCs funciona como fonte central das informações das espécies.

Isso permite reutilizar o mesmo registro em:

```text
Explorar
   │
   ├── Scanner
   ├── Resultado
   └── Jardim
```

A centralização evita manter cópias independentes da mesma espécie em diferentes funcionalidades.

## Jardim Virtual

Conceitualmente, o Jardim representa uma relação muitos-para-muitos entre usuários e PANCs.

```text
USUÁRIO
   │
   │ 1
   │
   ▼ N
JARDIM
   │
   │ N
   │
   ▼ 1
PANC
```

Assim, o Jardim armazena a relação entre entidades em vez de duplicar todas as informações botânicas.

### Operações

Um usuário autenticado pode:

- consultar seu Jardim;
- adicionar uma espécie;
- remover uma espécie;
- abrir as informações da PANC;
- continuar contribuindo com imagens de uma espécie já salva.

Quando a espécie já pertence ao Jardim, o fluxo pode oferecer a ação:

```text
Enviar novas fotos
```

em vez de impedir completamente uma nova contribuição.

---

# Eden IA

A Eden é implementada separadamente do classificador de imagens.

## Fluxo

```text
┌────────────┐
│  Usuário   │
└─────┬──────┘
      │ mensagem
      ▼
┌────────────┐
│ Front-end  │
│ JavaScript │
└─────┬──────┘
      │ request
      ▼
┌────────────────────┐
│ Supabase            │
│ Edge Function       │
│ `eden`              │
└─────────┬──────────┘
          │
          ├── instruções da assistente
          ├── mensagem atual
          └── histórico recente
          │
          ▼
┌────────────────────┐
│ Gemini API          │
└─────────┬──────────┘
          │ resposta
          ▼
┌────────────────────┐
│ Edge Function       │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Interface do chat  │
└────────────────────┘
```

## Por que uma Edge Function?

Fazer a requisição diretamente pelo JavaScript do navegador exigiria expor a credencial da API no cliente.

Por isso:

```text
INCORRETO

browser ─── API_KEY ───> Gemini


ARQUITETURA UTILIZADA

browser ───> Edge Function ─── segredo no backend ───> Gemini
```

A chave permanece no ambiente protegido do backend.

## Contexto da conversa

A requisição inclui:

- mensagem atual;
- parte do histórico recente;
- instruções responsáveis por orientar o comportamento da Eden.

Isso permite manter continuidade limitada entre mensagens sem transformar todo o histórico em uma requisição indefinidamente crescente.

## Tratamento de HTTP 503

A integração implementa tratamento para indisponibilidade temporária.

Quando o serviço retorna `HTTP 503`, a função pode executar **até três tentativas**, utilizando períodos progressivos de espera.

Caso nenhuma tentativa tenha sucesso, um erro é devolvido ao front-end para tratamento pela interface.

## Limitações

A Eden utiliza IA generativa e pode produzir informações imprecisas.

Ela é um recurso complementar e não deve ser utilizada como única fonte para decisões relacionadas à identificação ou consumo de plantas.

---

# Backend e persistência

O projeto começou com uma estrutura de banco baseada em **MySQL**, utilizando ferramentas como MySQL Workbench, XAMPP e phpMyAdmin.

Com a evolução da aplicação, o backend foi reestruturado para:

```text
Supabase
├── Auth
├── PostgreSQL
├── Storage
├── Row Level Security
└── Edge Functions
```

A mudança permitiu centralizar serviços que anteriormente precisariam ser implementados ou hospedados separadamente.

---

# Banco de dados

Entre as tabelas utilizadas na estrutura atual estão:

```text
profiles
pancs
jardim
identificacoes
imagens
mensagens
admins
imagens_treinamento
```

## Responsabilidades conceituais

| Tabela | Responsabilidade |
|---|---|
| `profiles` | informações complementares relacionadas aos usuários |
| `pancs` | catálogo central de espécies |
| `jardim` | relação entre usuários e espécies salvas |
| `identificacoes` | registros relacionados ao processo de identificação |
| `imagens` | informações relacionadas às imagens do sistema |
| `mensagens` | dados relacionados às interações/mensagens previstas pela aplicação |
| `admins` | controle dos usuários com privilégios administrativos |
| `imagens_treinamento` | metadados das imagens destinadas ao fluxo de contribuição/revisão |

> Os detalhes exatos de colunas, constraints e políticas devem ser consultados no schema SQL vigente do projeto. Este README descreve as responsabilidades arquiteturais sem inventar campos não documentados.

## Modelo lógico simplificado

```text
                    ┌──────────────┐
                    │   profiles   │
                    │   user_id    │
                    └──────┬───────┘
                           │
              ┌────────────┼─────────────┐
              │            │             │
              ▼            ▼             ▼
       ┌────────────┐ ┌───────────┐ ┌───────────────────┐
       │   jardim   │ │identific. │ │imagens_treinamento│
       └─────┬──────┘ └───────────┘ └───────────────────┘
             │
             ▼
       ┌────────────┐
       │   pancs    │
       └────────────┘
```

Esse diagrama é propositalmente simplificado: ele representa as relações funcionais descritas no projeto e não substitui o DER/schema SQL.

---

# Autenticação e autorização

## Supabase Auth

O Supabase Auth gerencia:

- criação de conta;
- credenciais;
- login;
- sessão;
- identificação do usuário autenticado.

## Validação de cadastro

A interface exige uma senha com:

- mínimo de 6 caracteres;
- pelo menos uma letra maiúscula;
- pelo menos um número;
- pelo menos um caractere especial.

Também existe confirmação da senha antes do envio.

A interface apresenta dinamicamente quais requisitos foram atendidos.

## Confirmação de e-mail

Dependendo da configuração ativa no Supabase, o usuário precisa confirmar o endereço de e-mail.

O redirecionamento foi configurado para retornar ao domínio do Growly.

## Sessão

Após a autenticação, o Supabase disponibiliza uma sessão que permite identificar o usuário atual.

As áreas protegidas utilizam uma verificação centralizada denominada:

```js
requireAuth()
```

A função é utilizada para impedir o carregamento de dados pessoais quando não existe uma sessão válida.

## UUID

Cada usuário é identificado por um UUID.

Esse identificador é utilizado para relacionar a conta a recursos como:

- Jardim;
- identificações;
- imagens autorizadas;
- outros dados pessoais da aplicação.

## Autenticação não é autorização

Uma distinção importante na arquitetura é:

```text
AUTENTICAÇÃO
"Quem é o usuário?"
       │
       └── Supabase Auth


AUTORIZAÇÃO
"O que esse usuário pode acessar?"
       │
       ├── Row Level Security
       ├── Storage Policies
       └── regras administrativas
```

Ocultar um botão no HTML ou JavaScript não é suficiente para proteger dados.

---

# Storage e contribuição de imagens

As imagens autorizadas para melhoria futura do modelo são armazenadas em uma área privada do Supabase Storage.

## Fluxo de contribuição

```text
Identificação concluída
        │
        ▼
Usuário autoriza contribuição?
        │
   ┌────┴────┐
   │         │
  NÃO       SIM
   │         │
   ▼         ▼
encerra   upload privado
             │
             ▼
       grava metadados
             │
             ▼
       fila de revisão
```

Os metadados podem registrar informações relacionadas a:

- previsão;
- confiança;
- espécie;
- origem;
- usuário;
- status de revisão.

A coleta é opcional e não deve ser necessária para utilizar normalmente o scanner.

---

# Revisão administrativa

O Growly possui uma etapa de curadoria humana das imagens contribuídas.

A área administrativa permite à equipe:

- visualizar contribuições pendentes;
- aprovar;
- rejeitar;
- corrigir a espécie associada;
- desfazer a última ação;
- organizar imagens aprovadas por espécie.

## Pipeline de curadoria

```text
Storage privado
      │
      ▼
imagem pendente
      │
      ▼
revisão humana
      │
 ┌────┴─────────────┐
 │                  │
 ▼                  ▼
rejeitada        aprovada
                    │
                    ├── classe confirmada
                    │
                    └── classe corrigida
                    │
                    ▼
              conjunto revisado
                    │
                    ▼
           candidato a dataset
                    │
                    ▼
             novo treinamento
```

A previsão inicial do modelo **não é tratada automaticamente como ground truth**. A revisão existe justamente para evitar retroalimentar erros do classificador.

---

# Interface e responsividade

A interface utiliza principalmente tons de verde e creme, componentes arredondados e elementos relacionados à natureza.

A identidade visual busca equilibrar:

```text
tecnologia + natureza + simplicidade
```

## Responsividade

O CSS utiliza:

- dimensões flexíveis;
- media queries;
- adaptações específicas para telas menores.

Foram realizados testes em computadores e smartphones.

### Scanner

A interface do scanner precisou acomodar:

- quatro imagens;
- pré-visualização;
- remoção/substituição;
- estado de processamento;
- resultado;
- confiança;
- ações posteriores.

### Eden

A interface do chat recebeu ajustes específicos para:

- rolagem;
- área de digitação;
- carregamento;
- navegação pelo histórico;
- retorno ao final da conversa.

### Feedback de interface

Foram implementados estados visuais para situações como:

- carregamento;
- sucesso;
- erro;
- seleção;
- indisponibilidade.

---

# Segurança

A arquitetura aplica controles em diferentes níveis.

## 1. Credenciais

Segredos de serviços externos não devem permanecer no JavaScript público.

A chave da Gemini API é utilizada no backend por meio da Edge Function.

## 2. Row Level Security

RLS restringe operações no PostgreSQL com base no contexto do usuário autenticado.

Isso permite que dados pessoais sejam protegidos no próprio backend.

Exemplo conceitual:

```text
Usuário A ─── pode modificar ───> Jardim A
Usuário A ─── NÃO pode modificar ───> Jardim B
```

## 3. Storage Policies

Arquivos privados possuem políticas próprias de acesso.

A proteção não depende de a URL estar escondida na interface.

## 4. Administração

Uma interface administrativa não deve ser considerada protegida apenas porque o link não aparece para usuários comuns.

A autorização deve ser validada com base nos privilégios associados à conta.

## 5. Front-end público

Como o código JavaScript enviado ao navegador pode ser inspecionado, nenhuma informação realmente secreta deve depender de ofuscação ou de elementos ocultos no cliente.

---

# Testes

O desenvolvimento foi incremental e os testes ocorreram ao longo das versões.

## Áreas verificadas

### Interface

- navegação;
- responsividade;
- posicionamento;
- rolagem;
- imagens;
- estados visuais.

### Autenticação

- cadastro;
- validação da senha;
- confirmação de e-mail;
- login;
- sessão;
- redirecionamento;
- páginas protegidas.

### Scanner

- carregamento do modelo;
- câmera;
- galeria;
- quatro imagens;
- pré-visualização;
- inferência;
- agregação;
- mapeamento de classes;
- resultado.

### IA

- classificações corretas/incorretas;
- consistência em diferentes ângulos;
- fundos;
- iluminação;
- entradas inválidas;
- níveis de confiança.

### Backend

- consultas;
- relações com usuário;
- Storage;
- permissões;
- integração com Edge Functions.

### Eden

- envio de mensagens;
- resposta;
- histórico;
- indisponibilidade temporária;
- interface mobile.

### Deploy

Após a publicação, os testes foram repetidos porque determinados problemas aparecem somente no ambiente hospedado, principalmente:

- caminhos de arquivos;
- carregamento de recursos;
- permissões do navegador;
- diferenças entre dispositivos.

## Processo

```text
implementação
     │
     ▼
teste
     │
     ▼
diagnóstico
     │
     ▼
correção
     │
     ▼
regressão / novo teste
     │
     └──────────► próxima iteração
```

---

# Decisões técnicas

## Por que uma aplicação web responsiva?

A versão atual pode ser utilizada diretamente pelo navegador, permitindo acesso em computadores e dispositivos móveis sem exigir uma instalação nativa específica.

## Por que TensorFlow.js?

A execução no navegador permite realizar a inferência do classificador no próprio cliente.

A arquitetura do scanner é, portanto, diferente da Eden: a classificação visual não precisa enviar cada inferência para uma API de IA externa.

## Por que quatro imagens?

Porque os testes com uma única fotografia apresentaram variação relevante. A agregação de quatro previsões reduz a dependência de uma captura isolada.

## Por que Supabase?

A evolução para Supabase/PostgreSQL reuniu recursos de:

- persistência;
- autenticação;
- armazenamento;
- autorização;
- funções server-side.

## Por que RLS?

Porque verificar o usuário somente no front-end não protege o banco.

As regras de autorização precisam existir também na camada que efetivamente fornece os dados.

## Por que Edge Function na Eden?

Para evitar expor a chave da Gemini API e separar a integração externa do código público executado pelo navegador.

## Por que revisão humana das imagens?

Porque usar automaticamente a própria previsão do modelo como rótulo para novos dados poderia reforçar classificações incorretas.

A curadoria cria uma etapa de validação antes de considerar as imagens para novos treinamentos.

---

# Limitações conhecidas

O projeto ainda está em desenvolvimento e possui limitações técnicas conhecidas.

## Classificador restrito

A versão atual trabalha com cinco PANCs principais.

Uma planta fora das classes conhecidas não deve ser interpretada como se estivesse necessariamente representada pelo modelo.

## Dataset limitado

O desempenho depende da quantidade, qualidade e diversidade das imagens utilizadas no treinamento.

Tanchagem e Vinagreira demonstraram maior instabilidade em determinados testes.

## Confiança não é certeza

Uma previsão de alta confiança significa que o modelo atribuiu alta probabilidade àquela classe entre as opções aprendidas.

Não significa confirmação botânica.

## Sensibilidade à captura

A classificação pode variar com:

- iluminação;
- enquadramento;
- distância;
- fundo;
- foco;
- ângulo;
- estado da planta;
- semelhança visual entre espécies.

## Eden IA

A Eden pode gerar informações incorretas ou incompletas, como qualquer sistema baseado em IA generativa.

## Validação científica

O Growly é uma ferramenta educacional e assistiva. O resultado do scanner não substitui avaliação botânica especializada.

> **Nunca consuma uma planta exclusivamente com base em uma identificação realizada pelo Growly.**

---

# Evolução do projeto

O Growly passou por diversas versões:

```text
1.01
  │
  ▼
1.02
  │
  ▼
1.03 ─── versão preservada como estável em uma etapa do desenvolvimento
  │
  ▼
1.04 ─── testes e alterações no classificador
  │
  ▼
1.05 ─── consolidação da arquitetura atual
  │
  ▼
1.05.6
```

O controle de versão permitiu preservar versões funcionais enquanto novas implementações eram avaliadas.

A evolução envolveu mudanças em:

- interface;
- responsividade;
- scanner;
- modelo;
- autenticação;
- banco;
- backend;
- Eden;
- segurança;
- contribuição de imagens.

---

# Execução local

## Clonando o repositório

```bash
git clone https://github.com/ThiagoNestor/tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho.git
```

Entre no diretório:

```bash
cd tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho
```

## Branch do site

Para acessar a estrutura correspondente ao site publicado:

```bash
git switch site
```

## Servidor HTTP

Durante o desenvolvimento, execute o projeto por meio de um servidor HTTP local.

Uma opção é utilizar **Live Server** no Visual Studio Code.

Não é recomendado depender de:

```text
file:///
```

Recursos web como requisições, modelos e acesso à câmera podem sofrer restrições quando a aplicação é aberta diretamente pelo sistema de arquivos.

## Câmera

O acesso à câmera depende das permissões concedidas pelo usuário e das políticas de segurança do navegador.

Em ambiente publicado, utilize HTTPS.

---

# Versionamento e deploy

O repositório mantém separação entre o histórico acadêmico do TCC e a versão publicada.

## `main`

Mantém a estrutura e o histórico das versões do projeto.

A versão 1.05 está organizada no histórico do TCC em estrutura semelhante a:

```text
Protótipos/
└── GROWLY 1.05/
    └── GROWLY/
```

## `site`

Mantém os arquivos utilizados na raiz da versão publicada.

```text
site
├── arquivos HTML
├── css/
├── js/
├── assets/
├── model/
└── ...
```

Essa separação permite manter a documentação histórica sem exigir que a estrutura de publicação replique toda a árvore acadêmica.

> Ao trabalhar com as branches, evite misturar os históricos por rebase sem necessidade. Alterações destinadas ao site devem ser transferidas conscientemente entre `main` e `site`.

---

# Deploy

A aplicação está disponível em:

**https://growly.com.br/**

Repositório:

**https://github.com/ThiagoNestor/tcc-thiago-nestor-lais-ferrari-leticia-cardoso-rebeca-carvalho**

A versão publicada deve ser testada novamente após alterações, especialmente para verificar caminhos relativos, arquivos estáticos, modelo, autenticação e recursos dependentes do navegador.

---

# Roadmap

A continuidade técnica do Growly inclui:

- ampliar o dataset;
- melhorar o balanceamento entre classes;
- criar conjuntos independentes de treino e validação;
- incorporar imagens autorizadas somente após curadoria;
- comparar versões do modelo com métricas consistentes;
- melhorar o desempenho das classes instáveis;
- adicionar novas espécies;
- ampliar o catálogo;
- aprimorar acessibilidade;
- aprofundar testes em diferentes dispositivos;
- melhorar observabilidade e tratamento de erros;
- continuar fortalecendo políticas de segurança;
- evoluir a Eden;
- avaliar novas experiências mobile;
- documentar de forma cada vez mais detalhada o schema e as APIs internas.

---

# Sustentabilidade e impacto

O Growly relaciona tecnologia a temas como:

- biodiversidade;
- diversificação alimentar;
- educação;
- valorização de espécies locais;
- sustentabilidade;
- agricultura urbana;
- acesso ao conhecimento.

A pesquisa acadêmica do projeto relaciona as PANCs a diferentes Objetivos de Desenvolvimento Sustentável, especialmente em temas ligados à alimentação, saúde, cidades sustentáveis, consumo responsável e resiliência dos sistemas alimentares.

A aplicação não pressupõe que todas as PANCs possuam os mesmos benefícios ou formas de utilização. Cada espécie precisa ser compreendida individualmente.

---

# Documentação acadêmica

O projeto possui uma documentação completa de TCC que registra:

- contextualização;
- problema de pesquisa;
- justificativa;
- objetivos;
- hipótese;
- referencial teórico;
- metodologia;
- evolução das versões;
- arquitetura;
- tecnologias;
- banco de dados;
- interface;
- autenticação;
- catálogo;
- Jardim;
- scanner;
- treinamento;
- testes;
- Eden IA.

O README tem uma finalidade diferente da monografia: apresentar o projeto e documentar tecnicamente sua arquitetura de maneira adequada a um repositório de software.

---

# Equipe

O Growly é desenvolvido por estudantes do curso Técnico em Desenvolvimento de Sistemas da **ETEC Professor Camargo Aranha**.

| Integrante |
|---|
| **Laís Silva Ferrari** |
| **Letícia Rodrigues Cardoso** |
| **Rebeca Carvalho Trindade** |
| **Thiago Nestor Afonso dos Santos** |

### Orientação

**Prof. Ricardo Faria Palhares** — orientador do Trabalho de Conclusão de Curso.

O desenvolvimento também contou com apoio, colaboração e referências de professores e profissionais ao longo do projeto.

---

# Parceria e coleta de imagens

Durante o desenvolvimento foi estabelecida uma parceria com a **Horta das Flores**, localizada na região da Mooca, em São Paulo.

A parceria possibilitou acesso às espécies selecionadas e a produção de registros fotográficos próprios utilizados na construção do dataset.

O Growly não é uma aplicação exclusiva da instituição: a plataforma foi desenvolvida para o público interessado em conhecer e identificar PANCs.

---

<div align="center">

## Growly

**Tecnologia aplicada ao reconhecimento e ao conhecimento sobre PANCs.**

*Onde cada planta encontra seu caminho para florescer.*

São Paulo — 2026

</div>
