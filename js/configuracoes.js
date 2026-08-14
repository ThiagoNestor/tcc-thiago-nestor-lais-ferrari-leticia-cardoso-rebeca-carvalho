let usuario = null;

const status = document.getElementById("status");
const campoNome = document.getElementById("conta-nome");
const salvar = document.getElementById("salvar");

document.getElementById("form-perfil").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!usuario) return;
  salvar.disabled = true;
  salvar.textContent = "Salvando...";
  const { error } = await db.from("profiles").update({ nome: campoNome.value }).eq("id", usuario.id);
  salvar.disabled = false;
  salvar.textContent = "Salvar alterações";
  status.textContent = error ? "Não foi possível salvar." : "Perfil atualizado!";
  status.hidden = false;
});

document.getElementById("sair").addEventListener("click", async () => {
  await db.auth.signOut();
  location.href = "index.html";
});

(async () => {
  usuario = await requireAuth();
  if (!usuario) return;
  document.getElementById("conta-email").value = usuario.email || "";
  const { data } = await db.from("profiles").select("nome").eq("id", usuario.id).maybeSingle();
  campoNome.value = (data && data.nome) || "";
})();
