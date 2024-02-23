import ProductAdd from '@/components/Product/ProductAdd';
import ProductAddSkeleton from '@/components/Product/ProductAddSkeleton';
import ProductDetailsReviewFaqTab from '@/components/Product/ProductDetailsReviewFaqTab';
import ProductImage from '@/components/Product/ProductImage';
import ProductReviews from '@/components/Product/ProductReviews';
import { Container } from '@/components/UI/Container';
import Star from '@/components/UI/Star';
import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';
import { productImages } from '@/lib/db/schema/productImages';
import { productRating } from '@/lib/db/schema/productRating';
import { products } from '@/lib/db/schema/products';
import { SearchParamsServer } from '@/lib/types/common';
import { makeValidURL } from '@/lib/util';
import { and, eq, getTableColumns } from 'drizzle-orm';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense, cache } from 'react';

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

const getProduct = cache(
  async ({ params }: { params: PageProps['params'] }) => {
    const productColumns = getTableColumns(products);
    const productId = Number.parseInt(
      params.productName.slice(params.productName.lastIndexOf('-') + 1),
    );

    if (Number.isNaN(productId)) {
      notFound();
    }

    const product = await db
      .select({
        ...productColumns,
        averageRating: productRating.averageRating,
        image: productImages.url,
      })
      .from(products)
      .innerJoin(clothing, eq(products.clothingID, clothing.id))
      .leftJoin(productRating, eq(products.id, productRating.productId))
      .leftJoin(productImages, eq(products.id, productImages.productID))
      .where(
        and(
          eq(clothing.name, params.category),
          eq(products.id, productId),
          eq(productImages.isDefault, true),
        ),
      )
      .limit(1)
      .then((res) => res.at(0));

    if (
      product === undefined ||
      `${makeValidURL(product.name)}-${product.id}` !== params.productName
    ) {
      notFound();
    }

    return product;
  },
);

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const product = await getProduct({ params });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${product.name} - Verve Styles`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Verve Styles`,
      description: product.description ?? undefined,
      images: product.image ? [...previousImages, product.image] : undefined,
    },
  };
}

const ProductPage = async ({ params }: PageProps) => {
  const product = await getProduct({ params });

  const ratingStr = product.averageRating || '0.0';
  const ratingFloat = Number.parseFloat(ratingStr);

  return (
    <main>
      <Container asChild className="py-4 md:py-8 lg:py-16 xl:py-20">
        <section>
          <div
            className={
              'grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1fr] lg:grid-cols-[0.8fr_1fr] lg:gap-10 xl:grid-cols-2 xl:gap-16'
            }
          >
            <ProductImage productId={product.id} />
            <div>
              <h1 className="mb-3.5 text-balance font-integral-cf text-[clamp(1.75rem,0.9761904761904763rem+3.1746031746031744vw,2.5rem)] font-bold leading-none">
                {product.name}
              </h1>
              <div className="mb-5 flex gap-4">
                <Star rating={ratingFloat} />
                <span className="inline-block font-medium text-primary-400">
                  <span className="text-primary-900">{ratingStr}</span>/5.0
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
              <p className="text-balance text-base text-primary-400 md:text-lg">
                {product.description}
              </p>
              <div className="my-6 h-px w-full bg-primary-100" />
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
      </Container>
      <section className="py-20 lg:py-16 xl:py-20">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductDetailsReviewFaqTab
            ReviewsComp={
              <Suspense fallback={<p>Loading Reviews...</p>}>
                <ProductReviews productId={product.id} />
              </Suspense>
            }
          />
        </Suspense>
      </section>
    </main>
  );
};

export default ProductPage;
