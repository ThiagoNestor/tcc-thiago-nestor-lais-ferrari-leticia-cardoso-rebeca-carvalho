(async () => {
  const user = await requireAuth();
  if (!user) return;
  const { data } = await db.from("profiles").select("nome").eq("id", user.id).maybeSingle();
  const nome = (data && data.nome) || (user.email || "").split("@")[0] || "visitante";
  document.getElementById("nome").textContent = nome + " 🌱";
})();
