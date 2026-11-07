import {
  CONFIG
} from "./config.js?v=5.1.0";

import {
  clone,
  freshState,
  normalizeState
} from "./state.js?v=5.1.0";

export async function createStore() {
  const listeners = new Set();

  let state;
  let persistedSeen = false;
  let queue = Promise.resolve();

  const supportsLocks =
    typeof navigator.locks?.request === "function";

  function report(error) {
    window.dispatchEvent(
      new CustomEvent("nexus:error", { detail: error })
    );
  }

  function emit() {
    for (const listener of listeners) {
      try {
        listener();
      } catch (error) {
        report(error);
      }
    }
  }

  function readLatest() {
    let current;
    let old;
    let oldest;

    try {
      current = localStorage.getItem(CONFIG.storageKey);

      if (current === null && persistedSeen) {
        throw new Error(
          "La sauvegarde V5 a été retirée dans un autre onglet. " +
          "Recharge la page avant de continuer."
        );
      }

      if (current !== null) {
        return {
          state: normalizeState(JSON.parse(current)),
          raw: current,
          persisted: true,
          source: "v5"
        };
      }

      old = localStorage.getItem(CONFIG.legacyKey);
      oldest = old === null
        ? localStorage.getItem(CONFIG.oldestKey)
        : null;
    } catch (error) {
      throw new Error(
        "Lecture de la sauvegarde impossible. " +
        "Aucune donnée n’a été remplacée. " +
        (error.message || "")
      );
    }

    const legacy = old ?? oldest;

    if (legacy !== null) {
      try {
        return {
          state: normalizeState(JSON.parse(legacy)),
          raw: null,
          persisted: false,
          source: "ancienne sauvegarde"
        };
      } catch (error) {
        throw new Error(
          "L’ancienne sauvegarde n’a pas pu être reprise. " +
          "Elle est toujours conservée. " +
          (error.message || "")
        );
      }
    }

    return {
      state: freshState(),
      raw: null,
      persisted: false,
      source: "nouvelle collection"
    };
  }

  function exclusive(operation) {
    if (supportsLocks) {
      return navigator.locks.request(
        CONFIG.storageKey + ":write",
        operation
      );
    }

    return operation();
  }

  const initial = await exclusive(readLatest);

  state = initial.state;
  persistedSeen = initial.persisted;

  function get() {
    return clone(state);
  }

  function refresh() {
    const latest = readLatest();

    state = latest.state;
    persistedSeen ||= latest.persisted;

    emit();
  }

  function update(mutator) {
    const task = queue.then(() => exclusive(() => {
      const latest = readLatest();
      const draft = clone(latest.state);

      const result = mutator(draft);

      if (result && typeof result.then === "function") {
        throw new Error(
          "Une modification de progression doit être synchrone."
        );
      }

      const next = normalizeState(draft);

      next.revision = latest.state.revision + 1;
      next.updatedAt = new Date().toISOString();

      /*
       * Le verrou protège les autres onglets V5.
       * Cette comparaison détecte aussi certains changements externes.
       */
      if (localStorage.getItem(CONFIG.storageKey) !== latest.raw) {
        throw new Error(
          "La collection a changé ailleurs. Réessaie l’action."
        );
      }

      try {
        localStorage.setItem(
          CONFIG.storageKey,
          JSON.stringify(next)
        );
      } catch {
        throw new Error(
          "Enregistrement impossible : stockage plein ou bloqué. " +
          "L’action n’a pas été appliquée. " +
          "Exporte ta sauvegarde avant toute manipulation."
        );
      }

      state = next;
      persistedSeen = true;

      emit();

      return result;
    }));

    queue = task.catch(() => {});

    return task;
  }

  function subscribe(listener) {
    listeners.add(listener);

    return () => listeners.delete(listener);
  }

  function onStorage(event) {
    if (
      event.key !== CONFIG.storageKey &&
      event.key !== null
    ) {
      return;
    }

    try {
      refresh();
    } catch (error) {
      report(error);
    }
  }

  function onVisibility() {
    if (document.visibilityState !== "visible") return;

    try {
      refresh();
    } catch (error) {
      report(error);
    }
  }

  window.addEventListener("storage", onStorage);
  document.addEventListener("visibilitychange", onVisibility);

  return {
    get,
    update,
    refresh,
    subscribe,

    source: initial.source,
    supportsLocks,

    destroy() {
      listeners.clear();
      window.removeEventListener("storage", onStorage);
      document.removeEventListener(
        "visibilitychange",
        onVisibility
      );
    }
  };
}
