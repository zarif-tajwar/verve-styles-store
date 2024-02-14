import ProductAdd from '@/components/Product/ProductAdd';
import ProductAddSkeleton from '@/components/Product/ProductAddSkeleton';
import ProductDetailsReviewFaqTab from '@/components/Product/ProductDetailsReviewFaqTab';
import ProductImage from '@/components/Product/ProductImage';
import ProductImageShowcase2 from '@/components/Product/ProductImageShowcase';
import ProductReviews from '@/components/Product/ProductReviews';
import { Container } from '@/components/UI/Container';
import Star from '@/components/UI/Star';
import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';
import { productRating } from '@/lib/db/schema/productRating';
import { products } from '@/lib/db/schema/products';
import { SearchParamsServer } from '@/lib/types/common';
import { cn, makeValidURL } from '@/lib/util';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// export async function generateStaticParams() {
//   const slugs = await db
//     .select({
//       name: products.name,
//       id: products.id,
//       category: clothing.name,
//     })
//     .from(products)
//     .innerJoin(clothing, eq(products.clothingID, clothing.id));

//   return slugs.map((slug) => ({
//     category: makeValidURL(slug.category),
//     productName: `${makeValidURL(slug.name)}-${slug.id}`,
//   }));
// }

// export const dynamicParams = false;

interface PageProps {
  params: { category: string; productName: string };
  searchParams: SearchParamsServer;
}

const ProductPage = async ({ params }: PageProps) => {
  const productColumns = getTableColumns(products);
  const productId = Number.parseInt(
    params.productName.slice(params.productName.lastIndexOf('-') + 1),
  );

  if (Number.isNaN(productId)) {
    notFound();
  }

  const [product] = await db
    .select({ ...productColumns, averageRating: productRating.averageRating })
    .from(products)
    .innerJoin(clothing, eq(products.clothingID, clothing.id))
    .leftJoin(productRating, eq(products.id, productRating.productId))
    .where(and(eq(clothing.name, params.category), eq(products.id, productId)))
    .limit(1);

  if (
    product === undefined ||
    `${makeValidURL(product.name)}-${product.id}` !== params.productName
  ) {
    notFound();
  }

  const ratingStr = product.averageRating || '0.0';
  const ratingFloat = Number.parseFloat(ratingStr);

  return (
    <Container asChild className="pt-20">
      <main>
        <section>
          <div
            className={
              'grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1fr] lg:grid-cols-2 lg:gap-10 xl:gap-16'
            }
          >
            <ProductImage productId={product.id} />
            <div>
              <h1 className="mb-3.5 text-balance font-integral-cf text-4xl font-bold">
                {product.name}
              </h1>
              <div className="mb-5 flex gap-4">
                <Star rating={ratingFloat} />
                <span className="inline-block font-medium text-black/60">
                  <span className="text-black">{ratingStr}</span>/5.0
                </span>
              </div>
              <div className="mb-5">
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(Number.parseFloat(product.price))}
                </span>
              </div>
              <p className="text-lg text-black/60 [text-wrap:balance]">
                {product.description}
              </p>
              <div className="my-6 h-px w-full bg-black/10" />
              <Suspense fallback={<ProductAddSkeleton />}>
                <ProductAdd
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  clothing={params.category}
                />
              </Suspense>
            </div>
          </div>
        </section>
        <section className="mt-20">
          <Suspense fallback={<div>Loading...</div>}>
            <ProductDetailsReviewFaqTab
              ReviewsComp={
                <Suspense fallback={<p>Loading Reviews...</p>}>
                  <ProductReviews productId={productId} />
                </Suspense>
              }
            />
          </Suspense>
        </section>
      </main>
    </Container>
  );
};

export default ProductPage;
