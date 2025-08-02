// src/components/AppLoading.tsx
import { motion } from 'framer-motion';

export const AppLoading = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-4 bg-white text-gray-700">
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: 'linear',
        }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg font-medium"
      >
        Cargando...
      </motion.p>
    </div>
  );
};
