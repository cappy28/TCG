import {
  CONFIG,
  todayUTC
} from "./config.js?v=5.1.0";

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isRecord(value) {
  return value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);
}

function integer(value, maximum = 10_000_000) {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, Math.min(maximum, Math.floor(number)))
    : 0;
}

function validDay(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(value + "T00:00:00Z");

  return Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

function cleanIDs(values) {
  if (!Array.isArray(values)) return [];

  return [...new Set(values.filter(value =>
    typeof value === "string" &&
    /^[a-z0-9][a-z0-9_-]{0,99}$/i.test(value)
  ))];
}

export function freshState() {
  const day = todayUTC();

  return {
    version: 5,
    revision: 0,
    updatedAt: "",

    tokens: CONFIG.initialTokens,
    day,
    boosters: CONFIG.dailyBoosters,

    bag: {
      a: 3,
      b: 2,
      e: 1
    },

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
    },

    xp: 0,
    opened: 0,

    daily: {
      day,
      opened: 0,
      discoveries: 0,
      claims: []
    },

    history: [],
    lastPack: null
  };
}

export function refreshDaily(state) {
  const day = todayUTC();

  /*
   * Ne pas renouveler plusieurs fois en reculant simplement
   * l’horloge. Ce n’est pas une protection serveur.
   */
  if (state.day < day) {
    state.day = day;
    state.boosters = CONFIG.dailyBoosters;
  }

  if (!state.daily || state.daily.day < day) {
    state.daily = {
      day,
      opened: 0,
      discoveries: 0,
      claims: []
    };
  }

  return state;
}

export function normalizeState(raw) {
  if (!isRecord(raw) || !isRecord(raw.bag)) {
    throw new Error("La structure de la sauvegarde est invalide.");
  }

  if (
    raw.version !== 4 &&
    raw.version !== 5 &&
    raw.v !== 1
  ) {
    throw new Error("Cette version de sauvegarde est incompatible.");
  }

  /*
   * Conserver aussi les champs V4 supplémentaires :
   * créations, cadeaux, stocks et métadonnées existantes.
   */
  const clean = {
    ...freshState(),
    ...clone(raw),
    version: 5
  };

  clean.tokens = integer(raw.tokens);
  clean.revision = integer(raw.revision, Number.MAX_SAFE_INTEGER);
  clean.boosters = integer(raw.boosters, CONFIG.dailyBoosters);
  clean.day = validDay(raw.day) ? raw.day : todayUTC();
  clean.solid = Boolean(raw.solid);

  const bag = Object.create(null);

  for (const [id, amount] of Object.entries(raw.bag)) {
    if (!/^[a-z0-9][a-z0-9_-]{0,99}$/i.test(id)) continue;

    const count = integer(amount, 1_000_000);

    if (count > 0) bag[id] = count;
  }

  clean.bag = bag;
  clean.known = cleanIDs([
    ...(Array.isArray(raw.known) ? raw.known : []),
    ...Object.keys(bag)
  ]);

  clean.custom = Array.isArray(raw.custom)
    ? clone(raw.custom)
    : [];

  clean.gifts = Array.isArray(raw.gifts)
    ? clone(raw.gifts)
    : [];

  if (!isRecord(clean.stock)) {
    clean.stock = freshState().stock;
  }

  const profile = isRecord(raw.profile)
    ? raw.profile
    : isRecord(raw.nexusV2)
      ? raw.nexusV2
      : {};

  clean.profile = {
    ...profile,
    name: String(profile.name || "Moi").trim().slice(0, 24) || "Moi",
    wishlist: cleanIDs(profile.wishlist),
    showcase: cleanIDs(profile.showcase).slice(0, 3)
  };

  clean.xp = integer(raw.xp);
  clean.opened = integer(raw.opened);

  const daily = isRecord(raw.daily) ? raw.daily : {};

  clean.daily = {
    day: validDay(daily.day) ? daily.day : clean.day,
    opened: integer(daily.opened),
    discoveries: integer(daily.discoveries),
    claims: cleanIDs(daily.claims)
  };

  clean.history = Array.isArray(raw.history)
    ? raw.history.filter(entry =>
        isRecord(entry) &&
        typeof entry.title === "string" &&
        typeof entry.at === "string" &&
        Number.isFinite(Date.parse(entry.at))
      ).slice(0, CONFIG.historyLimit)
    : [];

  clean.lastPack =
    isRecord(raw.lastPack) &&
    Array.isArray(raw.lastPack.draws)
      ? {
          ...clone(raw.lastPack),
          draws: raw.lastPack.draws.filter(draw =>
            isRecord(draw) &&
            typeof draw.id === "string"
          ).slice(0, CONFIG.cardsPerBooster)
        }
      : null;

  return refreshDaily(clean);
}
