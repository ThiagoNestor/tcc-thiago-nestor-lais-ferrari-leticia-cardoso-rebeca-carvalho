const form = document.getElementById("form-login");
const erro = document.getElementById("erro");
const enviar = document.getElementById("enviar");

db.auth.getSession().then(({ data }) => {
  if (data.session) location.replace("home.html");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  erro.hidden = true;
  enviar.disabled = true;
  enviar.textContent = "Entrando...";

  const { error } = await db.auth.signInWithPassword({
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  });

  enviar.disabled = false;
  enviar.textContent = "Login";

  if (error) {
    erro.textContent =
      error.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : error.message;
    erro.hidden = false;
    return;
  }
  location.href = "home.html";
});

/* =========================================
   MOSTRAR / ESCONDER SENHA
   ========================================= */

const botaoMostrarSenha =
  document.querySelector(".password-toggle");

if (botaoMostrarSenha) {
  botaoMostrarSenha.addEventListener("click", () => {
    const campoId =
      botaoMostrarSenha.dataset.passwordToggle;

    const campo =
      document.getElementById(campoId);

    if (!campo) return;

    const senhaVisivel =
      campo.type === "text";

    if (senhaVisivel) {
      campo.type = "password";

      botaoMostrarSenha.textContent = "👁";

      botaoMostrarSenha.setAttribute(
        "aria-label",
        "Mostrar senha"
      );
    } else {
      campo.type = "text";

      botaoMostrarSenha.textContent = "◉";

      botaoMostrarSenha.setAttribute(
        "aria-label",
        "Ocultar senha"
      );
    }
  });
}