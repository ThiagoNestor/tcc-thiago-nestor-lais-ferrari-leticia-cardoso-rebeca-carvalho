let usuario = null;

const status = document.getElementById("status");

const formPerfil = document.getElementById("form-perfil");
const campoNome = document.getElementById("conta-nome");
const salvar = document.getElementById("salvar");

const formEmail = document.getElementById("form-email");
const campoEmail = document.getElementById("novo-email");

const formSenha = document.getElementById("form-senha");
const senhaAtual = document.getElementById("senha-atual");
const senhaNova = document.getElementById("senha-nova");
const senhaConfirmar = document.getElementById("senha-confirmar");

const btnSair = document.getElementById("sair");


// ==========================================
// MENSAGEM DE STATUS
// ==========================================

function mostrarStatus(mensagem, erro = false) {

  status.textContent = mensagem;
  status.hidden = false;

  if (erro) {
    status.classList.remove("form-ok");
    status.classList.add("form-error");
  } else {
    status.classList.remove("form-error");
    status.classList.add("form-ok");
  }

}


// ==========================================
// ALTERAR NOME
// ==========================================

formPerfil.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    if (!usuario) {
      return;
    }


    const novoNome =
      campoNome.value.trim();


    if (!novoNome) {

      mostrarStatus(
        "Digite um nome válido.",
        true
      );

      return;
    }


    salvar.disabled = true;
    salvar.textContent = "Salvando...";


    try {

      const {
        data,
        error
      } =
        await db.auth.updateUser({

          data: {
            nome: novoNome
          }

        });


      if (error) {
        throw error;
      }


      usuario = data.user;


      campoNome.value =
        data.user.user_metadata?.nome ||
        novoNome;


      mostrarStatus(
        "Nome atualizado com sucesso!"
      );


      console.log(
        "Nome atualizado:",
        data.user.user_metadata
      );


    } catch (e) {

      console.error(
        "Erro ao alterar nome:",
        e
      );


      mostrarStatus(
        e.message ||
        "Não foi possível alterar o nome.",
        true
      );

    } finally {

      salvar.disabled = false;
      salvar.textContent = "Salvar nome";

    }

  }
);


// ==========================================
// ALTERAR E-MAIL
// ==========================================

formEmail.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    if (!usuario) {
      return;
    }


    const novoEmail =
      campoEmail.value
        .trim()
        .toLowerCase();


    if (!novoEmail) {

      mostrarStatus(
        "Digite um e-mail válido.",
        true
      );

      return;
    }


    try {

      const {
        error
      } =
        await db.auth.updateUser({

          email: novoEmail

        });


      if (error) {
        throw error;
      }


      mostrarStatus(
        "Solicitação enviada! Confira seu e-mail para confirmar a alteração."
      );


      campoEmail.value = "";


    } catch (e) {

      console.error(
        "Erro ao alterar e-mail:",
        e
      );


      mostrarStatus(
        e.message ||
        "Não foi possível alterar o e-mail.",
        true
      );

    }

  }
);


// ==========================================
// ALTERAR SENHA
// ==========================================

formSenha.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    if (!usuario) {
      return;
    }


    const atual =
      senhaAtual.value;


    const nova =
      senhaNova.value;


    const confirmar =
      senhaConfirmar.value;


    if (nova.length < 6) {

      mostrarStatus(
        "A nova senha deve ter pelo menos 6 caracteres.",
        true
      );

      return;
    }


    if (nova !== confirmar) {

      mostrarStatus(
        "As novas senhas não coincidem.",
        true
      );

      return;
    }


    try {

      /*
        Primeiro validamos a senha atual
        fazendo login novamente.
      */

      const {
        error: erroLogin
      } =
        await db.auth.signInWithPassword({

          email: usuario.email,
          password: atual

        });


      if (erroLogin) {

        mostrarStatus(
          "A senha atual está incorreta.",
          true
        );

        return;
      }


      const {
        error
      } =
        await db.auth.updateUser({

          password: nova

        });


      if (error) {
        throw error;
      }


      senhaAtual.value = "";
      senhaNova.value = "";
      senhaConfirmar.value = "";


      mostrarStatus(
        "Senha alterada com sucesso!"
      );


    } catch (e) {

      console.error(
        "Erro ao alterar senha:",
        e
      );


      mostrarStatus(
        e.message ||
        "Não foi possível alterar a senha.",
        true
      );

    }

  }
);


// ==========================================
// SAIR DA CONTA
// ==========================================

btnSair.addEventListener(
  "click",
  async () => {

    await db.auth.signOut();

    location.href =
      "index.html";

  }
);

// ==========================================
// ÁREA DA EQUIPE - ADMIN
// ==========================================

async function verificarAdminConfiguracoes(userId) {

  const {
    data,
    error
  } =
    await db
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
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
// CONTAR IMAGENS PENDENTES
// ==========================================

async function contarImagensPendentes() {

  const {
    count,
    error
  } =
    await db
      .from("imagens_treinamento")
      .select(
        "id",
        {
          count: "exact",
          head: true
        }
      )
      .eq(
        "status",
        "pendente"
      )
      .eq(
        "autorizado",
        true
      );


  if (error) {

    console.error(
      "Erro ao contar imagens pendentes:",
      error
    );

    return null;
  }


  return count || 0;
}


// ==========================================
// CARREGAR ÁREA ADMINISTRATIVA
// ==========================================

async function carregarAreaEquipe(user) {

  const areaEquipe =
    document.getElementById(
      "area-equipe"
    );

  const statusEquipe =
    document.getElementById(
      "area-equipe-status"
    );


  if (
    !areaEquipe ||
    !statusEquipe ||
    !user
  ) {

    return;
  }


  // Por segurança começa escondida.
  areaEquipe.hidden =
    true;


  const admin =
    await verificarAdminConfiguracoes(
      user.id
    );


  // Usuário comum não vê absolutamente nada.
  if (!admin) {

    console.log(
      "Usuário comum: área da equipe oculta."
    );

    return;
  }


  // É uma das contas administrativas.
  areaEquipe.hidden =
    false;


  statusEquipe.textContent =
    "Verificando imagens pendentes...";


  const quantidade =
    await contarImagensPendentes();


  if (quantidade === null) {

    statusEquipe.textContent =
      "Abrir revisão de imagens";

    return;
  }


  if (quantidade === 0) {

    statusEquipe.textContent =
      "Tudo revisado ✓";

    return;
  }


  if (quantidade === 1) {

    statusEquipe.textContent =
      "1 imagem pendente";

    return;
  }


  statusEquipe.textContent =
    `${quantidade} imagens pendentes`;
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

(async () => {

  usuario =
    await requireAuth();


  if (!usuario) {
    return;
  }


  // ========================================
  // ÁREA ADMINISTRATIVA
  // ========================================

  await carregarAreaEquipe(
    usuario
  );


  /*
    O nome foi criado no cadastro usando:

    options: {
      data: {
        nome: ...
      }
    }

    Portanto ele fica em:

    usuario.user_metadata.nome
  */

  campoNome.value =
    usuario.user_metadata?.nome ||
    "";


  /*
    Não colocamos o e-mail atual dentro
    do campo "Novo e-mail", porque esse
    campo serve somente para informar
    o endereço que substituirá o atual.
  */

  campoEmail.value = "";


  console.log(
    "Usuário carregado nas configurações:",
    usuario
  );

})();