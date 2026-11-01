export function wirePrintButtons(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-print]')) {
    button.addEventListener('click', () => window.print());
  }
}
