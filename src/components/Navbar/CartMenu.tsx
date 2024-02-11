import { XMarkIcon } from '@heroicons/react/24/outline';
import Cart from '../Cart/Cart';
import { Cart as CartIcon } from '../Svgs/icons';
import { Button } from '../UI/Button';
import { Container } from '../UI/Container';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '../UI/Drawer';
import CartCount from './CartCount';

const CartMenu = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          size={'square'}
          variant={'ghost'}
          className="text-primary-500 ring-offset-0 data-[state=open]:bg-primary-50"
          aria-label="Trigger Cart Dropdown Menu"
        >
          <span className="relative z-10 justify-center">
            {
              <>
                <CartIcon />
                <CartCount />
              </>
            }
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-screen rounded-t-main [--close-size:3rem] portrait:h-[calc(100svh-var(--close-size))] landscape:h-[90vh]">
        <Container className="h-full">
          <div className="relative grid h-full w-full grid-cols-1 grid-rows-[auto_1fr]">
            <DrawerClose className="absolute right-0 top-0 inline-flex size-[var(--close-size)] -translate-y-full items-center justify-center rounded-full text-primary-0 transition-transform duration-200 hover:scale-125">
              <XMarkIcon className="size-[75%]" strokeWidth={2} />
            </DrawerClose>
            <div className="flex justify-center pt-5">
              <span className="mx-auto inline-block h-3 w-36 rounded-full bg-primary-100"></span>
            </div>
            <div className="bg-red-50 pb-6 pt-8">
              <Cart deliveryCharge={25} />
            </div>
          </div>
        </Container>
      </DrawerContent>
    </Drawer>
  );
};
export default CartMenu;
