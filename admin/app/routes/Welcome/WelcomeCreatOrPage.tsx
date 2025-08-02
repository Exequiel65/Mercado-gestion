import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";


export default function WelcomeCreateOrgPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted">
      <div className="max-w-xl w-full space-y-6 bg-white rounded-2xl shadow-xl p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Bienvenido a TuApp</h1>
          <p className="text-muted-foreground">
            Estás a punto de crear tu espacio personalizado. Aquí vas a poder gestionar tu tienda, productos y mucho más.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Button size="lg" className="w-full" onClick={() => navigate("/register")}>
            Comenzar configuración
          </Button>
        </div>
      </div>
    </div>
  );
}
