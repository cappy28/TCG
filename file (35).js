import {
  CONFIG,
  MISSIONS
} from "../core/config.js?v=5.1.0";

import {
  getCards,
  RARITIES
} from "./catalogue.js?v=5.1.0";

function random() {
  const values = new Uint32Array(1);

  crypto.getRandomValues(values);

  return values[0] / 4_294_967_296;
}

function makeID() {
  const values = new Uint32Array(2);

  crypto.getRandomValues(values);

  return Date.now().toString(36) +
    "-" +
    Array.from(values, value => value.toString(36)).join("-");
}

function addHistory(state, entry) {
  state.history.unshift({
    id: makeID(),
    at: new Date().toISOString(),
    ...entry
  });

  state.history = state.history.slice(0, CONFIG.historyLimit);
}

function pickCard(cards) {
  const roll = random();

  const rarity = roll < 0.70
    ? "commune"
    : roll < 0.95
      ? "rare"
      : "mythique";

  const pool = cards.filter(card => card.rarity === rarity);

  if (!pool.length) {
    throw new Error("Le catalogue de cette rareté est vide.");
  }

  return pool[Math.floor(random() * pool.length)];
}

export function openBooster(state) {
  if (state.boosters < 1) {
    throw new Error("Tu as déjà ouvert tes boosters du jour.");
  }

  const cards = getCards(state);
  const known = new Set(state.known);

  const draws = [];

  let earned = 0;
  let discoveries = 0;

  for (let index = 0; index < CONFIG.cardsPerBooster; index++) {
    const card = pickCard(cards);
    const discovered = !known.has(card.id);

    state.bag[card.id] = (state.bag[card.id] || 0) + 1;

    if (discovered) {
      known.add(card.id);
      discoveries++;
      earned += RARITIES[card.rarity].reward;
    }

    draws.push({
      id: card.id,
      discovered
    });
  }

  const xp =
    CONFIG.boosterXP +
    discoveries * CONFIG.discoveryXP;

  state.boosters--;
  state.opened++;
  state.daily.opened++;
  state.daily.discoveries += discoveries;

  state.known = [...known];
  state.tokens += earned;
  state.xp += xp;

  const pack = {
    id: makeID(),
    at: new Date().toISOString(),
    draws,
    earned,
    discoveries,
    xp
  };

  state.lastPack = pack;

  addHistory(state, {
    type: "booster",
    title: "Ouverture d’un booster",
    tokens: earned,
    xp
  });

  return pack;
}

export function claimMission(state, id) {
  const mission = MISSIONS.find(item => item.id === id);

  if (!mission) {
    throw new Error("Cette mission n’existe pas.");
  }

  if (state.daily.claims.includes(id)) {
    throw new Error("Cette récompense a déjà été récupérée.");
  }

  if ((state.daily[mission.metric] || 0) < mission.target) {
    throw new Error("La mission n’est pas encore terminée.");
  }

  state.daily.claims.push(id);
  state.tokens += mission.tokens;
  state.xp += mission.xp;

  addHistory(state, {
    type: "mission",
    title: mission.label,
    tokens: mission.tokens,
    xp: mission.xp
  });

  return {
    tokens: mission.tokens,
    xp: mission.xp
  };
}
