import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';
import { products } from '@/lib/db/schema/products';
import { makeValidURL } from '@/lib/util';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

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
  searchParams: { [key: string]: string | string[] | undefined };
}

const ProductPage = async ({ params, searchParams }: PageProps) => {
  const sql = db
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
    )
    .toSQL();

  // const exec = await db.execute(sql.sql)

  return <div>{sql.sql}</div>;

  // const [product] = await db
  //   .select()
  //   .from(products)
  //   .innerJoin(clothing, eq(products.clothingID, clothing.id))
  //   .where(
  //     and(
  //       eq(clothing.name, params.category),
  //       eq(
  //         products.id,
  //         Number.parseInt(
  //           params.productName.slice(params.productName.lastIndexOf('-') + 1),
  //         ),
  //       ),
  //     ),
  //   );

  // if (
  //   product === undefined ||
  //   `${makeValidURL(product.products.name)}-${product.products.id}` !==
  //     params.productName
  // ) {
  //   notFound();
  // }

  // return (
  //   <div>
  //     <div>Params: {JSON.stringify(params)}</div>
  //     <div>SearchParams: {JSON.stringify(searchParams)}</div>
  //     <div>Product: {JSON.stringify(product)}</div>
  //     <div>{typeof product}</div>
  //   </div>
  // );
};

export default ProductPage;
