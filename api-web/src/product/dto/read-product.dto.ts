export class ReadProductDTO {
    id: number;
    name: string;

    shortDescription?: string;

    description: string;
    quantity: number;


    price: number;
    priceConvert: number;
    priceConvertWithDiscount: number;

    images: string[];

    category: string;

    subcategory?: string;
    
    childCategory?: string;

    isAvaible: boolean;

    isSoldOut: boolean;

    isFeatured: boolean;
    hasDiscount?: boolean;
    discount?: number;

}
