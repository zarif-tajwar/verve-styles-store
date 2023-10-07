import { Icons } from '@/components/Svgs/icons';
import { db } from '@/lib/db';
import { ProductSelect, products } from '@/lib/db/schema/products';
import Image from 'next/image';
import SortBySelect from '@/components/UI/SortBySelect';
import { FilterSidebar } from '@/components/UI/FilterSidebar';
import { getProductsFromDB } from '@/lib/dbCalls/filter';

const staticProducts = [
  { name: 'Awesome Soft Computer', price: '8889.00' },
  { name: 'Elegant Bronze Gloves', price: '1969.00' },
  { name: 'Electronic Cotton Chair', price: '6091.00' },
  { name: 'Licensed Rubber Table', price: '4264.00' },
  { name: 'Electronic Soft Bike', price: '3239.00' },
  { name: 'Electronic Wooden Chips', price: '4521.00' },
  { name: 'Unbranded Fresh Car', price: '4394.00' },
  { name: 'Modern Metal Fish', price: '8554.00' },
  { name: 'Electronic Granite Cheese', price: '598.00' },
];

const ShopPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // const productItems = staticProducts;
  const productItemsRes = await getProductsFromDB(searchParams);
  const productItems = productItemsRes?.rows as {
    name: string;
    price: string;
  }[];

  // console.log(searchParams);

  return (
    <section className="mt-16">
      <div className="container-main">
        <p>{JSON.stringify(searchParams)}</p>
        <div className="flex gap-8">
          <FilterSidebar />
          <div>
            <div className="mb-4 flex items-end justify-between">
              <p>Showing {productItems.length} Products</p>
              <SortBySelect />
            </div>
            <div className="grid grid-cols-3 gap-x-5 gap-y-9">
              {productItems.map((product, i) => (
                <ProductListing key={i} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ShopPage;

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
