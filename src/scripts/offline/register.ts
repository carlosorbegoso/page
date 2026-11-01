const REGISTER_AFTER_LOAD_MS = 4000;

export function registerOfflineCache(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator) || new URLSearchParams(location.search).has('capture')) return;
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  const register = () => {
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(error => console.warn('[offline] service worker not registered', error));
  };
  const later = () => window.setTimeout(register, REGISTER_AFTER_LOAD_MS);
  if (document.readyState === 'complete') later();
  else window.addEventListener('load', later, { once: true });
}
