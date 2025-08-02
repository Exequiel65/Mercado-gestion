import { type MetaFunction } from "react-router";
import { useLoadPolicy } from "~/hooks/useLoadPolicies";


export const meta: MetaFunction = () => {
    return [
        { title: "Términos de Uso" },
        {
            name: "description",
            content: "Lee los términos y condiciones para usar el sitio y realizar compras",
        },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: "Términos de Uso" },
        {
            property: "og:description",
            content: "Condiciones legales para el uso correcto de nuestra tienda online.",
        },
    ];
};

export default function TermsOfUsePage() {
    const query = useLoadPolicy("terms", "terms-policy/terms");
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
            <h1 className="text-3xl font-bold mb-6">Términos de Uso</h1>
            <section className="mb-6" dangerouslySetInnerHTML={{ __html: query?.description || "" }}>
            </section>

            <p className="text-base mt-6">Última actualización: {fechaFormateada}</p>
        </div>
    );
}
