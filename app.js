(() => {
  "use strict";

  if (window.__classChatNexusLoaded) return;
  window.__classChatNexusLoaded = true;

  /* =========================================================
     CONFIGURATION
     Application front-end locale.
     Aucune authentification ni économie sécurisée côté serveur.
     ========================================================= */

  const CONFIG = Object.freeze({
    storageKey: "classchat-nexus-state-v4",
    legacyStorageKey: "classchat-nexus-demo-v1",
    version: 4,
    initialTokens: 160,
    dailyBoosters: 2,
    cardsPerBooster: 5,
    creationCost: 80,
    creationsPerDay: 3,
    maximumCustomCards: 200,
    maximumImageBytes: 2 * 1024 * 1024,
    maximumImageSide: 600,
    referencePageSize: 24,
    referenceCacheDuration: 15 * 60 * 1000,
    referenceTimeout: 10000,
    memeAPI: "https://justmeme.wtf/api/v1",
    fallbackAPI: "https://api.imgflip.com/get_memes"
  });

  const RARITIES = Object.freeze({
    commune: {
      label: "Commune",
      symbol: "◆",
      reward: 5,
      price: 30
    },
    rare: {
      label: "Rare",
      symbol: "✦ ✦",
      reward: 15,
      price: 90
    },
    mythique: {
      label: "Mythique",
      symbol: "✧ ✧ ✧",
      reward: 45,
      price: 270
    }
  });

  const FRIENDS = Object.freeze({
    leo: {
      name: "Léo",
      initial: "L",
      color: "#e1ecff"
    },
    ines: {
      name: "Inès",
      initial: "I",
      color: "#f5e5ef"
    },
    noa: {
      name: "Noa",
      initial: "N",
      color: "#def1e9"
    }
  });

  const THEMES = Object.freeze({
    sky: {
      label: "Ciel de verre",
      colors: ["#c7effa", "#659fd6", "#f0e7ff", "#e0f8ff"]
    },
    mint: {
      label: "Jardin suspendu",
      colors: ["#c7eee0", "#477f7a", "#fff3cf", "#e0f5db"]
    },
    candy: {
      label: "Nuage rose",
      colors: ["#f7dbe5", "#b572a4", "#fff1c9", "#e4d7ff"]
    },
    night: {
      label: "Nuit orbitale",
      colors: ["#172b50", "#526ab3", "#e7d8ff", "#8bcacb"]
    },
    solar: {
      label: "Éclat solaire",
      colors: ["#f3d5af", "#c36d56", "#fff3c9", "#dca7cd"]
    }
  });

  const BASE_CARDS = Object.freeze([
    {
      id: "a",
      name: "L’heure bleue",
      rarity: "commune",
      theme: "sky",
      creator: "Noa",
      desc: "Quand le ciel hésite entre le jour et la nuit."
    },
    {
      id: "b",
      name: "Petit chaos",
      rarity: "commune",
      theme: "candy",
      creator: "Inès",
      desc: "Rien ne se passe comme prévu. C’est ça qui est bien."
    },
    {
      id: "c",
      name: "Après les cours",
      rarity: "commune",
      theme: "mint",
      creator: "Léo",
      desc: "Le meilleur moment de la journée commence ici."
    },
    {
      id: "d",
      name: "Dernier métro",
      rarity: "commune",
      theme: "night",
      creator: "Noa",
      desc: "Encore une station, encore une histoire."
    },
    {
      id: "e",
      name: "Club lunaire",
      rarity: "rare",
      theme: "night",
      creator: "Inès",
      desc: "Une réunion privée, quelque part au-dessus des nuages."
    },
    {
      id: "f",
      name: "Mode avion",
      rarity: "rare",
      theme: "sky",
      creator: "Léo",
      desc: "Déconnecté du bruit. Connecté au reste."
    },
    {
      id: "g",
      name: "Hors orbite",
      rarity: "rare",
      theme: "solar",
      creator: "Noa",
      desc: "Personne n’a dit qu’il fallait rester sur la même planète."
    },
    {
      id: "h",
      name: "Éclipse",
      rarity: "mythique",
      theme: "night",
      creator: "Léo",
      desc: "Quelques secondes pour un souvenir qui reste."
    },
    {
      id: "i",
      name: "Supernova",
      rarity: "mythique",
      theme: "solar",
      creator: "Inès",
      desc: "Un petit point de lumière. Une très grande histoire."
    }
  ]);

  const ICONS = {
    nexus:
      '<path d="m12 3 8 5v8l-8 5-8-5V8z"/>' +
      '<path d="m4 8 8 5 8-5M12 13v8"/>',
    coin:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="m12 7 3 5-3 5-3-5z"/>',
    booster:
      '<rect x="5" y="3" width="14" height="18" rx="3"/>' +
      '<path d="M8 3v3m8-3v3M8 18v3m8-3v3m-4-12 2 3-2 3-2-3z"/>',
    collection:
      '<rect x="8" y="3" width="12" height="16" rx="2"/>' +
      '<path d="M4 7v12a2 2 0 0 0 2 2h10M12 8h4m-4 4h4"/>',
    create:
      '<path d="M12 5v14M5 12h14"/>' +
      '<circle cx="12" cy="12" r="9"/>',
    trade:
      '<path d="M4 7h15m-4-4 4 4-4 4M20 17H5m4-4-4 4 4 4"/>',
    shop:
      '<path d="M5 8h14l1 13H4zM8 8V6a4 4 0 0 1 8 0v2"/>',
    arrow:
      '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    close:
      '<path d="m6 6 12 12M6 18 18 6"/>',
    spark:
      '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',
    contrast:
      '<circle cx="12" cy="12" r="9"/>' +
      '<path d="M12 3v18M12 3a9 9 0 0 1 0 18" fill="currentColor"/>',
    gift:
      '<rect x="4" y="10" width="16" height="11" rx="2"/>' +
      '<path d="M3 7h18v4H3zm9 0v14"/>' +
      '<path d="M12 7H8a2.5 2.5 0 1 1 2.5-2.5L12 7zm0 0h4a2.5 2.5 0 1 0-2.5-2.5L12 7z"/>',
    search:
      '<circle cx="10.5" cy="10.5" r="6.5"/>' +
      '<path d="m16 16 4 4"/>',
    heart:
      '<path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"/>'
  };

  /* =========================================================
     OUTILS ET ÉTAT TEMPORAIRE
     ========================================================= */

  const $ = selector => document.querySelector(selector);

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));

  const today = () => new Date().toISOString().slice(0, 10);

  const truncate = (value, maximum) =>
    String(value ?? "").slice(0, maximum);

  const integer = (value, maximum = 100000) => {
    const number = Number(value);
    return Number.isFinite(number)
      ? Math.max(0, Math.min(maximum, Math.floor(number)))
      : 0;
  };

  const icon = name => `
    <svg width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="1.65"
      stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true">
      ${ICONS[name] || ICONS.spark}
    </svg>`;

  const ui = {
    view: "boosters",
    filter: "all",
    search: "",
    friend: "leo",
    give: "",
    profileTab: "profil"
  };

  const refs = {
    enabled: false,
    mode: "trending",
    query: "",
    page: 1,
    items: [],
    requestId: 0,
    primaryUnavailableUntil: 0,
    cache: new Map()
  };

  let toastTimer;
  let artworkCounter = 0;
  let storageWarningShown = false;
  let startupMessage = "";
  let draft = freshDraft();
  let state = loadState();

  function freshDraft() {
    return {
      name: "",
      desc: "",
      theme: "sky",
      image: "",
      friend: "leo",
      consent: false,
      reference: null,
      imageBusy: false,
      imageRequest: 0
    };
  }

  function freshState() {
    return {
      version: CONFIG.version,
      tokens: CONFIG.initialTokens,
      day: today(),
      boosters: CONFIG.dailyBoosters,
      bag: { a: 3, b: 2, e: 1 },
      known: ["a", "b", "e"],
      custom: [],
      gifts: [],
      solid: false,
      profile: {
        name: "Moi",
        wishlist: [],
        showcase: []
      },
      stock: {
        leo: { c: 3, d: 3, f: 2, g: 2, h: 2 },
        ines: { c: 3, d: 2, f: 2, g: 2, i: 2 },
        noa: { c: 2, d: 3, f: 2, g: 2, h: 2 }
      }
    };
  }

  function safeRemoteImage(value) {
    try {
      const url = new URL(String(value));

      const allowedHosts = new Set([
        "i.imgflip.com",
        "justmeme.wtf",
        "www.justmeme.wtf"
      ]);

      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.port ||
        !allowedHosts.has(url.hostname) ||
        !/\.(?:jpe?g|png|webp|gif)$/i.test(url.pathname)
      ) {
        return "";
      }

      url.hash = "";
      return url.href;
    } catch {
      return "";
    }
  }

  function safeStoredImage(value) {
    const image = String(value || "");

    if (
      image.length <= 1_500_000 &&
      /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image)
    ) {
      return image;
    }

    return safeRemoteImage(image);
  }

  function safeReference(value) {
    if (!value || typeof value !== "object") return null;

    const provider = value.provider === "Imgflip"
      ? "Imgflip"
      : value.provider === "justmeme"
        ? "justmeme"
        : "";

    const id = truncate(value.id, 150);
    if (!provider || !id) return null;

    return {
      provider,
      id,
      name: truncate(value.name, 100)
    };
  }

  function referenceURL(reference) {
    if (
      reference?.provider === "Imgflip" &&
      /^\d+$/.test(reference.id)
    ) {
      return `https://imgflip.com/memegenerator/${reference.id}`;
    }

    if (reference?.provider === "justmeme") {
      return "https://justmeme.wtf/meme/" +
        encodeURIComponent(reference.id);
    }

    return "https://imgflip.com";
  }

  /* =========================================================
     CHARGEMENT ET MIGRATION DE LA SAUVEGARDE
     ========================================================= */

  function normalizeState(raw) {
    if (!raw || typeof raw !== "object" || !raw.bag) return null;

    if (raw.version !== CONFIG.version && raw.v !== 1) return null;

    const clean = freshState();
    const ids = new Set(BASE_CARDS.map(card => card.id));

    clean.custom = (Array.isArray(raw.custom) ? raw.custom : [])
      .slice(0, CONFIG.maximumCustomCards)
      .flatMap(card => {
        if (!card || typeof card !== "object") return [];

        const id = truncate(card.id, 100);
        if (!/^u-[a-z0-9-]+$/i.test(id) || ids.has(id)) return [];

        const name = truncate(card.name, 30).trim();
        if (!name) return [];

        ids.add(id);

        return [{
          id,
          name,
          desc: truncate(card.desc, 140),
          rarity: "commune",
          theme: Object.hasOwn(THEMES, card.theme) ? card.theme : "sky",
          image: safeStoredImage(card.image),
          creator: "Toi",
          date: /^\d{4}-\d{2}-\d{2}$/.test(card.date)
            ? card.date
            : today(),
          reference: safeReference(card.reference)
        }];
      });

    const cleanBag = source => {
      const result = {};

      if (source && typeof source === "object") {
        for (const id of ids) {
          const amount = integer(source[id]);
          if (amount > 0) result[id] = amount;
        }
      }

      return result;
    };

    clean.tokens = integer(raw.tokens, 10_000_000);
    clean.bag = cleanBag(raw.bag);
    clean.day = /^\d{4}-\d{2}-\d{2}$/.test(raw.day)
      ? raw.day
      : today();

    clean.boosters = integer(raw.boosters, CONFIG.dailyBoosters);
    clean.solid = Boolean(raw.solid);

    clean.known = [...new Set([
      ...(Array.isArray(raw.known) ? raw.known : []),
      ...Object.keys(clean.bag)
    ])].filter(id => ids.has(id));

    for (const friend of Object.keys(FRIENDS)) {
      clean.stock[friend] = raw.stock?.[friend]
        ? cleanBag(raw.stock[friend])
        : clean.stock[friend];
    }

    clean.gifts = (Array.isArray(raw.gifts) ? raw.gifts : [])
      .slice(0, CONFIG.maximumCustomCards)
      .filter(gift =>
        gift &&
        ids.has(gift.id) &&
        Object.hasOwn(FRIENDS, gift.friend)
      )
      .map(gift => ({
        id: gift.id,
        friend: gift.friend,
        date: /^\d{4}-\d{2}-\d{2}$/.test(gift.date)
          ? gift.date
          : today()
      }));

    const profile = raw.profile || raw.nexusV2 || {};

    clean.profile = {
      name: truncate(profile.name, 24).trim() || "Moi",
      wishlist: [...new Set(
        Array.isArray(profile.wishlist) ? profile.wishlist : []
      )].filter(id => ids.has(id) && !clean.bag[id]),
      showcase: [...new Set(
        Array.isArray(profile.showcase) ? profile.showcase : []
      )].filter(id => ids.has(id) && clean.bag[id]).slice(0, 3)
    };

    return clean;
  }

  function loadState() {
    try {
      const current = localStorage.getItem(CONFIG.storageKey);

      if (current) {
        const normalized = normalizeState(JSON.parse(current));

        if (normalized) return normalized;

        startupMessage =
          "La sauvegarde actuelle n’est pas compatible. " +
          "Une nouvelle session locale a été ouverte.";

        return freshState();
      }

      const legacy = localStorage.getItem(CONFIG.legacyStorageKey);

      if (legacy) {
        const migrated = normalizeState(JSON.parse(legacy));

        if (migrated) {
          startupMessage =
            "Ton ancienne progression locale a été reprise.";
          return migrated;
        }
      }
    } catch {
      startupMessage =
        "La sauvegarde locale est indisponible ou illisible.";
    }

    return freshState();
  }

  function persist() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
      return true;
    } catch {
      if (!storageWarningShown) {
        storageWarningShown = true;

        toast(
          "Sauvegarde impossible : les changements de cette session " +
          "pourraient être perdus."
        );
      }

      return false;
    }
  }

  function allCards() {
    return [...BASE_CARDS, ...state.custom];
  }

  function findCard(id) {
    return allCards().find(card => card.id === id);
  }

  function quantity(id) {
    return integer(state.bag[id]);
  }

  function ownedCards() {
    return allCards().filter(card => quantity(card.id) > 0);
  }

  function synchronizeProfile() {
    state.profile.wishlist = [...new Set(state.profile.wishlist)]
      .filter(id => findCard(id) && quantity(id) === 0);

    state.profile.showcase = [...new Set(state.profile.showcase)]
      .filter(id => findCard(id) && quantity(id) > 0)
      .slice(0, 3);
  }

  function refreshDaily() {
    if (state.day === today()) return;

    state.day = today();
    state.boosters = CONFIG.dailyBoosters;
    persist();
  }

  function commit() {
    synchronizeProfile();
    persist();
    render();
  }

  function creationCount() {
    return state.custom.filter(card => card.date === today()).length;
  }

  /* =========================================================
     STRUCTURE ET INTERFACE
     ========================================================= */

  function mount() {
    if (!$("#content")) {
      let root = $("#app");

      if (!root) {
        root = document.createElement("div");
        root.id = "app";
        document.body.append(root);
      }

      root.innerHTML = `
        <div class="shell">
          <header class="topbar">
            <div class="brand">
              <div class="brand-mark glass" id="brandIcon"></div>
              <div>
                <span class="brand-name">NEXUS</span>
                <span class="brand-sub">
                  ClassChat · collection sociale
                </span>
              </div>
            </div>

            <div class="top-actions">
              <div class="wallet glass"
                aria-label="Solde en jetons virtuels">
                <span id="coinIcon"></span>
                <span id="balance">0</span>
              </div>

              <button class="icon-btn glass" id="contrast"
                type="button"
                data-action="transparency"
                aria-label="Réduire la transparence"
                aria-pressed="false"></button>

              <button class="icon-btn avatar"
                type="button"
                data-action="profile"
                aria-label="Ouvrir mon profil">
                MOI
              </button>
            </div>
          </header>

          <main id="content"></main>
        </div>
      `;
    }

    if (!$("#navigation")) {
      document.body.insertAdjacentHTML("beforeend", `
        <div class="dock-wrap">
          <nav class="dock glass" id="navigation"
            aria-label="Navigation principale"></nav>
        </div>
      `);
    }

    if (!$("#modal")) {
      document.body.insertAdjacentHTML("beforeend", `
        <dialog id="modal" aria-labelledby="modalTitle"></dialog>
      `);
    }

    if (!$("#toast")) {
      document.body.insertAdjacentHTML("beforeend", `
        <div id="toast" class="toast"
          role="status" aria-live="polite"></div>
      `);
    }

    if ($("#brandIcon")) $("#brandIcon").innerHTML = icon("nexus");
    if ($("#coinIcon")) $("#coinIcon").innerHTML = icon("coin");
    if ($("#contrast")) $("#contrast").innerHTML = icon("contrast");
  }

  function toast(message) {
    const target = $("#toast");
    if (!target) return;

    target.textContent = message;
    target.classList.add("visible");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      target.classList.remove("visible");
    }, 4500);
  }

  function showDialog(title, body) {
    const dialog = $("#modal");

    dialog.innerHTML = `
      <div class="dialog-head">
        <h2 id="modalTitle" tabindex="-1">
          ${escapeHTML(title)}
        </h2>

        <form method="dialog">
          <button class="close" type="submit" aria-label="Fermer">
            ${icon("close")}
          </button>
        </form>
      </div>

      ${body}
    `;

    if (!dialog.open) dialog.showModal();

    $("#modalTitle")?.focus({ preventScroll: true });
  }

  function navigate(view) {
    const allowed = ["boosters", "collection", "create", "exchange", "shop"];

    ui.view = allowed.includes(view) ? view : "boosters";

    if ($("#modal").open) $("#modal").close();

    render();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function creditsHTML() {
    return `
      <p class="microcopy spacer">
        Sources des références :
        <a href="https://justmeme.wtf"
          target="_blank" rel="noopener noreferrer">justmeme.wtf</a>
        et
        <a href="https://imgflip.com"
          target="_blank" rel="noopener noreferrer">Imgflip</a>.
        L’accès au catalogue ne transmet pas les droits sur les images.
      </p>
    `;
  }

  /* =========================================================
     CARTES ET ILLUSTRATIONS
     ========================================================= */

  function artwork(card) {
    const remote = safeRemoteImage(card.image);
    const local = safeStoredImage(card.image);

    if (local && !remote) {
      return `
        <img src="${escapeHTML(local)}"
          alt="" loading="lazy">
      `;
    }

    if (remote && refs.enabled) {
      return `
        <img src="${escapeHTML(remote)}"
          alt="" loading="lazy"
          referrerpolicy="no-referrer">
      `;
    }

    const colors = (THEMES[card.theme] || THEMES.sky).colors;
    const id = `nx-art-${++artworkCounter}`;

    return `
      <svg viewBox="0 0 300 360"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true">

        <defs>
          <linearGradient id="${id}-bg"
            x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="${colors[0]}"/>
            <stop offset="1" stop-color="${colors[1]}"/>
          </linearGradient>

          <radialGradient id="${id}-orb" cx=".3" cy=".22" r=".85">
            <stop stop-color="#fff"/>
            <stop offset=".35" stop-color="${colors[2]}"/>
            <stop offset=".75" stop-color="${colors[3]}"/>
            <stop offset="1" stop-color="${colors[1]}"/>
          </radialGradient>
        </defs>

        <rect width="300" height="360" fill="url(#${id}-bg)"/>

        <circle cx="247" cy="61" r="30"
          fill="${colors[2]}" opacity=".45"/>

        <g fill="white" opacity=".75">
          <circle cx="40" cy="63" r="1.8"/>
          <circle cx="241" cy="124" r="1.3"/>
          <circle cx="203" cy="35" r="1.3"/>
          <circle cx="73" cy="143" r="1"/>
          <circle cx="264" cy="207" r="1.8"/>
        </g>

        <circle cx="150" cy="154" r="76"
          fill="url(#${id}-orb)"/>

        <ellipse cx="150" cy="154" rx="111" ry="29"
          transform="rotate(-24 150 154)"
          fill="none" stroke="white"
          stroke-opacity=".6" stroke-width="2"/>

        <path d="M-20 293Q60 211 152 284T330 265V380H-20Z"
          fill="${colors[3]}"/>

        <path d="M-20 325Q91 261 176 315T330 300V380H-20Z"
          fill="${colors[1]}" opacity=".7"/>

        ${remote ? `
          <rect x="15" y="315" width="270" height="29"
            rx="14" fill="#ffffffdd"/>
          <text x="150" y="334" text-anchor="middle"
            font-family="sans-serif" font-size="11" fill="#172230">
            Image externe désactivée
          </text>
        ` : ""}
      </svg>
    `;
  }

  function cardHTML(card) {
    const rarity = RARITIES[card.rarity];
    const index = allCards().findIndex(item => item.id === card.id);

    return `
      <span class="tcg ${card.rarity}">
        <span class="card-top">
          <span>NEXUS</span>
          <span>
            ${index >= 0 ? "#" + String(index + 1).padStart(3, "0") : "NEW"}
          </span>
        </span>

        <span class="art">${artwork(card)}</span>

        <span class="card-bottom">
          <span class="card-name">${escapeHTML(card.name)}</span>
          <span class="card-author">
            par ${escapeHTML(card.creator)}
          </span>

          <span class="rarity-line">
            <span class="rarity">${rarity.label}</span>
            <span class="rarity-symbol">${rarity.symbol}</span>
          </span>
        </span>
      </span>
    `;
  }

  function cardButton(card, showCount = false) {
    const wished = state.profile.wishlist.includes(card.id);

    return `
      <button class="card-button" type="button"
        data-action="detail" data-id="${escapeHTML(card.id)}"
        aria-label="${escapeHTML(card.name)}, ${RARITIES[card.rarity].label}">
        ${cardHTML(card)}

        ${showCount ? `
          <span class="count">×${quantity(card.id)}</span>
        ` : ""}

        ${wished ? `
          <span class="tag" style="position:absolute;top:9px;left:9px">
            ${icon("heart")}
          </span>
        ` : ""}
      </button>
    `;
  }

  function pageHeader(label, title, description) {
    return `
      <span class="eyebrow">
        <span class="dot"></span>${label}
      </span>
      <h1 class="page-title">${title}</h1>
      <p class="lead">${description}</p>
    `;
  }

  function previewCard() {
    return {
      id: "preview",
      name: draft.name || "Ta prochaine histoire",
      desc: draft.desc,
      image: draft.image,
      theme: draft.theme,
      rarity: "commune",
      creator: "Toi"
    };
  }

  /* =========================================================
     ÉCRANS PRINCIPAUX
     ========================================================= */

  function boostersView() {
    const featured = [...BASE_CARDS].reverse().slice(0, 5);

    return `
      <section class="page">
        <div class="hero">
          <div class="hero-copy">
            <span class="eyebrow">
              <span class="dot"></span>Votre univers, en cartes
            </span>

            <h1>
              Tes potes.<br>
              Tes cartes.<br>
              <em>Ton Nexus.</em>
            </h1>

            <p class="lead">
              Ouvre, découvre et échange les créations de ton groupe.
              La première carte que tu crées est toujours un cadeau.
            </p>

            <div class="hero-actions">
              <button class="btn primary" data-action="open"
                ${state.boosters < 1 ? "disabled" : ""}>
                ${icon("spark")} Ouvrir un booster ${icon("arrow")}
              </button>

              <button class="btn secondary" data-view="create">
                ${icon("create")} Créer une carte
              </button>

              <button class="text-btn" data-action="references">
                Explorer les refs →
              </button>
            </div>

            <p class="microcopy">
              ${state.boosters} booster(s) disponible(s)
              · ${CONFIG.cardsPerBooster} cartes par booster<br>
              ${CONFIG.dailyBoosters} boosters par jour
              · renouvellement à minuit UTC
            </p>
          </div>

          <div class="pack-stage">
            <div class="orbit" aria-hidden="true"></div>

            <div class="float-label float-one glass">
              Collection originale
            </div>

            <button class="pack" data-action="open"
              aria-label="Ouvrir un booster Nexus Originals"
              ${state.boosters < 1 ? "disabled" : ""}>
              <span class="pack-brand">NEXUS</span>
              <span class="pack-orb" aria-hidden="true"></span>
              <span class="pack-label">
                ORIGINALS<br>
                ÉDITION DU GROUPE · 5 CARTES
              </span>
            </button>

            <div class="float-label float-two glass">
              ${allCards().length} cartes à découvrir
            </div>
          </div>
        </div>

        <div class="notice row">
          ${icon("gift")}
          <span>
            <strong>La première n’est jamais pour toi.</strong>
            Offre le premier exemplaire de ta création à un ami.
          </span>
        </div>

        <div class="section-head">
          <div>
            <h2>Petites cartes. Grandes histoires.</h2>
            <p class="muted">La collection de démonstration.</p>
          </div>

          <button class="text-btn" data-view="collection">
            Ma collection →
          </button>
        </div>

        <div class="card-grid">
          ${featured.map(card => cardButton(card)).join("")}
        </div>

        <p class="microcopy spacer">
          Probabilités par carte :
          70 % commune · 25 % rare · 5 % mythique.
          Aucun tirage rare n’est garanti.
          Les raretés ne correspondent pas à des éditions limitées.
        </p>
      </section>
    `;
  }

  function collectionView() {
    const owned = ownedCards();
    const total = owned.reduce((sum, card) => sum + quantity(card.id), 0);

    return `
      <section class="page">
        ${pageHeader(
          "Ton espace",
          "Chaque carte a une histoire.",
          "Les tiennes, celles de tes amis et les prochaines à découvrir."
        )}

        <div class="stats">
          <div class="stat glass">
            <strong>${owned.length} / ${allCards().length}</strong>
            <small>Cartes différentes</small>
          </div>

          <div class="stat glass">
            <strong>${total}</strong>
            <small>Exemplaires possédés</small>
          </div>

          <div class="stat glass">
            <strong>${state.custom.length}</strong>
            <small>Cartes créées</small>
          </div>
        </div>

        <div class="notice row between wrap">
          <span>Expose trois cartes sur ton profil.</span>
          <button class="text-btn"
            data-action="profile" data-tab="souhaits">
            Mes souhaits · ${state.profile.wishlist.length} →
          </button>
        </div>

        <div class="toolbar">
          <div class="filters">
            ${[
              ["all", "Toutes"],
              ["commune", "Communes"],
              ["rare", "Rares"],
              ["mythique", "Mythiques"],
              ["doubles", "Doubles"]
            ].map(([value, label]) => `
              <button class="chip ${ui.filter === value ? "active" : ""}"
                data-filter="${value}"
                aria-pressed="${ui.filter === value}">
                ${label}
              </button>
            `).join("")}
          </div>

          <input class="search" id="collectionSearch"
            type="search" aria-label="Chercher une carte"
            placeholder="Chercher une carte…"
            value="${escapeHTML(ui.search)}">
        </div>

        <div id="collectionGrid"></div>

        <p class="microcopy spacer">
          Seuls les doubles sont échangeables :
          le dernier exemplaire reste dans ta collection.
        </p>
      </section>
    `;
  }

  function updateCollectionGrid() {
    const target = $("#collectionGrid");
    if (!target) return;

    const needle = ui.search.toLocaleLowerCase("fr");

    const list = ownedCards().filter(card => {
      const text = `${card.name} ${card.creator}`.toLocaleLowerCase("fr");

      const matchesFilter =
        ui.filter === "all" ||
        (ui.filter === "doubles"
          ? quantity(card.id) > 1
          : card.rarity === ui.filter);

      return text.includes(needle) && matchesFilter;
    });

    target.innerHTML = list.length
      ? `<div class="card-grid">
          ${list.map(card => cardButton(card, true)).join("")}
        </div>`
      : `<div class="empty">
          Aucune carte ne correspond à cette recherche.
        </div>`;
  }

  function createView() {
    return `
      <section class="page">
        ${pageHeader(
          "Le studio",
          "Une idée. Une carte. Un cadeau.",
          "Crée quelque chose que tes amis auront envie de collectionner."
        )}

        <div class="two-col spacer">
          <form class="panel" id="createForm">
            <div class="row between" style="margin-bottom:24px">
              <h3 style="margin:0">Ta création</h3>
              <span class="tag">${CONFIG.creationCost} jetons</span>
            </div>

            <div class="notice" style="margin-bottom:24px">
              <strong>Pars d’une référence.</strong>
              <p class="help">
                Choisis une image dans la bibliothèque connectée,
                ou importe ta propre création.
              </p>

              <button type="button"
                class="text-btn" data-action="references">
                Explorer les mèmes & refs →
              </button>
            </div>

            <div class="field">
              <label for="cardName">Nom de la carte</label>
              <input id="cardName" name="name"
                required maxlength="30"
                value="${escapeHTML(draft.name)}"
                placeholder="Une ref que vous seuls connaissez…">
            </div>

            <div class="field">
              <label for="cardDesc">Son histoire</label>
              <textarea id="cardDesc" name="desc"
                maxlength="140"
                placeholder="Ce qui la rend spéciale.">${escapeHTML(draft.desc)}</textarea>
            </div>

            <div class="field">
              <label for="cardTheme">Univers visuel</label>
              <select id="cardTheme" name="theme">
                ${Object.entries(THEMES).map(([id, theme]) => `
                  <option value="${id}"
                    ${draft.theme === id ? "selected" : ""}>
                    ${theme.label}
                  </option>
                `).join("")}
              </select>
            </div>

            <div class="field">
              <label for="cardImage">Image facultative</label>
              <input id="cardImage" type="file"
                accept="image/jpeg,image/png,image/webp">

              <p class="help">
                JPG, PNG ou WebP · 2 Mo maximum.
                Ton fichier n’est pas envoyé à un serveur.
              </p>

              ${draft.image ? `
                <button type="button" class="text-btn"
                  data-action="remove-image">
                  Retirer l’image
                </button>
              ` : ""}
            </div>

            <div class="field">
              <label for="giftFriend">
                Qui reçoit le premier exemplaire ?
              </label>

              <select id="giftFriend" name="friend">
                ${Object.entries(FRIENDS).map(([id, friend]) => `
                  <option value="${id}"
                    ${draft.friend === id ? "selected" : ""}>
                    ${friend.name} · ami fictif
                  </option>
                `).join("")}
              </select>

              <p class="help">
                Ce premier exemplaire ne rejoint pas ton inventaire.
                Il ne rapporte pas de jetons.
              </p>
            </div>

            <label class="check">
              <input type="checkbox" name="consent"
                required ${draft.consent ? "checked" : ""}>
              <span>
                J’ai le droit d’utiliser cette image et l’accord
                des personnes représentées.
              </span>
            </label>

            <button id="publishButton"
              class="btn primary full spacer" type="submit">
              ${icon("gift")}
              Créer et offrir · ${CONFIG.creationCost} jetons
            </button>

            <p class="help">
              ${creationCount()}/${CONFIG.creationsPerDay}
              créations aujourd’hui.
              Les nouvelles créations sont communes.
            </p>

            <p class="help" id="creationStatus"></p>
          </form>

          <aside class="panel preview-panel">
            <span class="eyebrow">Aperçu en direct</span>

            <div class="preview-card" id="cardPreview">
              ${cardHTML(previewCard())}
            </div>

            <h3>
              Créée par toi.<br>
              Collectionnée par les autres.
            </h3>

            <p class="help">
              Le cadeau est simulé dans cette version.
              Tu peux ensuite retrouver la carte en booster
              ou l’acheter avec tes jetons virtuels.
            </p>
          </aside>
        </div>
      </section>
    `;
  }

  function updatePreview() {
    if ($("#cardPreview")) {
      $("#cardPreview").innerHTML = cardHTML(previewCard());
    }

    updateCreationStatus();
  }

  function updateCreationStatus() {
    const button = $("#publishButton");
    const status = $("#creationStatus");
    if (!button || !status) return;

    let message = "";

    if (draft.imageBusy) {
      message = "Préparation de l’image…";
    } else if (state.tokens < CONFIG.creationCost) {
      message =
        `Il te manque ${CONFIG.creationCost - state.tokens} jetons.`;
    } else if (creationCount() >= CONFIG.creationsPerDay) {
      message = "La limite de créations du jour est atteinte.";
    } else if (state.custom.length >= CONFIG.maximumCustomCards) {
      message = "La limite locale de créations est atteinte.";
    }

    button.disabled = Boolean(message);
    status.textContent = message;
  }

  function exchangeView() {
    const giveOptions = ownedCards()
      .filter(card => quantity(card.id) > 1);

    if (!giveOptions.some(card => card.id === ui.give)) {
      ui.give = giveOptions[0]?.id || "";
    }

    const offered = findCard(ui.give);

    const wantedOptions = offered
      ? allCards().filter(card =>
          (state.stock[ui.friend][card.id] || 0) > 1 &&
          card.rarity === offered.rarity &&
          card.id !== offered.id &&
          card.creator !== "Toi"
        )
      : [];

    return `
      <section class="page">
        ${pageHeader(
          "Entre amis · simulation",
          "Le double qui te manquait.",
          "Un double contre une carte de même rareté."
        )}

        <div class="notice spacer">
          <strong>Simulation locale :</strong>
          personne ne reçoit de proposition réelle.
          Le bouton simule l’accord de ton ami.
          Les échanges ne donnent pas de jetons de découverte.
        </div>

        ${!giveOptions.length ? `
          <div class="empty spacer">
            Tu n’as pas encore de double à échanger.
          </div>
        ` : `
          <form id="tradeForm" class="spacer">
            <div class="panel" style="margin-bottom:22px">
              <label for="tradeFriend">Avec quel ami ?</label>

              <select id="tradeFriend" name="friend">
                ${Object.entries(FRIENDS).map(([id, friend]) => `
                  <option value="${id}"
                    ${ui.friend === id ? "selected" : ""}>
                    ${friend.name}
                  </option>
                `).join("")}
              </select>
            </div>

            <div class="two-col">
              <div class="panel">
                <span class="eyebrow">Tu proposes</span>

                <div class="field spacer">
                  <label for="giveCard">Un de tes doubles</label>

                  <select id="giveCard" name="give">
                    ${giveOptions.map(card => `
                      <option value="${escapeHTML(card.id)}"
                        ${ui.give === card.id ? "selected" : ""}>
                        ${escapeHTML(card.name)}
                        · ×${quantity(card.id)}
                      </option>
                    `).join("")}
                  </select>
                </div>

                <div class="trade-preview">
                  ${cardHTML(offered)}
                </div>
              </div>

              <div class="panel">
                <span class="eyebrow">Tu reçois</span>

                <div class="field spacer">
                  <label for="wantCard">
                    Un double de ${FRIENDS[ui.friend].name}
                  </label>

                  <select id="wantCard" name="want"
                    ${!wantedOptions.length ? "disabled" : ""}>
                    ${wantedOptions.length
                      ? wantedOptions.map(card => `
                          <option value="${escapeHTML(card.id)}">
                            ${escapeHTML(card.name)}
                          </option>
                        `).join("")
                      : "<option>Aucun échange compatible</option>"
                    }
                  </select>
                </div>

                <div class="trade-preview" id="wantPreview">
                  ${wantedOptions[0] ? cardHTML(wantedOptions[0]) : ""}
                </div>
              </div>
            </div>

            <button class="btn primary full spacer"
              type="submit"
              ${!wantedOptions.length ? "disabled" : ""}>
              ${icon("trade")} Simuler l’acceptation
            </button>
          </form>
        `}
      </section>
    `;
  }

  function shopView() {
    return `
      <section class="page">
        ${pageHeader(
          "La boutique",
          "Celle que tu cherchais.",
          "Une carte précise, sans tirage aléatoire."
        )}

        <div class="notice spacer">
          Aucun achat en argent réel.
          Les cartes achetées ne donnent pas de jetons et sont
          considérées comme déjà découvertes.
        </div>

        <div class="shop-grid spacer">
          ${allCards().map(card => `
            <article class="shop-item">
              ${cardButton(card)}

              <button class="btn primary full"
                data-action="buy"
                data-id="${escapeHTML(card.id)}"
                ${state.tokens < RARITIES[card.rarity].price
                  ? "disabled"
                  : ""}>
                ${icon("coin")}
                ${RARITIES[card.rarity].price} jetons
              </button>

              <p class="help" style="text-align:center">
                Possédée : ×${quantity(card.id)}
              </p>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function render() {
    refreshDaily();
    synchronizeProfile();

    document.body.classList.toggle("solid", state.solid);

    if ($("#balance")) $("#balance").textContent = state.tokens;

    const contrast = $("#contrast");
    if (contrast) {
      contrast.dataset.action = "transparency";
      contrast.setAttribute("aria-pressed", String(state.solid));
    }

    const avatar = document.querySelector(
      ".avatar[data-action='profile'], .avatar[data-action='friends']"
    );

    if (avatar) {
      avatar.dataset.action = "profile";
      avatar.textContent = state.profile.name
        .split(/\s+/)
        .slice(0, 2)
        .map(part => Array.from(part)[0] || "")
        .join("")
        .toLocaleUpperCase("fr");

      avatar.setAttribute(
        "aria-label",
        `Ouvrir le profil de ${state.profile.name}`
      );
    }

    $("#navigation").innerHTML = [
      ["boosters", "booster", "Boosters"],
      ["collection", "collection", "Collection"],
      ["create", "create", "Créer"],
      ["exchange", "trade", "Échanges"],
      ["shop", "shop", "Boutique"]
    ].map(([id, symbol, label]) => `
      <button class="nav-item" data-view="${id}"
        ${ui.view === id ? 'aria-current="page"' : ""}>
        ${icon(symbol)}<span>${label}</span>
      </button>
    `).join("");

    const views = {
      boosters: boostersView,
      collection: collectionView,
      create: createView,
      exchange: exchangeView,
      shop: shopView
    };

    $("#content").innerHTML = views[ui.view]();

    if (ui.view === "collection") updateCollectionGrid();
    if (ui.view === "create") updateCreationStatus();

    $("#content").insertAdjacentHTML("beforeend", `
      <p class="microcopy spacer">
        Version locale · amis et échanges simulés.
        <button class="text-btn" data-action="references">
          Mèmes & refs
        </button>
      </p>

      ${creditsHTML()}
    `);
  }

  /* =========================================================
     BOOSTERS, CRÉATION, BOUTIQUE ET ÉCHANGES
     ========================================================= */

  function pickCard() {
    const value = Math.random();

    const rarity = value < 0.7
      ? "commune"
      : value < 0.95
        ? "rare"
        : "mythique";

    const pool = allCards().filter(card => card.rarity === rarity);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function openBooster() {
    refreshDaily();

    if (state.boosters < 1) {
      return toast("Tous les boosters du jour ont été ouverts.");
    }

    state.boosters--;

    const results = [];
    let earned = 0;

    for (let index = 0; index < CONFIG.cardsPerBooster; index++) {
      const card = pickCard();
      const discovered = !state.known.includes(card.id);

      state.bag[card.id] = quantity(card.id) + 1;

      if (discovered) {
        state.known.push(card.id);
        earned += RARITIES[card.rarity].reward;
      }

      results.push({ card, discovered });
    }

    state.tokens += earned;
    commit();

    showDialog("Cinq cartes. À toi de découvrir.", `
      <p class="muted">
        Touche les cartes pour les retourner.
        Elles sont déjà enregistrées dans ta collection.
      </p>

      <div class="reveal-grid">
        ${results.map(({ card }, index) => `
          <button class="flip" type="button"
            data-action="flip"
            data-name="${escapeHTML(card.name)}"
            aria-label="Révéler la carte ${index + 1}">
            <span class="flip-inner">
              <span class="flip-back" aria-hidden="true">
                ${icon("nexus")}<strong>NEXUS</strong>
              </span>

              <span class="flip-front" aria-hidden="true">
                ${cardHTML(card)}
              </span>
            </span>
          </button>
        `).join("")}
      </div>

      <div class="row between wrap">
        <span class="tag">
          ${icon("coin")} +${earned} jetons de découverte
        </span>

        <button class="btn secondary" data-action="reveal-all">
          ${icon("spark")} Tout révéler
        </button>
      </div>

      <p class="help">
        ${results.filter(result => result.discovered).length}
        nouvelle(s) carte(s).
        Les doubles ne donnent pas de récompense supplémentaire.
      </p>

      ${creditsHTML()}
    `);
  }

  function revealCard(button) {
    button.classList.add("revealed");
    button.setAttribute("aria-label", button.dataset.name);
    button.querySelector(".flip-front")?.setAttribute("aria-hidden", "false");
  }

  async function readImage(file) {
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return toast("Choisis une image JPG, PNG ou WebP.");
    }

    if (file.size > CONFIG.maximumImageBytes) {
      return toast("L’image doit faire moins de 2 Mo.");
    }

    const targetDraft = draft;
    const request = ++targetDraft.imageRequest;
    targetDraft.imageBusy = true;
    updateCreationStatus();

    try {
      const dataURL = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Lecture impossible"));
        reader.readAsDataURL(file);
      });

      const image = await new Promise((resolve, reject) => {
        const element = new Image();
        element.onload = () => resolve(element);
        element.onerror = () => reject(new Error("Image invalide"));
        element.src = dataURL;
      });

      if (draft !== targetDraft || request !== draft.imageRequest) return;

      const scale = Math.min(
        1,
        CONFIG.maximumImageSide / Math.max(image.width, image.height)
      );

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas indisponible");

      context.fillStyle = "#eef3f8";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      draft.image = canvas.toDataURL("image/jpeg", 0.82);
      draft.reference = null;
      draft.consent = false;

      const consent = $("#createForm [name='consent']");
      if (consent) consent.checked = false;

      toast("Image préparée localement. Aucun fichier envoyé.");
    } catch {
      toast("Impossible de lire cette image.");
    } finally {
      if (draft === targetDraft && request === draft.imageRequest) {
        draft.imageBusy = false;
        updatePreview();
      }
    }
  }

  function createCard(form) {
    refreshDaily();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim().slice(0, 30);
    const friend = String(data.get("friend") || "");
    const theme = String(data.get("theme") || "");

    if (
      !name ||
      !Object.hasOwn(FRIENDS, friend) ||
      !Object.hasOwn(THEMES, theme) ||
      !data.get("consent")
    ) {
      return toast("Complète les champs obligatoires.");
    }

    if (draft.imageBusy) return toast("L’image est encore en préparation.");

    if (state.tokens < CONFIG.creationCost) {
      return toast("Tu n’as pas assez de jetons.");
    }

    if (creationCount() >= CONFIG.creationsPerDay) {
      return toast("La limite de créations du jour est atteinte.");
    }

    if (state.custom.length >= CONFIG.maximumCustomCards) {
      return toast("La limite locale de créations est atteinte.");
    }

    const suffix = globalThis.crypto?.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

    const card = {
      id: `u-${suffix}`,
      name,
      desc: String(data.get("desc") || "").trim().slice(0, 140),
      rarity: "commune",
      theme,
      image: safeStoredImage(draft.image),
      creator: "Toi",
      date: today(),
      reference: safeReference(draft.reference)
    };

    state.tokens -= CONFIG.creationCost;
    state.custom.push(card);

    // Le cadeau n'entre jamais dans l'inventaire du créateur.
    state.stock[friend][card.id] =
      (state.stock[friend][card.id] || 0) + 1;

    state.gifts.unshift({
      id: card.id,
      friend,
      date: today()
    });

    // Aucun jeton ni découverte attribué pour ce premier cadeau.
    draft = freshDraft();
    commit();

    showDialog("La première est pour un ami.", `
      <div class="detail-layout">
        ${cardHTML(card)}

        <div>
          <span class="tag">${icon("gift")} Cadeau simulé</span>

          <h3 class="spacer">
            ${FRIENDS[friend].name} reçoit le premier exemplaire.
          </h3>

          <p class="lead">
            Tu as créé cette carte, mais tu ne la possèdes pas encore.
          </p>

          <p class="help">
            Elle rejoint le pool des boosters et la boutique de cette démo.
            Aucun cadeau réel n’a été envoyé.
          </p>
        </div>
      </div>

      ${creditsHTML()}
    `);
  }

  function buyCard(id) {
    const card = findCard(id);
    if (!card) return;

    const price = RARITIES[card.rarity].price;

    if (state.tokens < price) {
      return toast("Pas assez de jetons.");
    }

    state.tokens -= price;
    state.bag[id] = quantity(id) + 1;

    // Pas de récompense ultérieure de première découverte.
    if (!state.known.includes(id)) state.known.push(id);

    commit();
    toast(`${card.name} rejoint ta collection. −${price} jetons.`);
  }

  function tradeCards(form) {
    const data = new FormData(form);
    const friend = String(data.get("friend"));
    const give = findCard(String(data.get("give")));
    const want = findCard(String(data.get("want")));

    if (!Object.hasOwn(FRIENDS, friend) || !give || !want) {
      return toast("Échange incomplet.");
    }

    const stock = state.stock[friend];

    if (
      give.id === want.id ||
      give.rarity !== want.rarity ||
      quantity(give.id) < 2 ||
      (stock[want.id] || 0) < 2 ||
      want.creator === "Toi"
    ) {
      return toast("Cet échange n’est plus compatible.");
    }

    state.bag[give.id]--;
    state.bag[want.id] = quantity(want.id) + 1;

    stock[want.id]--;
    stock[give.id] = (stock[give.id] || 0) + 1;

    if (!state.known.includes(want.id)) state.known.push(want.id);

    commit();

    toast(
      `Échange simulé avec ${FRIENDS[friend].name} : ` +
      `tu reçois ${want.name}.`
    );
  }

  /* =========================================================
     FICHES, PROFIL, SOUHAITS ET VITRINE
     ========================================================= */

  function showDetail(id) {
    const card = findCard(id);
    if (!card) return;

    const owned = quantity(id) > 0;
    const wished = state.profile.wishlist.includes(id);
    const pinned = state.profile.showcase.includes(id);

    showDialog(card.name, `
      <div class="detail-layout">
        ${cardHTML(card)}

        <div>
          <span class="tag">
            ${RARITIES[card.rarity].symbol}
            ${RARITIES[card.rarity].label}
          </span>

          <h3 class="spacer">Par ${escapeHTML(card.creator)}</h3>
          <p class="lead">${escapeHTML(card.desc || "Une nouvelle histoire.")}</p>

          <p class="muted">
            ${quantity(id)} exemplaire(s) dans ta collection.
          </p>

          <p class="help">
            Première découverte en booster :
            +${RARITIES[card.rarity].reward} jetons, une seule fois.
            Aucun bonus sur un achat ou un échange.
          </p>

          <div class="row wrap spacer">
            ${owned ? `
              <button class="btn secondary" data-action="pin"
                data-id="${escapeHTML(id)}"
                aria-pressed="${pinned}">
                ${icon("spark")}
                ${pinned ? "Retirer de ma vitrine" : "Exposer dans ma vitrine"}
              </button>
            ` : `
              <button class="btn secondary" data-action="wish"
                data-id="${escapeHTML(id)}"
                aria-pressed="${wished}">
                ${icon("heart")}
                ${wished ? "Retirer des souhaits" : "Ajouter aux souhaits"}
              </button>
            `}

            <button class="text-btn" data-action="profile">
              Mon profil →
            </button>
          </div>

          ${safeRemoteImage(card.image) && !refs.enabled ? `
            <p class="help spacer">
              L’image externe est masquée pour cette session.
              <button class="text-btn" data-action="references">
                Gérer la connexion aux références
              </button>
            </p>
          ` : ""}

          ${card.reference ? `
            <p class="help spacer">
              Référence d’origine :
              <a href="${escapeHTML(referenceURL(card.reference))}"
                target="_blank" rel="noopener noreferrer">
                ${escapeHTML(card.reference.name)}
                · ${escapeHTML(card.reference.provider)} ↗
              </a>
            </p>
          ` : ""}
        </div>
      </div>

      ${creditsHTML()}
    `);
  }

  function matchingTrade(card) {
    if (card.creator === "Toi") return null;

    const give = ownedCards().find(candidate =>
      quantity(candidate.id) > 1 &&
      candidate.rarity === card.rarity &&
      candidate.id !== card.id
    );

    if (!give) return null;

    const friend = Object.keys(FRIENDS).find(id =>
      (state.stock[id][card.id] || 0) > 1
    );

    return friend ? { friend, give: give.id } : null;
  }

  function showProfile(tab = "profil") {
    synchronizeProfile();

    ui.profileTab = ["profil", "souhaits", "cadeaux"].includes(tab)
      ? tab
      : "profil";

    let body = "";

    if (ui.profileTab === "profil") {
      const slots = Array.from({ length: 3 }, (_, index) => {
        const card = findCard(state.profile.showcase[index]);

        return card
          ? cardButton(card)
          : `
            <button class="panel" data-view="collection"
              style="aspect-ratio:.7;text-align:center">
              ${icon("create")}
              <p class="help">Choisir une carte</p>
            </button>
          `;
      }).join("");

      body = `
        <div class="stats">
          <div class="stat glass">
            <strong>${ownedCards().length}</strong>
            <small>Cartes différentes</small>
          </div>
          <div class="stat glass">
            <strong>${state.custom.length}</strong>
            <small>Créations</small>
          </div>
        </div>

        <h3>Ma vitrine</h3>
        <p class="help">
          Ouvre une carte possédée pour l’exposer ou la retirer.
        </p>

        <div class="card-grid spacer"
          style="grid-template-columns:repeat(3,minmax(0,1fr))">
          ${slots}
        </div>

        <form id="profileForm" class="panel spacer">
          <label for="profileName">Ton pseudo local</label>
          <input id="profileName" name="nickname"
            required maxlength="24"
            value="${escapeHTML(state.profile.name)}">
          <button class="btn primary spacer" type="submit">
            Enregistrer
          </button>
        </form>

        <h3 class="spacer">Tes amis fictifs</h3>

        ${Object.values(FRIENDS).map(friend => `
          <div class="friend-line">
            <span class="friend-face"
              style="background:${friend.color}">
              ${friend.initial}
            </span>

            <div>
              <strong>${friend.name}</strong>
              <p>Compte de démonstration</p>
            </div>
          </div>
        `).join("")}
      `;
    }

    if (ui.profileTab === "souhaits") {
      const list = state.profile.wishlist.map(findCard).filter(Boolean);

      body = list.length ? `
        <p class="help">
          Une carte quitte les souhaits dès que tu la possèdes.
        </p>

        <div class="shop-grid spacer">
          ${list.map(card => {
            const match = matchingTrade(card);

            return `
              <article class="shop-item">
                ${cardButton(card)}

                <button class="btn secondary full"
                  ${match
                    ? `data-action="prepare-trade" data-id="${escapeHTML(card.id)}"`
                    : 'data-view="shop"'}>
                  ${match
                    ? `Échanger avec ${FRIENDS[match.friend].name}`
                    : "Voir la boutique"}
                </button>
              </article>
            `;
          }).join("")}
        </div>
      ` : `
        <div class="empty spacer">
          Ta liste est vide.
          Ouvre une carte non possédée pour l’ajouter aux souhaits.
        </div>
      `;
    }

    if (ui.profileTab === "cadeaux") {
      body = state.gifts.length
        ? state.gifts.map(gift => {
            const card = findCard(gift.id);
            if (!card) return "";

            return `
              <div class="friend-line">
                ${icon("gift")}

                <div>
                  <strong>${escapeHTML(card.name)}</strong>
                  <p>
                    Premier exemplaire offert à
                    ${FRIENDS[gift.friend].name}
                    · ${escapeHTML(gift.date)}
                    · simulation
                  </p>
                </div>

                <button class="text-btn"
                  data-action="detail" data-id="${escapeHTML(card.id)}">
                  Voir →
                </button>
              </div>
            `;
          }).join("")
        : `<div class="empty spacer">Pas encore de premier cadeau.</div>`;
    }

        showDialog(`Le Nexus de ${state.profile.name}`, `
      <div class="filters">
        <button
          class="chip ${ui.profileTab === "profil" ? "active" : ""}"
          data-action="profile"
          data-tab="profil"
          aria-pressed="${ui.profileTab === "profil"}"
        >
          Mon profil
        </button>

        <button
          class="chip ${ui.profileTab === "souhaits" ? "active" : ""}"
          data-action="profile"
          data-tab="souhaits"
          aria-pressed="${ui.profileTab === "souhaits"}"
        >
          Souhaits · ${state.profile.wishlist.length}
        </button>

        <button
          class="chip ${ui.profileTab === "cadeaux" ? "active" : ""}"
          data-action="profile"
          data-tab="cadeaux"
          aria-pressed="${ui.profileTab === "cadeaux"}"
        >
          Cadeaux · ${state.gifts.length}
        </button>
      </div>

      ${body}

      <div class="notice spacer">
        Profil enregistré dans ce navigateur seulement.
        Aucun compte réel n’est connecté.
      </div>

      <div class="row wrap spacer">
        <button class="btn secondary" data-action="transparency">
          ${icon("contrast")}
          ${state.solid ? "Rétablir le verre" : "Réduire la transparence"}
        </button>

        ${refs.enabled ? `
          <button class="text-btn" data-action="disable-references">
            Désactiver les images externes
          </button>
        ` : ""}

        <button class="text-btn" data-action="reset">
          Réinitialiser la démo
        </button>
      </div>

      ${creditsHTML()}
    `);
  }

  /* =========================================================
     RÉFÉRENCES : API, CACHE, PAGINATION ET SECOURS
     ========================================================= */

  async function fetchJSON(url, force = false) {
    const cached = refs.cache.get(url);

    if (
      !force &&
      cached &&
      Date.now() - cached.time < CONFIG.referenceCacheDuration
    ) {
      return cached.data;
    }

    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      CONFIG.referenceTimeout
    );

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        credentials: "omit",
        referrerPolicy: "no-referrer"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data?.success === false) {
        throw new Error("La source a refusé la demande");
      }

      if (refs.cache.size >= 40 && !refs.cache.has(url)) {
        refs.cache.delete(refs.cache.keys().next().value);
      }

      refs.cache.set(url, {
        data,
        time: Date.now()
      });

      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  function normalizeReferences(items, provider) {
    const seen = new Set();

    return items.slice(0, 3000).flatMap(item => {
      const image = safeRemoteImage(item?.url);
      const id = truncate(item?.slug || item?.id, 150);
      const name = truncate(item?.name, 100).trim();

      if (!image || !id || !name || seen.has(image)) return [];

      seen.add(image);
      return [{ id, name, image, provider }];
    });
  }

  function obsoleteRequest() {
    return new DOMException("Recherche remplacée", "AbortError");
  }

  async function retrieveReferences(parameters, force, isCurrent) {
    if (force) refs.primaryUnavailableUntil = 0;

    const { query, mode, page } = parameters;
    const size = CONFIG.referencePageSize;

    try {
      if (Date.now() < refs.primaryUnavailableUntil) {
        throw new Error("Source principale en pause");
      }

      let endpoint;

      if (query) {
        endpoint = "/templates/search?q=" + encodeURIComponent(query);
      } else if (mode === "trending") {
        endpoint = "/trending";
      } else {
        endpoint = `/templates?page=${page}&limit=${size}`;
      }

      const data = await fetchJSON(CONFIG.memeAPI + endpoint, force);
      if (!isCurrent()) throw obsoleteRequest();

      const raw = !query && mode === "trending"
        ? data.trending
        : data.templates;

      if (!Array.isArray(raw)) throw new Error("Format inattendu");

      const list = normalizeReferences(raw, "justmeme");

      if (raw.length && !list.length) {
        throw new Error("Aucune image compatible");
      }

      if (query) {
        const offset = (page - 1) * size;

        return {
          items: list.slice(offset, offset + size),
          total: list.length,
          source: "justmeme · recherche",
          hasNext: offset + size < list.length
        };
      }

      if (mode === "trending") {
        return {
          items: list,
          total: list.length,
          source: "justmeme · sélection tendances",
          hasNext: false
        };
      }

      const reportedTotal = Number(data.total);
      const totalKnown =
        Number.isFinite(reportedTotal) && reportedTotal >= 0;

      return {
        items: list,
        total: totalKnown
          ? reportedTotal
          : (page - 1) * size + list.length,
        source: "justmeme · catalogue",
        hasNext: totalKnown
          ? page * size < reportedTotal
          : raw.length === size
      };
    } catch {
      if (!isCurrent()) throw obsoleteRequest();

      refs.primaryUnavailableUntil = Date.now() + 60000;

      const data = await fetchJSON(CONFIG.fallbackAPI, force);
      if (!isCurrent()) throw obsoleteRequest();

      const raw = data?.data?.memes;
      if (!Array.isArray(raw)) {
        throw new Error("Source de secours indisponible");
      }

      let list = normalizeReferences(raw, "Imgflip");

      if (raw.length && !list.length) {
        throw new Error("Aucune image compatible dans le secours");
      }

      if (query) {
        const needle = query.toLocaleLowerCase("fr");

        list = list.filter(item =>
          item.name.toLocaleLowerCase("fr").includes(needle)
        );
      }

      const offset = (page - 1) * size;

      return {
        items: list.slice(offset, offset + size),
        total: list.length,
        source: "Imgflip · secours · modèles populaires",
        hasNext: offset + size < list.length
      };
    }
  }

  function showReferences() {
    if (!refs.enabled) {
      showDialog("Connecter les références.", `
        <form id="referenceConsentForm" class="panel">
          <h3>Une connexion facultative.</h3>

          <p class="lead">
            La bibliothèque contacte des services externes
            et charge leurs images.
          </p>

          <div class="notice">
            Ce catalogue n’est pas modéré par Nexus.
            Il ne couvre pas toutes les références françaises
            ni toutes les nouveautés.
            Cette activation de test n’est pas un contrôle d’âge.
          </div>

          <label class="check spacer">
            <input type="checkbox" required>
            <span>
              J’ai au moins 13 ans et je souhaite activer ces
              sources externes pour cette session de test.
            </span>
          </label>

          <button class="btn primary full spacer" type="submit">
            Activer pour cette session
          </button>

          ${creditsHTML()}
        </form>
      `);

      return;
    }

    showDialog("Mèmes & refs.", `
      <div id="referenceLibrary">
        <p class="help">
          Cherche une référence, puis importe-la dans ton brouillon.
          La recherche utilise les noms du fournisseur :
          certains termes français peuvent ne rien retourner.
        </p>

        <form id="referenceSearchForm" class="row spacer">
          <input id="referenceQuery" type="search"
            maxlength="80" aria-label="Chercher une référence"
            placeholder="Chercher une ref…"
            value="${escapeHTML(refs.query)}">

          <button class="btn primary" type="submit">
            ${icon("search")}
          </button>
        </form>

        <div class="toolbar">
          <div class="filters">
            <button class="chip"
              data-action="reference-mode" data-mode="trending">
              Tendances
            </button>

            <button class="chip"
              data-action="reference-mode" data-mode="catalogue">
              Catalogue
            </button>
          </div>

          <button class="text-btn" data-action="reference-refresh">
            Actualiser ↻
          </button>
        </div>

        <p id="referenceStatus" class="help"
          role="status" aria-live="polite"></p>

        <div id="referenceResults" class="spacer"></div>
        <div id="referencePagination" class="row between spacer"></div>

        <p class="help spacer">
          Importer une image n’autorise pas automatiquement
          sa réutilisation. Aucun jeton n’est donné lors d’un import.
        </p>

        ${creditsHTML()}
      </div>
    `);

    void loadReferences();
  }

  async function loadReferences(force = false) {
    const root = $("#referenceLibrary");
    if (!root) return;

    const requestId = ++refs.requestId;

    const parameters = {
      query: refs.query,
      mode: refs.mode,
      page: refs.page
    };

    const isCurrent = () =>
      refs.enabled &&
      refs.requestId === requestId &&
      root.isConnected &&
      $("#modal").open;

    const status = root.querySelector("#referenceStatus");
    const results = root.querySelector("#referenceResults");
    const pagination = root.querySelector("#referencePagination");

    root.setAttribute("aria-busy", "true");
    status.textContent = "Connexion au catalogue…";
    results.innerHTML = "";
    pagination.innerHTML = "";
    refs.items = [];

    root.querySelectorAll("[data-action='reference-mode']")
      .forEach(button => {
        const active =
          !parameters.query &&
          button.dataset.mode === parameters.mode;

        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });

    try {
      const response = await retrieveReferences(
        parameters,
        force,
        isCurrent
      );

      if (!isCurrent()) return;

      refs.items = response.items;

      const time = new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      });

      status.textContent =
        `${response.source} · ${response.total} résultat(s)` +
        ` · affichage actualisé à ${time}`;

      results.innerHTML = response.items.length
        ? `
          <div class="shop-grid">
            ${response.items.map((item, index) => `
              <article class="shop-item">
                <img src="${escapeHTML(item.image)}"
                  alt="${escapeHTML(item.name)}"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  style="width:100%;height:150px;object-fit:contain;border-radius:15px;background:#f2f5f9">

                <h3 style="font-size:14px;margin-top:14px">
                  ${escapeHTML(item.name)}
                </h3>

                <button class="btn secondary full"
                  data-action="reference-use"
                  data-index="${index}">
                  Utiliser cette ref
                </button>

                <p class="help">
                  <a href="${escapeHTML(referenceURL(item))}"
                    target="_blank" rel="noopener noreferrer">
                    Voir la source ↗
                  </a>
                </p>
              </article>
            `).join("")}
          </div>
        `
        : `<div class="empty">
            Aucun résultat. Essaie un autre nom.
          </div>`;

      pagination.innerHTML = `
        <button class="btn secondary"
          data-action="reference-page" data-direction="-1"
          ${parameters.page <= 1 ? "disabled" : ""}>
          ← Précédent
        </button>

        <span class="help">Page ${parameters.page}</span>

        <button class="btn secondary"
          data-action="reference-page" data-direction="1"
          ${!response.hasNext ? "disabled" : ""}>
          Suivant →
        </button>
      `;
    } catch {
      if (!isCurrent()) return;

      status.textContent = "Connexion impossible.";

      results.innerHTML = `
        <div class="empty">
          Les sources sont indisponibles ou la connexion est bloquée.
          Aucun contenu fictif n’est présenté comme synchronisé.
          Tu peux continuer avec tes propres images.
        </div>
      `;
    } finally {
      if (isCurrent()) root.removeAttribute("aria-busy");
    }
  }

  function useReference(index) {
    const item = refs.items[index];
    if (!item || !refs.enabled) return;

    draft.imageRequest++;
    draft.imageBusy = false;
    draft.name = item.name.slice(0, 30);
    draft.image = item.image;
    draft.reference = safeReference(item);
    draft.consent = false;

    navigate("create");
    toast("Référence ajoutée au brouillon. Vérifie tes droits avant de publier.");
  }

  /* =========================================================
     ÉVÉNEMENTS
     ========================================================= */

  function handleClick(event) {
    const navigation = event.target.closest("[data-view]");

    if (navigation) {
      navigate(navigation.dataset.view);
      return;
    }

    const filter = event.target.closest("[data-filter]");

    if (filter) {
      ui.filter = filter.dataset.filter;
      render();
      return;
    }

    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;

    const { action, id } = button.dataset;

    switch (action) {
      case "open":
        openBooster();
        break;

      case "detail":
        showDetail(id);
        break;

      case "friends":
      case "profile":
        showProfile(button.dataset.tab || "profil");
        break;

      case "buy":
        buyCard(id);
        break;

      case "flip":
        revealCard(button);
        break;

      case "reveal-all":
        $("#modal").querySelectorAll(".flip").forEach(revealCard);
        break;

      case "transparency": {
        const profileOpen =
          $("#modal").open &&
          Boolean($("#profileForm") || $("#modal [data-action='reset']"));

        state.solid = !state.solid;
        commit();

        if (profileOpen) showProfile(ui.profileTab);
        break;
      }

      case "remove-image":
        draft.imageRequest++;
        draft.imageBusy = false;
        draft.image = "";
        draft.reference = null;
        draft.consent = false;
        render();
        break;

      case "wish":
        if (!findCard(id) || quantity(id) > 0) return;

        state.profile.wishlist = state.profile.wishlist.includes(id)
          ? state.profile.wishlist.filter(value => value !== id)
          : [...state.profile.wishlist, id];

        commit();
        showDetail(id);
        break;

      case "pin":
        if (!findCard(id) || quantity(id) < 1) return;

        if (state.profile.showcase.includes(id)) {
          state.profile.showcase =
            state.profile.showcase.filter(value => value !== id);
        } else {
          if (state.profile.showcase.length >= 3) {
            return toast("Ta vitrine contient déjà trois cartes.");
          }

          state.profile.showcase.push(id);
        }

        commit();
        showDetail(id);
        break;

      case "prepare-trade": {
        const card = findCard(id);
        const match = card && matchingTrade(card);

        if (!match) return toast("Aucun échange compatible actuellement.");

        ui.friend = match.friend;
        ui.give = match.give;
        navigate("exchange");

        const wanted = $("#wantCard");
        if (wanted) {
          wanted.value = id;
          updateWantedPreview();
        }

        toast("Proposition préparée. Vérifie les deux cartes avant de confirmer.");
        break;
      }

      case "references":
        showReferences();
        break;

      case "reference-mode":
        refs.mode = button.dataset.mode === "catalogue"
          ? "catalogue"
          : "trending";

        refs.query = "";
        refs.page = 1;

        if ($("#referenceQuery")) $("#referenceQuery").value = "";
        void loadReferences();
        break;

      case "reference-refresh":
        void loadReferences(true);
        break;

      case "reference-page":
        refs.page = Math.max(
          1,
          refs.page + Number(button.dataset.direction)
        );

        void loadReferences();
        break;

      case "reference-use":
        useReference(Number(button.dataset.index));
        break;

      case "disable-references":
        refs.enabled = false;
        refs.requestId++;
        refs.items = [];

        $("#modal").close();
        render();

        toast("Images externes désactivées pour cette session.");
        break;

      case "reset":
        if (!confirm("Effacer toute la progression locale de cette démo ?")) {
          return;
        }

        $("#modal").close();
        state = freshState();
        draft = freshDraft();
        ui.filter = "all";
        ui.search = "";

        commit();
        navigate("boosters");
        toast("La démo a été réinitialisée.");
        break;
    }
  }

  function updateWantedPreview() {
    const select = $("#wantCard");
    const target = $("#wantPreview");

    if (!select || !target) return;

    const card = findCard(select.value);
    target.innerHTML = card ? cardHTML(card) : "";
  }

  function handleInput(event) {
    const input = event.target;

    if (input.id === "collectionSearch") {
      ui.search = input.value;
      updateCollectionGrid();
    }

    if (input.id === "cardName") {
      draft.name = input.value;
      updatePreview();
    }

    if (input.id === "cardDesc") {
      draft.desc = input.value;
    }
  }

  function handleChange(event) {
    const input = event.target;

    if (input.id === "cardTheme") {
      draft.theme = input.value;
      updatePreview();
    }

    if (input.id === "giftFriend") draft.friend = input.value;

    if (input.name === "consent") {
      draft.consent = input.checked;
    }

    if (input.id === "cardImage") {
      void readImage(input.files?.[0]);
    }

    if (input.id === "tradeFriend") {
      if (Object.hasOwn(FRIENDS, input.value)) {
        ui.friend = input.value;
        render();
      }
    }

    if (input.id === "giveCard") {
      ui.give = input.value;
      render();
    }

    if (input.id === "wantCard") updateWantedPreview();
  }

  function handleSubmit(event) {
    const form = event.target;

    if (form.id === "createForm") {
      event.preventDefault();
      createCard(form);
    }

    if (form.id === "tradeForm") {
      event.preventDefault();
      tradeCards(form);
    }

    if (form.id === "profileForm") {
      event.preventDefault();

      const name = String(new FormData(form).get("nickname") || "")
        .trim()
        .slice(0, 24);

      if (!name) return toast("Choisis un pseudo non vide.");

      state.profile.name = name;
      commit();
      showProfile("profil");
      toast("Ton pseudo local a été enregistré.");
    }

    if (form.id === "referenceConsentForm") {
      event.preventDefault();

      refs.enabled = true;
      render();
      showReferences();
    }

    if (form.id === "referenceSearchForm") {
      event.preventDefault();

      const query = $("#referenceQuery").value.trim().slice(0, 80);

      if (query && query.length < 2) {
        return toast("Entre au moins deux caractères.");
      }

      refs.query = query;
      refs.page = 1;
      void loadReferences();
    }
  }

  /* =========================================================
     INITIALISATION
     ========================================================= */

  function start() {
    mount();
    refreshDaily();
    synchronizeProfile();
    render();
    persist();

    document.addEventListener("click", handleClick);
    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleChange);
    document.addEventListener("submit", handleSubmit);

    $("#modal").addEventListener("close", () => {
      refs.requestId++;
    });

    // Remplacer les images externes indisponibles sans réessayer
    // en boucle et sans inventer un contenu de remplacement.
    document.addEventListener("error", event => {
      const image = event.target;

      if (
        !(image instanceof HTMLImageElement) ||
        !safeRemoteImage(image.getAttribute("src"))
      ) {
        return;
      }

      const replacement = document.createElement("span");
      replacement.className = "help";
      replacement.textContent = "Image externe indisponible";
      image.replaceWith(replacement);
    }, true);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && state.day !== today()) {
        refreshDaily();
        render();
      }
    });

    // Rafraîchissement entre onglets, sans prétendre fournir
    // des transactions concurrentes sécurisées.
    window.addEventListener("storage", event => {
      if (event.key !== CONFIG.storageKey || !event.newValue) return;

      try {
        const updated = normalizeState(JSON.parse(event.newValue));
        if (!updated) return;

        state = updated;

        if ($("#modal").open) $("#modal").close();

        render();
        toast("Progression actualisée depuis un autre onglet.");
      } catch {
        // Une sauvegarde invalide ne remplace pas la session active.
      }
    });

    if (startupMessage) toast(startupMessage);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
