interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorComponent({
  message = 'Ocurrió un error inesperado.',
  onRetry,
}: ErrorComponentProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-100 text-red-700 px-6 py-4 rounded-md shadow-md max-w-md">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p className="mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition cursor-pointer"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
