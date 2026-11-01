import { currentStoryClock } from '../../../../scripts/story-clock';
import type { Invitation, WorkOrder } from './draw';

export interface ChatLine {
  text: string;
  side: 'in' | 'out';
}

export interface BeatCopy {
  invitations: { invite: Invitation; amount: string }[];
  yapeBy: string;
  orders: WorkOrder[];
  chats: ChatLine[][];
  alfa: string[];
}

const ES: BeatCopy = {
  invitations: [
    {
      invite: { eyebrow: 'Estás invitado', title: 'Boda de Ana & Luis', when: 'Sáb 14 · 7 p. m.' },
      amount: '+S/ 50'
    },
    {
      invite: { eyebrow: 'Estás invitado', title: 'Cumple de Sofía', when: 'Dom 22 · 4 p. m.' },
      amount: '+S/ 30'
    },
    {
      invite: { eyebrow: 'Estás invitado', title: 'Baby shower de Mía', when: 'Sáb 5 · 3 p. m.' },
      amount: '+S/ 40'
    }
  ],
  yapeBy: 'aportado por Yape',
  orders: [
    { brand: 'SKYMEK · TALLER', number: 'OT #0142', job: 'Cambio de aceite', done: 'Listo ✓' },
    { brand: 'SKYMEK · TALLER', number: 'OT #0143', job: 'Alineación y balanceo', done: 'Listo ✓' },
    { brand: 'SKYMEK · TALLER', number: 'OT #0144', job: 'Pastillas de freno', done: 'Listo ✓' }
  ],
  chats: [
    [
      { text: '¿Tienen talla M?', side: 'in' },
      { text: '¡Sí! Te la separo. ¿Envío o recojo?', side: 'out' },
      { text: 'Envío, porfa 🙌', side: 'in' }
    ],
    [
      { text: '¿Hacen delivery a Surco?', side: 'in' },
      { text: 'Sí, llega mañana. El envío cuesta S/ 10.', side: 'out' },
      { text: 'Perfecto, lo pido', side: 'in' }
    ],
    [
      { text: '¿Cuánto cuesta la casaca negra?', side: 'in' },
      { text: 'S/ 129, y hoy tiene 10 % de descuento.', side: 'out' },
      { text: '¡La quiero!', side: 'in' }
    ]
  ],
  alfa: [
    '¡Hola! Soy Alfa. Atiendo tus chats 24/7.',
    'Hoy respondí 128 mensajes.',
    'Cerré 3 ventas mientras dormías.'
  ]
};

const EN: BeatCopy = {
  invitations: [
    {
      invite: { eyebrow: "You're invited", title: "Ana & Luis's wedding", when: 'Sat 14 · 7 p.m.' },
      amount: '+S/ 50'
    },
    {
      invite: { eyebrow: "You're invited", title: "Sofía's birthday", when: 'Sun 22 · 4 p.m.' },
      amount: '+S/ 30'
    },
    {
      invite: { eyebrow: "You're invited", title: "Mía's baby shower", when: 'Sat 5 · 3 p.m.' },
      amount: '+S/ 40'
    }
  ],
  yapeBy: 'sent with Yape',
  orders: [
    { brand: 'SKYMEK · GARAGE', number: 'WO #0142', job: 'Oil change', done: 'Done ✓' },
    { brand: 'SKYMEK · GARAGE', number: 'WO #0143', job: 'Wheel alignment', done: 'Done ✓' },
    { brand: 'SKYMEK · GARAGE', number: 'WO #0144', job: 'Brake pads', done: 'Done ✓' }
  ],
  chats: [
    [
      { text: 'Do you have it in M?', side: 'in' },
      { text: 'Yes! I’ll hold one. Delivery or pickup?', side: 'out' },
      { text: 'Delivery, please 🙌', side: 'in' }
    ],
    [
      { text: 'Do you deliver to Surco?', side: 'in' },
      { text: 'Yes, it arrives tomorrow. Shipping is S/ 10.', side: 'out' },
      { text: 'Perfect, ordering now', side: 'in' }
    ],
    [
      { text: 'How much is the black jacket?', side: 'in' },
      { text: 'S/ 129, and 10% off today.', side: 'out' },
      { text: 'I want it!', side: 'in' }
    ]
  ],
  alfa: [
    "Hi! I'm Alfa. I answer your chats 24/7.",
    'I answered 128 messages today.',
    'I closed 3 sales while you slept.'
  ]
};

export function beatCopy(): BeatCopy {
  return document.documentElement.lang.startsWith('en') ? EN : ES;
}

export function clockTime(offsetMinutes = 0): string {
  const match = /(\d{1,2}):(\d{2})/.exec(currentStoryClock());
  const start = match ? Number(match[1]) * 60 + Number(match[2]) : 22 * 60;
  const total = (((start + offsetMinutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
