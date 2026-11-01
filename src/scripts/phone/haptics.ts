const TAP_MS = 10;

export function haptic(): void {
  try {
    navigator.vibrate?.(TAP_MS);
  } catch {
  }
}
