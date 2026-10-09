const video = document.getElementById("inviteVideo");
const soundPrompt = document.getElementById("soundPrompt");

const actions = document.getElementById("actions");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");

const contactChooser = document.getElementById("contactChooser");
const groomLink = document.getElementById("groomLink");
const brideLink = document.getElementById("brideLink");
const statusMessage = document.getElementById("statusMessage");

// Contactos em formato internacional, sem +, espaços ou símbolos.
const GROOM = "244925276623";
const BRIDE = "244948228721";

const MESSAGES = {
  yesGroom:
    "Olá! Confirmo a minha presença no vosso casamento. 💍❤️",
  yesBride:
    "Olá! Confirmo a minha presença no vosso casamento. 💍❤️",
  noGroom:
    "Olá! Infelizmente não poderei comparecer ao vosso casamento. Desejo-vos muitas felicidades! ❤️",
  noBride:
    "Olá! Infelizmente não poderei comparecer ao vosso casamento. Desejo-vos muitas felicidades! ❤️"
};

let actionsVisible = false;
let replayTimer = null;

function whatsappUrl(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function setContacts(type) {
  const isYes = type === "yes";

  groomLink.href = whatsappUrl(
    GROOM,
    isYes ? MESSAGES.yesGroom : MESSAGES.noGroom
  );

  brideLink.href = whatsappUrl(
    BRIDE,
    isYes ? MESSAGES.yesBride : MESSAGES.noBride
  );
}

function showContacts(type) {
  setContacts(type);
  contactChooser.classList.add("open");
  contactChooser.setAttribute("aria-hidden", "false");

  statusMessage.textContent =
    type === "yes"
      ? "Escolha: Noivo ou Noiva."
      : "Escolha: Noivo ou Noiva para enviar o aviso.";
}

yesButton.addEventListener("click", () => showContacts("yes"));
noButton.addEventListener("click", () => showContacts("no"));

/*
 * Os botões ficam escondidos durante a primeira reprodução.
 * Aparecem no final do vídeo.
 * Após 5 segundos, o vídeo reinicia e os botões permanecem visíveis
 * durante todos os loops seguintes.
 */
function revealActionsAtEnd() {
  if (actionsVisible) return;

  actionsVisible = true;
  actions.classList.add("visible");

  clearTimeout(replayTimer);

  replayTimer = setTimeout(() => {
    video.currentTime = 0;
    video.play().catch(() => {});
  }, 5000);
}

/*
 * Autoplay:
 * navegadores modernos podem bloquear autoplay com som.
 * Tentamos primeiro com som. Se for bloqueado, fazemos fallback
 * para autoplay silencioso + botão "Ativar som".
 */
async function startVideo() {
  video.loop = false;
  video.muted = false;

  try {
    await video.play();
    soundPrompt.classList.add("hidden");
  } catch (error) {
    video.muted = true;

    try {
      await video.play();
    } catch (playError) {
      // Alguns browsers exigem interação antes de iniciar o vídeo.
    }

    soundPrompt.classList.remove("hidden");
  }
}

soundPrompt.addEventListener("click", async () => {
  try {
    video.muted = false;
    await video.play();
    soundPrompt.classList.add("hidden");
  } catch (error) {
    video.muted = true;
  }
});

video.addEventListener("ended", revealActionsAtEnd);

window.addEventListener("load", startVideo);

document.addEventListener(
  "visibilitychange",
  () => {
    if (!document.hidden && video.paused && !replayTimer) {
      video.play().catch(() => {});
    }
  },
  { passive: true }
);
