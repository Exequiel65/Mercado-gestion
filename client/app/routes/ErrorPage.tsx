// pages/ErrorPage.tsx
import { useRouteError, isRouteErrorResponse } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <div className="p-10 text-center text-red-500">Página no encontrada (404)</div>;
    }
    return <div className="p-10 text-center text-red-500">Error: {error.statusText}</div>;
  }

  return (
    <div className="p-10 text-center text-red-500">
      <h1>Ocurrió un error inesperado</h1>
      {/* <pre>{String(error)}</pre> */}
    </div>
  );
}
