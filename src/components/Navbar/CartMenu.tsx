import { Cart as CartIcon } from '../Svgs/icons';
import { Button } from '../UI/Button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '../UI/Drawer';
import CartCount from './CartCount';
import Cart from '../Cart/Cart';
import { ScrollArea } from '../UI/ScrollArea';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Container } from '../UI/Container';

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
      <DrawerContent className="h-[90vh] w-screen rounded-t-main">
        <Container className="h-full pb-6">
          <div className="relative grid h-full w-full grid-cols-1 grid-rows-[auto_1fr]">
            <DrawerClose className="absolute -top-3 right-0 -translate-y-full rounded-full text-primary-0 transition-transform duration-200 hover:scale-125">
              <XMarkIcon className="size-8" strokeWidth={2} />
            </DrawerClose>
            <div className="flex justify-center pt-5">
              <span className="mx-auto inline-block h-3 w-36 rounded-full bg-primary-100"></span>
            </div>
            <div className="bg-red-50">
              <Cart deliveryCharge={25} />
            </div>
          </div>
        </Container>
      </DrawerContent>
    </Drawer>
  );
};
export default CartMenu;
