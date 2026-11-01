import { Vector3 } from 'three';
import { DESK, PLINTH, type FigureId } from '../../layout';
import { beatCopy, clockTime } from './copy';
import { bubbleHeight, drawBubble, drawInvitation, drawSpeech, drawTicket, drawYape } from './draw';
import { floatUp, popIn, stackedBubble, ticketDrop, type BeatPlace } from './paths';
import type { BeatCanvas, BeatSize } from './plane';

export type BeatToy = FigureId | 'mug';

export type BeatSound = 'invite' | 'yape' | 'ticket' | 'message';

export interface BeatSpec {
  at: number;
  until: number;
  size: BeatSize;
  paper: boolean;
  face: 'camera' | 'yaw';
  sound?: BeatSound;
  draw(canvas: BeatCanvas): void;
  place: BeatPlace;
}

export interface BeatScript {
  busy: number;
  beats: BeatSpec[];
}

const BUBBLE_WIDTH = 0.074;
const BUBBLE_GAP = 0.004;
const CHAT_TIMES = [0.9, 1.7, 2.5] as const;

const pick = <T>(list: readonly T[], variant: number): T => list[variant % list.length]!;

function giftScript(variant: number): BeatScript {
  const copy = beatCopy();
  const { invite, amount } = pick(copy.invitations, variant);
  return {
    busy: 2,
    beats: [
      {
        at: 0.32,
        until: 4,
        size: { width: 0.062, height: 0.042 },
        paper: false,
        face: 'camera',
        sound: 'invite',
        draw: canvas => drawInvitation(canvas, invite),
        place: floatUp(new Vector3(0, -0.012, 0.004), new Vector3(0.062, 0.014, 0.016), 0.85)
      },
      {
        at: 1,
        until: 4,
        size: { width: 0.092, height: 0.017 },
        paper: false,
        face: 'camera',
        sound: 'yape',
        draw: canvas => drawYape(canvas, amount, copy.yapeBy),
        place: popIn(new Vector3(0.072, -0.024, 0.02))
      }
    ]
  };
}

function wrenchScript(variant: number, anchor: Vector3): BeatScript {
  const order = pick(beatCopy().orders, variant);
  const floor = new Vector3(
    -0.012,
    DESK.top + 0.0008 - anchor.y,
    PLINTH.centre.z + PLINTH.depth / 2 + 0.05 - anchor.z
  );
  return {
    busy: 2.4,
    beats: [
      {
        at: 1,
        until: 3.9,
        size: { width: 0.034, height: 0.05 },
        paper: true,
        face: 'yaw',
        sound: 'ticket',
        draw: canvas => drawTicket(canvas, order),
        place: ticketDrop(new Vector3(0.002, -0.03, 0.02), 0.052, floor)
      }
    ]
  };
}

function chatScript(variant: number): BeatScript {
  const lines = pick(beatCopy().chats, variant);
  const heights = lines.map(line => bubbleHeight(line.text, BUBBLE_WIDTH));
  const beats = lines.map((line, index): BeatSpec => {
    const at = CHAT_TIMES[index] ?? 0;
    const later = lines.slice(index + 1).map((_, offset) => ({
      at: CHAT_TIMES[index + 1 + offset] ?? 0,
      height: heights[index + 1 + offset] ?? 0
    }));
    const x = line.side === 'out' ? 0.014 : -0.014;
    const time = clockTime(index === 0 ? -1 : 0);
    return {
      at,
      until: 4.9,
      size: { width: BUBBLE_WIDTH, height: heights[index] ?? 0.014 },
      paper: false,
      face: 'camera',
      sound: 'message',
      draw: canvas => drawBubble(canvas, line.text, line.side, time),
      place: stackedBubble(new Vector3(x, 0.02, 0.012), at, later, BUBBLE_GAP)
    };
  });
  return { busy: 2.7, beats };
}

function alfaScript(variant: number): BeatScript {
  const text = pick(beatCopy().alfa, variant);
  return {
    busy: 1.6,
    beats: [
      {
        at: 0.25,
        until: 3.6,
        size: { width: 0.078, height: 0.032 },
        paper: false,
        face: 'camera',
        sound: 'message',
        draw: canvas => drawSpeech(canvas, text),
        place: popIn(new Vector3(0.026, 0.016, 0.012))
      }
    ]
  };
}

export function scriptFor(toy: BeatToy, variant: number, anchor: Vector3): BeatScript | null {
  if (toy === 'parati') return giftScript(variant);
  if (toy === 'skymek') return wrenchScript(variant, anchor);
  if (toy === 'ventixs') return chatScript(variant);
  if (toy === 'alfa') return alfaScript(variant);
  return null;
}
