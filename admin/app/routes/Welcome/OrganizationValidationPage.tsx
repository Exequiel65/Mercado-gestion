import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { get } from "~/services/apiService";

const fields = [
  { label: "Organización", key: "business" },
  { label: "Dominio", key: "domain" },
  { label: "Sucursal", key: "store" },
  { label: "Usuario", key: "user" }
];

interface IValidationData 
{
  isValid: boolean;
  domain: boolean;
}

export default function OrganizationValidationPage() {
  const [status, setStatus] = useState<Record<string, "pending" | "success" | "error">>(
    Object.fromEntries(fields.map((f) => [f.key, "pending"]))
  );

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await get<IValidationData>({ path: "business/validate", token: sessionStorage.getItem("token") });
        if (!res.success || !res.data) {
          throw new Error("Validation failed");
        }
        const data = {
          business: true,
          domain: true,
          store: true,
          user: true
        };

        const updatedStatus: Record<string, "pending" | "success" | "error"> = {};

        fields.forEach((field) => {
          updatedStatus[field.key] = data ? "success" : "error";
        });

        setStatus(updatedStatus);

        const allValid = Object.values(updatedStatus).every((s) => s === "success");
        if (allValid) {
          setTimeout(() => {
            window.location.href = import.meta.env.DEV ? `http://${res.data.domain}:${import.meta.env.VITE_PORT}/admin` : `http://${res.data.domain}/admin` ;
          }, 1500);
        }
      } catch (error: any) {

        const errorMap: Record<string, string> = {
          BUSINESS_NOT_FOUND: "business",
          DOMAIN_NOT_FOUND: "domain",
          STORE_NOT_FOUND: "store",
          ENTITY_NOT_FOUND: "user"
        };

        let errorField: string | undefined;
        if (error?.response?.data?.data && typeof error.response.data.data === "string") {
          errorField = errorMap[error.response.data.data];
        }

        const updatedStatus: Record<string, "pending" | "success" | "error"> = {};
        fields.forEach((field) => {
          if (field.key === errorField) {
            updatedStatus[field.key] = "error";
          } else {
            updatedStatus[field.key] = "pending";
          }
        });

        setStatus(updatedStatus);
      }
    };

    validate();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Validando organización</h2>
            <p className="text-sm text-muted-foreground">
              Estamos comprobando que todos los datos estén correctos...
            </p>
          </div>

          <ul className="space-y-3">
            {fields.map((field) => (
              <li key={field.key} className="flex items-center justify-between">
                <span>{field.label}</span>
                {status[field.key] === "pending" && <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />}
                {status[field.key] === "success" && <CheckCircle2 className="text-green-500 h-5 w-5" />}
                {status[field.key] === "error" && <XCircle className="text-red-500 h-5 w-5" />}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
