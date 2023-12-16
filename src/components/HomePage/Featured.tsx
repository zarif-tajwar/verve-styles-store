'use client';

import { animate, motion, Variants } from 'framer-motion';
import { Button } from '../UI/Button';

const Featured = () => {
  return (
    <section>
      <div className="container-main mt-3 divide-y divide-black/10">
        <FeaturedItem title="New Arrivals" />
        <FeaturedItem title="Top Selling" />
      </div>
    </section>
  );
};

const MotionVariantsParent: Variants = {
  initial: {},
  reveal: { transition: { staggerChildren: 0.15 } },
};

const MotionVariantsItem: Variants = {
  initial: {
    y: 100,
    opacity: 0,
  },
  reveal: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: 'spring',
      bounce: 0.5,
      damping: 10,
    },
  },
};

const FeaturedItem = ({ title }: { title: string }) => {
  return (
    <div className="py-16 text-center">
      <h2 className="mb-14 font-integral-cf text-5xl font-bold uppercase">
        {title}
      </h2>
      <motion.div
        className="mb-9 grid grid-cols-4 gap-5"
        variants={MotionVariantsParent}
        initial={'initial'}
        whileInView={'reveal'}
        viewport={{ once: true, amount: 0.8 }}
      >
        <motion.div
          className="aspect-square rounded-2xl bg-offwhite"
          variants={MotionVariantsItem}
          // whileInView={'reveal'}
          // initial={'initial'}
          // viewport={{ once: true, amount: 0.5 }}
        >
          1
        </motion.div>
        <motion.div
          className="aspect-square rounded-2xl bg-offwhite"
          variants={MotionVariantsItem}
          // whileInView={'reveal'}
          // initial={'initial'}
          // viewport={{ once: true, amount: 0.5 }}
        >
          2
        </motion.div>
        <motion.div
          className="aspect-square rounded-2xl bg-offwhite"
          variants={MotionVariantsItem}
          // whileInView={'reveal'}
          // initial={'initial'}
          // viewport={{ once: true, amount: 0.5 }}
        >
          3
        </motion.div>
        <motion.div
          className="aspect-square rounded-2xl bg-offwhite"
          variants={MotionVariantsItem}
          // whileInView={'reveal'}
          // initial={'initial'}
          // viewport={{ once: true, amount: 0.5 }}
        >
          4
        </motion.div>
      </motion.div>
      <Button variant={'outline'} size={'xl'}>
        View All
      </Button>
    </div>
  );
};

export default Featured;
