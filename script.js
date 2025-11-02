// Cole aqui a URL do seu Apps Script (Implantar > Aplicativo da Web > URL)
const url = "https://script.google.com/macros/s/AKfycby1Z2EQ4VZyqgFoBTrhXE28bWRYzBCajxZBaNtYXdALT8SGyAu8ZC-Gaw7UvzvwFfaLmg/exec
";

// --- Renderização dos controles ---
const expOpcoes = ["Excelente", "Boa", "Regular", "Ruim", "Péssima"];
const retOpcoes = ["Sim", "Talvez", "Não"];

// Chips 1-5
document.querySelectorAll(".rating").forEach(group => {
  group.innerHTML = [1,2,3,4,5].map(n => `<button type="button">${n}</button>`).join("");
});

// Chips 0-10
document.querySelectorAll(".rating-0-10").forEach(group => {
  group.innerHTML = Array.from({length:11}, (_,i) => `<button type="button">${i}</button>`).join("");
});

// Experiência
document.getElementById("experiencia").innerHTML =
  expOpcoes.map(t => `<button type="button">${t}</button>`).join("");

// Retorno
document.getElementById("retorno").innerHTML =
  retOpcoes.map(t => `<button type="button">${t}</button>`).join("");

// --- Seleção visual dos chips ---
document.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLElement)) return;
  if (e.target.tagName !== "BUTTON") return;

  const parent = e.target.parentElement;
  if (!parent) return;

  // Evita submeter o form quando o botão é um chip
  if (parent.classList.contains("rating") ||
      parent.classList.contains("rating-0-10") ||
      parent.classList.contains("options")) {
    e.preventDefault();
    parent.querySelectorAll("button").forEach(b => b.classList.remove("selected"));
    e.target.classList.add("selected");
  }
});

// --- Envio ---
const form = document.getElementById("formFeedback");
const submitBtn = document.getElementById("submitBtn");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";
  statusEl.classList.remove("error");

  const get = sel => document.querySelector(sel)?.innerText || "";

  const data = {
    atendimento: get("[data-field='atendimento'] .selected"),
    tempo:       get("[data-field='tempo'] .selected"),
    limpeza:     get("[data-field='limpeza'] .selected"),
    experiencia: get("#experiencia .selected"),
    retorno:     get("#retorno .selected"),
    nps:         get("[data-field='nps'] .selected")
  };

  // Validação simples
  if (!data.atendimento || !data.tempo || !data.limpeza || !data.experiencia || !data.retorno || !data.nps) {
    statusEl.textContent = "Preencha todas as respostas antes de enviar.";
    statusEl.classList.add("error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!resp.ok) throw new Error("Falha no envio");

    statusEl.textContent = "✅ Avaliação enviada! Obrigado.";
    form.reset();
    // remove seleções visuais
    document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Erro ao enviar. Verifique a URL do Apps Script (Deploy Web App) e tente novamente.";
    statusEl.classList.add("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar avaliação";
  }
});
