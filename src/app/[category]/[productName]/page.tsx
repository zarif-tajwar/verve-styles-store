import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';
import { products } from '@/lib/db/schema/products';
import { makeValidURL } from '@/lib/util';
import { eq } from 'drizzle-orm';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await db
    .select({
      name: products.name,
      id: products.id,
      category: clothing.name,
    })
    .from(products)
    .innerJoin(clothing, eq(products.clothingID, clothing.id));

  return slugs.map((slug) => ({
    category: makeValidURL(slug.category),
    productName: `${makeValidURL(slug.name)}-${slug.id}`,
  }));
}

interface PageProps {
  params: { category: string; productName: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const ProductPage = async ({ params, searchParams }: PageProps) => {
  return (
    <div>
      <div>Params: {JSON.stringify(params)}</div>
      <div>SearchParams: {JSON.stringify(searchParams)}</div>
    </div>
  );
};

export default ProductPage;
