function clockText(lang: string): string {
  const parts = new Intl.DateTimeFormat(lang, { hour: 'numeric', minute: '2-digit' }).formatToParts(
    new Date()
  );
  return parts
    .filter(
      part =>
        part.type === 'hour' ||
        part.type === 'minute' ||
        (part.type === 'literal' && part.value.trim() === ':')
    )
    .map(part => part.value.trim())
    .join('');
}

export function createClock(el: HTMLElement | null) {
  let timer: number | undefined;
  let running = false;

  function tick(): void {
    window.clearTimeout(timer);
    if (!el || !running || document.visibilityState === 'hidden') return;
    el.textContent = clockText(document.documentElement.lang || navigator.language);
    const now = new Date();
    timer = window.setTimeout(tick, (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50);
  }

  document.addEventListener('visibilitychange', tick);

  return {
    start(): void {
      running = true;
      tick();
    },
    stop(): void {
      running = false;
      window.clearTimeout(timer);
    }
  };
}
