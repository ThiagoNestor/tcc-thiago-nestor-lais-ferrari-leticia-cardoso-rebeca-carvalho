(async () => {

  const user = await requireAuth();

  if (!user) {
    return;
  }

  const nome =
    user.user_metadata?.nome ||
    (user.email || "").split("@")[0] ||
    "visitante";

  document.getElementById("nome").textContent =
    nome + " 🌱";

})();