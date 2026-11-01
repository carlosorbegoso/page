export type NotFoundQuality = 'mid' | 'high';

export interface NotFoundOptions {
  container: HTMLElement;
  /** Label printed on the sheet, e.g. "No encontrado · Not found". */
  paperLabel: string;
  quality: NotFoundQuality;
}

/** Uniforms the frame loop advances every frame. */
export interface TimedUniform {
  uTime: { value: number };
}
