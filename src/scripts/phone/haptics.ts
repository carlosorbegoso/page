const TAP_MS = 10;

export function haptic(): void {
  try {
    navigator.vibrate?.(TAP_MS);
  } catch {
    /* Some browsers throw instead of ignoring vibrate outside a user gesture. */
  }
}
