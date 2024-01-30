import { db } from '@/lib/db';
import { productImages } from '@/lib/db/schema/productImages';
import { eq } from 'drizzle-orm';
import Image from 'next/image';
import ProductImageShowcase from './ProductImageShowcase';

const ProductImage = async ({ productId }: { productId: number }) => {
  const images = (
    await db
      .select({ url: productImages.url, isDefault: productImages.isDefault })
      .from(productImages)
      .where(eq(productImages.productID, productId))
  ).map((img, i) => ({ ...img, alt: `Product Image ${i + 1}` }));

  if (images.length === 0)
    return (
      <div className="flex h-full max-h-[34rem] items-center justify-center gap-4 rounded-main bg-primary-50 text-xl font-medium">
        <span>N/A</span>
      </div>
    );

  return <ProductImageShowcase images={images} />;
};
export default ProductImage;
