'use client';

import { motion, useScroll, useTransform } from 'framer-motion';

export function AmbientOrbs() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);
  const rot = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(245,179,66,0.06) 0%, rgba(245,179,66,0.01) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: y2, rotate: rot }}
        className="absolute top-[40vh] -right-40 h-[520px] w-[520px] rounded-full"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(140,90,210,0.08) 0%, rgba(140,90,210,0.02) 40%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: y3 }}
        className="absolute top-[120vh] left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(245,179,66,0.06) 0%, rgba(245,179,66,0.01) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </motion.div>
    </div>
  );
}
