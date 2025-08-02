import { useState } from "react";
import { Minus, Plus, Truck, Undo2, ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonComponent } from "../Customs/ButtonComponent";
import type { IProduct } from "~/types/Products";
import { useCartStore } from "~/store/useCartStore";
import { useConfigStore } from "~/store/ConfigData";
import { formatPrice } from "~/utils/formats";

export default function Detail({ product }: { product: IProduct }) {
    const config = useConfigStore(state => state.config)
    const addToCart = useCartStore(state => state.addToCart);
    const hasDiscount = product.hasDiscount;
    const remainingImages = product.images.length > 4 ? product.images.length - 4 : 0;

    // Estados para selección
    const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || null);
    const [quantity, setQuantity] = useState(1);

    // Estado para imagen principal
    const [mainImageIndex, setMainImageIndex] = useState(0);

    // Funciones para manejar cantidad
    const handleIncrement = () => setQuantity((q) => q + 1);
    const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    // Función para agregar al carrito
    const handleAddToCart = () => {
        addToCart(product, quantity)
        // Aquí podrías agregar lógica para llamar a un contexto o API para agregar al carrito
    };

    // Navegar entre imágenes en móvil
    const handlePrevImage = () => {
        setMainImageIndex((idx) => (idx === 0 ? product.images.length - 1 : idx - 1));
    };

    const handleNextImage = () => {
        setMainImageIndex((idx) => (idx === product.images.length - 1 ? 0 : idx + 1));
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-4 py-8 max-w-7xl mx-auto">
            {/* Galería */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Miniaturas Desktop: costado vertical */}
                <div className="hidden lg:flex flex-col gap-2">
                    {product.images.map((img: string, index: number) => {
                        return index <= 3 && (<div
                            key={index}
                            className={`relative w-20 h-20 cursor-pointer rounded border ${mainImageIndex === index ? "border-[#DB4444]" : "border-gray-300"
                                }`}
                            onClick={() => setMainImageIndex(index)}
                        >
                            <img
                                src={img}
                                alt={`Miniatura ${index}`}
                                className="w-full h-full object-contain rounded"
                            />
                            {index === 3 && remainingImages > 0 && (
                                <div className="absolute inset-0 bg-black/60 text-white text-sm font-medium flex items-center justify-center rounded">
                                    +{remainingImages}
                                </div>
                            )}
                        </div>)
                    }

                    )}
                </div>

                {/* Imagen principal */}
                <div className="relative flex-1">
                    <img
                        src={product.images[mainImageIndex]}
                        alt="Imagen grande"
                        className="w-full h-[400px] object-contain rounded"
                    />

                    {/* Flechas para móvil */}
                    {
                        product.images.length > 1 && (
                            <>
                                <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 rounded-full p-1 cursor-pointer" onClick={handlePrevImage}>
                                    <ChevronLeft size={24} color="white" />
                                </div>
                                <div className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 rounded-full p-1 cursor-pointer" onClick={handleNextImage}>
                                    <ChevronRight size={24} color="white" />
                                </div>
                            </>
                        )
                    }

                </div>

                {/* Miniaturas móvil debajo */}
                <div className="lg:hidden flex gap-2 mt-4 justify-center overflow-x-auto">
                    {product.images.map((img: string, index: number) => {
                        return index <= 3 && (<div
                            key={index}
                            className={`relative w-16 h-16 cursor-pointer rounded border ${mainImageIndex === index ? "border-[#DB4444]" : "border-gray-300"
                                }`}
                            onClick={() => setMainImageIndex(index)}
                        >
                            <img
                                src={img}
                                alt={`Miniatura ${index}`}
                                className="w-full h-full object-contain rounded"
                            />
                            {index === 3 && remainingImages > 0 && (
                                <div className="absolute inset-0 bg-black/60 text-white text-sm font-medium flex items-center justify-center rounded">
                                    +{remainingImages}
                                </div>
                            )}
                        </div>)
                    }

                    )}
                </div>
            </div>

            {/* Info del producto */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>

                <p
                    className={`text-sm font-medium ${!product.isSoldOut ? "text-green-600" : "text-yellow-500"
                        }`}
                >
                    {!product.isSoldOut ? "Disponible" : "No disponible"}
                </p>
                {
                    !product.isSoldOut && (
                        <div className="space-y-1">
                            {hasDiscount ? (
                                <>
                                    <p className="text-gray-300 line-through text-sm">{formatPrice(product.priceConvert)}</p>
                                    <p className="text-xl font-bold text-red-600">
                                        {formatPrice(product.priceConvertWithDiscount)}{" "}
                                        <span className="text-sm font-medium text-gray-600">
                                            ({Math.round((1 - product.priceConvertWithDiscount / product.priceConvert) * 100)}% OFF)
                                        </span>
                                    </p>
                                </>
                            ) : (
                                <p className="text-xl font-bold text-gray-600">{formatPrice(product.priceConvert)}</p>
                            )}
                        </div>

                    )
                }

                <p className="text-gray-700">{product.description}</p>

                <hr className="my-4 text-gray-300" />

                {/* Colores */}
                {product.colors.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-700 mb-1">Color</p>
                        <div className="flex gap-2">
                            {product.colors.map((color: string, idx: number) => (
                                <div
                                    key={idx}
                                    className={`w-6 h-6 rounded-full border-2 cursor-pointer ${selectedColor === color ? "border-[#ff0000]" : "border-gray-300"
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tamaños */}
                {
                    product.sizes.length > 0 && (
                        <div>
                            <p className="text-sm text-gray-700 mb-1">Tamaño</p>
                            <div className="flex gap-2">
                                {product.sizes.map((size: string, idx: number) => (
                                    <button
                                        key={idx}
                                        className={`w-10 h-10 border-1 text-sm rounded cursor-pointer hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] ${selectedSize === size
                                            ? "bg-[#DB4444] text-white border-[#DB4444]"
                                            : "border-gray-400 text-gray-700"
                                            }`}
                                        onClick={() => setSelectedSize(size)}
                                        type="button"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                }




                {/* Cantidad y Agregar */}
                {
                    !product.isSoldOut && (
                        <div className="flex items-stretch gap-4 mt-4">
                            <div className="flex items-stretch border-1 border-gray-400 rounded">
                                <button
                                    onClick={handleDecrement}
                                    className="px-2 text-lg hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] cursor-pointer"
                                    type="button"
                                >
                                    <Minus size={15} />
                                </button>
                                <div className="flex items-center">
                                    <span className="mx-4 min-w-7 text-center">{quantity}</span>
                                </div>
                                <button
                                    onClick={handleIncrement}
                                    className="px-2 text-lg hover:bg-[#DB4444] hover:text-white hover:border-[#DB4444] cursor-pointer"
                                    type="button"
                                >
                                    <Plus size={15} />
                                </button>
                            </div>

                            <ButtonComponent
                                children="Agregar al carrito"
                                containerClassName=""
                                className="bg-[#DB4444] text-white px-6 py-2 rounded hover:bg-[#ff9191] cursor-pointer"
                                onClick={handleAddToCart}
                            />
                            


                        </div>)
                }

                {/* Info extra */}
                {
                    config?.shipping?.enabled || config?.guaranteedDevolution?.enabled ? (
                        <div className="mt-6 p-4 border rounded bg-gray-50 space-y-2 text-sm text-gray-700">
                            {(product.freeShipping && config.shipping?.enabled) && (
                                <div className="flex items-center gap-2">
                                    <Truck size={16} /> Envío gratis
                                </div>
                            )}
                            {(product.returnPolicy && config.guaranteedDevolution?.enabled) && (
                                <div className="flex items-center gap-2">
                                    <Undo2 size={16} /> Devolución dentro de los {config.guaranteedDevolution.day} días
                                </div>
                            )}
                        </div>
                    ) : ""
                }

            </div>
        </section>
    );
}
