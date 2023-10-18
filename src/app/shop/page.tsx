import { Icons } from '@/components/Svgs/icons';
import Image from 'next/image';
import { getProductsFromDB } from '@/lib/dbCalls/filter';
import ShopFilterPagination from '@/components/UI/ShopFilterPagination';
import { FILTER_PRODUCTS_PER_PAGE } from '@/lib/validation/constants';
import Link from 'next/link';
import { makeValidURL } from '@/lib/util';
import Star from '@/components/UI/Star';

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

const ShopPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // return <p>{JSON.stringify(searchParams)}</p>;

  // const productItems = staticProducts;

  console.log(searchParams);
  const productItemsRes = await getProductsFromDB(searchParams);
  const productItems = productItemsRes?.rows as {
    name: string;
    price: string;
    total_count: number;
    category: string;
    id: number;
  }[];
  const currentPage = Number.parseInt(searchParams.page as string) || 1;
  const totalProducts = productItems.at(0)?.total_count || 0;

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

const ProductListing = ({
  product,
}: {
  product: { name: string; price: string; category: string; id: number };
}) => {
  return (
    <Link
      href={`/${makeValidURL(product.category)}/${makeValidURL(product.name)}-${
        product.id
      }`}
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
          <Star rating={4} size="sm" />
          <p className="text-sm font-medium text-black/60">
            <span className="text-black">4.0/</span>5.0
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
