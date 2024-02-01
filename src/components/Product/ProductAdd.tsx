import { db } from '@/lib/db';
import { ClothingSelect } from '@/lib/db/schema/clothing';
import { productEntries } from '@/lib/db/schema/productEntries';
import { ProductSelect } from '@/lib/db/schema/products';
import { sizes } from '@/lib/db/schema/sizes';
import { and, eq, gt } from 'drizzle-orm';
import { unstable_noStore as noStore } from 'next/cache';
import ProductAddCartRadioGroup from './ProductAddCartRadioGroup';

interface ProductAddProps {
  productId: ProductSelect['id'];
  name: ProductSelect['name'];
  price: ProductSelect['price'];
  clothing: ClothingSelect['name'];
}

const ProductAdd = async ({
  productId,
  name,
  price,
  clothing,
}: ProductAddProps) => {
  noStore();
  const productAvailableSizes = await db
    .selectDistinct({ sizeName: sizes.name, sizeId: sizes.id })
    .from(sizes)
    .innerJoin(productEntries, eq(productEntries.sizeID, sizes.id))
    .where(
      and(
        eq(productEntries.productID, productId),
        gt(productEntries.quantity, 0),
      ),
    )
    .orderBy(sizes.id);

  return (
    <ProductAddCartRadioGroup
      sizeOptions={productAvailableSizes}
      productId={productId}
      name={name}
      price={price}
      clothing={clothing}
    />
  );
};
export default ProductAdd;
