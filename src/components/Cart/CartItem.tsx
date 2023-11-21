'use client';

import { capitalize, cn, priceFormat } from '@/lib/util';
import CartQuantityCounter from './CartQuantityCounter';
import { CartItemProps } from '@/lib/types/cart';
import { useCartItemsStore } from '@/lib/store/cart-store';
import { trpc } from '@/app/_trpc/client';
import useDebounce from '@/lib/hooks/useDebounce';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MouseEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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
import { useCountDown } from '@/lib/hooks/useCountdown';
import {
  deleteCartItemServer,
  updateCartItemQuantityServer,
} from '@/lib/actions/cart';
import { CartItemsInsert } from '@/lib/db/schema/cartItems';
import { CART_ITEM_DATA_QUERY_KEY } from '@/lib/constants/query-keys';

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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [countdown, startCountdown, _, resetCountdown] = useCountDown(4);

  const cartItemData = cartItemState ? cartItemState : cartItem;
  const cartItemId = cartItemData.cartItemId;

  const queryClient = useQueryClient();

  const { mutateAsync: deleteMutation } = useMutation({
    mutationFn: deleteCartItemServer,
  });

  const { mutateAsync: updateMutation } = useMutation({
    mutationFn: updateCartItemQuantityServer,
  });

  const debouncedUpdateQuantity = useDebounce(
    async (newQuantity: CartItemsInsert['quantity']) => {
      await updateMutation({
        cartItemId: cartItemId,
        newQuantity,
      });
      queryClient.refetchQueries({
        queryKey: CART_ITEM_DATA_QUERY_KEY,
      });
    },
    500,
  );

  const totalPrice = priceFormat(
    Number.parseFloat(cartItemData.price || '0') * cartItemData.quantity,
  );

  const handleQuantityChange = async (newQuantity: number) => {
    updateQuantity(cartItemId, newQuantity);
    await debouncedUpdateQuantity(newQuantity);
  };

  const handleCartItemDelete = useCallback(async () => {
    await deleteMutation(cartItemId);
    deleteCartItem(cartItemId);
    queryClient.refetchQueries({
      queryKey: CART_ITEM_DATA_QUERY_KEY,
    });
  }, [cartItemId, deleteCartItem, deleteMutation, queryClient]);

  const deleteVariants: Variants = {
    hidden: {
      transform: 'translateX(-40%)',
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

  useEffect(() => {
    if (countdown === 0) {
      setConfirmDelete(true);
      handleCartItemDelete();
    }
  }, [countdown, handleCartItemDelete]);

  return (
    <MotionConfig
      transition={{
        duration: 0.2,
      }}
    >
      <AnimatePresence key={'cartItemContainer'} mode="wait" initial={false}>
        {!confirmDelete && (
          <motion.div
            exit={{
              opacity: 0,
              height: '0px',
            }}
            animate={{ opacity: 1, height: 'auto' }}
            key={'cartItemMainContainer'}
            className="group relative"
          >
            <motion.div
              layout
              className={cn('relative flex w-full justify-between py-6')}
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
              </motion.div>
              <motion.div
                layout
                className="flex min-h-full flex-col items-end justify-end"
              >
                <motion.div layout={'position'} className="mb-auto flex">
                  <AnimatePresence
                    key={'cartItemDeleteBtns'}
                    initial={false}
                    mode="wait"
                  >
                    {!toggleDelete ? (
                      <motion.button
                        className={cn(
                          buttonVariants({
                            size: 'sm',
                            variant: 'ghost',
                          }),
                          'relative h-7 min-w-max bg-transparent px-2 text-sm font-medium tracking-wide text-red-500 ring-1 ring-red-400 transition-none duration-0',
                          'hover:bg-red-500 hover:text-neutral-50',
                        )}
                        onClick={() => {
                          setToggleDelete(true);
                          startCountdown();
                        }}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'hidden'}
                        key={'delete'}
                        variants={deleteVariants}
                        disabled={toggleDelete || confirmDelete}
                      >
                        <Trash size={16} />
                        <span>Delete</span>
                      </motion.button>
                    ) : (
                      <motion.button
                        className={cn(
                          buttonVariants({
                            size: 'sm',
                            variant: 'secondary',
                          }),
                          'relative h-7 min-w-max px-2 text-sm tracking-wide transition-none',
                        )}
                        onClick={() => {
                          setToggleDelete(false);
                          resetCountdown();
                        }}
                        initial={'hidden'}
                        animate={'visible'}
                        exit={'hidden'}
                        key={'undo'}
                        variants={restoreVariants}
                        disabled={!toggleDelete || confirmDelete}
                      >
                        <motion.span
                          initial={{ rotate: 270 }}
                          animate={{ rotate: 0 }}
                          key={'undoIcon'}
                          transition={{
                            duration: 1,
                            type: 'spring',
                            bounce: 0.4,
                          }}
                        >
                          <History size={16} />
                        </motion.span>
                        <span className="inline-flex items-center justify-between">
                          <span>Undo</span>
                          <span className="inline-flex h-4 w-4 items-center justify-center font-semibold">
                            {countdown}
                          </span>
                        </span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
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
                              opacity: 0,
                              transform: 'translateX(-50%) scale(0.5)',
                            }
                          : {
                              opacity: 1,
                              transform: 'translateX(0%) scale(1)',
                            }
                      }
                    >
                      <CartQuantityCounter
                        initial={cartItem.quantity}
                        onChange={handleQuantityChange}
                        className="max-h-[2.5rem] min-w-[8.25rem]"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
            <MotionDivider
              layout
              className="absolute w-full group-last-of-type:hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
