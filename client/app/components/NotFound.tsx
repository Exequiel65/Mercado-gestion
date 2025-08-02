import { AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { ButtonComponent } from "./Customs/ButtonComponent";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      <AlertTriangle size={80} className="text-red-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">Página No Encontrada</h2>
      <p className="text-gray-500 mt-2">
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>
      <Link to="/">
        <ButtonComponent >
          Volver al inicio
        </ButtonComponent>
      </Link>
    </div>
  );
}