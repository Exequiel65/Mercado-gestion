import { useLoadPolicy } from "~/hooks/useLoadPolicies";

export default function FAQPage() {
  const query = useLoadPolicy("faq", "terms-policy/faq");

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-284px)]">
      <h1 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h1>

      <section className="mb-6" dangerouslySetInnerHTML={{ __html: query?.description || "" }}>
      </section>
    </main>
  );
}
