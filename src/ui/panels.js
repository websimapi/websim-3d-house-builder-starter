export function initPanels(api) {
  const $ = (id) => document.getElementById(id);
  const bind = (id, fn) => $(id).addEventListener('click', fn);

  bind('btn-topdown', api.topDown);
  bind('btn-fit', api.fit);
  bind('btn-grid', api.grid);
  bind('btn-axes', api.axes);
  bind('btn-reset', api.reset);

  // Room size controls
  const widthEl = $('input-width');
  const depthEl = $('input-depth');
  const applyBtn = $('btn-apply-size');

  // Initialize fields with current room size
  const initSize = api.getRoomSize?.();
  if (initSize) {
    widthEl.value = initSize.width;
    depthEl.value = initSize.depth;
  }

  function applySize() {
    const w = parseFloat(widthEl.value);
    const d = parseFloat(depthEl.value);
    if (Number.isFinite(w) && Number.isFinite(d)) {
      api.setRoomSize?.({ width: w, depth: d });
    }
  }

  applyBtn.addEventListener('click', applySize);

  // Allow pressing Enter in either field to apply
  [widthEl, depthEl].forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') applySize();
    });
  });

  // Resize canvas to container via CSS size; renderer handles pixel size in main loop.
  // Also keep buttons' titles synced with shortcuts.
}