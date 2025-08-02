import {
  Truck,
  Headset,
  ShieldCheck,
} from "lucide-react";
import { useConfigStore } from "~/store/ConfigData";


export default function SectionDetailService() {
  const config = useConfigStore(state => state.config)
  return (
    <section className="py-10 bg-gray-100">
      <div className="container flex flex-row justify-evenly flex-wrap mx-auto px-4 gap-8 text-center">
        {config?.shipping && config.shipping.enabled && (
          <div className="flex flex-col items-center">
            <div className="mb-4"><Truck size={32} className="text-red-600" /></div>
            <h3 className="font-semibold text-lg">{config.shipping.title}</h3>
            <p className="text-sm text-gray-600">{config.shipping.description}</p>
          </div>
        )}


        <div className="flex flex-col items-center">
          <div className="mb-4"><Headset size={32} className="text-red-600" /></div>
          <h3 className="font-semibold text-lg">SOPORTE AL CLIENTE 24/7</h3>
          <p className="text-sm text-gray-600">Atención al cliente amigable y disponible las 24 horas</p>
        </div>


        {config?.guaranteedDevolution && config.guaranteedDevolution.enabled && (
          <div className="flex flex-col items-center">
            <div className="mb-4"><ShieldCheck size={32} className="text-red-600" /></div>
            <h3 className="font-semibold text-lg">{config.guaranteedDevolution.title}</h3>
            <p className="text-sm text-gray-600">{config.guaranteedDevolution.description}</p>
          </div>
        )}

      </div>
    </section>
  );
}
