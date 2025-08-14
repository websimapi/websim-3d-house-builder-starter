export function initPanels(api) {
  const $ = (id) => document.getElementById(id);
  const bind = (id, fn) => $(id).addEventListener('click', fn);

  bind('btn-topdown', api.topDown);
  bind('btn-fit', api.fit);
  bind('btn-grid', api.grid);
  bind('btn-axes', api.axes);
  bind('btn-reset', api.reset);

  // Resize canvas to container via CSS size; renderer handles pixel size in main loop.
  // Also keep buttons' titles synced with shortcuts.
}

