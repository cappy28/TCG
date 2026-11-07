import {
  CONFIG,
  PAGES,
  siteURL
} from "../core/config.js?v=5.1.0";

import {
  escapeHTML,
  icon
} from "./cards.js?v=5.1.0";

import {
  showDialog,
  closeDialog,
  toast
} from "./dialogs.js?v=5.1.0";

export function mountShell({ store, page }) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="${siteURL()}">
          <span class="brand-mark">${icon("nexus")}</span>

          <span class="brand-copy">
            <span class="brand-name">NEXUS</span>
            <span class="brand-sub">
              Votre univers, en cartes.
            </span>
          </span>
        </a>

        <div class="top-actions">
          <span class="local-badge">LOCAL · DÉMO</span>

          <div class="wallet glass"
            aria-label="Solde en jetons virtuels">
            ${icon("coin")}
            <span id="balance">0</span>
          </div>

          <button class="icon-btn glass" type="button"
            data-core="solid" aria-label="Réduire la transparence">
            ${icon("contrast")}
          </button>

          <button class="avatar" type="button"
            data-core="profile" aria-label="Ouvrir mon profil">
            MOI
          </button>
        </div>
      </header>

      <main id="content" tabindex="-1"></main>

      <footer class="site-footer">
        <div class="footer-inner">
          <div>
            <p><strong>Nexus.</strong> Crée, découvre, collectionne.</p>
            <p>Démo locale · jetons virtuels · aucun achat réel.</p>
            <p>Pas de compte ni d’échange multijoueur dans ce lot.</p>
          </div>
          <p class="footer-version">V${CONFIG.release}</p>
        </div>
      </footer>
    </div>

    <div class="dock-wrap">
      <nav id="navigation" class="dock glass"
        aria-label="Navigation principale">
        ${Object.entries(PAGES).map(([id, route]) => {
          if (!route.ready) {
            return `
              <button class="nav-item" type="button" disabled
                title="Disponible dans un prochain lot">
                ${icon(route.icon)}
                <span>${route.label}</span>
              </button>
            `;
          }

          return `
            <a class="nav-item"
              href="${siteURL(route.path)}"
              ${id === page ? 'aria-current="page"' : ""}
              style="text-decoration:none">
              ${icon(route.icon)}
              <span>${route.label}</span>
            </a>
          `;
        }).join("")}
      </nav>
    </div>
  `;

  function updateHeader() {
    const state = store.get();

    document.getElementById("balance").textContent =
      state.tokens.toLocaleString("fr-FR");

    document.body.classList.toggle("solid", state.solid);

    const contrast = app.querySelector('[data-core="solid"]');

    contrast.setAttribute("aria-pressed", String(state.solid));
    contrast.setAttribute(
      "aria-label",
      state.solid
        ? "Rétablir la transparence"
        : "Réduire la transparence"
    );

    const avatar = app.querySelector('[data-core="profile"]');

    avatar.textContent = state.profile.name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => Array.from(part)[0] || "")
      .join("")
      .toLocaleUpperCase("fr-FR");

    avatar.setAttribute(
      "aria-label",
      "Ouvrir le profil de " + state.profile.name
    );
  }

  function showProfile() {
    const state = store.get();

    showDialog("Ton espace Nexus", `
      <form id="quickProfileForm">
        <div class="field">
          <label for="profileName">Ton pseudo</label>

          <input id="profileName" name="name"
            maxlength="24" required autocomplete="nickname"
            value="${escapeHTML(state.profile.name)}">
        </div>

        <button class="btn primary" type="submit">
          Enregistrer le pseudo
        </button>
      </form>

      <div class="stats">
        <div class="stat">
          <strong>${state.xp}</strong>
          <small>XP gagnée depuis la V5</small>
        </div>

        <div class="stat">
          <strong>${state.opened}</strong>
          <small>Boosters ouverts depuis la V5</small>
        </div>
      </div>

      <section class="panel spacer">
        <h3>Garder une copie</h3>

        <p class="help">
          L’export contient ta progression et tes créations locales.
          La restauration sera ajoutée dans le lot Profil.
        </p>

        <button class="btn secondary spacer"
          type="button" data-core="export">
          Télécharger ma sauvegarde
        </button>
      </section>

      <p class="microcopy">
        Pas de synchronisation entre appareils.
        La sauvegarde V4 d’origine n’est pas supprimée.
      </p>
    `);
  }

  function exportBackup() {
    const backup = {
      application: "classchat-nexus",
      format: 1,
      savedAt: new Date().toISOString(),
      state: store.get()
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      { type: "application/json;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      "nexus-v5-" +
      new Date().toISOString().replace(/[:.]/g, "-") +
      ".json";

    const dialog = document.getElementById("modal");

    (dialog?.open ? dialog : document.body).append(link);

    try {
      link.click();
    } finally {
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    }

    toast("Export demandé. Vérifie tes téléchargements.");
  }

  async function onClick(event) {
    const button = event.target.closest("[data-core]");

    if (!button || button.disabled) return;

    try {
      switch (button.dataset.core) {
        case "profile":
          showProfile();
          break;

        case "solid":
          await store.update(state => {
            state.solid = !state.solid;
          });
          break;

        case "export":
          exportBackup();
          break;
      }
    } catch (error) {
      toast(error.message || "L’action n’a pas pu être terminée.");
    }
  }

  async function onSubmit(event) {
    if (event.target.id !== "quickProfileForm") return;

    event.preventDefault();

    const form = event.target;
    const button = form.querySelector('button[type="submit"]');
    const name = String(new FormData(form).get("name") || "")
      .trim()
      .slice(0, 24);

    if (!name) {
      toast("Choisis un pseudo.");
      return;
    }

    button.disabled = true;

    try {
      await store.update(state => {
        state.profile.name = name;
      });

      closeDialog();
      toast("Pseudo enregistré.");
    } catch (error) {
      toast(error.message);
    } finally {
      button.disabled = false;
    }
  }

  const unsubscribe = store.subscribe(updateHeader);

  document.addEventListener("click", onClick);
  document.addEventListener("submit", onSubmit);

  updateHeader();

  return function destroy() {
    unsubscribe();
    document.removeEventListener("click", onClick);
    document.removeEventListener("submit", onSubmit);
  };
}
