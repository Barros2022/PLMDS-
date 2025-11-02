const url = "https://script.google.com/macros/s/AKfycby1Z2EQ4VZyqgFoBTrhXE28bWRYzBCajxZBaNtYXdALT8SGyAu8ZC-Gaw7UvzvwFfaLmg/exec";

/* Renderizar botões de 1 a 5 */
document.querySelectorAll(".rating").forEach((group) => {
  group.innerHTML = [1,2,3,4,5]
    .map(n => `<button>${n}</button>`)
    .join("");
});

/* Renderizar botões de 0 a 10 */
document.querySelectorAll(".rating-0-10").forEach((group) => {
  group.innerHTML = [...Array(11).keys()]
    .map(n => `<button>${n}</button>`)
    .join("");
});

/* Selecionar botões */
document.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  let parent = e.target.parentElement;
  parent.querySelectorAll("button").forEach(btn => btn.classList.remove("selected"));
  e.target.classList.add("selected");
});

/* Enviar para planilha */
document.getElementById("formFeedback").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    atendimento: document.querySelector("[data-field='atendimento'] .selected")?.innerText,
    tempo: document.querySelector("[data-field='tempo'] .selected")?.innerText,
    limpeza: document.querySelector("[data-field='limpeza'] .selected")?.innerText,
    experiencia: document.querySelector("#experiencia .selected")?.innerText,
    retorno: document.querySelector("#retorno .selected")?.innerText,
    nps: document.querySelector("[data-field='nps'] .selected")?.innerText
  };

  await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  alert("✅ Avaliação enviada com sucesso!");
});
