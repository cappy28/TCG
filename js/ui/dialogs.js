import {
  escapeHTML,
  icon
} from "./cards.js?v=5.1.0";

let toastTimer;
let dialogInitialized = false;

function getDialog() {
  let dialog = document.getElementById("modal");

  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.id = "modal";
    document.body.append(dialog);
  }

  if (!dialogInitialized) {
    dialog.addEventListener("click", event => {
      if (event.target.closest("[data-dialog-close]")) {
        dialog.close();
      }
    });

    dialog.addEventListener("close", () => {
      document.body.classList.remove("modal-open");
    });

    dialogInitialized = true;
  }

  return dialog;
}

export function showDialog(title, content) {
  const dialog = getDialog();

  dialog.innerHTML = `
    <div class="dialog-head">
      <h2 id="modalTitle" tabindex="-1">
        ${escapeHTML(title)}
      </h2>

      <button class="close" type="button"
        data-dialog-close aria-label="Fermer la fenêtre">
        ${icon("close")}
      </button>
    </div>

    <div class="dialog-body">
      ${content}
    </div>
  `;

  dialog.setAttribute("aria-labelledby", "modalTitle");

  if (!dialog.open) {
    dialog.showModal();
  }

  document.body.classList.add("modal-open");

  requestAnimationFrame(() => {
    if (dialog.open) {
      document.getElementById("modalTitle")?.focus();
    }
  });

  return dialog;
}

export function closeDialog() {
  document.getElementById("modal")?.close();
}

export function toast(message) {
  let element = document.getElementById("toast");

  if (!element) {
    element = document.createElement("div");
    element.id = "toast";
    element.className = "toast";
    element.setAttribute("role", "status");
    element.setAttribute("aria-live", "polite");
    element.setAttribute("aria-atomic", "true");
  }

  const dialog = document.getElementById("modal");
  const parent = dialog?.open ? dialog : document.body;

  parent.append(element);
  element.textContent = String(message);
  element.classList.add("visible");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    element.classList.remove("visible");
  }, 4500);
}
