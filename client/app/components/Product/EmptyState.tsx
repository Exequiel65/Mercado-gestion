// components/EmptyState.tsx
import { SearchX  } from "lucide-react";

export default function EmptyState({ 
  message = "No se encontraron productos",
  description = "Intenta ajustando tus filtros de búsqueda"
}: {
  message?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
      <p className="text-gray-500 max-w-md">{description}</p>
    </div>
  );
}