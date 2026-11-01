export const html = document.documentElement;
export const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
export const allowed = () => !reducedQuery.matches && html.dataset.motion !== 'paused';
export const is3d = () => html.classList.contains('is-3d');
