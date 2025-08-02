import { useMemo, useState } from "react";
import ProductGrid from "~/components/Product/ProductGrid";
import SideBarFilter from "~/components/Product/SideBarFilter";
import { useLoadCatalog } from "~/hooks/useCatalog";
import { Loader } from '../components/Customs/Loader';
import { useCategoryStore } from "~/store/categoryStore";
import { useSearchParams } from "react-router";
import EmptyState from "~/components/Product/EmptyState";
import type { Route } from "../+types/root";


export function meta({}: Route.MetaArgs ){
  return [
    { title: "Productos" },
    {
      name: "description",
      content:
        "Explorá el catálogo completo",
    },
    { name: "robots", content: "index, follow" },
  ];
}

export default function ProductosPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const categories = useCategoryStore(state => state.categories);

    const categoryParam = searchParams.get("category");
    const subParam = searchParams.get("sub");
    const childParam = searchParams.get("child");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const discountParam = searchParams.get("discount");
    const sortParam = searchParams.get("sort") || "mostRelevant";

    const [sortBy, setSortBy] = useState(sortParam);

    const handleSortChange = (value: string) => {
        setSortBy(value);

        // Actualizar la URL
        const params = new URLSearchParams(searchParams);
        params.set("sort", value);
        setSearchParams(params);
    };
    const { categoryId, subId, childId } = useMemo(() => {

        const categoryObj = categories.find(x => x.name.toLowerCase() === categoryParam?.toLowerCase());
        const subObj = categoryObj?.subCategories.find(x => x.name.toLowerCase() === subParam?.toLowerCase());
        const childObj = subObj?.childCategories.find(x => x.name.toLowerCase() === childParam?.toLowerCase());

        return {
            categoryId: categoryObj?.id,
            subId: subObj?.id,
            childId : childObj?.id
        };
    }, [categories, categoryParam, subParam, childParam]);


    const { data, isLoading } = useLoadCatalog({
        category: categoryId,
        sub: subId,
        child: childId,
        minPrice: minPriceParam || undefined,
        maxPrice: maxPriceParam || undefined,
        discount: discountParam || undefined,
        sortBy: sortBy !== "mostRelevant" ? sortBy : undefined
    });

    const products = data ?? [];

    return (
        <div className="flex flex-col md:flex-row container mx-auto px-4 py-8 gap-8 min-h-screen">
            {/* Sidebar */}

            <SideBarFilter />
            {/* Productos */}
            <main className="w-full md:w-3/4 flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Productos</h1>

                {/* Ordenamiento */}
                <div className="mb-6">
                    <label htmlFor="sort" className="mr-2 font-medium">
                        Ordenar por:
                    </label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1"
                    >
                        <option value="mostRelevant">Más relevantes</option>
                        <option value="priceAsc">Menor precio</option>
                        <option value="priceDesc">Mayor precio</option>
                        <option value="nameAsc">A - Z</option>
                        <option value="nameDesc">Z - A</option>
                    </select>
                </div>
                {
                    isLoading ? (<div className="flex flex-col justify-center items-center"><Loader /></div>) : (
                        products.length > 0 ? (<ProductGrid products={products} />) : <EmptyState />
                    )
                }
            </main>
        </div>
    );
}
