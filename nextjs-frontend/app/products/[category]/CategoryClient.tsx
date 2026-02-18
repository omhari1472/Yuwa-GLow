'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import API from '@/lib/api';
import type { Product, Category } from '@/lib/types';
import ProductGrid from '@/components/products/ProductGrid';
import ProductDetail from '@/components/products/ProductDetail';
import { DetailSkeleton } from '@/components/shared/LoadingSkeleton';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

interface CategoryClientInnerProps {
  category: string;
}

function CategoryClientInner({ category }: CategoryClientInnerProps) {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const catMeta = PRODUCT_CATEGORIES.find((c) => c.slug === category);
  const title = catMeta?.label || category.charAt(0).toUpperCase() + category.slice(1);

  // Load product list
  useEffect(() => {
    if (!category) return;
    setLoading(true);

    Promise.all([API.getProducts(), API.getCategories()]).then(
      ([productsRes, categoriesRes]) => {
        const allProducts: Product[] = Array.isArray(productsRes.data) ? productsRes.data : [];
        const allCategories: Category[] = Array.isArray(categoriesRes.data) ? categoriesRes.data : [];

        const cat = allCategories.find((c) =>
          c.name.toLowerCase().includes(category.toLowerCase())
        );

        let filtered: Product[];
        if (cat) {
          filtered = allProducts.filter((p) => p.category_id === cat.id);
        } else {
          filtered = allProducts.filter(
            (p) =>
              p.name.toLowerCase().includes(category) ||
              (p.description && p.description.toLowerCase().includes(category))
          );
        }

        setProducts(filtered);
        setLoading(false);
      }
    );
  }, [category]);

  // Load product detail when ?id is present
  useEffect(() => {
    if (!productId) {
      setSelectedProduct(null);
      return;
    }
    // Check if already in products list
    const found = products.find((p) => String(p.id) === productId);
    if (found) {
      setSelectedProduct(found);
      return;
    }
    // Fetch individually
    setDetailLoading(true);
    API.getProduct(productId).then((res) => {
      if (res.success && res.data) {
        setSelectedProduct(res.data);
      }
      setDetailLoading(false);
    });
  }, [productId, products]);

  // Product detail view
  if (productId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <nav className="flex items-center gap-2 text-[11px] text-gray-400 mb-10 flex-wrap">
          <Link href="/" className="hover:text-[#C38636]">Home</Link>
          <span>/</span>
          <Link href="/products/" className="hover:text-[#C38636]">Products</Link>
          <span>/</span>
          <Link href={`/products/${category}/`} className="hover:text-[#C38636]">{title}</Link>
          {selectedProduct && (
            <>
              <span>/</span>
              <span style={{ color: '#C38636' }}>{selectedProduct.name}</span>
            </>
          )}
        </nav>

        {(detailLoading || (!selectedProduct && loading)) && <DetailSkeleton />}

        {!detailLoading && !selectedProduct && !loading && (
          <div className="text-center py-20">
            <h2 className="font-serif text-3xl mb-4">Product Not Found</h2>
            <Link href={`/products/${category}/`} className="cta-link">Back to {title}</Link>
          </div>
        )}

        {selectedProduct && (
          <ProductDetail product={selectedProduct} category={category} />
        )}
      </div>
    );
  }

  // Product grid view
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <nav className="flex items-center gap-2 text-[11px] text-gray-400 mb-10">
        <Link href="/" className="hover:text-[#C38636]">Home</Link>
        <span>/</span>
        <Link href="/products/" className="hover:text-[#C38636]">Products</Link>
        <span>/</span>
        <span style={{ color: '#C38636' }}>{title}</span>
      </nav>

      <div className="mb-12">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: '#C38636' }}>
          {catMeta?.emoji} {catMeta?.label || 'Collection'}
        </p>
        <h1 className="section-title text-4xl sm:text-5xl mb-3">{title} Products</h1>
        {catMeta?.description && (
          <p className="text-sm text-gray-500 max-w-lg">{catMeta.description}</p>
        )}
      </div>

      <ProductGrid products={products} category={category} loading={loading} />
    </div>
  );
}

interface CategoryClientProps {
  category: string;
}

export default function CategoryClient({ category }: CategoryClientProps) {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16"><DetailSkeleton /></div>}>
      <CategoryClientInner category={category} />
    </Suspense>
  );
}
