
export interface OfferSectionProps {
  title: string
  endDate?: Date
  products: Product[]
}

export interface Product {
  id: string
  name: string
  image: string
  discountPercentage: number
  price: number
  offerPrice: number,
  IsSoldOut: boolean,
  IsDiscount: boolean
}

export interface IProduct {
    id:              number;
    name:             string;
    shortDescription: string;
    description:      string;
    quantity:         number;
    price:            number;
    images:           string[];
    category:         string;
    subcategory:      string;
    isAvaible:        boolean;
    isFeatured:       boolean;
    hasDiscount:      boolean;
    discount:         number;
    isSoldOut:        boolean;
    isDeleted:        boolean;
    createdAt:        string;
    updatedAt:        string;
    __v:              number;
    sortPriority:     number;
    priceConvert:     number;
    priceConvertWithDiscount : number;
    freeShipping: boolean;
    returnPolicy: boolean;
    colors:string[];
    sizes:string[];
}

export interface BannerItem {
  id: string | number;
  image: string;
  priority: 1 | 2 | 3;
  description?: string;
  name: string;
  button?: {
    path: string;
    text: string
  },
  theme: "light" | "dark";
}


export interface IHomeConfig{
  id: string;
  banners: IBanner[],
  sections: ISection[],
  bannerGrid: IBannerGrid;
}

export interface IBanner{
  id: string | number,
  images : {
    sm: string,
    md: string,
    xl: string
  }
  text: string,
  link: string
}

export interface ISection {
    id: string | number;
    section: string;
    title: string;
    endDate?: Date;
    button?: {
        text: string;
        path: string;
        position: "bottom" | "top";
    };
    showButtonSlider: boolean;
    secondLine: boolean;
}

export interface IBannerGrid{
  title : string;
  section: string;
  items: IItemsGrid[]
}
export interface IItemsGrid{
  id: string |number;
  image: string;
  title: string;
  subtitle?: string;
  button?:{
    text: string;
    link: string;
  }
  theme: "light" | "dark",
  priority: 1 | 2 | 3;
}


export interface ICategory {
    id:           number;
    name:          string;
    subcategories: Subcategory[];
    createdAt:     Date;
    updatedAt:     Date;
}

export interface Subcategory {
    name:     string;
    childCategories: Child[];
    id:      number;
}

export interface Child {
    name: string;
    id:  number;
}

export interface IDiscountOptions{
    label: string;
    value:string
}

