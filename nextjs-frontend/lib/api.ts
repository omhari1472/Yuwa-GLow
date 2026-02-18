import type {
  Product, Category, Blog, Career,
  GalleryItem, CarouselItem, Transformation,
  Stockist, Distributor, PartnerAvailability,
  EnquiryData,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.7:8000/api';
export const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://192.168.1.7:8000/storage/';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data: T; message: string }> {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: result.message || 'Server Error',
        errors: result.errors || {},
      };
    }

    return {
      success: true,
      message: result.message || 'Success',
      data: result.data ?? result,
    };
  } catch (error: unknown) {
    console.error(`API Error [${endpoint}]:`, error);
    const err = error as { message?: string };
    return {
      success: false,
      message: err.message || 'Connection Failed',
      data: null as unknown as T,
    };
  }
}

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '/assets/images/placeholder.png';
  if (path.startsWith('http')) return path;
  return `${STORAGE_URL}${path}`;
}

const API = {
  getProducts: () => apiFetch<Product[]>('/products/active'),
  getProduct:  (id: number | string) => apiFetch<Product>(`/products/${id}`),
  getCategories: () => apiFetch<Category[]>('/categories/active'),
  getBlogs:    () => apiFetch<Blog[]>('/blogs/published'),
  getBlog:     (slug: string) => apiFetch<Blog>(`/blogs/${slug}`),
  getCareers:  () => apiFetch<Career[]>('/careers/open'),
  getCareer:   (id: number | string) => apiFetch<Career>(`/careers/${id}`),
  getGallery:  () => apiFetch<GalleryItem[]>('/gallery'),
  getCarousel: () => apiFetch<CarouselItem[]>('/carousel'),
  getTransformations: () => apiFetch<Transformation[]>('/transformations'),
  getDistributors:    () => apiFetch<Distributor[]>('/distributors'),
  getStockists:       () => apiFetch<Stockist[]>('/stockists'),
  getPartnerAvailability: () => apiFetch<PartnerAvailability[]>('/partners/availability'),

  submitEnquiry:     (data: EnquiryData) =>
    apiFetch<{ id: number }>('/enquire', { method: 'POST', body: JSON.stringify(data) }),
  submitApplication: (formData: FormData) =>
    apiFetch<{ id: number }>('/apply', { method: 'POST', body: formData }),
};

export default API;
