import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";


interface ICategoryCard {
    title: string;
    path: string;
    IconLucide: LucideIcon;
}
export default function CategoryCard({ title, path, IconLucide }: ICategoryCard) {
    return (
        <Link to={path}>
            <div className="w-64 flex-shrink-0 flex flex-col items-center justify-center gap-4 rounded-lg border border-gray-300 bg-white p-6 text-gray-700 shadow-md transition-all duration-300 group hover:bg-red-600 hover:border-red-600 hover:text-white">
                <IconLucide size={100} className="transition-colors duration-300 group-hover:text-white" />
                <p className="text-lg font-medium">{title}</p>
            </div>
        </Link>

    )
}

