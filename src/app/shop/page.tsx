import { Icons } from '@/components/Svgs/icons';
import { db } from '@/lib/db';
import { ProductSelect, products } from '@/lib/db/schema/products';
import Image from 'next/image';
import DoubleRangeSlider from '@/components/UI/DoubleRangeSlider';

const page = async () => {
  // const products = [...Array(9).keys()];
  const productItems = await db
    .select({ name: products.name, price: products.price })
    .from(products)
    .limit(9);

  return (
    <section className="mt-16">
      <div className="container-main">
        <div className="flex gap-4">
          <FilterSidebar />
          <div>
            <div>
              <p>Showing 1-9 of 1000 Products</p>
              <p>
                Sort by:{' '}
                <select name="" id="">
                  <option value="m">Most Popular</option>
                  <option value="m">Most Recent</option>
                </select>
              </p>
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
export default page;

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

const FilterSidebar = () => {
  return (
    <div className="w-full max-w-[296px]">
      <div className="h-[800px] rounded-main border border-black/10 px-6 py-5">
        <div className="flex items-center justify-between">
          <h2 className="font-plus-jakarta-sans text-xl font-bold capitalize">
            Filters
          </h2>
          <Icons.filter className="text-black/40" />
        </div>
        <VerticalDivider />
        <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
          Clothing
        </h3>
        <div className="grid grid-cols-2 gap-2.5 text-sm">
          <button className="flex items-center gap-1 rounded-lg bg-black/5 px-2 py-2 font-medium text-black/60 transition-all duration-200 hover:bg-black/10 hover:text-black">
            <Icons.Shorts className="h-[18px]" />
            <p>Shorts</p>
          </button>
          <button className="flex items-center gap-1 rounded-lg bg-black/5 px-2 py-2 font-medium text-black/60 transition-all duration-200 hover:bg-black/10 hover:text-black">
            <Icons.Shirt className="h-[18px]" />
            <p>Shirts</p>
          </button>
          <button className="flex items-center gap-1 rounded-lg bg-black/5 px-2 py-2 font-medium text-black/60 transition-all duration-200 hover:bg-black/10 hover:text-black">
            <Icons.TShirt className="h-[18px]" />
            <p>T-Shirts</p>
          </button>
          <button className="flex items-center gap-1 rounded-lg bg-black/5 px-2 py-2 font-medium text-black/60 transition-all duration-200 hover:bg-black/10 hover:text-black">
            <Icons.Hoodie className="h-[18px]" />
            <p>Hoodie</p>
          </button>
          <button className="flex items-center gap-1 rounded-lg bg-black/5 px-2 py-2 font-medium text-black/60 transition-all duration-200 hover:bg-black/10 hover:text-black">
            <Icons.Jeans className="h-[18px]" />
            <p>Jeans</p>
          </button>
        </div>
        <VerticalDivider />
        <h3 className="mb-4 font-plus-jakarta-sans font-bold capitalize">
          Price
        </h3>
        <div className="relative">
          <DoubleRangeSlider />
        </div>
        <VerticalDivider />
      </div>
    </div>
  );
};

const VerticalDivider = () => (
  <div className="my-6 h-px w-full bg-black/10"></div>
);
