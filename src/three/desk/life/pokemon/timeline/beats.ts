export const FACE_OFF = { turn: [0, 0.55], crouch: [0.35, 0.9], rear: [0.3, 1], sparks: [0.5, 1.2] } as const;

export const TAKEOFF = { dip: [1, 1.25], launch: [1.25, 2.05], flaps: 1.25 } as const;

export const FLAMETHROWER = { inhale: [2.05, 2.35], breath: [2.35, 3.4], rise: [2.35, 2.5], fade: [3.2, 3.4], follow: [2.7, 3.3] } as const;

export const QUICK_ATTACK = { hop: [2.48, 2.78], land: [2.78, 3.02], trail: [2.46, 2.98], back: [4.6, 5.3] } as const;

export const THUNDERBOLT = { charge: [3.35, 3.8], strikes: [3.8, 4.05, 4.28], end: [4.4, 4.55] } as const;

export const IMPACT = { hit: 3.83, flash: [3.83, 4.15], recoil: [3.83, 4.7], smoke: [3.95, 4.9] } as const;

export const LANDING = { descend: [4.6, 5.5], glide: 4.75, touch: [5.5, 5.85], rest: [5.45, 6] } as const;

export const VICTORY = { hops: [[5.95, 6.2], [6.3, 6.55]], ears: [5.85, 6.1], wag: [5.9, 7.4] } as const;

export const ROAR = { rear: [6.2, 7.3], puff: [6.45, 7.2] } as const;

export const RETURN = { turn: [7.5, 8.5], still: [8, 8.8] } as const;

export const BATTLE_SECONDS = 8.8;

export const CALM_SECONDS = 3.4;
