
import { motion } from 'framer-motion';

export const MaintenancePage = () => {
  return (
    <motion.div
      className="h-screen w-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Sitio en mantenimiento</h1>
      <p className="text-lg text-gray-600 mb-6">
        Estamos realizando tareas de mantenimiento para mejorar tu experiencia.
        <br />
        Volvé a intentarlo en unos minutos.
      </p>
      <span className="text-sm text-gray-400">Gracias por tu paciencia 🙏</span>
    </motion.div>
  );
};
