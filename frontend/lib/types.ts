export interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  inStock: boolean;
  featured?: boolean;
  badge?: string;
  rating?: number;
  reviews?: number;
  specifications?: {
    material?: string;
    weight?: string;
    dimensions?: string;
    color?: string;
    brand?: string;
    warranty?: string;
    [key: string]: string | undefined;
  };
  audioSamples?: {
    title: string;
    url: string;
    duration: string;
  }[];
  videoUrl?: string;
  videoThumbnail?: string;
  userPhotos?: {
    url: string;
    user: string;
    caption: string;
    uploadedAt: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  subcategories?: string[];
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
