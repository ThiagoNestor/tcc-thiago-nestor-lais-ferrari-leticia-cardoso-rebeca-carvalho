const form = document.getElementById("form-cadastro");

const erro = document.getElementById("erro");
const aviso = document.getElementById("aviso");
const enviar = document.getElementById("enviar");

const campoSenha = document.getElementById("password");
const confirmarSenha = document.getElementById("confirm-password");

const regraTamanho = document.getElementById("regra-tamanho");
const regraMaiuscula = document.getElementById("regra-maiuscula");
const regraNumero = document.getElementById("regra-numero");
const regraEspecial = document.getElementById("regra-especial");

const passwordMatch = document.getElementById("password-match");


/* =========================================
   VERIFICA AS REGRAS DA SENHA
   ========================================= */

function validarSenha(senha) {

  return {

    tamanho:
      senha.length >= 6,

    maiuscula:
      /[A-Z]/.test(senha),

    numero:
      /[0-9]/.test(senha),

    especial:
      /[^A-Za-z0-9]/.test(senha)

  };

}


/* =========================================
   MUDA CADA REGRA ENTRE VERMELHO E VERDE
   ========================================= */

function atualizarRegra(elemento, valida) {

  if (!elemento) return;

  const icone =
    elemento.querySelector(".regra-icone");


  if (valida) {

    elemento.classList.remove("invalida");
    elemento.classList.add("valida");

    icone.textContent = "✓";

  } else {

    elemento.classList.remove("valida");
    elemento.classList.add("invalida");

    icone.textContent = "✕";

  }

}


/* =========================================
   CONFIRMAÇÃO DE SENHA
   ========================================= */

function verificarSenhasIguais() {

  const senha =
    campoSenha.value;

  const confirmacao =
    confirmarSenha.value;


  const iguais =
    senha.length > 0 &&
    confirmacao.length > 0 &&
    senha === confirmacao;


  const icone =
    passwordMatch.querySelector(".regra-icone");


  if (iguais) {

    passwordMatch.classList.remove("invalida");
    passwordMatch.classList.add("valida");

    icone.textContent = "✓";

    passwordMatch.querySelector("span:last-child").textContent =
      "As senhas são iguais";

  } else {

    passwordMatch.classList.remove("valida");
    passwordMatch.classList.add("invalida");

    icone.textContent = "✕";

    passwordMatch.querySelector("span:last-child").textContent =
      "As senhas devem ser iguais";

  }


  return iguais;

}


/* =========================================
   ATUALIZA TUDO EM TEMPO REAL
   ========================================= */

function atualizarRequisitos() {

  const senha =
    campoSenha.value;


  const regras =
    validarSenha(senha);


  atualizarRegra(
    regraTamanho,
    regras.tamanho
  );

  atualizarRegra(
    regraMaiuscula,
    regras.maiuscula
  );

  atualizarRegra(
    regraNumero,
    regras.numero
  );

  atualizarRegra(
    regraEspecial,
    regras.especial
  );


  const senhaValida =
    regras.tamanho &&
    regras.maiuscula &&
    regras.numero &&
    regras.especial;


  const senhasIguais =
    verificarSenhasIguais();


  const cadastroValido =
    senhaValida &&
    senhasIguais;


  enviar.disabled =
    !cadastroValido;


  return cadastroValido;

}


/* =========================================
   VERIFICA ENQUANTO O USUÁRIO DIGITA
   ========================================= */

campoSenha.addEventListener(
  "input",
  atualizarRequisitos
);


confirmarSenha.addEventListener(
  "input",
  atualizarRequisitos
);


/* Estado inicial */

atualizarRequisitos();


/* =========================================
   CADASTRO
   ========================================= */

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    erro.hidden = true;
    aviso.hidden = true;


    const senha =
      campoSenha.value;


    const confirmacao =
      confirmarSenha.value;


    /* Segurança extra */

    if (!atualizarRequisitos()) {

      erro.textContent =
        "A senha ainda não atende a todos os requisitos.";

      erro.hidden = false;

      return;

    }


    if (senha !== confirmacao) {

      erro.textContent =
        "As senhas não coincidem.";

      erro.hidden = false;

      return;

    }


    enviar.disabled = true;

    enviar.textContent =
      "Cadastrando...";


    try {

      const { data, error } =
        await db.auth.signUp({

          email:
            document
              .getElementById("email")
              .value,

          password:
            senha,

          options: {

            data: {

              nome:
                document
                  .getElementById("username")
                  .value

            },

            emailRedirectTo:
              location.origin +
              location.pathname.replace(
                "cadastro.html",
                "home.html"
              )

          }

        });


      if (error) {

        throw error;

      }


      if (data.session) {

        location.href =
          "home.html";

        return;

      }


      aviso.textContent =
        "Conta criada! Confirme o e-mail enviado para você e depois faça login.";

      aviso.hidden =
        false;


      /* Limpa as senhas */

      campoSenha.value =
        "";

      confirmarSenha.value =
        "";


      atualizarRequisitos();


    } catch (error) {

      erro.textContent =
        error.message.includes(
          "already registered"
        )
          ? "Este e-mail já possui uma conta. Faça login."
          : error.message;


      erro.hidden =
        false;

    } finally {

      enviar.textContent =
        "Cadastrar";


      atualizarRequisitos();

    }

  }
);

/* =========================================
   MOSTRAR / ESCONDER SENHA
   ========================================= */

const botoesMostrarSenha =
  document.querySelectorAll(".password-toggle");


botoesMostrarSenha.forEach((botao) => {

  botao.addEventListener("click", () => {

    const campoId =
      botao.dataset.passwordToggle;

    const campo =
      document.getElementById(campoId);


    if (!campo) return;


    const senhaVisivel =
      campo.type === "text";


    if (senhaVisivel) {

      campo.type = "password";

      botao.textContent = "👁";

      botao.setAttribute(
        "aria-label",
        "Mostrar senha"
      );

    } else {

      campo.type = "text";

      botao.textContent = "◉";

      botao.setAttribute(
        "aria-label",
        "Ocultar senha"
      );

    }

  });

});