import { useEffect, useRef, useState, type ComponentType } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import TimeLeft from "../Customs/TimeLeft";
import { Link } from "react-router";

interface ISectionProps<T> {
    section: string;
    title: string;
    endDate?: Date;
    data: T[];
    button?: {
        text: string;
        path: string;
        position: "bottom" | "top";
    };
    CardComponent: ComponentType<{ data: T }>;
    showButtonSlider: boolean;
    secondLine: boolean;
}

function splitArrayInTwo<T>(arr: T[]): [T[], T[]] {
    const middle = Math.ceil(arr.length / 2); // redondea hacia arriba si es impar
    const firstHalf = arr.slice(0, middle);
    const secondHalf = arr.slice(middle);
    return [firstHalf, secondHalf];
}

export function SectionSlider<T>({ title, endDate, section, data, button, CardComponent, showButtonSlider, secondLine }: ISectionProps<T>) {

    const sliderRef = useRef<HTMLDivElement>(null)
    const sliderRef2 = useRef<HTMLDivElement>(null)
    const [showScrollButtons, setShowScrollButtons] = useState(false);

    const [first, second] = splitArrayInTwo(data);
    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })
        }
        if (sliderRef2.current) {
            sliderRef2.current.scrollBy({ left: -300, behavior: "smooth" })
        }
    }

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })
        }
        if (sliderRef2.current) {
            sliderRef2.current.scrollBy({ left: 300, behavior: "smooth" })
        }
    }


    useEffect(() => {
        const checkScroll = () => {
            if (sliderRef.current) {
                const { scrollWidth, clientWidth } = sliderRef.current;
                setShowScrollButtons(scrollWidth > clientWidth);
            }
        };

        checkScroll();

        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    return (
        <section className="py-10">
            {/* Encabezado */}
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="bg-red-600 text-white font-bold px-4 py-1 uppercase tracking-wide w-min text-center">
                        {section}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
                    {endDate && (<TimeLeft endDate={endDate} />)}

                </div>

                {/* Botones de scroll */}
                {showScrollButtons && showButtonSlider && (
                    <div className="hidden sm:flex gap-2 sm:ml-auto">
                        <button
                            onClick={scrollLeft}
                            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="bg-gray-200 hover:bg-gray-300 rounded-full p-2"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
                {
                    button && button.position === "top" && (
                        <div className="flex justify-center">
                            <Link to={button.path} className="rounded-lg p-5 mt-3 bg-[#DB4444] text-white select-none cursor-pointer hover:bg-[#ff9191]" >
                                {button.text}
                            </Link>
                        </div>
                    )
                }
            </div>

            {/* Slider manual */}
            {showButtonSlider && (<div
                ref={sliderRef}
                className="flex gap-10 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
            >
                {!secondLine ? data.map((item, index) => (
                    <div key={index} className="w-full sm:w-[240px] sm:min-w-[240px] flex-shrink-0">
                        <CardComponent data={item} />
                    </div>
                )) : first.map((item, index) => (
                    <div key={index} className="w-full sm:w-[240px] sm:min-w-[240px] flex-shrink-0">
                        <CardComponent data={item} />
                    </div>
                ))
                }
            </div>)}

            {showButtonSlider && secondLine && (<div
                ref={sliderRef2}
                className="flex gap-10 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
            >
                {second.map((item, index) => (
                    <div key={index} className="w-full sm:w-[240px] sm:min-w-[240px] flex-shrink-0">
                        <CardComponent data={item} />
                    </div>
                ))}
            </div>)}
            {!showButtonSlider && button && button.position === "top" && (
                <div
                    ref={sliderRef}
                    className="flex gap-10 overflow-x-auto scroll-smooth pb-4"
                >
                    {data.map((item, index) => (
                        <div key={index} className="w-full sm:w-[240px] sm:min-w-[240px] flex-shrink-0">
                            <CardComponent data={item} />
                        </div>
                    ))}
                </div>
            )}

            {
                button && button.position === "bottom" && (
                    // <ButtonComponent containerClassName="flex justify-center" />
                    <div className="flex justify-center">
                        <Link to={button.path} className="rounded-lg p-5 mt-3 bg-[#DB4444] text-white select-none cursor-pointer hover:bg-[#ff9191]" >
                            {button.text}
                        </Link>
                    </div>

                )
            }

        </section>
    )
}

