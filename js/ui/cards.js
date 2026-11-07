import {
  RARITIES,
  THEMES
} from "../game/catalogue.js?v=5.1.0";

let artworkID = 0;

export function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    character => {
      switch (character) {
        case "&": return "&amp;";
        case "<": return "&lt;";
        case ">": return "&gt;";
        case '"': return "&quot;";
        case "'": return "&#39;";
        default: return character;
      }
    }
  );
}

const ICONS = Object.freeze({
  nexus:
    '<path d="m12 3 8 5v8l-8 5-8-5V8z"/>' +
    '<path d="m4 8 8 5 8-5M12 13v8"/>',

  booster:
    '<rect x="5" y="3" width="14" height="18" rx="3"/>' +
    '<path d="M8 3v3m8-3v3M8 18v3m8-3v3"/>' +
    '<path d="m12 9 2 3-2 3-2-3z"/>',

  collection:
    '<rect x="8" y="3" width="12" height="16" rx="2"/>' +
    '<path d="M4 7v12a2 2 0 0 0 2 2h10"/>',

  create:
    '<circle cx="12" cy="12" r="9"/>' +
    '<path d="M12 7v10M7 12h10"/>',

  trade:
    '<path d="M4 7h15m-4-4 4 4-4 4"/>' +
    '<path d="M20 17H5m4-4-4 4 4 4"/>',

  shop:
    '<path d="M5 8h14l1 13H4z"/>' +
    '<path d="M8 8V6a4 4 0 0 1 8 0v2"/>',

  coin:
    '<circle cx="12" cy="12" r="9"/>' +
    '<path d="m12 7 3 5-3 5-3-5z"/>',

  close:
    '<path d="m6 6 12 12M6 18 18 6"/>',

  spark:
    '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z"/>',

  contrast:
    '<circle cx="12" cy="12" r="9"/>' +
    '<path d="M12 3v18"/>'
});

export function icon(name) {
  return `
    <svg class="icon" viewBox="0 0 24 24"
      aria-hidden="true" focusable="false">
      ${ICONS[name] || ICONS.spark}
    </svg>
  `;
}

function artwork(card) {
  const image = String(card.image || "");

  /*
   * Seulement les images locales enregistrées dans la sauvegarde.
   * Pas de SVG importé ni d’URL distante chargée ici.
   */
  if (
    image.length <= 1_500_000 &&
    /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(image)
  ) {
    return `
      <img
        src="${escapeHTML(image)}"
        alt=""
        loading="lazy"
        decoding="async"
      >
    `;
  }

  const theme = THEMES[card.theme] || THEMES.sky;
  const id = "nexus-art-" + (++artworkID);

  const seed = Array.from(String(card.id))
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);

  const x = 65 + seed % 90;
  const y = 85 + seed % 100;

  return `
    <svg viewBox="0 0 240 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true" focusable="false">

      <defs>
        <linearGradient id="${id}" x2="1" y2="1">
          <stop stop-color="${theme.colors[0]}"/>
          <stop offset="1" stop-color="${theme.colors[1]}"/>
        </linearGradient>

        <radialGradient id="${id}-orb">
          <stop stop-color="#ffffff" stop-opacity=".95"/>
          <stop offset="1"
            stop-color="${theme.colors[2]}"
            stop-opacity=".35"/>
        </radialGradient>
      </defs>

      <rect width="240" height="300" fill="url(#${id})"/>

      <circle cx="${x}" cy="${y}" r="68"
        fill="url(#${id}-orb)"/>

      <ellipse cx="120" cy="163" rx="107" ry="37"
        fill="none" stroke="#ffffff" stroke-opacity=".65"
        stroke-width="2" transform="rotate(-25 120 163)"/>

      <path d="M-20 265Q90 125 260 235V320H-20Z"
        fill="${theme.colors[2]}" fill-opacity=".5"/>

      <circle cx="188" cy="58" r="5" fill="#ffffff"/>
      <circle cx="45" cy="76" r="3" fill="#ffffff"/>
      <circle cx="177" cy="245" r="4" fill="#ffffff"/>

      <path d="m188 116 5 12 12 5-12 5-5 12-5-12-12-5 12-5z"
        fill="#ffffff" fill-opacity=".8"/>
    </svg>
  `;
}

export function cardHTML(card) {
  const rarity = RARITIES[card.rarity] || RARITIES.commune;

  return `
    <span class="tcg ${escapeHTML(card.rarity)}">
      <span class="card-top">
        <span>NEXUS</span>
        <span>COLLECTION</span>
      </span>

      <span class="art">
        ${artwork(card)}
      </span>

      <span class="card-bottom">
        <span class="card-name">
          ${escapeHTML(card.name)}
        </span>

        <span class="card-author">
          Par ${escapeHTML(card.creator || "Toi")}
        </span>

        <span class="rarity-line">
          <span class="rarity">${rarity.label}</span>
          <span class="rarity-symbol">${rarity.symbol}</span>
        </span>
      </span>
    </span>
  `;
}
