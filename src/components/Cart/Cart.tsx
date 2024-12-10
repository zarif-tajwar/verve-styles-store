'use client';

import CartItem from '@/components/Cart/CartItem';
import OrderSummary from '@/components/Cart/OrderSummary';
import { clearCartItems, generateCartItems } from '@/lib/actions/cart';
import { CART_ITEM_DATA_QUERY_KEY } from '@/lib/constants/query-keys';
import { useCartItemsQuery } from '@/lib/queries/cart';
import { FetchedCartItem } from '@/lib/server/cart';
import { cn } from '@/lib/util';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import { CartIcon } from '../Svgs/icons';
import { Button } from '../UI/Button';
import { ScrollArea } from '../UI/ScrollArea';
import CartSkeleton from './CartSkeleton';
import { DrawerTitle } from '../UI/Drawer';

const CartItemsListing = ({
  cartItems,
  deliveryCharge,
}: {
  cartItems: FetchedCartItem[];
  deliveryCharge: number;
}) => {
  const totalCartItems = cartItems.length;

  const height = useMotionValue(1);
  const heightFinal = useMotionTemplate`calc(${height}px - var(--vertical-padding))`;
  const cusRef = useRef(null);

  const resizeObserver = useMemo(() => {
    return new ResizeObserver((entries) => {
      const element = entries.at(0);
      if (!element) return;
      height.set(element.contentRect.height);
    });
  }, [height]);

  useEffect(() => {
    if (!cusRef.current) return;

    resizeObserver.observe(cusRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [cusRef, resizeObserver]);

  const CartComp = useMemo(() => {
    if (cartItems.length > 0)
      return cartItems.map((cartItem, i) => {
        return (
          <CartItem
            key={
              cartItem.cartItemId ??
              cartItem.name + cartItem.sizeName + cartItem.price
            }
            cartItem={cartItem}
            totalCartItems={totalCartItems}
            index={i}
          />
        );
      });
    else return null;
  }, [cartItems, totalCartItems]);

  return (
    <div
      className={cn(
        'grid h-full gap-x-5',
        'grid-cols-1 grid-rows-[1fr_auto]',
        'lg:grid-cols-5 lg:grid-rows-none',
        'gap-y-4 sm:gap-y-5 md:gap-y-6',
      )}
    >
      <div
        ref={cusRef}
        className="rounded-main border border-primary-100 pt-[var(--vertical-padding)] [--vertical-padding:1rem] sm:[--vertical-padding:1.25rem] md:[--vertical-padding:1.5rem] lg:col-span-3 landscape:[@media(height<625px)]:[--min-height:384px]"
      >
        <div className="px-1 sm:px-2">
          <ScrollArea scrollBarClassName="w-2 translate-x-0.5 sm:translate-x-0">
            <motion.div
              style={{ height: heightFinal }}
              className={cn(
                'flex min-h-[var(--min-height)] flex-col px-3 sm:px-3 md:px-4',
                '-translate-y-4 sm:-translate-y-5 md:-translate-y-6',
              )}
            >
              <LayoutGroup>{CartComp}</LayoutGroup>
            </motion.div>
          </ScrollArea>
        </div>
      </div>
      <OrderSummary deliveryCharge={deliveryCharge} cartItemsData={cartItems} />
    </div>
  );
};

const TemporaryButtons = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: generateCartItemsMutate } = useMutation({
    mutationFn: generateCartItems,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: CART_ITEM_DATA_QUERY_KEY });
    },
  });
  const { mutateAsync: clearCartItemsMutate } = useMutation({
    mutationFn: clearCartItems,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: CART_ITEM_DATA_QUERY_KEY });
    },
  });

  return (
    <div className="absolute right-0 top-0 mx-auto mb-10 grid w-max -translate-y-full grid-cols-2 justify-center gap-4 rounded-main bg-primary-0 p-4 ring-1 ring-primary-100">
      <p className="col-span-2">Temporary Buttons for Testing</p>
      <Button
        onClick={async () => {
          await generateCartItemsMutate({ num: 5 });
        }}
      >
        Add 5 Random Products
      </Button>
      <Button
        variant={'outline'}
        onClick={async () => {
          await clearCartItemsMutate();
        }}
      >
        Clear Cart
      </Button>
    </div>
  );
};

const Cart = ({ deliveryCharge }: { deliveryCharge: number }) => {
  const { data, isLoading, isFetched } = useCartItemsQuery();

  const cartItemsData = data;

  return (
    <div className="relative h-full">
      <div className="grid h-full grid-cols-1 grid-rows-[auto_1fr]">
        <DrawerTitle className="mb-3 px-4 font-integral-cf text-3xl sm:mb-5 sm:px-5 md:mb-6 md:px-0 md:text-4xl">
          My Cart
        </DrawerTitle>
        <div>
          {!isLoading && cartItemsData && cartItemsData.length > 0 && (
            <CartItemsListing
              cartItems={cartItemsData}
              deliveryCharge={deliveryCharge}
            />
          )}
          {isLoading && <CartSkeleton />}
          {isFetched && cartItemsData && cartItemsData.length === 0 && (
            <EmptyCart />
          )}
        </div>
      </div>
    </div>
  );
};
export default Cart;

const EmptyCart = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-center gap-4 rounded-xl bg-primary-50 p-4 sm:p-5 md:p-6">
        <CartIcon className="size-[2rem] text-primary-200 md:size-[2.5rem]" />
        <p className="text-lg font-semibold text-primary-300 md:text-xl">
          Your shopping cart is empty!
        </p>
      </div>
    </div>
  );
};
