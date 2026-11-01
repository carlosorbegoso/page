const served = new WeakSet<Request>();

/** True the first time it is called for a page render, so per-page markup (the arming script) is emitted once. */
export function firstInRequest(request: Request): boolean {
  if (served.has(request)) return false;
  served.add(request);
  return true;
}
