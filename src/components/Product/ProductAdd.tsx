import { ProductSelect } from '@/lib/db/schema/products';
import ProductAddCartRadioGroup from './ProductAddCartRadioGroup';
import { db } from '@/lib/db';
import { productEntries } from '@/lib/db/schema/productEntries';
import { sizes } from '@/lib/db/schema/sizes';
import { and, eq, gt } from 'drizzle-orm';
import { wait } from '@/lib/util';

interface ProductAddProps {
  productId: ProductSelect['id'];
}

const ProductAdd = async ({ productId }: ProductAddProps) => {
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
    />
  );
};
export default ProductAdd;
