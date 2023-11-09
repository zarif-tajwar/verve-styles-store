'use client';

import { capitalize, cn, priceFormat } from '@/lib/util';
import CartQuantityCounter from './CartQuantityCounter';
import { CartItemProps } from '@/lib/types/cart';
import { useCartItemsStore } from '@/lib/store/cart-store';
import { trpc } from '@/app/_trpc/client';
import useDebounce from '@/lib/hooks/useDebounce';
import { useQueryClient } from '@tanstack/react-query';
import { getQueryKey } from '@trpc/react-query';
import { MouseEvent, memo, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  AnimatePresence,
  Variants,
  motion,
  useMotionValue,
} from 'framer-motion';
import Divider from '../UI/Divider';
import { Button, buttonVariants } from '../UI/Button';
import { History } from 'lucide-react';

const MotionDivider = motion(Divider);

const CartItem = memo(({ cartItem }: { cartItem: CartItemProps }) => {
  const cartItemState = useCartItemsStore(
    useShallow((state) =>
      state.cartItems.find(
        (cartItemState) => cartItemState.cartItemId === cartItem.cartItemId,
      ),
    ),
  );
  const updateQuantity = useCartItemsStore((state) => state.updateQuantity);
  const deleteCartItem = useCartItemsStore((state) => state.deleteCartItem);

  const [toggleDelete, setToggleDelete] = useState(false);

  const cartItemData = cartItemState ? cartItemState : cartItem;

  const cartItemId = cartItemData.cartItemId;

  const updateQuantityServerTrpc = trpc.updateCartQuantity.useMutation({});

  const deleteCartItemServerTrpc = trpc.deleteCartItem.useMutation({});

  const updateQuantityServer = async (newQuantity: number) => {
    await updateQuantityServerTrpc.mutateAsync({
      cartItemId: cartItemId,
      newQuantity,
    });
  };

  const deleteCartItemServer = async () => {
    await deleteCartItemServerTrpc.mutateAsync({
      cartItemId: cartItemId,
    });
  };

  const debouncedUpdateQuantity = useDebounce((newQuantity: number) => {
    updateQuantityServer(newQuantity);
    console.log(newQuantity);
  }, 500);

  const queryClient = useQueryClient();

  const totalPrice = priceFormat(
    Number.parseFloat(cartItemData.price || '0') * cartItemData.quantity,
  );

  const queryKey = useMemo(() => getQueryKey(trpc.getCartItems), []);

  const handleQuantityChange = async (newQuantity: number) => {
    updateQuantity(cartItem.cartItemId, newQuantity);
    debouncedUpdateQuantity(newQuantity);
  };

  const handleCartItemDelete = async () => {
    await deleteCartItemServer();
    deleteCartItem(cartItem.cartItemId);
    await queryClient.refetchQueries({
      queryKey,
    });
  };

  console.log(`${cartItem.name}: RENDERED`);

  const deleteVariant: Variants = {
    initial: { transform: 'translateX(100%)', opacity: 0 },
    enter: { transform: 'translateX(0%)', opacity: 1 },
    leave: { transform: 'translateX(-100%)', opacity: 0 },
  };

  const commonVariants: Variants = {
    show: {
      y: '0%',
      opacity: 1,
      visibility: 'visible',
      pointerEvents: 'auto',
      display: 'inline-block',
    },
    hide: {
      y: '-100%',
      opacity: 0,
      pointerEvents: 'none',
      transitionEnd: {
        visibility: 'hidden',
      },
    },
  };

  const productNameVariant: Variants = {
    show: {
      scale: 1,
      opacity: 1,
    },
    minimize: {
      scale: 0.8,
      opacity: 0.6,
    },
  };

  const productImageVariant: Variants = {
    show: {
      width: '8rem',
      height: '8rem',
      opacity: 1,
    },
    minimize: {
      width: '4rem',
      height: '4rem',
      opacity: 0.6,
    },
  };

  const containerVariants: Variants = {
    show: {
      height: 'auto',
    },
    hide: { height: '100px' },
  };

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <div className="group relative flex w-full justify-between py-6">
        <motion.div
          layout
          className={cn(
            'relative flex w-full items-start gap-4',
            toggleDelete && 'gap-2',
          )}
        >
          <motion.div
            layout
            className={cn(
              'aspect-square w-[16%] max-w-[8rem] origin-top-left bg-primary-100',
              toggleDelete && 'w-[8%]',
            )}
            style={{
              borderRadius: 12,
            }}
          />
          <motion.div layout className="flex min-h-full justify-between">
            <motion.div
              layout
              className="relative flex min-h-full flex-col items-start justify-start gap-1"
            >
              <motion.p
                className={cn(
                  'origin-top-left text-xl font-semibold',
                  toggleDelete && 'text-base',
                )}
                layout
              >
                {cartItem.name}
              </motion.p>
              <motion.div
                layout
                className="flex flex-grow items-start justify-start gap-2"
              >
                <motion.span
                  layout
                  className={cn(
                    'absolute bottom-0 left-0 inline-block origin-top-left text-xl font-semibold',
                    toggleDelete && 'static text-base',
                  )}
                >
                  {totalPrice}
                </motion.span>
                <motion.span
                  layout
                  className="inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-0.5 text-xs font-normal tracking-wide text-primary-400 ring-1 ring-primary-100"
                >
                  {cartItem.sizeName.length > 3
                    ? capitalize(cartItem.sizeName)
                    : cartItem.sizeName.toUpperCase()}
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>
          {/* <MotionDivider
            layout
            animate={
              toggleDelete ? { scaleX: 0, height: 0 } : { scaleX: 1, height: 1 }
            }
            className={
              'absolute bottom-0 left-0 w-full origin-left group-last-of-type:hidden'
            }
          /> */}
        </motion.div>
        <div className="flex min-h-full flex-col items-end justify-between">
          <div className="flex items-start gap-1 pr-px">
            {!toggleDelete && (
              <button
                onClick={async (e) => {
                  console.log('lol');
                  setToggleDelete(true);
                }}
                className="inline-flex h-5 items-center justify-center text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20"
                  viewBox="0 0 448 512"
                  fill="currentColor"
                >
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
              </button>
            )}
            {toggleDelete && (
              <button
                className={cn(
                  buttonVariants({
                    size: 'sm',
                    variant: 'secondary',
                  }),
                  'h-6 gap-1 px-2 text-sm tracking-wide',
                )}
                onClick={() => setToggleDelete(false)}
              >
                <History size={16} />
                <span>Undo in 3</span>
              </button>
            )}
          </div>
          <span className={cn('inline-block')}>
            <CartQuantityCounter
              initial={cartItem.quantity}
              onChange={handleQuantityChange}
            />
          </span>
        </div>
      </div>
    </AnimatePresence>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
