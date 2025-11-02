// ✅ URL do Google Apps Script (WebApp)
const url = "https://script.google.com/macros/s/AKfycbxWGwS1_2qBTcnwxR8n6_TM-elLcvl76-TqIWqefk9Md8Kc9gzFnZDRa9moTIUtGwjy0g/exec";

// Renderiza botões de 1 a 5
document.querySelectorAll(".rating").forEach(group => {
  group.innerHTML = [1,2,3,4,5]
    .map(n => `<button type="button" class="chip">${n}</button>`)
    .join("");
});

// Renderiza botões de 0 a 10
document.querySelectorAll(".rating-0-10").forEach(group => {
  group.innerHTML = [...Array(11).keys()]
    .map(n => `<button type="button" class="chip">${n}</button>`)
    .join("");
});

// Renderiza botões de experiência geral e retorno
document.getElementById("experiencia").innerHTML =
  ["Excelente", "Boa", "Regular", "Ruim", "Péssima"]
  .map(t => `<button type="button" class="chip">${t}</button>`)
  .join("");

document.getElementById("retorno").innerHTML =
  ["Sim", "Talvez", "Não"]
  .map(t => `<button type="button" class="chip">${t}</button>`)
  .join("");

// Seleção visual dos chips
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("chip")) {
    e.preventDefault();
    [...e.target.parentElement.querySelectorAll(".chip")].forEach(btn =>
      btn.classList.remove("selected")
    );
    e.target.classList.add("selected");
  }
});

// Enviar dados para Google Sheets
document.getElementById("formFeedback").addEventListener("submit", async (e) => {
  e.preventDefault();

  const getValue = selector => document.querySelector(selector)?.innerText || "";

  const data = {
    atendimento: getValue("[data-field='atendimento'] .selected"),
    tempo: getValue("[data-field='tempo'] .selected"),
    limpeza: getValue("[data-field='limpeza'] .selected"),
    experiencia: getValue("#experiencia .selected"),
    retorno: getValue("#retorno .selected"),
    nps: getValue("[data-field='nps'] .selected")
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    alert("✅ Avaliação enviada com sucesso!");

    document.getElementById("formFeedback").reset();
    document.querySelectorAll(".selected").forEach(btn => btn.classList.remove("selected"));

  } catch (error) {
    alert("❌ Erro ao enviar. Verifique a conexão.");
  }
});
