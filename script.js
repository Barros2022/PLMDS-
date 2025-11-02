// ✅ Cole aqui a URL do Google Apps Script (Web App) que termina com /exec
const url = "https://script.google.com/macros/s/AKfycbyHFzwmQHnpnplO2qGTJxobbLWliE3DVGUq6TMn9B_3-gtyN0pR1tG1wqgfaFCX3I1vEw/exec";

// ----------------------- Renderização -----------------------
document.querySelectorAll(".rating").forEach(group => {
  group.innerHTML = [1,2,3,4,5]
    .map(n => `<button type="button" class="chip">${n}</button>`)
    .join("");
});

document.querySelectorAll(".rating-0-10").forEach(group => {
  group.innerHTML = [...Array(11).keys()]
    .map(n => `<button type="button" class="chip">${n}</button>`)
    .join("");
});

document.getElementById("experiencia").innerHTML =
  ["Excelente", "Boa", "Regular", "Ruim", "Péssima"]
  .map(t => `<button type="button" class="chip">${t}</button>`)
  .join("");

document.getElementById("retorno").innerHTML =
  ["Sim", "Talvez", "Não"]
  .map(t => `<button type="button" class="chip">${t}</button>`)
  .join("");

// ----------------------- Seleção -----------------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("chip")) {
    [...e.target.parentElement.querySelectorAll(".chip")]
      .forEach(btn => btn.classList.remove("selected"));
    e.target.classList.add("selected");
  }
});

// ----------------------- Envio -----------------------
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

  // ✅ Validação
  if (!data.atendimento || !data.tempo || !data.limpeza || !data.experiencia || !data.retorno || !data.nps) {
    return;
  }

  // ✅ Envia para o Google Sheets
  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  // ✅ Redireciona para página de obrigado
  window.location.href = "obrigado.html";
});

