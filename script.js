// ✅ Cole aqui a URL do Google Apps Script (Web App) que termina com /exec
const url = "https://script.google.com/macros/s/AKfycbyHFzwmQHnpnplO2qGTJxobbLWliE3DVGUq6TMn9B_3-gtyN0pR1tG1wqgfaFCX3I1vEw/exec";

// --------------------------------------------------------
// Renderiza botões 1–5
// --------------------------------------------------------
document.querySelectorAll(".rating").forEach(group => {
  group.innerHTML = [1,2,3,4,5]
    .map(n => `<button type="button" class="chip">${n}</button>`)
    .join("");
});

// --------------------------------------------------------
// Renderiza botões 0–10 (NPS)
// --------------------------------------------------------
document.querySelectorAll(".rating-0-10").forEach(group => {
  group.innerHTML = [...Array(11).keys()]
    .map(n => `<button type="button" class="chip">${n}</button>`)
    .join("");
});

// --------------------------------------------------------
// Renderiza botões das perguntas de múltipla escolha
// --------------------------------------------------------
document.getElementById("experiencia").innerHTML =
  ["Excelente", "Boa", "Regular", "Ruim", "Péssima"]
  .map(t => `<button type="button" class="chip">${t}</button>`)
  .join("");

document.getElementById("retorno").innerHTML =
  ["Sim", "Talvez", "Não"]
  .map(t => `<button type="button" class="chip">${t}</button>`)
  .join("");


// --------------------------------------------------------
// Efeito de seleção visual (ficar verde quando clicado)
// --------------------------------------------------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("chip")) {
    [...e.target.parentElement.querySelectorAll(".chip")]
      .forEach(btn => btn.classList.remove("selected"));
    e.target.classList.add("selected");
  }
});


// --------------------------------------------------------
// Enviar dados para Google Sheets
// --------------------------------------------------------
document.getElementById("formFeedback").addEventListener("submit", async (e) => {
  e.preventDefault();

  const value = sel => document.querySelector(sel)?.innerText || "";

  const data = {
    atendimento: value("[data-field='atendimento'] .selected"),
    tempo:       value("[data-field='tempo'] .selected"),
    limpeza:     value("[data-field='limpeza'] .selected"),
    experiencia: value("#experiencia .selected"),
    retorno:     value("#retorno .selected"),
    nps:         value("[data-field='nps'] .selected")
  };

  // ✅ Validação — impede envio se faltar respostas
  if (!data.atendimento || !data.tempo || !data.limpeza || !data.experiencia || !data.retorno || !data.nps) {
    alert("⚠️ Por favor, responda TODAS as perguntas antes de enviar.");
    return;
  }

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    alert("✅ Avaliação enviada com sucesso!");

    // limpa marcações visuais
    document.querySelectorAll(".selected")
      .forEach(btn => btn.classList.remove("selected"));

    document.getElementById("formFeedback").reset();

  } catch (error) {
    alert("❌ Erro ao enviar. Verifique conexão ou URL do Google Apps Script.");
  }
});
