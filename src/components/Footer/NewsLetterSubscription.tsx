import { cn } from '@/lib/util';
import { Email } from '../Svgs/icons';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Container } from '../UI/Container';

const NewsLetterSubscription = () => {
  return (
    <div className="relative">
      <Container className="relative z-20 @container">
        <div className="flex flex-col gap-8 rounded-main bg-primary-900 px-4 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-9">
          <p className="flex flex-col text-balance font-integral-cf text-2xl font-bold uppercase leading-[1.125] text-primary-0 selection:bg-primary-50 selection:text-primary-900 sm:text-3xl xl:text-4xl">
            <span>Stay upto date about</span>
            <span>our latest offers</span>
          </p>
          <form className="grid w-full grid-cols-1 grid-rows-2 gap-4 lg:max-w-[22.5rem]">
            <div className="relative">
              <input
                type="email"
                name=""
                id=""
                className={cn(
                  'placeholder:prim peer w-full rounded-full bg-primary-0 py-3 pl-[3.25rem] pr-8 lg:h-full',
                  'outline-none focus-visible:ring-2 focus-visible:ring-primary-0 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900',
                  'transition-all duration-200',
                )}
                placeholder="Enter your email adress"
              />
              <Email
                className={cn(
                  'prim absolute left-4 top-1/2 -translate-y-1/2 text-primary-300',
                  'transition-all duration-200',
                  'peer-focus-visible:text-primary-900',
                )}
              />
            </div>
            <Button
              variant={'inverse'}
              size={'xl'}
              className="px-3 py-3 text-sm font-medium lg:h-auto lg:px-4 lg:text-base"
            >
              Subscribe to Newsletter
            </Button>
          </form>
        </div>
      </Container>
      <div className="absolute -bottom-px left-0 z-10 h-1/2 w-full bg-primary-50"></div>
    </div>
  );
};
export default NewsLetterSubscription;
