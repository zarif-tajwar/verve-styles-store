import Link from 'next/link';

const BrowseStyle = () => {
  return (
    <section className="mt-4">
      <div className="container-main">
        <div className="rounded-[2.5rem] bg-offwhite px-16 py-16">
          <h2 className="mb-16 text-center font-integral-cf text-5xl font-bold uppercase">
            Browse by Dress Style
          </h2>
          <div className="grid grid-cols-3 gap-5">
            <Link
              href={'/shop?styles=casual'}
              className="h-[290px] rounded-[1.25rem] bg-white pl-9 pt-6"
            >
              <p className="text-4xl font-semibold">Casual</p>
            </Link>
            <Link
              href={'/shop?styles=formal'}
              className="col-span-2 h-[290px] rounded-[1.25rem] bg-white pl-9 pt-6"
            >
              <p className="text-4xl font-semibold">Formal</p>
            </Link>
            <Link
              href={'/shop?styles=festival'}
              className="col-span-2 h-[290px] rounded-[1.25rem] bg-white pl-9 pt-6"
            >
              <p className="text-4xl font-semibold">Festival</p>
            </Link>
            <Link
              href={'/shop?styles=gym'}
              className="h-[290px] rounded-[1.25rem] bg-white pl-9 pt-6"
            >
              <p className="text-4xl font-semibold">Gym</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
export default BrowseStyle;
