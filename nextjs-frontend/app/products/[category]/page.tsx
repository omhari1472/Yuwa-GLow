import CategoryClient from './CategoryClient';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  return <CategoryClient category={category} />;
}

export function generateStaticParams() {
  return [
    { category: 'hair' },
    { category: 'skin' },
    { category: 'makeup' },
    { category: 'salon' },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${title} Products`,
    description: `Explore YuvaGlow's premium ${title} products.`,
  };
}
