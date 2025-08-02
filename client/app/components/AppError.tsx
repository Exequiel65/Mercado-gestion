// src/components/AppError.tsx
import { motion } from 'framer-motion';

interface AppErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const AppError = ({ message = "Ocurrió un error al cargar.", onRetry }: AppErrorProps) => {
  return (
    <motion.div
      className="h-screen w-screen flex flex-col justify-center items-center text-center px-4 bg-white text-red-600"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold mb-2">¡Ups!</h2>
      <p className="mb-4">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Reintentar
        </button>
      )}
    </motion.div>
  );
};
