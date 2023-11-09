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
  MotionConfig,
  Variants,
  motion,
  useMotionValue,
} from 'framer-motion';
import Divider from '../UI/Divider';
import { Button, buttonVariants } from '../UI/Button';
import { History, Trash } from 'lucide-react';

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
    // debouncedUpdateQuantity(newQuantity);
  };

  const handleCartItemDelete = async () => {
    await deleteCartItemServer();
    deleteCartItem(cartItem.cartItemId);
    await queryClient.refetchQueries({
      queryKey,
    });
  };

  console.log(`${cartItem.name}: RENDERED`);

  const deleteVariants: Variants = {
    hidden: {
      transform: 'translateX(-30%)',
      opacity: 0,
      pointerEvents: 'none',
    },
    visible: {
      transform: 'translateX(0%)',
      opacity: 1,
      pointerEvents: 'auto',
    },
  };

  const restoreVariants: Variants = {
    hidden: {
      transform: 'translateX(30%)',
      opacity: '0%',
      pointerEvents: 'none',
    },
    visible: {
      transform: 'translateX(0%)',
      opacity: '100%',
      pointerEvents: 'auto',
    },
  };

  return (
    <AnimatePresence key={'cartItemContainer'} initial={false} mode="popLayout">
      <MotionConfig
        transition={{
          duration: 0.2,
        }}
      >
        <motion.div
          layout
          className="group relative flex w-full justify-between py-6"
        >
          <motion.div
            layout
            className={cn(
              'relative flex w-full items-start gap-4',
              toggleDelete && 'gap-2',
            )}
            animate={toggleDelete ? { opacity: 0.3 } : { opacity: 1 }}
          >
            <motion.div
              layout
              className={cn(
                'aspect-square w-[20%] max-w-[8rem] origin-top-left bg-primary-100',
                toggleDelete && 'w-[10%]',
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
                    'origin-top-left text-xl font-medium',
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
                      'absolute bottom-0 left-0 inline-block origin-top-left text-xl font-medium',
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
          <div className="flex min-h-full flex-col items-end justify-end">
            <AnimatePresence
              key={'cartItemDeleteBtns'}
              initial={false}
              mode="wait"
            >
              <motion.div layout={'position'} className="mb-auto">
                {!toggleDelete && (
                  <motion.button
                    // layout={'position'}
                    className={cn(
                      buttonVariants({
                        size: 'sm',
                        variant: 'ghost',
                      }),
                      'relative h-7 gap-1 bg-transparent px-2 text-sm font-medium tracking-wide text-red-500 ring-1 ring-red-400',
                      // 'hover:bg-transparent',
                      'hover:bg-red-500 hover:text-neutral-50',
                    )}
                    onClick={() => setToggleDelete(true)}
                    initial={'hidden'}
                    animate={'visible'}
                    exit={'hidden'}
                    key={'delete'}
                    variants={deleteVariants}
                  >
                    <Trash size={16} />
                    <span>Delete</span>
                  </motion.button>
                )}

                {toggleDelete && (
                  <motion.button
                    // layout={'position'}
                    className={cn(
                      buttonVariants({
                        size: 'sm',
                        variant: 'secondary',
                      }),
                      'relative h-7 gap-1 px-2 text-sm tracking-wide',
                    )}
                    onClick={() => setToggleDelete(false)}
                    initial={'hidden'}
                    animate={'visible'}
                    exit={'hidden'}
                    key={'undo'}
                    variants={restoreVariants}
                  >
                    <History size={16} />
                    <span>Undo in 3</span>
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
            <motion.div layout={'preserve-aspect'}>
              <motion.div
                animate={
                  toggleDelete
                    ? {
                        height: 0,
                      }
                    : {
                        height: 'auto',
                      }
                }
              >
                <motion.div
                  className="origin-top-left"
                  animate={
                    toggleDelete
                      ? {
                          // scale: 0,
                          // y: '-60%',
                          opacity: 0,
                          transform: 'translateX(-50%) scale(0.5)',
                        }
                      : {
                          // scale: 1,
                          // y: '0%',
                          opacity: 1,
                          transform: 'translateX(0%) scale(1)',
                        }
                  }
                >
                  <CartQuantityCounter
                    initial={cartItem.quantity}
                    onChange={handleQuantityChange}
                    className="max-h-[2.5rem]"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </MotionConfig>
    </AnimatePresence>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
