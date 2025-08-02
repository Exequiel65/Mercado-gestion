import { Link } from "react-router";
import type { IBannerGrid, IItemsGrid } from "~/types/Products";

export default function NewArrivalBanner({title, section, items}: IBannerGrid) {
    const getSpacesByPriority = (priority: number) => {
        switch (priority) {
            case 1:
                return 4; // 2x2
            case 2:
                return 2; // 2x1
            case 3:
            default:
                return 1; // 1x1
        }
    };

    const getSpanClass = (priority: number): string => {
        switch (priority) {
            case 1:
                return "col-span-4 sm:col-span-2 row-span-4";
            case 2:
                return "col-span-4 sm:col-span-2 row-span-2";
            case 3:
            default:
                return "col-span-2 sm:col-span-1 row-span-2";
        }
    };


    const selectedItems: IItemsGrid[] = [];
    let usedSpaces = 0;
    const maxSpaces = 16;

    for (const item of items) {
        const itemSpaces = getSpacesByPriority(item.priority);
        if (usedSpaces + itemSpaces <= maxSpaces) {
            selectedItems.push(item);
            usedSpaces += itemSpaces;
        }
        if (usedSpaces >= maxSpaces) break;
    }

    if (selectedItems.length < 2) {
        const extra = items.filter((d) => !selectedItems.includes(d));
        selectedItems.push(...extra.slice(0, 2 - selectedItems.length));
    }

    return (
        <section className="py-10">
            <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="bg-red-600 text-white font-bold px-4 py-1 uppercase tracking-wide w-min text-center">
                        {section}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold">{title}</h2>
                </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 grid-rows-auto gap-4 h-[600px]">
                {selectedItems.map((item, idx) => (
                    <div
                        key={idx}
                        className={`${getSpanClass(item.priority)} relative rounded-xs overflow-hidden`}
                    >
                        <div className={`absolute bottom-0 left-0 right-0 p-4 ${item.theme === "dark" ? "text-black" : "text-white" }`}>
                            <h3 className="text-2xl font-semibold">{item.title}</h3>
                            <p className="text-sm mb-2">{item.subtitle}</p>
                            {item.button && (
                                <Link
                                    to={item.button.link ?? ""}
                                    className={`inline-block ${item.theme === "dark" ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black hover:bg-gray-200"}  text-sm px-4 py-2 rounded  transition`}
                                >
                                    {item.button.text}
                                </Link>
                            )}

                        </div>
                        <img
                            src={item.image}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}