const RELEASE = "5.1.0";
const ROOT = new URL("./", import.meta.url);

function moduleURL(path) {
  const url = new URL(path, ROOT);

  url.searchParams.set("v", RELEASE);

  return url.href;
}

function report(error) {
  if (typeof window.reportNexusError === "function") {
    window.reportNexusError(error);
    return;
  }

  console.error(error);

  const app = document.getElementById("app");

  if (app) {
    app.textContent =
      "Nexus n’a pas pu démarrer : " +
      (error?.message || String(error));
  }
}

async function start() {
  const [
    configModule,
    storageModule,
    shellModule
  ] = await Promise.all([
    import(moduleURL("js/core/config.js")),
    import(moduleURL("js/core/storage.js")),
    import(moduleURL("js/ui/shell.js"))
  ]);

  const page = document.body.dataset.page || "accueil";
  const route = configModule.PAGES[page];

  if (!route || !route.ready) {
    throw new Error(
      "La page demandée n’est pas disponible dans ce lot."
    );
  }

  const store = await storageModule.createStore();

  shellModule.mountShell({
    store,
    page
  });

  const pageModule = await import(moduleURL(route.module));

  if (typeof pageModule.mount !== "function") {
    throw new Error(
      "Le module de la page ne fournit pas de fonction mount()."
    );
  }

  await pageModule.mount({
    root: document.getElementById("content"),
    store
  });

  window.dispatchEvent(
    new CustomEvent("nexus:ready", {
      detail: {
        page,
        release: RELEASE
      }
    })
  );
}

window.addEventListener("nexus:error", event => {
  report(event.detail);
});

start().catch(report);
