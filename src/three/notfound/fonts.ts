export async function fontsReady(): Promise<void> {
  const loads = Promise.all([
    document.fonts.load('700 320px Geist'),
    document.fonts.load('500 40px "Geist Mono"')
  ]).then(() => undefined);
  await Promise.race([loads, new Promise(resolve => setTimeout(resolve, 1500))]).catch(() => undefined);
}
