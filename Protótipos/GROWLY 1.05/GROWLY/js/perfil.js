let usuarioPerfil = null;


// ==========================================
// ELEMENTOS
// ==========================================

const profileAvatar =
  document.getElementById("profile-avatar");

const profileAvatarInitials =
  document.getElementById("profile-avatar-initials");

const profileAvatarImage =
  document.getElementById("profile-avatar-image");

const profileAvatarInput =
  document.getElementById("profile-avatar-input");


const profileName =
  document.getElementById("profile-name");

const profileEmail =
  document.getElementById("profile-email");

const profileMember =
  document.getElementById("profile-member");


const profileAccountName =
  document.getElementById("profile-account-name");

const profileAccountEmail =
  document.getElementById("profile-account-email");

const profileAccountType =
  document.getElementById("profile-account-type");

const profileAccountCreated =
  document.getElementById("profile-account-created");


const statJardim =
  document.getElementById("stat-jardim");

const statIdentificacoes =
  document.getElementById("stat-identificacoes");

const statContribuicoes =
  document.getElementById("stat-contribuicoes");


const profileContributionNumber =
  document.getElementById(
    "profile-contribution-number"
  );


const btnLogout =
  document.getElementById("profile-logout");



// ==========================================
// CONFIGURAÇÕES DO AVATAR
// ==========================================

const AVATAR_BUCKET =
  "avatares";

const AVATAR_MAX_SIZE =
  5 * 1024 * 1024;

const AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp"
];



// ==========================================
// INICIAIS DO USUÁRIO
// ==========================================

function obterIniciais(nome) {

  if (!nome) {
    return "G";
  }


  const partes =
    nome
      .trim()
      .split(/\s+/)
      .filter(Boolean);


  if (!partes.length) {
    return "G";
  }


  if (partes.length === 1) {

    return partes[0]
      .charAt(0)
      .toUpperCase();

  }


  return (
    partes[0].charAt(0) +
    partes[partes.length - 1].charAt(0)
  ).toUpperCase();
}



// ==========================================
// DATA DA CONTA
// ==========================================

function obterDataConta(dataCriacao) {

  if (!dataCriacao) {
    return null;
  }


  const data =
    new Date(dataCriacao);


  if (
    Number.isNaN(
      data.getTime()
    )
  ) {

    return null;
  }


  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      month: "long",
      year: "numeric"
    }
  ).format(data);
}



function formatarDataConta(dataCriacao) {

  const data =
    obterDataConta(
      dataCriacao
    );


  if (!data) {
    return "Membro do Growly";
  }


  return `Membro desde ${data}`;
}



// ==========================================
// CARREGAR DADOS DO USUÁRIO
// ==========================================

function carregarDadosUsuario(usuario) {

  const nome =
    usuario.user_metadata?.nome ||
    usuario.email?.split("@")[0] ||
    "Usuário Growly";


  const email =
    usuario.email ||
    "E-mail não disponível";


  const dataConta =
    obterDataConta(
      usuario.created_at
    );


  // CARD PRINCIPAL

  profileName.textContent =
    nome;

  profileEmail.textContent =
    email;

  profileMember.textContent =
    formatarDataConta(
      usuario.created_at
    );


  // AVATAR

  profileAvatarInitials.textContent =
    obterIniciais(
      nome
    );


  // INFORMAÇÕES DA CONTA

  profileAccountName.textContent =
    nome;

  profileAccountEmail.textContent =
    email;

  profileAccountCreated.textContent =
    dataConta ||
    "Não disponível";
}



// ==========================================
// VERIFICAR ADMINISTRADOR
// ==========================================

async function verificarAdminPerfil(
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
// CARREGAR TIPO DE CONTA
// ==========================================

async function carregarTipoConta(
  userId
) {

  try {

    const admin =
      await verificarAdminPerfil(
        userId
      );


    profileAccountType.textContent =
      admin
        ? "Administrador"
        : "Membro";

  } catch (erro) {

    console.error(
      "Erro ao carregar tipo de conta:",
      erro
    );

    profileAccountType.textContent =
      "Membro";
  }
}



// ==========================================
// EXIBIÇÃO DO AVATAR
// ==========================================

function mostrarIniciaisAvatar() {

  profileAvatarImage.hidden =
    true;


  profileAvatarImage.removeAttribute(
    "src"
  );


  profileAvatarInitials.hidden =
    false;
}



function mostrarFotoAvatar(url) {

  profileAvatarImage.src =
    url;


  profileAvatarImage.hidden =
    false;


  profileAvatarInitials.hidden =
    true;
}



// ==========================================
// CARREGAR FOTO
// ==========================================

async function carregarFotoPerfil(
  usuario
) {

  const caminho =
    usuario.user_metadata?.avatar_path;


  if (!caminho) {

    mostrarIniciaisAvatar();

    return;
  }


  try {

    const {
      data,
      error
    } =
      await db.storage
        .from(
          AVATAR_BUCKET
        )
        .createSignedUrl(
          caminho,
          60 * 60
        );


    if (error) {
      throw error;
    }


    if (!data?.signedUrl) {

      mostrarIniciaisAvatar();

      return;
    }


    mostrarFotoAvatar(
      data.signedUrl
    );

  } catch (erro) {

    console.error(
      "Erro ao carregar foto de perfil:",
      erro
    );


    mostrarIniciaisAvatar();
  }
}



// ==========================================
// VALIDAR AVATAR
// ==========================================

function validarAvatar(arquivo) {

  if (
    !AVATAR_TYPES.includes(
      arquivo.type
    )
  ) {

    throw new Error(
      "Escolha uma imagem JPG, PNG ou WEBP."
    );
  }


  if (
    arquivo.size >
    AVATAR_MAX_SIZE
  ) {

    throw new Error(
      "A imagem deve ter no máximo 5 MB."
    );
  }
}



// ==========================================
// ENVIAR FOTO
// ==========================================

async function enviarFotoPerfil(
  arquivo
) {

  if (!usuarioPerfil) {
    return;
  }


  validarAvatar(
    arquivo
  );


  const extensoes = {

    "image/jpeg": "jpg",

    "image/png": "png",

    "image/webp": "webp"

  };


  const extensao =
    extensoes[
      arquivo.type
    ];


  const caminho =
    `${usuarioPerfil.id}/avatar.${extensao}`;


  const caminhoAnterior =
    usuarioPerfil
      .user_metadata
      ?.avatar_path;



  // UPLOAD

  const {
    error: uploadError
  } =
    await db.storage
      .from(
        AVATAR_BUCKET
      )
      .upload(
        caminho,
        arquivo,
        {
          cacheControl: "3600",
          upsert: true,
          contentType:
            arquivo.type
        }
      );


  if (uploadError) {
    throw uploadError;
  }



  // SALVAR CAMINHO NO AUTH

  const {
    data,
    error: updateError
  } =
    await db.auth.updateUser({

      data: {
        avatar_path:
          caminho
      }

    });


  if (updateError) {

    await db.storage
      .from(
        AVATAR_BUCKET
      )
      .remove([
        caminho
      ]);


    throw updateError;
  }


  usuarioPerfil =
    data.user;



  // REMOVER FOTO ANTIGA
  // CASO A EXTENSÃO MUDE

  if (
    caminhoAnterior &&
    caminhoAnterior !==
      caminho
  ) {

    const {
      error: removeError
    } =
      await db.storage
        .from(
          AVATAR_BUCKET
        )
        .remove([
          caminhoAnterior
        ]);


    if (removeError) {

      console.warn(
        "Não foi possível remover o avatar anterior:",
        removeError
      );
    }
  }



  await carregarFotoPerfil(
    usuarioPerfil
  );
}



// ==========================================
// CLIQUE NO AVATAR
// ==========================================

profileAvatar.addEventListener(
  "click",
  () => {

    profileAvatarInput.click();

  }
);



// ==========================================
// TROCAR FOTO
// ==========================================

profileAvatarInput.addEventListener(
  "change",
  async () => {

    const arquivo =
      profileAvatarInput
        .files?.[0];


    if (!arquivo) {
      return;
    }


    profileAvatar.disabled =
      true;


    try {

      await enviarFotoPerfil(
        arquivo
      );

    } catch (erro) {

      console.error(
        "Erro ao alterar foto de perfil:",
        erro
      );


      alert(
        erro.message ||
        "Não foi possível alterar sua foto de perfil."
      );

    } finally {

      profileAvatar.disabled =
        false;


      profileAvatarInput.value =
        "";
    }
  }
);



// ==========================================
// CONTAR REGISTROS
// ==========================================

async function contarRegistros(
  tabela,
  userId
) {

  const {
    count,
    error
  } =
    await db
      .from(
        tabela
      )
      .select(
        "*",
        {
          count: "exact",
          head: true
        }
      )
      .eq(
        "user_id",
        userId
      );


  if (error) {
    throw error;
  }


  return count ?? 0;
}



// ==========================================
// CARREGAR ESTATÍSTICAS
// ==========================================

async function carregarEstatisticas(
  userId
) {

  const resultados =
    await Promise.allSettled([

      contarRegistros(
        "jardim",
        userId
      ),

      contarRegistros(
        "identificacoes",
        userId
      ),

      contarRegistros(
        "imagens_treinamento",
        userId
      )

    ]);


  const [
    jardim,
    identificacoes,
    contribuicoes
  ] = resultados;



  // JARDIM

  if (
    jardim.status ===
    "fulfilled"
  ) {

    statJardim.textContent =
      jardim.value;

  } else {

    statJardim.textContent =
      "—";


    console.error(
      "Erro ao carregar plantas do jardim:",
      jardim.reason
    );
  }



  // IDENTIFICAÇÕES

  if (
    identificacoes.status ===
    "fulfilled"
  ) {

    statIdentificacoes.textContent =
      identificacoes.value;

  } else {

    statIdentificacoes.textContent =
      "—";


    console.error(
      "Erro ao carregar identificações:",
      identificacoes.reason
    );
  }



  // CONTRIBUIÇÕES

  if (
    contribuicoes.status ===
    "fulfilled"
  ) {

    statContribuicoes.textContent =
      contribuicoes.value;


    profileContributionNumber.textContent =
      contribuicoes.value;

  } else {

    statContribuicoes.textContent =
      "—";


    profileContributionNumber.textContent =
      "—";


    console.error(
      "Erro ao carregar contribuições:",
      contribuicoes.reason
    );
  }
}



// ==========================================
// LOGOUT
// ==========================================

btnLogout.addEventListener(
  "click",
  async () => {

    btnLogout.disabled =
      true;


    const textoOriginal =
      btnLogout.innerHTML;


    btnLogout.textContent =
      "Saindo...";


    try {

      const {
        error
      } =
        await db.auth.signOut();


      if (error) {
        throw error;
      }


      location.replace(
        "login.html"
      );

    } catch (erro) {

      console.error(
        "Erro ao sair:",
        erro
      );


      btnLogout.innerHTML =
        textoOriginal;


      btnLogout.disabled =
        false;


      alert(
        "Não foi possível sair da conta. Tente novamente."
      );
    }
  }
);



// ==========================================
// INICIALIZAÇÃO
// ==========================================

async function iniciarPerfil() {

  try {

    const usuario =
      await requireAuth();


    if (!usuario) {
      return;
    }


    usuarioPerfil =
      usuario;


    carregarDadosUsuario(
      usuarioPerfil
    );


    await Promise.all([

      carregarFotoPerfil(
        usuarioPerfil
      ),

      carregarEstatisticas(
        usuarioPerfil.id
      ),

      carregarTipoConta(
        usuarioPerfil.id
      )

    ]);

  } catch (erro) {

    console.error(
      "Erro ao carregar perfil:",
      erro
    );
  }
}


iniciarPerfil();