'use client';

import { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  z: number;
  r: number;
  o: number;
  baseO: number;
  twinkle: number;
};

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = (canvas.width = canvas.offsetWidth * dpr);
    let h = (canvas.height = canvas.offsetHeight * dpr);
    let stars: Star[] = [];

    const init = () => {
      const count = Math.min(140, Math.floor((w * h) / (12000 * dpr)));
      stars = Array.from({ length: count }).map(() => {
        const z = Math.random();
        const baseO = 0.2 + Math.random() * 0.8;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r: (0.4 + z * 1.6) * dpr,
          o: baseO,
          baseO,
          twinkle: Math.random() * Math.PI * 2,
        };
      });
    };

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = canvas.offsetWidth * dpr;
      h = canvas.height = canvas.offsetHeight * dpr;
      init();
    };

    let mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    const onMouse = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };

    let raf = 0;
    let t0 = performance.now();
    const tick = (t: number) => {
      const dt = (t - t0) / 1000;
      t0 = t;
      mx += (tx - mx) * 0.05;
      my += (ty - my) * 0.05;

      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.twinkle += dt * (0.5 + s.z * 1.5);
        s.o = s.baseO * (0.6 + 0.4 * Math.sin(s.twinkle));

        const px = s.x + mx * 20 * s.z * dpr - (scrollY * 0.05 * s.z * dpr);
        const py = s.y + my * 20 * s.z * dpr;

        const xx = ((px % w) + w) % w;
        const yy = ((py % h) + h) % h;

        ctx.beginPath();
        ctx.arc(xx, yy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 233, 180, ${s.o})`;
        ctx.shadowColor = 'rgba(245, 179, 66, 0.6)';
        ctx.shadowBlur = 6 * s.z;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    init();
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll', onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-70"
    />
  );
}
