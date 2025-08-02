import { ShoppingCart } from "lucide-react";
import type { IProduct } from "~/types/Products";
import { formatPrice } from "~/utils/formats";
import { Link } from "react-router";
import { ButtonComponent } from "../Customs/ButtonComponent";
import { useCartStore } from "~/store/useCartStore";

export default function ProductCard({ product }: { product: IProduct }) {
  const isSoldOut = product.isSoldOut;
  const addToCart = useCartStore(state => state.addToCart)
  return (
    <div className="relative bg-white rounded-lg shadow-md flex-shrink-0 group overflow-hidden h-72">
      <div className="relative">
        {/* Imagen con opacidad si está agotado */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-48 object-contain transition-opacity duration-300 ${isSoldOut ? "opacity-40" : "opacity-100"}`}
          loading="lazy"
        />


        {/* Si NO está agotado, mostrar el descuento */}
        {!isSoldOut && product.hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}

        {/* Si está agotado, mostrar cartel AGOTADO centrado */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-black bg-opacity-80 px-4 py-1 rounded">
              Agotado
            </span>
          </div>
        )}

        {/* Botón agregar al carrito */}
        {!isSoldOut && (
          <ButtonComponent 
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300 bg-black text-white px-4 py-1 text-sm rounded cursor-pointer"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={16} className="inline mr-2" /> Agregar
          </ButtonComponent>

        )}
      </div>
      <Link to={`/products/${product.id}`} >


        <div className="p-4">
          <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>

          {/* Precio solo si está disponible */}
          {!isSoldOut && (product.hasDiscount ? (
            <div className="mt-2 text-sm">
              <span className="text-red-600 font-bold">{formatPrice(product.priceConvertWithDiscount)}</span>
              <span className="text-gray-400 line-through ml-2">{formatPrice(product.priceConvert)}</span>
            </div>
          ) : (

            <div className="mt-2 text-sm">
              <span className="ml-2 font-bold">{formatPrice(product.priceConvert)}</span>
            </div>


          ))}
        </div>
      </Link>
    </div>
  );
}
