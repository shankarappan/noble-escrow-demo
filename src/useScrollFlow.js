import { useEffect, useState } from 'react';

const clamp = value => Math.max(0, Math.min(1, value));

export function useScrollFlow(root, paused) {
  const [stage, setStage] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const heightQuery = window.matchMedia('(max-height: 700px)');
    const update = () => { setReduced(query.matches); setCompact(heightQuery.matches); };
    update();
    query.addEventListener('change', update);
    heightQuery.addEventListener('change', update);
    return () => { query.removeEventListener('change', update); heightQuery.removeEventListener('change', update); };
  }, []);

  const enabled = !paused && !reduced && !compact;
  useEffect(() => {
    const main = root.current;
    if (!main || !enabled) return;
    const hero = main.querySelector('.hero');
    const journey = main.querySelector('.process-flow');
    const reveals = [...main.querySelectorAll('.service, .clarity-inner')];
    let frame = 0;
    const paint = () => {
      frame = 0;
      const height = window.innerHeight;
      const mobile = window.innerWidth <= 760;
      const heroRect = hero.getBoundingClientRect();
      const heroProgress = clamp(-heroRect.top / heroRect.height);
      hero.style.setProperty('--hero-depth', `${heroProgress * (mobile ? 55 : 160)}px`);
      hero.style.setProperty('--hero-copy-depth', `${heroProgress * -65}px`);
      const rect = journey.getBoundingClientRect();
      const progress = clamp((100 - rect.top) / Math.max(1, rect.height - height + 100));
      const nextStage = Math.min(3, Math.floor(progress * 4));
      setStage(previous => previous === nextStage ? previous : nextStage);
      journey.style.setProperty('--journey-progress', progress);
      journey.style.setProperty('--journey-rotate', `${(progress - .5) * (mobile ? 9 : 22)}deg`);
      journey.style.setProperty('--journey-lift', `${Math.sin(progress * Math.PI) * -35}px`);
      for (const element of reveals) {
        const box = element.getBoundingClientRect();
        const entrance = clamp((height - box.top) / (height * .32));
        element.style.setProperty('--entrance', entrance);
        element.style.setProperty('--reveal-y', `${(1 - entrance) * 55}px`);
        element.style.setProperty('--reveal-rotate', `${(1 - entrance) * 9}deg`);
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      for (const element of [hero, journey, ...reveals]) element.removeAttribute('style');
    };
  }, [root, enabled]);
  const goToStage = index => {
    setStage(index);
    const journey = root.current.querySelector('.process-flow');
    if (!enabled) return;
    const travel = journey.offsetHeight - window.innerHeight + 100;
    const top = journey.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: top + travel * ((index + .4) / 4), behavior: 'smooth' });
  };
  return { stage, enabled, goToStage };
}
