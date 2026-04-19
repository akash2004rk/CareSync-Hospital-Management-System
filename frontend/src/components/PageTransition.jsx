import { motion } from 'framer-motion';

// No blur — just a clean fade + tiny slide up.
// Blur triggers GPU re-compositing and causes visible blink between routes.
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  in:      { opacity: 1, y: 0  },
  out:     { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.22,
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
