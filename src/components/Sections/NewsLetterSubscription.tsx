import { cn } from '@/lib/util';
import { Icons } from '../Svgs/icons';

const NewsLetterSubscription = () => {
  return (
    <div className="container-main">
      <div className="flex items-center justify-between gap-8 rounded-main bg-black px-16 py-9">
        <p className="max-w-[35rem] font-integral-cf text-[2.5rem] font-bold uppercase leading-[1.125] text-white">
          Stay upto date about our latest offers
        </p>
        <form className="w-full max-w-[22.5rem]">
          <div className="relative mb-4">
            <input
              type="email"
              name=""
              id=""
              className={cn(
                'peer h-12 w-full rounded-full bg-white py-3 pl-[3.25rem] pr-8 placeholder:text-black/40',
                'outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                'transition-all duration-200',
              )}
              placeholder="Enter your email adress"
            />
            <Icons.email
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 text-black/40',
                'transition-all duration-200',
                'peer-focus-visible:text-black',
              )}
            />
          </div>
          <button
            className={cn(
              'h-12 w-full rounded-full bg-white text-center text-black',
              'transition-all duration-200',
              'hover:bg-white/95',
              'outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black',
            )}
          >
            Subscribe to Newsletter
          </button>
        </form>
      </div>
    </div>
  );
};
export default NewsLetterSubscription;
