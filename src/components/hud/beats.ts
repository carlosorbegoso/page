export type Beats = Record<string, string[]>;

export function readBeats(chapter: HTMLElement | null): { night: Beats; day: Beats } {
  return {
    night: JSON.parse(chapter?.dataset.storyBeats ?? '{}') as Beats,
    day: JSON.parse(chapter?.dataset.storyBeatsDay ?? '{}') as Beats
  };
}

export function beatFor(beats: { night: Beats; day: Beats }, id: string): string[] | undefined {
  return (document.documentElement.dataset.time === 'day' ? beats.day : beats.night)[id];
}
