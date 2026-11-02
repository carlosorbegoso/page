import { BoxGeometry, CylinderGeometry, SphereGeometry, TorusGeometry } from 'three';
import type { Finish, PartBuilder } from '../builder';
import { ROOM } from '../layout';
import type { Palette, Quality } from '../props';
import { seg, shade } from '../props/geometry';
import { CEILING_LIGHT, CORNICE } from './layout';

function buildFixture(b: PartBuilder, p: Palette, q: Quality): void {
  const { x, z, radius } = CEILING_LIGHT;
  const ceiling = ROOM.height;
  const glass: Finish = { color: shade(p.ceramic, 0.6).color, roughness: 0.6, metalness: 0, emissive: 0.03 };
  b.add(new CylinderGeometry(0.09, 0.1, 0.025, seg(24, q, 12)), shade(p.ceramic, 0.85), { position: [x, ceiling - 0.0125, z] });
  b.add(new CylinderGeometry(radius + 0.01, radius + 0.01, 0.02, seg(32, q, 16)), p.brass, { position: [x, ceiling - 0.035, z] });
  const dome = new SphereGeometry(radius, seg(32, q, 16), seg(10, q, 5), 0, Math.PI * 2, Math.PI / 2, Math.PI / 2).scale(1, 0.55, 1);
  b.add(dome, glass, { position: [x, ceiling - 0.045, z] });
  b.add(new TorusGeometry(radius + 0.01, 0.006, 6, seg(32, q, 16)), p.brass, { position: [x, ceiling - 0.045, z], rotation: [Math.PI / 2, 0, 0] });
}

function buildCornice(b: PartBuilder, trim: Finish): void {
  const s = CORNICE.size;
  const y = ROOM.height - s / 2;
  const width = ROOM.right - ROOM.left;
  const depth = ROOM.front - ROOM.back;
  const midX = (ROOM.left + ROOM.right) / 2;
  const midZ = (ROOM.back + ROOM.front) / 2;
  b.add(new BoxGeometry(width, s, s), trim, { position: [midX, y, ROOM.back + s / 2] });
  b.add(new BoxGeometry(width, s, s), trim, { position: [midX, y, ROOM.front - s / 2] });
  b.add(new BoxGeometry(s, s, depth - 2 * s), trim, { position: [ROOM.left + s / 2, y, midZ] });
  b.add(new BoxGeometry(s, s, depth - 2 * s), trim, { position: [ROOM.right - s / 2, y, midZ] });
}

function buildPlaster(b: PartBuilder, p: Palette): void {
  const plaster: Finish = { color: shade(p.ceramic, 0.16, -0.25).color, roughness: 0.95, metalness: 0 };
  const width = ROOM.right - ROOM.left;
  const depth = ROOM.front - ROOM.back;
  b.add(new BoxGeometry(width, 0.004, depth), plaster, {
    position: [(ROOM.left + ROOM.right) / 2, ROOM.height - 0.004, (ROOM.back + ROOM.front) / 2]
  });
}

export function buildCeiling(b: PartBuilder, p: Palette, q: Quality): void {
  buildPlaster(b, p);
  buildFixture(b, p, q);
  buildCornice(b, shade(p.wall, 1.3));
}
