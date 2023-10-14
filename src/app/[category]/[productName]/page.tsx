import { Icons } from '@/components/Svgs/icons';
import ProductAdd from '@/components/UI/ProductAdd';
import Star from '@/components/UI/Star';
import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';
import { products } from '@/lib/db/schema/products';
import { makeValidURL } from '@/lib/util';
import { and, eq, sql } from 'drizzle-orm';
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
  searchParams: { [key: string]: string | string[] | undefined };
}

const ProductPage = async ({ params, searchParams }: PageProps) => {
  const [product] = await db
    .select()
    .from(products)
    .innerJoin(clothing, eq(products.clothingID, clothing.id))
    .where(
      and(
        eq(clothing.name, params.category),
        eq(
          products.id,
          Number.parseInt(
            params.productName.slice(params.productName.lastIndexOf('-') + 1),
          ),
        ),
      ),
    );

  // if (
  //   product === undefined ||
  //   `${makeValidURL(product.products.name)}-${product.products.id}` !==
  //     params.productName
  // ) {
  //   notFound();
  // }

  return (
    <main className="container-main pt-20">
      <section>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex gap-4">
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
            <div className="max-h-[34rem] flex-grow overflow-hidden rounded-main">
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
              {product.products.name}
            </h1>
            <div className="mb-5 flex gap-4">
              <Star rating={4.5} />
              <span className="inline-block font-medium text-black/60">
                <span className="text-black">4.0/</span>5.0
              </span>
            </div>
            <div className="mb-5">
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(Number.parseFloat(product.products.price))}
              </span>
            </div>
            <p className="text-lg text-black/60 [text-wrap:balance]">
              {product.products.description}
            </p>
            <div className="my-6 h-px w-full bg-black/10" />
            <Suspense fallback={<div>Sizes Loading...</div>}>
              <ProductAdd productId={product.products.id} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
