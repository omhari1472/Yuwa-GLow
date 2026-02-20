'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import API from '@/lib/api';
import type { Product, Category } from '@/lib/types';
import ProductGrid from '@/components/products/ProductGrid';
import ProductDetail from '@/components/products/ProductDetail';
import { DetailSkeleton } from '@/components/shared/LoadingSkeleton';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

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
      <div className="max-w-7xl mx-auto px-4 py-16">
        <nav className="flex items-center gap-2 text-[11px] text-gray-400 mb-10 flex-wrap">
          <Link href="/" className="hover:text-[#C38636] transition-colors">Home</Link>
          <span className="text-gray-300">/</span>
          <Link href="/products/" className="hover:text-[#C38636] transition-colors">Products</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/products/${category}/`} className="hover:text-[#C38636] transition-colors">{title}</Link>
          {selectedProduct && (
            <>
              <span className="text-gray-300">/</span>
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
          <ProductDetail
            product={selectedProduct}
            category={category}
            relatedProducts={products.filter((p) => p.id !== selectedProduct.id).slice(0, 4)}
          />
        )}
      </div>
    );
  }

  // Category grid view
  return (
    <div>
      {/* Category Hero Header */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #faf8f5 0%, #f0e8da 60%, #e8d9c4 100%)' }}
      >
        {/* Decorative orb */}
        <div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(195,134,54,0.12), transparent 70%)' }}
        />
        <div
          className="absolute -top-10 left-1/4 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(220,178,100,0.08), transparent 70%)' }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-4 py-20 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mb-8">
            <Link href="/" className="hover:text-[#C38636] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products/" className="hover:text-[#C38636] transition-colors">Products</Link>
            <span>/</span>
            <span style={{ color: '#C38636' }}>{title}</span>
          </nav>

          {/* Category label */}
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase mb-4" style={{ color: '#C38636' }}>
            {catMeta?.emoji}&nbsp; YuvaGlow Collection
          </p>

          {/* Title */}
          <h1 className="section-title text-5xl sm:text-6xl mb-5" style={{ color: '#2c2c2c' }}>
            {title}
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-12" style={{ background: 'rgba(195,134,54,0.4)' }} />
            <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: '#C38636' }} />
            <div className="h-px w-12" style={{ background: 'rgba(195,134,54,0.4)' }} />
          </div>

          {catMeta?.description && (
            <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: '#777' }}>
              {catMeta.description}
            </p>
          )}
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Sort / Count Toolbar */}
        {!loading && (
          <div
            className="flex items-center justify-between mb-8 pb-5"
            style={{ borderBottom: '1px solid #f0ebe3' }}
          >
            <p className="text-[12px]" style={{ color: '#999' }}>
              {products.length > 0
                ? `${products.length} ${products.length === 1 ? 'product' : 'products'}`
                : ''}
            </p>

            {products.length > 1 && (
              <div className="relative flex items-center">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none pl-3 pr-8 py-2 text-[12px] rounded-lg cursor-pointer focus:outline-none transition-colors"
                  style={{
                    border: '1.5px solid #e8ddd0',
                    color: '#555',
                    background: 'white',
                  }}
                >
                  <option value="default">Sort: Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="az">Name: A → Z</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 pointer-events-none"
                  style={{ color: '#C38636' }}
                />
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
