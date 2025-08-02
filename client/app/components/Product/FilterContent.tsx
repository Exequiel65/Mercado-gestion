import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router';
import type { Category } from '~/store/categoryStore';
import type { IDiscountOptions } from '~/types/Products';



interface IProps{
    categories: Category[];
    discountOptions: IDiscountOptions[];
    brands: string[];
    expandedCategoryIds: number[];
    toggleCategory: (id: number) => void;
    minPrice: string;
    maxPrice: string;
    setMinPrice: React.Dispatch<React.SetStateAction<string>>;
    setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
    selectedDiscount: string;
    setSelectedDiscount:  React.Dispatch<React.SetStateAction<string>>;
    selectedBrands: string[];
    toggleBrand:(brand: string) => void;
    apply: () => void
    clear: () => void
}
export default function FilterContent({
    categories,
    discountOptions,
    brands,
    expandedCategoryIds,
    toggleCategory,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    selectedDiscount,
    setSelectedDiscount,
    selectedBrands,
    toggleBrand,
    apply,
    clear
}: IProps) {
    return (
        <div className="space-y-6">
            {/* Categorías */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-2">Categorías</h3>
                {/* Filtros activos */}
                {(selectedDiscount || selectedBrands.length > 0) && (
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        {/* Filtro por descuento */}
                        {selectedDiscount && (
                            <span className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                Descuento: {discountOptions.find((d) => d.value === selectedDiscount)?.label}
                                <button onClick={() => setSelectedDiscount("")} className="ml-1 text-gray-500 hover:text-black">×</button>
                            </span>
                        )}

                        {/* Filtro por marcas */}
                        {selectedBrands.map((brand) => (
                            <span key={brand} className="bg-gray-200 text-sm px-2 py-1 rounded-full flex items-center gap-1">
                                Marca: {brand}
                                <button onClick={() => toggleBrand(brand)} className="ml-1 text-gray-500 hover:text-black">×</button>
                            </span>
                        ))}
                    </div>
                )}
                {categories.map((category) => {
                    const isExpanded = expandedCategoryIds.includes(category.id);
                    return (
                        <div key={category.id} className="mb-2">
                            <div className="flex justify-between items-center">
                                <Link
                                    to={`/products?category=${category.name}`}
                                    className="text-gray-900 font-medium hover:underline"
                                >
                                    {category.name}
                                </Link>
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="text-sm text-gray-600"
                                >
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.ul
                                        className="ml-4 mt-1 space-y-1 text-sm text-gray-700"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {category.subCategories.map((sub) => {
                                            return (
                                                <li key={sub.id}>
                                                    <Link to={`?category=${category.name}&sub=${sub.name}`} className="font-medium hover:underline">{sub.name}</Link>
                                                    <ul className="ml-4 mt-1 space-y-1">
                                                        {sub.childCategories.map((child) => (
                                                            <li key={child.id}>
                                                                <Link
                                                                    to={`/products?category=${category.name}&sub=${sub.name}&child=${child.name}`}
                                                                    className="hover:underline"
                                                                >
                                                                    {child.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            );
                                        })}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}

            </div>

            {/* Precio */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-2">Filtrar por precio</h3>
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Mínimo"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-1/2 border border-gray-300 rounded px-3 py-1"
                    />
                    <input
                        type="number"
                        placeholder="Máximo"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-1/2 border border-gray-300 rounded px-3 py-1"
                    />
                </div>
            </div>

            {/* Descuentos */}
            <div>
                <h3 className="font-semibold text-gray-800 mb-2">Descuentos</h3>
                {discountOptions.map((d) => (
                    <label key={d.value} className="flex items-center text-sm text-gray-700">
                        <input
                            type="radio"
                            name="discount"
                            value={d.value}
                            checked={selectedDiscount === d.value}
                            onChange={(e) => setSelectedDiscount(e.target.value)}
                            className="mr-2"
                        />
                        {d.label}
                    </label>
                ))}
            </div>

            {/* Marcas */}
            <div>
                {brands.length > 0 && (
                    <>
                        <h3 className="font-semibold text-gray-800 mb-2">Marcas</h3>
                        {brands.map((brand) => (
                            <label key={brand} className="flex items-center text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={() => toggleBrand(brand)}
                                    className="mr-2"
                                />
                                {brand}
                            </label>
                        ))}
                    </>
                )}
            </div>

            <button
                className="bg-[#DB4444] text-white px-4 py-1 rounded hover:bg-[#ff9191] w-full"
                onClick={apply}
            >
                Aplicar filtros
            </button>
            <button
                onClick={clear}
                className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 w-full"
            >
                Limpiar
            </button>
        </div>
    )
}
