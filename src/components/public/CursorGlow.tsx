'use client';

import { useEffect, useRef } from 'react';

/**
 * Soft editorial glow that follows the native mouse cursor.
 * - Single small champagne-gold radial halo, blurred, with gentle easing.
 * - Sits below the OS cursor; pointer-events: none so it never blocks clicks.
 * - On touch / coarse-pointer devices nothing renders.
 */
export function CursorGlow() {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const SIZE = 140;
    const HALF = SIZE / 2;

    let raf = 0;
    let tx = window.innerWidth * 0.5;
    let ty = window.innerHeight * 0.4;
    let cx = tx;
    let cy = ty;
    let opacity = 0;
    let targetOpacity = 1;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      targetOpacity = 1;
    };
    const onLeave = () => {
      targetOpacity = 0;
    };
    const onEnter = () => {
      targetOpacity = 1;
    };

    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      opacity += (targetOpacity - opacity) * 0.1;
      if (haloRef.current) {
        haloRef.current.style.transform = `translate3d(${cx - HALF}px, ${cy - HALF}px, 0)`;
        haloRef.current.style.opacity = String(opacity);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={haloRef}
      aria-hidden
      data-cursor-glow="halo"
      className="pointer-events-none fixed top-0 left-0 z-[70] h-[140px] w-[140px] rounded-full will-change-transform"
      style={{
        background:
          'radial-gradient(circle, rgba(245, 196, 120, 0.15) 0%, rgba(245, 179, 66, 0.07) 38%, rgba(245, 179, 66, 0.02) 60%, rgba(245, 179, 66, 0) 78%)',
        filter: 'blur(10px)',
        mixBlendMode: 'screen',
        opacity: 0,
      }}
    />
  );
}
