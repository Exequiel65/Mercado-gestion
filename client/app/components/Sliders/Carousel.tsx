import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useWindowSize } from "~/hooks/useWindowSize";
import type { IBanner } from "~/types/Products";

interface CarouselProps {
  banner: IBanner[];
}

export default function Carousel({ banner }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const { width } = useWindowSize();

  const getImageUrl = (banner: IBanner) => {
    if (!width) return banner.images.sm; // Por defecto mientras se carga

    if (width >= 1280) return banner.images.xl;
    if (width >= 768) return banner.images.md;
    return banner.images.sm;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banner.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banner.length]);

return (
    <div className="relative w-full mx-auto h-1/2 overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banner.map((banner, index) => (
          <div key={index} className="relative w-full flex-shrink-0">
            <img
              src={getImageUrl(banner)}
              alt={`Slide ${index}`}
              className="w-full h-[300px] md:h-[400px] xl:h-[500px] object-cover"
            />
            
            {/* Botón del banner */}
            <div className="absolute bottom-10 left-10">
              <Link
                to={banner.link}
                className="bg-none text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-[#c2c0c081] hover:text-[#363636] hover:underline transition-colors duration-300 text-xl md:text-2xl lg:text-3xl"
              >
                {banner.text}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banner.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}