import { Icons } from '@/components/Svgs/icons';
import Image from 'next/image';
import { getProductsFromDB } from '@/lib/dbCalls/filter';
import ShopFilterPagination from '@/components/UI/ShopFilterPagination';
import { makeValidURL } from '@/lib/util';
import Star from '@/components/UI/Star';
import { FilteredProductItem } from '@/lib/dbCalls/filter';
import Link from 'next/link';

export const revalidate = 0;

const ShopPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsServer;
}) => {
  const productItems = await getProductsFromDB(searchParams);

  if (productItems === undefined) return null;

  const totalProducts = productItems?.at(0)?.totalCount || 0;

  return (
    <div>
      <div className="grid grid-cols-3 gap-x-5 gap-y-9">
        {productItems.map((product, i) => {
          return <ProductListing key={i} product={product} />;
        })}
      </div>
      <div className="pt-16">
        <ShopFilterPagination totalProducts={totalProducts} />
      </div>
    </div>
  );
};

export default ShopPage;

const ProductListing = ({ product }: { product: FilteredProductItem }) => {
  const ratingStr = product.averageRating || '0.0';
  const ratingFloat = Number.parseFloat(ratingStr);

  return (
    <Link
      href={`/${makeValidURL(product.categoryName!)}/${makeValidURL(
        product.name,
      )}-${product.id}`}
    >
      <div>
        <div className="mb-4 aspect-square w-full overflow-hidden rounded-main">
          <Image
            src={'/products/black-striped-tshirt.png'}
            alt="product"
            width={300}
            height={300}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="mb-2 font-plus-jakarta-sans text-xl font-bold capitalize">
            {product.name}
          </h3>
        </div>
        <div className="mb-2 flex gap-3">
          <Star rating={ratingFloat} size="sm" />
          <p className="text-sm font-medium text-black/60">
            <span className="text-black">{ratingStr}/</span>5.0
          </p>
        </div>
        <p className="text-2xl font-bold">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(Number.parseFloat(product.price))}
        </p>
      </div>
    </Link>
  );
};
