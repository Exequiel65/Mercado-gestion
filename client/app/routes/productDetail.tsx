import Detail from "~/components/Product/Detail";
import { getById } from "~/services/apiService";
import type { Route } from "../+types/root";
import type { IProduct } from "~/types/Products";
import type { MetaFunction } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
    if (!params.id) {
        throw new Error("Product ID is required");
    }
    try {
        let re = await getById<IProduct>({ path: "product", id: params.id });
        return { data: re };
    } catch (error) {
        console.log(error)
        return { data: null}
    }
}

export const meta: MetaFunction = ({ data }: any) => {
    const product = data?.data as IProduct | undefined;
    if (!product) {
        return [
            { title: "Producto" },
            { name: "description", content: "Detalle del producto" },
        ];
    }
    return [
        { title: `${product.name}` },
        {
            name: "description",
            content: `${product.name} - ${product.description?.substring(0, 150) || "Descripción del producto"}`,
        },
        {
            name: "keywords",
            content: `${product.name}`,
        },
        { name: "robots", content: "index, follow" },
    ];
};



const ProductDetail = ({ loaderData }: { loaderData: { data: IProduct } }) => {
    if (loaderData === undefined) {
        return <div>Cargando....</div>
    }
    const product: IProduct = {
        ...loaderData.data,
        freeShipping: true,
        returnPolicy: true,
        sizes: [],
        colors: [],
    }




    return (
        <main className="min-h-[calc(100vh-284px)] max-w-7xl mx-auto">
            <Detail product={product} />
            {/* <SectionSlider
                title="Ofertas de la Semana"
                section="¡Oferta!"
                endDate={new Date("2025-05-30")}
                data={[]}
                secondLine={false}
                showButtonSlider={true}
                CardComponent={({ data }) => <ProductCard product={data} />}
            /> */}

        </main>
    );
};

export default ProductDetail;
