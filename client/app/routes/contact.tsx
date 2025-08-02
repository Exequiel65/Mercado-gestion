import { useConfigStore } from "~/store/ConfigData";

export default function ContactPage() {
    const config = useConfigStore(state => state.config);
    let company = config?.company
    if (!company) {
        return (
            <main className="max-w-5xl mx-auto px-4 py-8 min-h-[calc(100vh-284px)] flex items-center justify-center">
                <p className="text-center text-red-600 text-lg font-semibold">
                    Ups, no pudimos cargar los datos de contacto. Por favor, intenta más tarde.
                </p>
            </main>
        )
    }
    return (
        <main className="max-w-5xl mx-auto px-4 py-8 min-h-[calc(100vh-284px)]">
            <h1 className="text-3xl font-bold mb-8">Contacto</h1>

            <section className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                <img
                    src="logo.png"
                    alt={`${company.name} logo`}
                    className="w-40 h-auto object-contain"
                    loading="lazy"
                />
                <div>
                    <h2 className="text-2xl font-semibold mb-4">{company.name}</h2>
                    <p className="mb-2">
                        <strong>Dirección:</strong> {company.address}
                    </p>
                    <p className="mb-2">
                        <strong>Teléfono:</strong>{" "}
                        <a
                            href={`https://wa.me/${company.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            aria-label={`Enviar mensaje por WhatsApp al ${company.phone}`}
                        >
                            {company.phone} (WhatsApp)
                        </a>
                    </p>
                    <p className="mb-2">
                        <strong>Email:</strong>{" "}
                        <a
                            href={`mailto:${company.email}`}
                            className="text-blue-600 hover:underline"
                            aria-label={`Enviar email a ${company.email}`}
                        >
                            {company.email}
                        </a>
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Ubicación</h2>
                {company.googleMaps ? (
                    <div
                        className="w-full h-[450px] my-4"
                        dangerouslySetInnerHTML={{ __html: company.googleMaps }}
                    />
                ) : (
                    <p>No se pudo cargar el mapa.</p>
                )}
            </section>
        </main>
    );
}