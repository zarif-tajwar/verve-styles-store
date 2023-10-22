import { Icons } from '@/components/Svgs/icons';
import Image from 'next/image';
import { getProductsFromDB } from '@/lib/dbCalls/filter';
import ShopFilterPagination from '@/components/UI/ShopFilterPagination';
import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';
import Link from 'next/link';
import { makeValidURL } from '@/lib/util';
import Star from '@/components/UI/Star';
import { FilteredProductItem } from '@/lib/dbCalls/filter';

// const staticProducts = [
//   { name: 'Awesome Soft Computer', price: '8889.00' },
//   { name: 'Elegant Bronze Gloves', price: '1969.00' },
//   { name: 'Electronic Cotton Chair', price: '6091.00' },
//   { name: 'Licensed Rubber Table', price: '4264.00' },
//   { name: 'Electronic Soft Bike', price: '3239.00' },
//   { name: 'Electronic Wooden Chips', price: '4521.00' },
//   { name: 'Unbranded Fresh Car', price: '4394.00' },
//   { name: 'Modern Metal Fish', price: '8554.00' },
//   { name: 'Electronic Granite Cheese', price: '598.00' },
// ];

export const revalidate = 0;

// type ProductItemProps = {
//   name: string;
//   price: string;
//   total_count: number;
//   category: string;
//   id: number;
//   average_rating: string | null | undefined;
// };

const ShopPage = async ({
  searchParams,
}: {
  searchParams: SearchParamsServer;
}) => {
  const productItemsRes = await getProductsFromDB(searchParams);
  const productItems = productItemsRes;

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
