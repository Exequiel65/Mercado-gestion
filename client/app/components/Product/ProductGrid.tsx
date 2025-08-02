import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import type { IProduct } from "~/types/Products";

interface Props {
    products: IProduct[];
}

export default function ProductGrid({ products }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cardsPerPage, setCardsPerPage] = useState(12); // valor inicial por defecto
    const [currentPage, setCurrentPage] = useState(0);
    // Calcula cuántas cards entran por fila y por página
    useEffect(() => {
        const calculateCardsPerPage = () => {
            const container = containerRef.current;
            if (!container) return;

            const containerWidth = container.offsetWidth;
            const cardWidth = 223; // ancho estimado de la card
            const cardsPerRow = Math.floor(containerWidth / cardWidth);
            const visibleRows = 10; // o 3 si querés más scroll
            const total = cardsPerRow * visibleRows;

            setCardsPerPage(total);
        };

        calculateCardsPerPage();
        window.addEventListener("resize", calculateCardsPerPage);
        return () => window.removeEventListener("resize", calculateCardsPerPage);
    }, []);

    // Paginar productos
    const paginatedProducts = products.slice(
        currentPage * cardsPerPage,
        (currentPage + 1) * cardsPerPage
    );

    const totalPages = Math.ceil(products.length / cardsPerPage);

    return (
        <div className="flex flex-col flex-grow justify-between">
            <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center min-h-3/4">
                {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Paginación con mt-auto para pegar al fondo */}
            <div className="mt-auto flex justify-center gap-2 py-4">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        className={`px-3 py-1 rounded ${index === currentPage ? "bg-black text-white" : "bg-gray-200"}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
