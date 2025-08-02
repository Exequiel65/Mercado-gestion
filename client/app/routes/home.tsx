import Carousel from "~/components/Sliders/Carousel";
import type { Route } from "./+types/home";
import { SectionSlider } from "~/components/Sliders/SectionSlider";
import ProductCard from "~/components/Product/ProductCard";
import NewArrivalBanner from "~/components/Section/NewArrivalBanner";
import SectionDetailService from "~/components/Section/SectionDetailService";
import { useHomeConfig } from "~/store/homeStore";
import { useLoadHomeConfig } from "~/hooks/useLoadHomeConfig";
import { Loader } from "~/components/Customs/Loader";
import { ErrorComponent } from "~/components/Customs/ErrorComponent";
import { useLoadSectionProducts } from "~/hooks/useLoadSectionProducts";
import type { ISection } from "~/types/Products";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Inicio" },
    // {
    //   name: "description",
    //   content:
    //     "Misión 6mm es tu tienda online de confianza para comprar réplicas de airsoft, municiones, equipamiento táctico, indumentaria militar y accesorios. Envíos a todo el país.",
    // },
    // {
    //   name: "keywords",
    //   content:
    //     "airsoft, tienda airsoft, equipamiento táctico, réplicas de airsoft, armas airsoft, municiones airsoft, Misión 6mm, indumentaria militar, comprar airsoft Argentina, mision6mm.mbst.com.ar, cordoba airsoft, Córdoba",
    // },
    // { name: "author", content: "Misión 6mm" },
    // { name: "robots", content: "index, follow" },
  ];
}

export default function Home() {
  const { isLoading, isError, refetch } = useLoadHomeConfig();
  const config = useHomeConfig((state) => state.config);
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <Loader message="Cargando contenido de inicio..." />
    </div>
  }
  if (isError) {
    return (
      <ErrorComponent
        message="Hubo un error al cargar la configuración de inicio."
        onRetry={refetch}
      />
    );
  }
  return (
    <div className="container m-auto min-h-screen">
      {config?.banners && config.banners.length > 0 && (
        <Carousel banner={config.banners} />
      )}
      {
        config?.sections && config.sections.length > 0 &&
        config.sections.map((s, index) => (
          <SectionWithProducts 
            key={index}
            sectionConfig={s}
          />
          // <div key={index}>
          //   <SectionSlider
          //     key={index}
          //     title={s.title}
          //     section={s.section}
          //     endDate={s.endDate && new Date(s.endDate)}
          //     data={products}
          //     secondLine={false}
          //     button={s.button}
          //     showButtonSlider={s.showButtonSlider}
          //     CardComponent={({ data }) => <ProductCard product={data} />}
          //   />
          //   <div className="border-1 border-black opacity-7 mb-3">
          //   </div>
          // </div>
        ))
      }
      {/* <SectionSlider
        title="Categorias"
        section="Categorias"
        data={categories}
        secondLine={false}
        showButtonSlider={true}
        CardComponent={({ data }) => <CategoryCard IconLucide={data.IconLucide} path={data.path} title={data.title} />}
      />
      <div className="border-1 border-black opacity-7 mb-3">
      </div> */}
      {
        config?.bannerGrid && (
          <NewArrivalBanner
            title={config.bannerGrid.title}
            section=""
            items={config.bannerGrid.items}
          />
        )
      }

      <SectionDetailService />
    </div>
  );
}



function SectionWithProducts({ sectionConfig }: { sectionConfig:ISection }) {
  const { data: products } = useLoadSectionProducts(sectionConfig.button?.path || '');
  
  return (
    <div>
      <SectionSlider
        title={sectionConfig.title}
        section={sectionConfig.section}
        endDate={sectionConfig.endDate && new Date(sectionConfig.endDate)}
        data={products || []}
        secondLine={sectionConfig.secondLine}
        button={sectionConfig.button}
        showButtonSlider={sectionConfig.showButtonSlider}
        CardComponent={({ data }) => <ProductCard product={data} />}
        // isLoading={isLoading}
      />
      <div className="border-1 border-black opacity-7 mb-3"></div>
    </div>
  );
}