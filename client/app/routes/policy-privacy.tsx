import type { MetaFunction } from "react-router";
import { useLoadPolicy } from "~/hooks/useLoadPolicies";


export const meta: MetaFunction = () => {
    return [
        { title: "Política de Privacidad" },
        {
            name: "description",
            content: "Conocé cómo recopilamos, usamos y protegemos tus datos",
        },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: "Política de Privacidad" },
        {
            property: "og:description",
            content: "Información clara y detallada sobre el uso de tus datos personales.",
        },
    ];
};

export default function PrivacyPolicyPage() {
    const query = useLoadPolicy("policy", "terms-policy/policy");
    const fecha = query?.createdAt ? new Date(query.createdAt) : null;

    const fechaFormateada = fecha
        ? fecha.toLocaleDateString("es-AR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : "Fecha no disponible";
    return (
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-284px)]">
            <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>

            <section className="mb-6" dangerouslySetInnerHTML={{ __html: query?.description || "" }}>
            </section>

            <p className="text-base mt-6">Última actualización: {fechaFormateada}</p>
        </div>
    );
}
