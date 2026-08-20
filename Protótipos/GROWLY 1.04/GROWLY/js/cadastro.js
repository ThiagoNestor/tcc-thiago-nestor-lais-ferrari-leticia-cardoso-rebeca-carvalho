const form = document.getElementById("form-cadastro");
const erro = document.getElementById("erro");
const aviso = document.getElementById("aviso");
const enviar = document.getElementById("enviar");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  erro.hidden = true;
  aviso.hidden = true;

  const senha = document.getElementById("password").value;
  if (senha.length < 6) {
    erro.textContent = "A senha deve ter pelo menos 6 caracteres.";
    erro.hidden = false;
    return;
  }

  enviar.disabled = true;
  enviar.textContent = "Cadastrando...";

  const { data, error } = await db.auth.signUp({
    email: document.getElementById("email").value,
    password: senha,
    options: {
      data: { nome: document.getElementById("username").value },
      emailRedirectTo: location.origin + location.pathname.replace("cadastro.html", "home.html"),
    },
  });

  enviar.disabled = false;
  enviar.textContent = "Cadastrar";

  if (error) {
    erro.textContent = error.message.includes("already registered")
      ? "Este e-mail já possui uma conta. Faça login."
      : error.message;
    erro.hidden = false;
    return;
  }
  if (data.session) {
    location.href = "home.html";
    return;
  }
  aviso.textContent = "Conta criada! Confirme o e-mail enviado para você e depois faça login.";
  aviso.hidden = false;
});
