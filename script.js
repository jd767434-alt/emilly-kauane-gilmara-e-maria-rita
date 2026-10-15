const roomSelect = document.getElementById("roomSelect");
const callBtn = document.getElementById("callBtn");
const repeatBtn = document.getElementById("repeatBtn");
const clearBtn = document.getElementById("clearBtn");
const resetBtn = document.getElementById("resetBtn");
const printBtn = document.getElementById("printBtn");
const announcementTitle = document.getElementById("announcementTitle");
const announcementText = document.getElementById("announcementText");
const roomGrid = document.getElementById("roomGrid");
const counter = document.getElementById("counter");
const progressBar = document.getElementById("progressBar");

const rooms = [
  "Maternal I", "Maternal II", "Infantil I", "Infantil II",
  "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano",
  "6º Ano", "7º Ano", "8º Ano", "9º Ano"
];
const calledRooms = new Set();
let lastCalled = "";

document.getElementById("today").textContent = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit", month: "short", year: "numeric"
}).format(new Date());

function renderRooms() {
  roomGrid.innerHTML = "";
  rooms.forEach(room => {
    const isCalled = calledRooms.has(room);
    const card = document.createElement("div");
    card.className = `room-card${isCalled ? " called" : ""}`;
    card.innerHTML = `
      <span class="status-dot" aria-hidden="true"></span>
      <div><div class="room-name"></div><div class="status">${isCalled ? "Chamada realizada" : "Aguardando chamada"}</div></div>
    `;
    card.querySelector(".room-name").textContent = room;
    roomGrid.appendChild(card);
  });
  const total = calledRooms.size;
  counter.textContent = `${total} de ${rooms.length} chamadas`;
  progressBar.style.width = `${(total / rooms.length) * 100}%`;
}

function announce(room) {
  if (!room) {
    announcementTitle.textContent = "Selecione uma sala";
    announcementText.textContent = "Escolha uma sala na lista para realizar a chamada.";
    return;
  }
  lastCalled = room;
  calledRooms.add(room);
  announcementTitle.textContent = `${room} — dirigir-se ao refeitório`;
  announcementText.textContent = `Atenção, ${room}! O almoço está servido. Por favor, dirijam-se ao refeitório.`;
  repeatBtn.disabled = false;
  renderRooms();

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(
      `Atenção, sala ${room}. O almoço está servido. Por favor, dirijam-se ao refeitório.`
    );
    speech.lang = "pt-BR";
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  }
}

callBtn.addEventListener("click", () => {
  const room = roomSelect.value;
  if (!room) {
    roomSelect.focus();
    announcementTitle.textContent = "Escolha uma sala primeiro";
    announcementText.textContent = "Selecione a turma no campo acima e clique em Chamar sala.";
    return;
  }
  announce(room);
});

repeatBtn.addEventListener("click", () => {
  if (lastCalled) announce(lastCalled);
});

clearBtn.addEventListener("click", () => {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  announcementTitle.textContent = "Painel limpo";
  announcementText.textContent = "Selecione uma sala para fazer uma nova chamada.";
  lastCalled = "";
  repeatBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
  calledRooms.clear();
  lastCalled = "";
  repeatBtn.disabled = true;
  announcementTitle.textContent = "Lista reiniciada";
  announcementText.textContent = "Todas as salas estão aguardando chamada.";
  renderRooms();
});

printBtn.addEventListener("click", () => window.print());

renderRooms();
