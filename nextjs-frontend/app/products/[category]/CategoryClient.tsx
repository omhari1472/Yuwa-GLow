'use client';

import ProductDetail from '@/components/products/ProductDetail';
import ProductGrid from '@/components/products/ProductGrid';
import { DetailSkeleton } from '@/components/shared/LoadingSkeleton';
import API from '@/lib/api';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import type { Category, Product } from '@/lib/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'az';

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
  const [sort, setSort] = useState<SortOption>('default');

  const catMeta = PRODUCT_CATEGORIES.find((c) => c.slug === category);
  const title = catMeta?.label || category.charAt(0).toUpperCase() + category.slice(1);

  const sortedProducts = useMemo(() => {
    const copy = [...products];
    switch (sort) {
      case 'price-asc':
        return copy.sort((a, b) => parseFloat(String(a.price)) - parseFloat(String(b.price)));
      case 'price-desc':
        return copy.sort((a, b) => parseFloat(String(b.price)) - parseFloat(String(a.price)));
      case 'az':
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return copy;
    }
  }, [products, sort]);

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
    const found = products.find((p) => String(p.id) === productId);
    if (found) {
      setSelectedProduct(found);
      return;
    }
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
      <div className="bg-[#faf8f4] min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-[#2c2c2c]/50 mb-12 flex-wrap font-medium">
            <Link href="/" className="hover:text-[#C38636] transition-colors">Home</Link>
            <span className="text-[#2c2c2c]/30">/</span>
            <Link href="/products/" className="hover:text-[#C38636] transition-colors">Products</Link>
            <span className="text-[#2c2c2c]/30">/</span>
            <Link href={`/products/${category}/`} className="hover:text-[#C38636] transition-colors">{title}</Link>
            {selectedProduct && (
              <>
                <span className="text-[#2c2c2c]/30">/</span>
                <span style={{ color: '#C38636' }}>{selectedProduct.name}</span>
              </>
            )}
          </nav>

          {(detailLoading || (!selectedProduct && loading)) && <DetailSkeleton />}

          {!detailLoading && !selectedProduct && !loading && (
            <div className="text-center py-32">
              <h2 className="font-serif text-3xl sm:text-4xl mb-6 text-[#2c2c2c]">Product Not Found</h2>
              <Link
                href={`/products/${category}/`}
                className="inline-flex items-center justify-center px-8 py-3 text-[11px] tracking-[0.2em] uppercase font-semibold text-white transition-all duration-300 hover:bg-black"
                style={{ background: '#0a0804' }}
              >
                Back to {title}
              </Link>
            </div>
          )}

          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              category={category}
              relatedProducts={products.filter((p) => p.id !== selectedProduct.id).slice(0, 4)}
            />
          )}
        </div>
      </div>
    );
  }

  // Category grid view
  return (
    <div className="bg-[#faf8f4] min-h-screen">
      {/* Category Hero Header */}
      <div
        className="relative overflow-hidden bg-[#0A0804]"
      >
        {/* Decorative lighting */}
        <div
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(195,134,54,0.3), transparent 70%)', filter: 'blur(50px)' }}
        />
        <div
          className="absolute -top-20 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(220,178,100,0.2), transparent 70%)', filter: 'blur(40px)' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-24 sm:py-32 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-[10px] tracking-[0.15em] uppercase text-white/40 mb-10">
            <Link href="/" className="hover:text-[#C38636] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products/" className="hover:text-[#C38636] transition-colors">Products</Link>
            <span>/</span>
            <span style={{ color: '#DCB264' }}>{title}</span>
          </nav>

          {/* Category label */}
          <h1 className="font-serif text-5xl sm:text-7xl mb-6 text-[#faf8f4]">
            {title}
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.2)' }} />
            <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
            <div className="h-px w-16" style={{ background: 'rgba(195,134,54,0.2)' }} />
          </div>

          {catMeta?.description && (
            <p className="text-sm sm:text-base leading-relaxed max-w-lg mx-auto text-white/60">
              {catMeta.description}
            </p>
          )}
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">

        {/* Sort / Count Toolbar */}
        {!loading && (
          <div
            className="flex items-center justify-between mb-10 pb-6 border-b border-black/5"
          >
            <p className="font-sans text-[11px] tracking-[0.1em] text-[#2c2c2c]/50 uppercase font-medium">
              {products.length > 0
                ? `${products.length} ${products.length === 1 ? 'Product' : 'Products'} found`
                : ''}
            </p>

            {products.length > 1 && (
              <div className="relative flex items-center group">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none pl-4 pr-10 py-2.5 text-[11px] tracking-[0.05em] uppercase font-medium rounded-sm cursor-pointer focus:outline-none transition-all duration-300 bg-transparent"
                  style={{
                    border: '1px solid rgba(0,0,0,0.1)',
                    color: '#2c2c2c',
                  }}
                >
                  <option value="default">Sort: Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="az">Name: A → Z</option>
                </select>
                <div className="absolute right-3 pointer-events-none text-[#C38636] transition-transform duration-300 group-hover:translate-y-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        <ProductGrid products={sortedProducts} category={category} loading={loading} />
      </div>
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
