import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("products", "./routes/products.tsx"),
    route("products/:id", "./routes/productDetail.tsx"),
    route("cart", "./routes/cart.tsx"),
    route("privacy-policy", "./routes/policy-privacy.tsx"),
    route("terms-of-use", "./routes/termsOfUse.tsx"),
    route("faq", "./routes/FAQ.tsx"),
    route("contact", "./routes/contact.tsx"),

] satisfies RouteConfig;
