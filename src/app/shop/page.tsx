import { Icons } from '@/components/Svgs/icons';
import Image from 'next/image';
import { getProductsFromDB } from '@/lib/dbCalls/filter';
import { number } from 'zod';

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
  // await wait(1000);
  // return <p>{JSON.stringify(searchParams)}</p>;
  // const productItems = staticProducts;
  const productItemsRes = await getProductsFromDB(searchParams);
  const productItems = productItemsRes?.rows as {
    name: string;
    price: string;
  }[];
  return (
    <>
      <p className="absolute left-0 top-8">{productItems.length} products</p>
      <div className="grid grid-cols-3 gap-x-5 gap-y-9">
        {productItems.map((product, i) => {
          return <ProductListing key={i} product={product} />;
          // return i < 9 && <ProductListing key={i} product={product} />;
        })}
      </div>
    </>
  );
};

export default ShopPage;

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const ProductListing = ({
  product,
}: {
  product: { name: string; price: string };
}) => {
  return (
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
        <div className="flex gap-1 text-amber-400">
          {[...Array(4).keys()].map((_, i) => (
            <Icons.star key={i} />
          ))}
        </div>
        <p className="text-sm font-medium text-black/60">
          <span className="text-black">4.0/</span>5.0
        </p>
      </div>
      <p className="text-2xl font-bold">${Number.parseFloat(product.price)}</p>
    </div>
  );
};
