const form = document.getElementById("form-nova-senha");
const erro = document.getElementById("erro");
const sucesso = document.getElementById("sucesso");
const salvarSenha = document.getElementById("salvar-senha");

/* =========================================
   MOSTRAR / ESCONDER SENHAS
   ========================================= */

document.querySelectorAll(".password-toggle").forEach((botao) => {
  botao.addEventListener("click", () => {
    const campoId = botao.dataset.passwordToggle;
    const campo = document.getElementById(campoId);

    if (!campo) return;

    const senhaVisivel = campo.type === "text";

    campo.type = senhaVisivel ? "password" : "text";
    botao.textContent = senhaVisivel ? "👁" : "◉";

    botao.setAttribute(
      "aria-label",
      senhaVisivel ? "Mostrar senha" : "Ocultar senha"
    );
  });
});

/* =========================================
   REDEFINIR SENHA
   ========================================= */

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  erro.hidden = true;
  sucesso.hidden = true;

  const novaSenha =
    document.getElementById("nova-senha").value;

  const confirmarSenha =
    document.getElementById("confirmar-senha").value;

  if (novaSenha.length < 8) {
    erro.textContent =
      "A nova senha deve ter pelo menos 8 caracteres.";

    erro.hidden = false;
    return;
  }

  if (novaSenha !== confirmarSenha) {
    erro.textContent =
      "As senhas não coincidem. Verifique e tente novamente.";

    erro.hidden = false;
    return;
  }

  salvarSenha.disabled = true;
  salvarSenha.textContent = "Redefinindo...";

  const { error } = await db.auth.updateUser({
    password: novaSenha,
  });

  if (error) {
    console.error(error);

    erro.textContent =
      "Não foi possível redefinir sua senha. O link pode ter expirado. Solicite um novo link de recuperação.";

    erro.hidden = false;

    salvarSenha.disabled = false;
    salvarSenha.textContent = "Redefinir senha";

    return;
  }

  sucesso.textContent =
    "Senha redefinida com sucesso! Você já pode entrar na sua conta.";

  sucesso.hidden = false;

  salvarSenha.textContent = "Senha redefinida ✓";

  setTimeout(async () => {
    await db.auth.signOut();
    window.location.href = "login.html";
  }, 2000);
});