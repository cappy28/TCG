export const CONFIG = Object.freeze({
  release: "5.1.0",
  storageKey: "classchat-nexus-state-v5",
  legacyKey: "classchat-nexus-state-v4",
  oldestKey: "classchat-nexus-demo-v1",

  initialTokens: 160,
  dailyBoosters: 2,
  cardsPerBooster: 5,

  boosterXP: 20,
  discoveryXP: 5,
  xpPerLevel: 100,

  historyLimit: 40
});

/*
 * Calculé depuis ce fichier :
 * /TCG/js/core/config.js → /TCG/
 *
 * Aucun nom de domaine n’est codé en dur.
 */
export const ROOT = new URL("../../", import.meta.url);

export function siteURL(path = "") {
  return new URL(path, ROOT).href;
}

export const PAGES = Object.freeze({
  accueil: {
    label: "Boosters",
    path: "",
    module: "accueil.js",
    icon: "booster",
    ready: true
  },
  collection: {
    label: "Collection",
    path: "collection/",
    module: "collection/collection.js",
    icon: "collection",
    ready: false
  },
  creation: {
    label: "Créer",
    path: "creation/",
    module: "creation/creation.js",
    icon: "create",
    ready: false
  },
  echanges: {
    label: "Échanges",
    path: "echanges/",
    module: "echanges/echanges.js",
    icon: "trade",
    ready: false
  },
  boutique: {
    label: "Boutique",
    path: "boutique/",
    module: "boutique/boutique.js",
    icon: "shop",
    ready: false
  }
});

export const MISSIONS = Object.freeze([
  {
    id: "first-pack",
    label: "Première découverte",
    description: "Ouvre un booster aujourd’hui.",
    metric: "opened",
    target: 1,
    tokens: 15,
    xp: 10
  },
  {
    id: "two-packs",
    label: "La double ouverture",
    description: "Ouvre tes deux boosters quotidiens.",
    metric: "opened",
    target: 2,
    tokens: 25,
    xp: 20
  },
  {
    id: "new-card",
    label: "Une nouvelle dans l’album",
    description: "Découvre une carte que tu n’avais jamais obtenue.",
    metric: "discoveries",
    target: 1,
    tokens: 20,
    xp: 15
  }
]);

export function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}
