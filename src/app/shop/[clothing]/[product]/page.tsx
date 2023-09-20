import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';
import { products } from '@/lib/db/schema/products';
import { eq, sql, and } from 'drizzle-orm';

interface PageProps {
  params: {
    clothing: string;
    product: string;
  };
}

// http://localhost:3000/shop/t-shirts/modern-metal-fish

export const dynamicParams = false;

export const revalidate = 0;

export async function generateStaticParams() {
  const slugs = await db.query.products.findMany({
    columns: {
      name: true,
    },
    with: {
      clothing: {
        columns: {
          name: true,
        },
      },
    },
  });

  return slugs.map((slug) => ({
    clothing: slug.clothing?.name,
    product: slug.name.replaceAll(' ', '-').toLowerCase(),
  }));
}

export const page = async ({ params }: PageProps) => {
  const productSlug = params.product.replaceAll('-', ' ');

  const product = await db
    .select()
    .from(products)
    .innerJoin(clothing, eq(clothing.id, products.clothingID))
    .where(
      and(
        eq(sql`lower(${products.name})`, productSlug),
        eq(clothing.name, params.clothing),
      ),
    )
    .limit(1);

  return (
    <div>
      <p>{JSON.stringify(product)}</p>
    </div>
  );
};
export default page;
