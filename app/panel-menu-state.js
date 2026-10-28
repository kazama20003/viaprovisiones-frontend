let popupCount = 0;
const listeners = new Set();

export function subscribePopup(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isPopupOpen() { return popupCount > 0; }

export function registerPopup() {
  popupCount += 1;
  listeners.forEach(listener => listener());
  return () => {
    popupCount = Math.max(0, popupCount - 1);
    listeners.forEach(listener => listener());
  };
}

export function pinPanelMenu() {
  try { localStorage.setItem('via-menu-pinned', '1'); } catch {}
  window.dispatchEvent(new CustomEvent('via-menu-pin-change', { detail: true }));
}
