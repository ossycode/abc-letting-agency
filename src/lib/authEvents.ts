let isFiring = false;

export const authEvents = {
  emitUnauthorized() {
    if (typeof window === "undefined") return;
    if (isFiring) return;
    isFiring = true;
    window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    // let next ticks fire again (1 frame is plenty)
    requestAnimationFrame(() => {
      isFiring = false;
    });
  },
  onUnauthorized(cb: () => void) {
    const handler = () => cb();
    if (typeof window !== "undefined") {
      window.addEventListener("auth:unauthorized", handler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth:unauthorized", handler);
      }
    };
  },
};
