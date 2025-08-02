import { Facebook, Twitter, Instagram, Send } from "lucide-react";
import { NavLink } from "react-router";
import { useConfigStore } from "~/store/ConfigData";

export default function Footer() {
  const config = useConfigStore(s => s.config);
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* 1. Exclusive */}
        {config && config.hasSubscription && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Exclusivo</h3>
            <p className="text-sm mb-2">Suscribite y obtené un 10% de descuento en tu primera compra</p>
            <div className="relative mt-2">
              <input
                type="email"
                placeholder="Ingresá tu email"
                className="w-full py-2 pl-4 pr-10 rounded bg-gray-800 text-sm placeholder:text-gray-400"
              />
              <Send size={18} className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer" />
            </div>
          </div>
        )}

        {/* 2. Soporte */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Soporte</h3>
          <ul className="text-sm space-y-2">
            {config?.company && config.company.address && (
              <li>📍 {config.company.address}</li>
            )}
            {config?.company && config.company.email && (
              <li>📧 {config.company.email}</li>
            )}
            {
              config?.company && config.company.phone && (
                <li>📞 {config.company.phone}</li>
              )
            }
            {/* {
              config?.company && config.company.googleMaps && (
                <li> <a target="_blank" href={config.company.googleMaps}>Ver en google Maps</a></li>
              )
            } */}

          </ul>
        </div>

        {/* 3. Cuenta */}
        {config?.haveAuth && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Cuenta</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#">Mi cuenta</a></li>
              <li><a href="#">Carrito</a></li>
              <li><a href="#">Tienda</a></li>
            </ul>
          </div>
        )}
        {/* 4. Quick Link */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
          <ul className="text-sm space-y-2">
            <li><NavLink className="hover:underline transition" to="/privacy-policy">Política de privacidad</NavLink></li>
            <li><NavLink className="hover:underline transition" to="/terms-of-use">Términos de uso</NavLink></li>
            <li><NavLink className="hover:underline transition" to="/faq">Preguntas frecuentes</NavLink></li>
            <li><NavLink className="hover:underline transition" to="/contact">Contacto</NavLink></li>
          </ul>
        </div>

        {/* 5. Redes Sociales */}
        {config?.socialMedia && (config.socialMedia.facebook || config.socialMedia.twitter || config.socialMedia.instagram) && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Redes sociales</h3>
            <div className="flex gap-4">
              {config?.socialMedia && config.socialMedia.facebook && (<NavLink target="_blank" to={config.socialMedia.facebook} aria-label="Facebook"><Facebook className="text-gray-400 hover:text-white" size={20} /></NavLink>)}
              {config?.socialMedia && config.socialMedia.twitter && (<NavLink target="_blank" to={config.socialMedia.twitter} aria-label="Twitter"><Twitter className="text-gray-400 hover:text-white" size={20} /></NavLink>)}
              {config?.socialMedia && config.socialMedia.instagram && (<NavLink target="_blank" to={config.socialMedia.instagram} aria-label="Instagram"><Instagram className="text-gray-400 hover:text-white" size={20} /></NavLink>)}
            </div>
          </div>
        )}

      </div>

      {/* Derechos reservados */}
      <div className="mt-10 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {config?.company.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
