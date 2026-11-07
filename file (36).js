import {
  CONFIG,
  MISSIONS,
  todayUTC
} from "./js/core/config.js?v=5.1.0";

import {
  BASE_CARDS,
  RARITIES,
  findCard,
  ownedCards
} from "./js/game/catalogue.js?v=5.1.0";

import {
  openBooster,
  claimMission
} from "./js/game/boosters.js?v=5.1.0";

import {
  cardHTML,
  escapeHTML,
  icon
} from "./js/ui/cards.js?v=5.1.0";

import {
  showDialog,
  toast
} from "./js/ui/dialogs.js?v=5.1.0";

export function mount({ root, store }) {
  let busy = false;

  function render() {
    const state = store.get();
    const owned = ownedCards(state);
    const total = Object.values(state.bag)
      .reduce((sum, amount) => sum + amount, 0);

    const level = Math.floor(state.xp / CONFIG.xpPerLevel) + 1;
    const levelXP = state.xp % CONFIG.xpPerLevel;

    const baseOwned = BASE_CARDS.filter(card =>
      state.bag[card.id] > 0
    ).length;

    root.innerHTML = `
      <section class="page" data-nexus-view="accueil">

        <div class="hero">
          <div class="hero-copy">
            <span class="eyebrow">
              <span class="dot"></span>
              TON UNIVERS À COLLECTIONNER
            </span>

            <h1>
              Une ouverture.<br>
              <em>Cinq possibilités.</em>
            </h1>

            <p class="lead">
              Salut ${escapeHTML(state.profile.name)}.
              Découvre de nouvelles cartes, complète ta collection
              et gagne des récompenses à ton rythme.
            </p>

            <div class="hero-actions">
              <button class="btn primary"
                type="button" data-home="open"
                ${busy || !state.boosters ? "disabled" : ""}>
                ${icon("booster")}
                ${state.boosters
                  ? "Ouvrir un booster"
                  : "Boosters du jour ouverts"}
              </button>

              <button class="btn secondary"
                type="button" data-home="rules">
                Voir les probabilités
              </button>

              ${state.lastPack ? `
                <button class="text-btn"
                  type="button" data-home="last">
                  Revoir mon dernier booster
                </button>
              ` : ""}
            </div>

            <p class="microcopy">
              ${state.boosters} booster(s) restant(s).
              Renouvellement à minuit UTC.
              <span data-countdown></span>
            </p>
          </div>

          <div class="pack-stage">
            <div class="orbit" aria-hidden="true"></div>

            <div class="float-label glass float-one">
              5 cartes par ouverture
            </div>

            <button class="pack"
              type="button"
              data-home="open"
              aria-label="Ouvrir un booster Nexus"
              ${busy || !state.boosters ? "disabled" : ""}>
              <span class="pack-brand">NEXUS</span>
              <span class="pack-orb" aria-hidden="true"></span>
              <span class="pack-label">
                PREMIÈRE COLLECTION<br>
                5 CARTES À DÉCOUVRIR
              </span>
            </button>

            <div class="float-label glass float-two">
              Communes · Rares · Mythiques
            </div>
          </div>
        </div>

        ${!store.supportsLocks ? `
          <div class="notice warning">
            Pour éviter les écritures concurrentes sur ce navigateur,
            utilise un seul onglet Nexus à la fois.
          </div>
        ` : ""}

        <div class="stats">
          <div class="stat">
            <strong>${total}</strong>
            <small>Cartes possédées, doubles inclus</small>
          </div>

          <div class="stat">
            <strong>${owned.length}</strong>
            <small>Cartes différentes possédées</small>
          </div>

          <div class="stat">
            <strong>${baseOwned}/${BASE_CARDS.length}</strong>
            <small>Cartes du catalogue initial</small>
          </div>

          <div class="stat">
            <strong>${state.tokens}</strong>
            <small>Jetons disponibles</small>
          </div>
        </div>

        <div class="two-col spacer">
          <section class="panel">
            <div class="section-head" style="margin-top:0">
              <div>
                <span class="eyebrow">OBJECTIFS DU JOUR</span>
                <h2 class="spacer">Tes missions</h2>
              </div>
            </div>

            <div class="mission-list">
              ${MISSIONS.map(mission =>
                missionHTML(mission, state)
              ).join("")}
            </div>
          </section>

          <section class="panel level-panel">
            <span class="eyebrow">PROGRESSION V5</span>

            <div class="level-row spacer">
              <div class="level-medallion">${level}</div>

              <div class="level-copy">
                <strong>Collectionneur · Niveau ${level}</strong>
                <p>${state.xp} XP au total</p>
              </div>
            </div>

            <progress
              value="${levelXP}"
              max="${CONFIG.xpPerLevel}"
              aria-label="Progression vers le niveau suivant">
            </progress>

            <p class="help">
              ${CONFIG.xpPerLevel - levelXP} XP avant le prochain niveau.
            </p>

            <div class="notice spacer">
              Chaque booster rapporte ${CONFIG.boosterXP} XP,
              plus ${CONFIG.discoveryXP} XP par nouvelle carte.
              Les missions donnent des récompenses supplémentaires.
            </div>

            <button class="btn secondary spacer"
              type="button" data-core="export">
              Télécharger ma sauvegarde
            </button>

            <p class="microcopy">
              L’XP et l’historique commencent avec la V5.
              Tes cartes V4 sont conservées.
            </p>
          </section>
        </div>

        <section class="spacer">
          <div class="section-head">
            <div>
              <span class="eyebrow">DÉJÀ DANS TON UNIVERS</span>
              <h2 class="spacer">Un aperçu de ta collection</h2>
            </div>

            <button class="text-btn" type="button"
              data-home="collection">
              Agrandir l’aperçu
            </button>
          </div>

          ${owned.length ? `
            <div class="card-grid">
              ${owned.slice(0, 6).map(card =>
                ownedCardHTML(card, state)
              ).join("")}
            </div>
          ` : `
            <div class="empty">
              Ouvre un booster pour commencer ta collection.
            </div>
          `}
        </section>

        <section class="panel spacer">
          <div class="section-head" style="margin-top:0">
            <div>
              <span class="eyebrow">TES DERNIÈRES ACTIONS</span>
              <h2 class="spacer">Activité récente</h2>
            </div>
          </div>

          ${state.history.length ? `
            <div class="activity-list">
              ${state.history.slice(0, 5).map(entry => `
                <div class="activity-row">
                  <div class="activity-icon">
                    ${icon(entry.type === "mission" ? "spark" : "booster")}
                  </div>

                  <div class="activity-copy">
                    <strong>${escapeHTML(entry.title)}</strong>
                    <time datetime="${escapeHTML(entry.at)}">
                      ${escapeHTML(
                        new Date(entry.at).toLocaleString("fr-FR")
                      )}
                    </time>
                  </div>

                  <span class="activity-amount">
                    +${escapeHTML(entry.tokens || 0)} jetons
                    · +${escapeHTML(entry.xp || 0)} XP
                  </span>
                </div>
              `).join("")}
            </div>
          ` : `
            <p class="muted">
              Tes prochaines ouvertures et récompenses apparaîtront ici.
            </p>
          `}
        </section>

      </section>
    `;

    updateCountdown();
  }

  function missionHTML(mission, state) {
    const current = state.daily[mission.metric] || 0;
    const complete = current >= mission.target;
    const claimed = state.daily.claims.includes(mission.id);

    return `
      <article class="mission-card
        ${complete ? "is-complete" : ""}
        ${claimed ? "is-claimed" : ""}">

        <div class="mission-icon">${icon("spark")}</div>

        <div class="mission-body">
          <h3>${escapeHTML(mission.label)}</h3>
          <p>${escapeHTML(mission.description)}</p>

          <progress
            value="${Math.min(current, mission.target)}"
            max="${mission.target}"
            aria-label="${escapeHTML(mission.label)}">
          </progress>

          <div class="mission-meta">
            <span>${Math.min(current, mission.target)}/${mission.target}</span>
            <span>+${mission.tokens} jetons · +${mission.xp} XP</span>
          </div>
        </div>

        <button class="btn secondary small"
          type="button"
          data-home="claim"
          data-id="${mission.id}"
          ${busy || !complete || claimed ? "disabled" : ""}>
          ${claimed ? "Récupérée" : complete ? "Récupérer" : "En cours"}
        </button>
      </article>
    `;
  }

  function ownedCardHTML(card, state) {
    return `
      <button class="card-button" type="button"
        data-home="card"
        data-id="${escapeHTML(card.id)}"
        aria-label="${escapeHTML(card.name)}, ${state.bag[card.id]} exemplaire(s)">
        ${cardHTML(card)}
        <span class="count">×${state.bag[card.id]}</span>
      </button>
    `;
  }

  function showCard(id) {
    const state = store.get();
    const card = findCard(state, id);

    if (!card) {
      toast("Cette carte n’est pas disponible dans le catalogue.");
      return;
    }

    const rarity = RARITIES[card.rarity];

    showDialog(card.name, `
      <div class="detail-layout">
        ${cardHTML(card)}

        <div>
          <span class="badge">${rarity.label}</span>

          <h3 class="spacer">${escapeHTML(card.name)}</h3>

          <p class="lead">
            ${escapeHTML(card.desc || "Une carte de ton univers Nexus.")}
          </p>

          <p class="muted">
            Création de ${escapeHTML(card.creator || "Toi")}.
          </p>

          <div class="notice spacer">
            Tu possèdes ${state.bag[card.id] || 0} exemplaire(s).
            Une première découverte rapporte
            ${rarity.reward} jetons.
          </div>

          ${card.image && !String(card.image).startsWith("data:") ? `
            <p class="microcopy">
              L’image distante de cette carte n’est pas chargée
              automatiquement dans ce lot.
            </p>
          ` : ""}
        </div>
      </div>
    `);
  }

  function showCollection() {
    const state = store.get();
    const cards = ownedCards(state);

    showDialog("Aperçu de ta collection", `
      <p class="muted">
        ${cards.length} carte(s) différente(s).
        Cet aperçu affiche au maximum 30 cartes.
        La page Collection complète arrivera dans le prochain lot.
      </p>

      ${cards.length ? `
        <div class="card-grid spacer">
          ${cards.slice(0, 30).map(card =>
            ownedCardHTML(card, state)
          ).join("")}
        </div>
      ` : `
        <div class="empty">
          Ta collection est encore vide.
        </div>
      `}
    `);
  }

  function showPack(pack) {
    const state = store.get();

    const draws = pack.draws
      .map(draw => ({
        ...draw,
        card: findCard(state, draw.id)
      }))
      .filter(draw => draw.card);

    showDialog("Cinq cartes. À toi de découvrir.", `
      <p class="muted">
        Touche chaque carte pour la retourner.
        Les cartes et récompenses ont déjà été enregistrées.
      </p>

      <div class="reveal-grid">
        ${draws.map((draw, index) => `
          <button class="flip" type="button"
            data-home="flip"
            data-name="${escapeHTML(draw.card.name)}"
            aria-label="Révéler la carte ${index + 1}"
            aria-pressed="false">

            <span class="flip-inner">
              <span class="flip-back" aria-hidden="true">
                ${icon("nexus")}
                <strong>NEXUS</strong>
              </span>

              <span class="flip-front" aria-hidden="true">
                ${cardHTML(draw.card)}

                ${draw.discovered ? `
                  <span class="card-new">NOUVELLE</span>
                ` : ""}
              </span>
            </span>
          </button>
        `).join("")}
      </div>

      <div class="reveal-summary">
        <div>
          <strong>
            +${escapeHTML(pack.earned || 0)} jetons
          </strong>

          <p class="help">
            ${escapeHTML(pack.discoveries || 0)} découverte(s)
            · +${escapeHTML(pack.xp || 0)} XP
          </p>
        </div>

        <button class="btn secondary"
          type="button" data-home="reveal-all">
          Tout révéler
        </button>
      </div>

      <p class="microcopy">
        Revoir ce booster ne donne pas de nouvelles récompenses.
        Les doubles ne rapportent pas de jetons de découverte.
      </p>
    `);
  }

  function reveal(button) {
    button.classList.add("revealed");
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", button.dataset.name || "Carte révélée");

    button.querySelector(".flip-front")
      ?.setAttribute("aria-hidden", "false");
  }

  function showRules() {
    showDialog("Les règles des boosters", `
      <p class="lead">
        Deux boosters gratuits par jour et cinq tirages par booster.
      </p>

      <ul class="probability-list">
        <li><span>Commune</span><strong>70 %</strong></li>
        <li><span>Rare</span><strong>25 %</strong></li>
        <li><span>Mythique</span><strong>5 %</strong></li>
      </ul>

      <div class="notice spacer">
        Chaque carte est tirée indépendamment.
        Aucune carte rare ou mythique n’est garantie dans un booster.
      </div>

      <h3 class="spacer">Récompenses de découverte</h3>

      <ul class="probability-list">
        <li><span>Nouvelle commune</span><strong>5 jetons</strong></li>
        <li><span>Nouvelle rare</span><strong>15 jetons</strong></li>
        <li><span>Nouvelle mythique</span><strong>45 jetons</strong></li>
      </ul>

      <p class="microcopy">
        « Nouvelle » signifie jamais obtenue auparavant :
        échanger une carte ne permet pas de regagner
        sa récompense de première découverte.
      </p>

      <p class="microcopy">
        Le renouvellement utilise la date UTC de ton appareil.
        Cette démonstration locale n’est pas une économie sécurisée
        par un serveur.
      </p>
    `);
  }

  function updateCountdown() {
    const now = new Date();

    const tomorrow = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1
    );

    const remaining = Math.max(
      0,
      Math.ceil((tomorrow - now.getTime()) / 1000)
    );

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    const text = [hours, minutes, seconds]
      .map(number => String(number).padStart(2, "0"))
      .join(":");

    root.querySelectorAll("[data-countdown]").forEach(element => {
      element.textContent = " Dans " + text + ".";
    });
  }

  async function onClick(event) {
    const button = event.target.closest("[data-home]");

    if (!button || button.disabled) return;

    const action = button.dataset.home;

    if (action === "flip") {
      reveal(button);
      return;
    }

    if (action === "reveal-all") {
      document.querySelectorAll(
        '#modal [data-home="flip"]'
      ).forEach(reveal);
      return;
    }

    if (action === "rules") {
      showRules();
      return;
    }

    if (action === "collection") {
      showCollection();
      return;
    }

    if (action === "card") {
      showCard(button.dataset.id);
      return;
    }

    if (action === "last") {
      const pack = store.get().lastPack;

      if (pack) showPack(pack);

      return;
    }

    if (action !== "open" && action !== "claim") return;
    if (busy) return;

    busy = true;
    render();

    try {
      if (action === "open") {
        const pack = await store.update(openBooster);
        showPack(pack);
      } else {
        const reward = await store.update(state =>
          claimMission(state, button.dataset.id)
        );

        toast(
          "Mission récupérée : +" +
          reward.tokens +
          " jetons et +" +
          reward.xp +
          " XP."
        );
      }
    } catch (error) {
      toast(error.message || "L’action n’a pas pu être appliquée.");
    } finally {
      busy = false;
      render();
    }
  }

  const unsubscribe = store.subscribe(render);

  document.addEventListener("click", onClick);

  const clock = setInterval(updateCountdown, 1000);

  const dailyCheck = setInterval(() => {
    if (store.get().day < todayUTC()) {
      try {
        store.refresh();
      } catch (error) {
        toast(error.message);
      }
    }
  }, 30_000);

  render();

  return function destroy() {
    unsubscribe();
    clearInterval(clock);
    clearInterval(dailyCheck);
    document.removeEventListener("click", onClick);
  };
}
