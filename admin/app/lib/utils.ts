import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "decimal",
    
  }).format(value)

export const parsePrice = (value: string): number => {
  const normalized = value.replace(/\./g, "").replace(",", ".")
  const parsed = parseFloat(normalized)
  return isNaN(parsed) ? 0 : parsed
}