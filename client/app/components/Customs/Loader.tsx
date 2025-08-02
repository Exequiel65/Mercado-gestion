import { motion } from 'framer-motion';

interface LoaderProps {
  message?: string;
}

export function Loader({ message = 'Cargando...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
