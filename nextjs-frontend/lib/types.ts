export interface ProductImage {
  id: number;
  image_url: string;
}

export interface ProductVariant {
  id: number;
  variant_name: string;
  variant_value: string;
  price: string | number;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  category_id: number;
  category?: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image_url?: string;
  author?: string;
  published_at?: string;
  created_at: string;
}

export interface Career {
  id: number;
  title: string;
  department?: string;
  location?: string;
  type?: string; // full-time, part-time, etc.
  description: string;
  requirements?: string;
  created_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  media_url: string;
}

export interface CarouselItem {
  id: number;
  image_url: string;
  mobile_image_url?: string;
  title?: string;
  subtitle?: string;
}

export interface Transformation {
  id: number;
  title: string;
  description?: string;
  before_image: string;
  after_image: string;
}

export interface Stockist {
  id: number;
  name?: string;
  state: string;
  district?: string;
  address?: string;
  phone?: string;
}

export interface Distributor {
  id: number;
  name?: string;
  state: string;
  district: string;
  address?: string;
  phone?: string;
}

export interface PartnerAvailability {
  id: number;
  application_type: 'super_stockist' | 'distributor';
  state: string;
  district?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface EnquiryData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  product?: string;
}
