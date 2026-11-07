export const RARITIES = Object.freeze({
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

export const THEMES = Object.freeze({
  sky: {
    colors: ["#d8f2ff", "#74a8d8", "#f1e4ff"]
  },
  mint: {
    colors: ["#d9f5e6", "#63a18f", "#fff0c8"]
  },
  candy: {
    colors: ["#ffe0ee", "#c08ad0", "#fff0cb"]
  },
  night: {
    colors: ["#20385d", "#697fc0", "#e6d8ff"]
  },
  solar: {
    colors: ["#ffe5bd", "#d48d77", "#efc6e6"]
  }
});

export const BASE_CARDS = Object.freeze([
  {
    id: "a",
    name: "L’heure bleue",
    rarity: "commune",
    theme: "sky",
    creator: "Noa",
    desc: "Un instant calme avant la prochaine aventure."
  },
  {
    id: "b",
    name: "Petit chaos",
    rarity: "commune",
    theme: "candy",
    creator: "Inès",
    desc: "Les meilleures histoires commencent parfois par un imprévu."
  },
  {
    id: "c",
    name: "Après les cours",
    rarity: "commune",
    theme: "mint",
    creator: "Léo",
    desc: "La journée continue, mais les règles changent."
  },
  {
    id: "d",
    name: "Dernier métro",
    rarity: "commune",
    theme: "night",
    creator: "Noa",
    desc: "Une dernière destination avant de rentrer."
  },
  {
    id: "e",
    name: "Club lunaire",
    rarity: "rare",
    theme: "night",
    creator: "Inès",
    desc: "Une invitation discrète pour une soirée au-dessus du monde."
  },
  {
    id: "f",
    name: "Mode avion",
    rarity: "rare",
    theme: "sky",
    creator: "Léo",
    desc: "Une pause dans les notifications. Pas dans l’imagination."
  },
  {
    id: "g",
    name: "Hors orbite",
    rarity: "rare",
    theme: "solar",
    creator: "Noa",
    desc: "Prendre une direction que personne n’avait envisagée."
  },
  {
    id: "h",
    name: "Éclipse",
    rarity: "mythique",
    theme: "night",
    creator: "Léo",
    desc: "Deux mondes se croisent le temps d’un instant."
  },
  {
    id: "i",
    name: "Supernova",
    rarity: "mythique",
    theme: "solar",
    creator: "Inès",
    desc: "Une lumière assez forte pour commencer une nouvelle histoire."
  }
]);

export function getCards(state) {
  const cards = [...BASE_CARDS];
  const ids = new Set(cards.map(card => card.id));

  for (const card of state.custom || []) {
    if (
      card &&
      typeof card.id === "string" &&
      /^u-[a-z0-9-]+$/i.test(card.id) &&
      !ids.has(card.id)
    ) {
      cards.push({
        ...card,
        name: String(card.name || "Sans titre").slice(0, 100),
        rarity: Object.hasOwn(RARITIES, card.rarity)
          ? card.rarity
          : "commune",
        theme: Object.hasOwn(THEMES, card.theme)
          ? card.theme
          : "sky"
      });

      ids.add(card.id);
    }
  }

  return cards;
}

export function findCard(state, id) {
  return getCards(state).find(card => card.id === id);
}

export function ownedCards(state) {
  return getCards(state).filter(card => state.bag[card.id] > 0);
}
