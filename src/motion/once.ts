const served = new WeakSet<Request>();

export function firstInRequest(request: Request): boolean {
  if (served.has(request)) return false;
  served.add(request);
  return true;
}
