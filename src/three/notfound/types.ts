export type NotFoundQuality = 'mid' | 'high';

export interface NotFoundOptions {
  container: HTMLElement;
  paperLabel: string;
  quality: NotFoundQuality;
}

export interface TimedUniform {
  uTime: { value: number };
}
