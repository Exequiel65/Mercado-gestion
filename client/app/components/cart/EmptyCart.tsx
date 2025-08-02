import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";
import { ButtonComponent } from "../Customs/ButtonComponent";

export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16">
            <ShoppingCart size={80} className="text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700">Tu carrito está vacío</h2>
            <p className="text-gray-500 mt-2">Explora nuestra tienda y encuentra lo que necesitas.</p>
            <Link to="/products">
                <ButtonComponent >
                    Ir a la tienda
                </ButtonComponent>
            </Link>
        </div>
    );
}