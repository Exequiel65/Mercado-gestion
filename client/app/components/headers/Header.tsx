import { NavLink } from "react-router"
import { useState } from "react";
import {
    Menu,
    X,
    ShoppingCart,
    User,
    ChevronDown,
    MoveRight,
    ChevronRight,
} from "lucide-react";
import { useConfigStore } from "~/store/ConfigData";
import { useCartStore } from "~/store/useCartStore";
import { useCategoryStore } from "~/store/categoryStore";

export default function Header() {
    const cartItems = useCartStore(state => state.items);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const config = useConfigStore((state) => state.config);
    const categories = useCategoryStore((state) => state.categories);
    const [isOpen, setIsOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const [catalogOpenMobile, setCatalogOpenMobile] = useState(false);
    return (
        <header className="bg-[#0c1d2b] shadow-sm">
            <nav className="bg-white shadow-md sticky top-0 z-10 p-4">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <NavLink to="/" className="flex-shrink-0" onClick={() => setCatalogOpen(false)}>
                        <img
                            src={config?.company.logoUrl || "/logo.png"}
                            alt={config?.company.name || "Logo"}
                            className="w-40"
                            width={441}
                            height={100}
                        />
                    </NavLink>

                    {/* Menú Desktop */}
                    <ul className="hidden md:flex flex-1 pl-7  space-x-6">
                        {/* Catálogo con dropdown */}
                        <li className="relative">
                            <button
                                className="flex items-center text-gray-700 hover:text-gray-900"
                                onClick={() => {
                                    setCatalogOpen(!catalogOpen)
                                }}
                            >
                                Catálogo <ChevronDown size={16} className="ml-1" />
                            </button>
                        </li>
                        {/* Oferta */}
                        {/* <li><NavLink to="/oferta" className="text-gray-700 hover:text-gray-900">Oferta</NavLink></li> */}
                        {/* Contacto */}
                        {/* <li><NavLink to="/contacto" className="text-gray-700 hover:text-gray-900">Contacto</NavLink></li> */}
                    </ul>

                    {/* Acciones */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Buscador */}
                        {/* <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="bg-[#F5F5F5] borde rounded-s-xs px-3 pr-10 py-1 text-sm focus:outline-gray-300"
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                <Search size={16} />
                            </button>
                        </div> */}
                        {/* Carrito */}
                        <NavLink to="/cart" className="relative text-gray-700 hover:text-gray-900" onClick={() => setCatalogOpen(false)}>
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </NavLink>
                        {/* Login */}
                        {
                            config?.haveAuth && (
                                <NavLink to="/login" className="text-gray-700 hover:text-gray-900" onClick={() => setCatalogOpen(false)}>
                                    <User size={24} />
                                </NavLink>
                            )
                        }

                    </div>

                    {/* Botón Hamburguesa */}
                    <button
                        className="md:hidden p-2 text-gray-700"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
                {/* Dropdown Catálogo – fuera del container y ul */}
                {catalogOpen && (
                    <div className="absolute left-0 right-0 top-full bg-gray-100 shadow-lg border-t border-gray-200 z-20">
                        <div className="container mx-auto flex gap-15 p-10">
                            {categories.map((item, index) => (
                                <div key={index}>
                                    <h4 className="text-lg font-bold mb-1">{item.name}</h4>
                                    <ul className="space-y-1 pl-2 text-sm">
                                        {item.subCategories.map((it, idx) => (
                                            <li key={idx} ><NavLink to={`/products?category=${item.name}&sub=${it.name}`} onClick={() => setCatalogOpen(false)}>{it.name}</NavLink></li>
                                        ))}
                                        <li><NavLink to={"/products"} className="flex align-middle items-center gap-3" onClick={() => setCatalogOpen(false)} >Ver todo<MoveRight size={15} /></NavLink></li>
                                    </ul>
                                </div>
                            ))}

                            {/* <div>
                                <h4 className="text-lg font-bold mb-1">Indumentaria</h4>
                                <ul className="space-y-1 pl-2 text-sm">
                                    <li><NavLink to="/catalogo/indumentaria/camisas" onClick={() => setCatalogOpen(false)}>Camisas</NavLink></li>
                                    <li><NavLink to="/catalogo/indumentaria/pantalones" onClick={() => setCatalogOpen(false)}>Pantalones</NavLink></li>
                                    <li><NavLink to="/catalogo/indumentaria/accesorios" onClick={() => setCatalogOpen(false)}>Accesorios</NavLink></li>
                                    <li><p className="flex align-middle items-center gap-3" onClick={() => setCatalogOpen(false)}>Ver todo<MoveRight size={15} /></p></li>
                                </ul>
                            </div> */}
                        </div>
                    </div>
                )}
                {/* Menú Móvil */}
                {isOpen && (
                    <div className="md:hidden bg-white shadow-md absolute top-19 left-0 w-full z-10">
                        <ul className="flex flex-col space-y-4 p-4">
                            <li>
                                <button
                                    className="flex justify-between items-center w-full text-gray-700 hover:text-gray-900"
                                    onClick={() => setCatalogOpenMobile(!catalogOpenMobile)}
                                >
                                    Catálogo
                                    <ChevronRight size={16} className={`${catalogOpenMobile ? "rotate-90" : ""} transition-transform`} />
                                </button>

                                {catalogOpenMobile && (
                                    <div className="mt-2 pl-4 border-l border-gray-300">
                                        {categories.map((cat, index) => (
                                            <div key={index} className="mb-2">
                                                <NavLink to={`/products?category=${cat.name}`} className="text-sm font-bold mb-1">{cat.name}</NavLink>
                                                <ul className="space-y-1 text-sm">
                                                    {
                                                        cat.subCategories.map((sub, index) => (
                                                            <li key={index}>
                                                                <NavLink
                                                                    to={`/products?category=${cat.name}&sub=${sub.name}`}
                                                                    className="block text-gray-700 hover:text-gray-900"
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    {sub.name}
                                                                </NavLink>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>

                            {/* <li>
                                <NavLink
                                    to="/oferta"
                                    className="text-gray-700 hover:text-gray-900"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Oferta
                                </NavLink>
                            </li> */}
                            {/* <li>
                                <NavLink
                                    to="/contacto"
                                    className="text-gray-700 hover:text-gray-900"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Contacto
                                </NavLink>
                            </li> */}
                            <li>
                                <NavLink
                                    to="/cart"
                                    className="text-gray-700 hover:text-gray-900"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Carrito
                                </NavLink>
                            </li>
                            {config?.haveAuth && (
                                <li>
                                    <NavLink
                                        to="/login"
                                        className="text-gray-700 hover:text-gray-900"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </NavLink>
                                </li>
                            )}

                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
}
