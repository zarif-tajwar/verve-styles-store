import { db } from '@/lib/db';
import { clothing } from '@/lib/db/schema/clothing';
import { productRating } from '@/lib/db/schema/productRating';
import { products } from '@/lib/db/schema/products';
import { productSalesCount } from '@/lib/db/schema/productSalesCount';
import { desc, eq } from 'drizzle-orm';
import FeaturedItem from './FeaturedItem';
import { productImages } from '@/lib/db/schema/productImages';

const Featured = async () => {
  const newArrivalsPromise = db
    .selectDistinct({
      productId: products.id,
      productName: products.name,
      productPrice: products.price,
      rating: productRating.averageRating,
      category: clothing.name,
      updatedAt: products.updatedAt,
      image: productImages.url,
    })
    .from(products)
    .innerJoin(clothing, eq(products.clothingID, clothing.id))
    .innerJoin(productRating, eq(products.id, productRating.productId))
    .innerJoin(productImages, eq(products.id, productImages.productID))
    .where(eq(productImages.isDefault, true))
    .orderBy(desc(products.updatedAt), products.id)
    .limit(4)
    .then((data) => data.map((product) => ({ ...product, updatedAt: null })));
  const topSellingPromise = db
    .selectDistinct({
      productId: products.id,
      productName: products.name,
      productPrice: products.price,
      rating: productRating.averageRating,
      category: clothing.name,
      updatedAt: products.updatedAt,
      salesCount: productSalesCount.totalSales,
      image: productImages.url,
    })
    .from(products)
    .innerJoin(clothing, eq(products.clothingID, clothing.id))
    .innerJoin(productRating, eq(products.id, productRating.productId))
    .innerJoin(productImages, eq(products.id, productImages.productID))
    .innerJoin(productSalesCount, eq(products.id, productSalesCount.productId))
    .where(eq(productImages.isDefault, true))
    .orderBy(desc(productSalesCount.totalSales), products.id)
    .limit(4)
    .then((data) =>
      data.map((product) => ({
        ...product,
        updatedAt: null,
        salesCount: null,
      })),
    );

  const [newArrivals, topSelling] = await Promise.all([
    newArrivalsPromise,
    topSellingPromise,
  ]);
  return (
    <section>
      <div className="container-main mt-3 divide-y divide-black/10">
        <FeaturedItem
          title="New Arrivals"
          href="/shop"
          products={newArrivals}
        />
        <FeaturedItem
          title="Top Selling"
          href="/shop?sort_by=most+popular"
          products={topSelling}
        />
      </div>
    </section>
  );
};

export default Featured;
