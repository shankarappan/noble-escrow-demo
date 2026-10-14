import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect, useState, useRef } from 'react';

const clamp = value => Math.max(0, Math.min(1, value));

export function useScrollFlow(root, blocked) {
  const smoothScroll = useRef(null);
  const [stage, setStage] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const heightQuery = window.matchMedia('(max-height: 600px), (max-width: 760px) and (max-height: 760px)');
    const update = () => { setReduced(query.matches); setCompact(heightQuery.matches); };
    update();
    query.addEventListener('change', update);
    heightQuery.addEventListener('change', update);
    return () => { query.removeEventListener('change', update); heightQuery.removeEventListener('change', update); };
  }, []);

  const enabled = !reduced && !compact;
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ autoRaf: true, lerp: .095, smoothWheel: true, syncTouch: false,
      anchors: { offset: -102 }, prevent: node => !!node.closest('dialog, .chat-panel') });
    smoothScroll.current = lenis;
    return () => { lenis.destroy(); smoothScroll.current = null; };
  }, [enabled]);
  useEffect(() => {
    if (blocked) smoothScroll.current?.stop();
    else smoothScroll.current?.start();
  }, [blocked, enabled]);
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
      const heroFlow = main.querySelector('.hero-flow').getBoundingClientRect();
      const heroProgress = clamp((98 - heroFlow.top) / Math.max(1, heroFlow.height - height + 98));
      hero.style.setProperty('--hero-scale', 1 + heroProgress * (mobile ? .045 : .08));
      hero.style.setProperty('--hero-copy-depth', `${heroProgress * -36}px`);
      hero.style.setProperty('--hero-copy-scale', 1 - heroProgress * .035);
      const rect = journey.getBoundingClientRect();
      const progress = clamp((100 - rect.top) / Math.max(1, rect.height - height + 100));
      const nextStage = Math.min(3, Math.floor(progress * 4));
      setStage(previous => previous === nextStage ? previous : nextStage);
      journey.style.setProperty('--journey-progress', progress);
      for (const element of reveals) {
        const box = element.getBoundingClientRect();
        const entrance = clamp((height - box.top) / (height * .32));
        element.style.setProperty('--entrance', entrance);
        element.style.setProperty('--reveal-y', `${(1 - entrance) * 18}px`);
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
    const target = top + travel * ((index + .4) / 4);
    if (smoothScroll.current) smoothScroll.current.scrollTo(target);
    else window.scrollTo({ top: target, behavior: 'smooth' });
  };
  return { stage, enabled, goToStage };
}
