/** Light tick on supported devices (Android/Chrome); a silent no-op elsewhere, including iOS. */
export function haptic(ms = 8) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(ms)
  }
}
