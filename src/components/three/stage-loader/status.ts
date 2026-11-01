/** The text row under the loader: clock that runs towards the story's start time, label and percent. */
export class LoaderStatus {
  readonly label: HTMLElement;
  private readonly clock: HTMLElement;
  private readonly percent: HTMLElement;

  constructor(readonly element: HTMLElement) {
    this.label = element.querySelector<HTMLElement>('[role="status"]')!;
    this.clock = element.querySelector<HTMLElement>('[data-stage-clock]')!;
    this.percent = element.querySelector<HTMLElement>('[data-stage-percent]')!;
  }

  write(shown: number, day: boolean): void {
    const minutes = 48 + Math.round(12 * shown);
    this.clock.textContent = minutes >= 60 ? (day ? '10:00' : '23:00') : `${day ? '09' : '22'}:${minutes}`;
    this.percent.textContent = `${Math.round(shown * 100)}%`;
  }
}
