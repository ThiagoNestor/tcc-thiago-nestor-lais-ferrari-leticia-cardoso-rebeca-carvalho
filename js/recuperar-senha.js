const form = document.getElementById("form-recuperar");
const erro = document.getElementById("erro");
const sucesso = document.getElementById("sucesso");
const enviar = document.getElementById("enviar");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  erro.hidden = true;
  sucesso.hidden = true;

  enviar.disabled = true;
  enviar.textContent = "Enviando...";

  const email = document
    .getElementById("email")
    .value
    .trim();

  const redirectTo =
    `${window.location.origin}/nova-senha.html`;

  const { error } = await db.auth.resetPasswordForEmail(
    email,
    {
      redirectTo,
    }
  );

  enviar.disabled = false;
  enviar.textContent = "Enviar link";

  if (error) {
    console.error(error);

    erro.textContent =
      "Não foi possível enviar o link de recuperação. Tente novamente.";

    erro.hidden = false;
    return;
  }

  sucesso.textContent =
    "Se existir uma conta vinculada a esse e-mail, você receberá as instruções para redefinir sua senha.";

  sucesso.hidden = false;
});