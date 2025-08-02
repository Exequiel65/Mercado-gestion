import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullscreen?: boolean;
}

export default function Loading({ message = "Cargando...", fullscreen = true }: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${
        fullscreen ? "h-screen w-full" : "h-auto py-10"
      }`}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
