export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
  }).format(price);
};

