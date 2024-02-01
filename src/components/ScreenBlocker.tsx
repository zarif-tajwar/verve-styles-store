const ScreenBlocker = () => {
  return (
    <div className="block-display fixed left-0 top-0 z-[99999999999] h-screen w-screen items-center justify-center bg-primary-0 text-center">
      <p className="max-w-md text-balance text-2xl font-medium">
        Unsupported screen size. <br /> The website has not yet been made
        responsive yet.
      </p>
    </div>
  );
};
export default ScreenBlocker;
