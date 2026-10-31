import type { Stage } from './Stage';
import { STATIONS, stationElement } from './sections';

/**
 * Bridges scroll to the camera path with GSAP ScrollTrigger (only inside the 3D chunk).
 * Each section contributes the move from the previous station while its top travels from the
 * bottom to the top of the viewport; while a tall section stays on screen the camera holds.
 * Without scrub (reduced motion or pause) the Stage jumps between stations with a fade.
 */
export async function setupScroll(stage: Stage): Promise<() => void> {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const progress = STATIONS.map(() => ({ value: 0 }));
  let tweens: gsap.core.Tween[] = [];

  const publish = () => {
    let station = 0;
    progress.forEach((p, index) => {
      if (index > 0 && p.value > 0) station = Math.max(station, index - 1 + p.value);
    });
    stage.setStation(station);
  };

  const build = () => {
    for (const tween of tweens) tween.kill();
    tweens = [];
    if (!stage.scrubAllowed) return;
    STATIONS.forEach((id, index) => {
      const el = stationElement(id);
      if (index === 0 || !el) return;
      tweens.push(
        gsap.to(progress[index]!, {
          value: 1,
          ease: 'none',
          onUpdate: publish,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 15%', scrub: 0.8 }
        })
      );
    });
    ScrollTrigger.refresh();
    publish();
  };

  build();
  const offMotion = stage.onMotionChange(() => build());
  let refreshTimer: ReturnType<typeof setTimeout> | undefined;
  const offLayout = stage.onLayoutChange(() => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 100);
  });
  return () => {
    offMotion();
    offLayout();
    clearTimeout(refreshTimer);
    for (const tween of tweens) tween.kill();
  };
}
