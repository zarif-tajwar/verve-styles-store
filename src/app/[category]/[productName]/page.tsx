import ProductDetailsReviewFaq from '@/components/HomePage/ProductDetailsReviewFaq';
import ProductAdd from '@/components/Product/ProductAdd';
import Star from '@/components/UI/Star';
import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';
import { productRating } from '@/lib/db/schema/productRating';
import { products } from '@/lib/db/schema/products';
import { makeValidURL } from '@/lib/util';
import { and, eq, getTableColumns, sql } from 'drizzle-orm';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

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

export const dynamicParams = false;

interface PageProps {
  params: { category: string; productName: string };
  searchParams: SearchParamsServer;
}

const ProductPage = async ({ params, searchParams }: PageProps) => {
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
    .innerJoin(productRating, eq(products.id, productRating.productId))
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
    <main className="container-main pt-20">
      <section>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex max-h-[34rem] gap-4">
            <div className="grid h-full w-[152px] grid-cols-1 grid-rows-3 gap-4">
              <div className="overflow-hidden rounded-main ring-2 ring-black/60">
                <Image
                  src={'/products/one-life-graphic-tshirt.png'}
                  alt="One Life Graphic T-Shirt"
                  width={444}
                  height={666}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-main">
                <Image
                  src={'/products/one-life-graphic-tshirt-back.png'}
                  alt="One Life Graphic T-Shirt Back"
                  width={444}
                  height={666}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-main">
                <Image
                  src={'/products/one-life-graphic-tshirt-model.png'}
                  alt="One Life Graphic T-Shirt Model"
                  width={444}
                  height={666}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="flex-grow overflow-hidden rounded-main">
              <Image
                src={'/products/one-life-graphic-tshirt.png'}
                alt="One Life Graphic T-Shirt"
                width={444}
                height={666}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="mb-3.5 font-integral-cf text-4xl font-bold">
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
            <Suspense fallback={<div>Sizes Loading...</div>}>
              <ProductAdd productId={product.id} />
            </Suspense>
          </div>
        </div>
      </section>
      <section className="mt-20">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductDetailsReviewFaq
            productId={productId}
            searchParams={searchParams}
          />
        </Suspense>
      </section>
    </main>
  );
};

export default ProductPage;
