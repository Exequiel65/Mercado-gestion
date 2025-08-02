import { X } from "lucide-react";
import { useState } from "react";
import type { MetaFunction } from "react-router";
import EmptyCart from "~/components/cart/EmptyCart";
import { useConfigStore } from "~/store/ConfigData";
import { useCartStore } from "~/store/useCartStore";
import { formatPrice } from "~/utils/formats";

export const meta: MetaFunction = () => {
  return [
    { title: "Carrito de Compras" },
    // {
    //   name: "description",
    //   content: "Revisá los productos en tu carrito y finalizá tu compra en Misión 6mm.",
    // },
    // {
    //   name: "keywords",
    //   content: "carrito, compras, airsoft, Misión 6mm, checkout, productos",
    // },
    // { name: "robots", content: "index, follow" },
  ];
};

const SHIPPING_COST = 0;
export default function CartPage() {
  const cart = useCartStore(state => state.items);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const config = useConfigStore((state) => state.config);

  const handleApplyCoupon = () => {
    if (coupon === "DESCUENTO10") {
      setAppliedCoupon(coupon);
      setDiscountPercent(10);
    } else {
      alert("Cupón no válido");
    }
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.hasDiscount ? item.priceConvertWithDiscount : item.priceConvert) * item.quantity,
    0
  );

  const total = subtotal + SHIPPING_COST;

  const handleCheckout = () => {
    const message = encodeURIComponent(
      `Hola, quiero comprar:\n\n` +
      cart.map((item) => `${item.quantity} x ${item.name} - ${formatPrice(item.hasDiscount ? Math.ceil(item.priceConvertWithDiscount * item.quantity) : Math.ceil(item.priceConvert * item.quantity))}`).join("\n") +
      `\n\nTotal: ${formatPrice(total)}`
    )
    window.open(`https://wa.me/${config?.company.phone}?text=${message}`, "_blank")
  }

  return (
    <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8 min-h-[calc(100vh-284px)]">
      {/* Tabla de productos */}
      {cart.length > 0 ? (
        <>
        <div className="lg:col-span-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-1 border-b-gray-300 text-sm font-semibold">
                <th className="py-2">Producto</th>
                <th className="py-2">Precio</th>
                <th className="py-2">Cantidad</th>
                <th className="py-2">Subtotal</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => {
                const price = item.hasDiscount ? item.priceConvertWithDiscount : item.priceConvert;
                const itemSubtotal = price * item.quantity;
                return (
                  <tr key={item.id} className="border-b-1 border-b-gray-300 text-sm">
                    <td className="py-4 flex items-center gap-3">
                      <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-contain rounded" />
                      <span>{item.name}</span>
                    </td>
                    <td className="py-4">
                      {item.hasDiscount ? (
                        <div>
                          <span className="line-through text-gray-500 text-sm block">
                            {formatPrice(item.priceConvert)}
                          </span>
                          <span className="text-red-600 font-semibold">
                            {formatPrice(item.priceConvertWithDiscount)}
                          </span>
                        </div>
                      ) : (
                        <span>{formatPrice(item.priceConvert)}</span>
                      )}
                    </td>
                    <td className="py-4">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value))
                        }
                        className="w-16 border rounded px-2 py-1"
                      />
                    </td>
                    <td className="py-4">{formatPrice(itemSubtotal)}</td>
                    <td className="py-4">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:underline cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div>
            <button className="w-1/4 mt-6 bg-white text-black py-3 rounded border-1 border-gray-300 cursor-pointer hover:bg-gray-300">
              Seguir comprando
            </button>
          </div>
        </div>
              {/* Total y cupón */}
      <div className="border rounded p-6 shadow-md bg-white h-fit">
        <h2 className="text-lg font-semibold mb-4">Total del carrito</h2>

        <div className="flex justify-between py-2 border-b-1 border-b-gray-300">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {
          config?.shipping?.enabled && (<div className="flex justify-between py-2 border-b-1 border-b-gray-300">
            <span>Shipping</span>
            <span>{SHIPPING_COST === 0 ? "Free" : `$${(SHIPPING_COST as number).toFixed(2)}`}</span>
          </div>)
        }


        {appliedCoupon && config?.cart?.hasApplyCoupon && (
          <div className="flex justify-between py-2 border-b text-green-600">
            <span>Cupón ({appliedCoupon})</span>
            <span>-{discountPercent}%</span>
          </div>
        )}

        <div className="flex justify-between py-2 font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {/* Cupón */}
        <div className="mt-4">
          {!appliedCoupon && config?.cart?.hasApplyCoupon ? (
            <>
              <input
                type="text"
                placeholder="Código de cupón"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="border w-full px-3 py-2 rounded mb-2"
              />
              <button
                onClick={handleApplyCoupon}
                className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
              >
                Aplicar cupón
              </button>
            </>
          ) : (
            <div></div>
            // <p className="text-sm text-green-600 mt-2">
            //   Cupón <strong>{appliedCoupon}</strong> aplicado correctamente.
            // </p>
          )}
        </div>

        <button className="w-full mt-6 bg-[#DB4444] text-white py-3 rounded hover:bg-red-600 font-medium" onClick={handleCheckout}>
          Proceder con la compra {config?.cart?.redirectToWsp && !config.cart.hasPaymentMethod && ("por WhatsApp")}
        </button>
      </div>
      </>
      ) : (
        <div className="lg:col-span-3" >
          <EmptyCart />
        </div>
      )}
    </div>
  );
}
