import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect, useState, useRef } from 'react';

const clamp = value => Math.max(0, Math.min(1, value));

export function useScrollFlow(root, blocked) {
  const smoothScroll = useRef(null);
  const stageRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const heightQuery = window.matchMedia('(max-height: 600px), (max-width: 760px) and (max-height: 760px)');
    const updateReduced = () => setReduced(query.matches);
    let width = window.innerWidth;
    const updateLayout = () => setCompact(heightQuery.matches);
    const resize = () => {
      // Mobile address-bar changes alter height while scrolling; keep the layout choice stable.
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      updateLayout();
    };
    updateReduced();
    updateLayout();
    query.addEventListener('change', updateReduced);
    window.addEventListener('resize', resize);
    return () => { query.removeEventListener('change', updateReduced); window.removeEventListener('resize', resize); };
  }, []);

  const enabled = !reduced && !compact;
  useEffect(() => {
    const main = root.current;
    if (!main || !enabled) return;
    const hero = main.querySelector('.hero');
    const heroFlow = main.querySelector('.hero-flow');
    const journey = main.querySelector('.process-flow');
    const scene = main.querySelector('.process');
    const reveals = [...main.querySelectorAll('.service, .clarity-inner')].map(element => ({element, top:0, y:0, progress:-1}));
    // One frame clock drives both scrolling and transforms, preserving fractional scroll positions.
    const lenis = new Lenis({ autoRaf:false, lerp:.085, smoothWheel:true, syncTouch:false,
      anchors:{offset:-102}, prevent:node => !!node.closest('dialog, .chat-panel') });
    smoothScroll.current = lenis;
    let frame=0, dirty=true, disposed=false, metrics, heroValue=0, lastHero=-1, lastTime=0;
    const invalidate = () => { dirty=true; };
    const measure = () => {
      const y=window.scrollY;
      const heroRect=heroFlow.getBoundingClientRect();
      const journeyRect=journey.getBoundingClientRect();
      const headerHeight=document.querySelector('header').getBoundingClientRect().height;
      // Use the stable sticky scene height instead of the changing mobile browser toolbar height.
      metrics={header:headerHeight, heroTop:heroRect.top+y,
        heroTravel:Math.max(1,heroRect.height-hero.getBoundingClientRect().height),
        journeyTop:journeyRect.top+y,
        journeyTravel:Math.max(1,journeyRect.height-scene.getBoundingClientRect().height),
        viewport:hero.getBoundingClientRect().height+headerHeight, mobile:window.innerWidth<=760};
      // Remove our own translation from measurements so reveals cannot feed back into themselves.
      for (const item of reveals) item.top=item.element.getBoundingClientRect().top+y-item.y;
      dirty=false;
    };
    const tick = time => {
      lenis.raf(time);
      if (dirty) measure();
      const y=lenis.animatedScroll;
      const target=clamp((y-metrics.heroTop+metrics.header)/metrics.heroTravel);
      const dt=lastTime ? Math.min(64,time-lastTime) : 16.7;
      lastTime=time;
      heroValue+=(target-heroValue)*(1-Math.exp(-dt/65));
      if (Math.abs(heroValue-target)<.0001) heroValue=target;
      if (Math.abs(heroValue-lastHero)>.00001) {
        hero.style.setProperty('--hero-scale',1+heroValue*(metrics.mobile ? .045 : .08));
        hero.style.setProperty('--hero-copy-depth',`${heroValue*-28}px`);
        lastHero=heroValue;
      }
      const progress=clamp((y-metrics.journeyTop+metrics.header)/metrics.journeyTravel);
      const nextStage=Math.min(3,Math.floor(progress*4));
      const current=stageRef.current;
      // A small boundary margin prevents repeated caption changes around a stage threshold.
      if (nextStage!==current && (nextStage>current ? progress>(current+1)/4+.008 : progress<current/4-.008)) {
        stageRef.current=nextStage;
        setStage(nextStage);
      }
      for (const item of reveals) {
        const entrance=clamp((metrics.viewport-(item.top-y))/(metrics.viewport*.32));
        if (Math.abs(entrance-item.progress)<.0001) continue;
        item.y=(1-entrance)*18;
        item.element.style.setProperty('--entrance',entrance);
        item.element.style.setProperty('--reveal-y',`${item.y}px`);
        item.progress=entrance;
      }
      frame=requestAnimationFrame(tick);
    };
    const observer=new ResizeObserver(invalidate);
    observer.observe(main);
    window.addEventListener('resize',invalidate);
    document.fonts.ready.then(()=>{if(!disposed)invalidate();});
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      lastTime=0;
      if (!document.hidden) {dirty=true;frame=requestAnimationFrame(tick);}
    };
    document.addEventListener('visibilitychange',onVisibility);
    frame=requestAnimationFrame(tick);
    return () => {
      disposed=true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize',invalidate);
      document.removeEventListener('visibilitychange',onVisibility);
      lenis.destroy();
      smoothScroll.current=null;
      for (const element of [hero,...reveals.map(item=>item.element)]) element.removeAttribute('style');
    };
  }, [root,enabled]);
  useEffect(() => {
    if (blocked) smoothScroll.current?.stop();
    else smoothScroll.current?.start();
  }, [blocked,enabled]);
  const goToStage = index => {
    stageRef.current=index;
    setStage(index);
    const journey=root.current.querySelector('.process-flow');
    if (!enabled) return;
    const header=document.querySelector('header').getBoundingClientRect().height;
    const travel=journey.offsetHeight-journey.querySelector('.process').offsetHeight;
    const top=journey.getBoundingClientRect().top+window.scrollY-header;
    const target=top+travel*((index+.4)/4);
    if (smoothScroll.current) smoothScroll.current.scrollTo(target);
    else window.scrollTo({top:target,behavior:'smooth'});
  };
  return {stage,enabled,goToStage};
}
