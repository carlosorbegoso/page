export const STORY_CLOCK_EVENT = 'story:clock';
const PROPERTY = '--story-clock';

export type StoryClocks = { night: Record<string, string[]>; day: Record<string, string[]> };

export function readStoryClocks(source: HTMLElement | null): StoryClocks {
  const parsed = JSON.parse(source?.dataset.storyClocks ?? '{}') as Partial<StoryClocks>;
  return { night: parsed.night ?? {}, day: parsed.day ?? {} };
}

export function currentStoryClock(): string {
  return document.documentElement.style.getPropertyValue(PROPERTY).replaceAll('"', '');
}

export function publishStoryClock(clocks: StoryClocks, id: string, subIndex: number): void {
  const list = (document.documentElement.dataset.time === 'day' ? clocks.day : clocks.night)[id];
  const text = list?.[Math.min(Math.max(subIndex, 0), list.length - 1)];
  if (!text || text === currentStoryClock()) return;
  document.documentElement.style.setProperty(PROPERTY, `"${text}"`);
  window.dispatchEvent(new CustomEvent(STORY_CLOCK_EVENT, { detail: { text } }));
}
