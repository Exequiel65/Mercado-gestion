import { useState } from "react";
import { Filter } from "lucide-react";
import { Dialog } from "@headlessui/react";
import FilterContent from "./FilterContent";
import { useCategoryStore } from "~/store/categoryStore";
import { useSearchParams } from "react-router";
import type { IDiscountOptions } from "~/types/Products";




const discountOptions: IDiscountOptions[] = [
    { label: "Hasta 10%", value: "10" },
    { label: "Hasta 25%", value: "25" },
    { label: "Hasta 50%", value: "50" },
    { label: "Más del 50%", value: "51" },
];

export default function SideBarFilter() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categories = useCategoryStore(state => state.categories)
    const [expandedCategoryIds, setExpandedCategoryIds] = useState<number[]>([]);
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [selectedDiscount, setSelectedDiscount] = useState(searchParams.get("discount") || "");
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleCategory = (id: number) => {
        setExpandedCategoryIds((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    };
    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);

        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");

        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");

        if (selectedDiscount) params.set("discount", selectedDiscount);
        else params.delete("discount");

        setSearchParams(params);
        setIsMobileOpen(false);
    };

    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setSelectedDiscount("");
        setSelectedBrands([]);

        // Actualizar URL eliminando solo estos parámetros
        const params = new URLSearchParams(searchParams);
        params.delete("minPrice");
        params.delete("maxPrice");
        params.delete("discount");
        // params.delete("brands");

        setSearchParams(params);
    };

    return (
        <>
            {/* Botón solo visible en mobile */}
            <div className="md:hidden mb-4">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md"
                >
                    <Filter size={16} /> Filtros
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-full md:w-1/4 bg-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
                <FilterContent
                    categories={categories}
                    discountOptions={discountOptions}
                    brands={[]}
                    expandedCategoryIds={expandedCategoryIds}
                    toggleCategory={toggleCategory}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                    selectedDiscount={selectedDiscount}
                    setSelectedDiscount={setSelectedDiscount}
                    selectedBrands={selectedBrands}
                    toggleBrand={toggleBrand}
                    apply={applyFilters}
                    clear={clearFilters}
                />
            </aside>

            {/* Mobile modal */}
            <Dialog open={isMobileOpen} onClose={() => setIsMobileOpen(false)} className="md:hidden z-50 m-auto">
                <div className="fixed inset-0 bg-black bg-opacity-30" />
                <div className="fixed inset-0 overflow-y-auto p-4 flex justify-center items-start">
                    <Dialog.Panel className="bg-white w-full max-w-sm p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <Dialog.Title className="text-lg font-bold text-gray-800">Filtros</Dialog.Title>
                            <button onClick={() => setIsMobileOpen(false)} className="text-sm text-gray-600">
                                Cerrar
                            </button>
                        </div>
                        <FilterContent
                            categories={categories}
                            discountOptions={discountOptions}
                            brands={[]}
                            expandedCategoryIds={expandedCategoryIds}
                            toggleCategory={toggleCategory}
                            minPrice={minPrice}
                            maxPrice={maxPrice}
                            setMinPrice={setMinPrice}
                            setMaxPrice={setMaxPrice}
                            selectedDiscount={selectedDiscount}
                            setSelectedDiscount={setSelectedDiscount}
                            selectedBrands={selectedBrands}
                            toggleBrand={toggleBrand}
                            apply={applyFilters}
                            clear={clearFilters}
                        />
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}
