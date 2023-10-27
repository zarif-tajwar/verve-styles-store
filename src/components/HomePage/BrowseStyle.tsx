const BrowseStyle = () => {
  return (
    <section className="mt-4">
      <div className="container-main">
        <div className="rounded-[2.5rem] bg-offwhite px-16 py-16">
          <h2 className="mb-16 text-center">Browse by Dress Style</h2>
          <div className="grid grid-cols-3 gap-5">
            <div className="h-[290px] rounded-[1.25rem] bg-white pl-9 pt-6">
              <h3 className="text-4xl font-bold">Casual</h3>
            </div>
            <div className="col-span-2 h-[290px] rounded-[1.25rem] bg-white pl-9 pt-6">
              <h3 className="text-4xl font-bold">Formal</h3>
            </div>
            <div className="col-span-2 h-[290px] rounded-[1.25rem] bg-white pl-9 pt-6">
              <h3 className="text-4xl font-bold">Party</h3>
            </div>
            <div className="h-[290px] rounded-[1.25rem] bg-white pl-9 pt-6">
              <h3 className="text-4xl font-bold">Gym</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default BrowseStyle;
