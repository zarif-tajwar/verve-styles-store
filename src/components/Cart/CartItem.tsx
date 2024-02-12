'use client';

import { capitalize, cn, makeValidURL, priceFormat, wait } from '@/lib/util';
import CartQuantityCounter from './CartQuantityCounter';
import { CartItemProps } from '@/lib/types/cart';
import { useCartItemsStore } from '@/lib/store/cart-store';
import useDebounce from '@/lib/hooks/useDebounce';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { AnimatePresence, MotionConfig, Variants, motion } from 'framer-motion';
import Divider from '../UI/Divider';
import { Button, buttonVariants } from '../UI/Button';
import { History, MinusIcon, PlusIcon, Trash } from 'lucide-react';
import { useCountDown } from '@/lib/hooks/useCountdown';
import {
  deleteCartItemAction,
  updateCartItemQuantityAction,
} from '@/lib/actions/cart';
import { CartItemsInsert } from '@/lib/db/schema/cartItems';
import { CART_ITEM_DATA_QUERY_KEY } from '@/lib/constants/query-keys';
import Image from 'next/image';
import Link from 'next/link';
import SizeBadge from '../UI/SizeBadge';
// import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

const MotionDivider = motion(Divider);
const MotionLink = motion(Link);

const CartItem2 = memo(
  ({
    cartItem,
    totalCartItems,
    index,
  }: {
    cartItem: CartItemProps;
    totalCartItems: number;
    index: number;
  }) => {
    console.log('CART ITEM RENDRED');

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

    const exitAnimationDurationInSeconds = 0.2;

    const { mutateAsync: deleteMutation } = useMutation({
      mutationFn: deleteCartItemAction,
    });

    const { mutateAsync: updateMutation } = useMutation({
      mutationFn: updateCartItemQuantityAction,
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
      await wait(exitAnimationDurationInSeconds * 1000);
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

    const href = `/${makeValidURL(cartItem.clothing)}/${makeValidURL(
      cartItem.name,
    )}-${cartItem.productId}`;

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
              // transition={{ duration: 2 }}
              key={'cartItemMainContainer'}
              className="group relative"
              transition={{ duration: exitAnimationDurationInSeconds }}
            >
              <div
                className={cn(
                  'relative',
                  // index > 0 && 'pt-4 sm:pt-5 md:pt-6',
                  // index < totalCartItems - 1 && 'pb-4 sm:pb-5 md:pb-6',
                  'py-4 sm:py-5 md:py-6',
                )}
              >
                <div className="grid w-full grid-cols-[auto_1fr] gap-x-4 gap-y-4 rounded-xl sm:grid-cols-[auto_1fr_auto]">
                  <motion.div
                    className={cn(
                      'relative aspect-square overflow-hidden rounded-xl',
                      '[--height-from:7rem] [--height-to:5rem] sm:[--height-from:8rem] sm:[--height-to:6rem]',
                    )}
                    animate={
                      toggleDelete
                        ? { opacity: 0.5, height: 'var(--height-to)' }
                        : { opacity: 1, height: 'var(--height-from)' }
                    }
                  >
                    {cartItem.image && (
                      <Image
                        src={cartItem.image}
                        alt={cartItem.name}
                        className="object-cover"
                        fill
                      />
                    )}
                  </motion.div>
                  <motion.div
                    animate={toggleDelete ? { opacity: 0.3 } : { opacity: 1 }}
                    className="flex flex-col justify-between"
                  >
                    <div>
                      <p
                        className={cn(
                          'line-clamp-1 text-lg font-semibold text-primary-500 sm:line-clamp-none sm:text-xl',
                        )}
                      >
                        {cartItem.name}
                      </p>
                      <SizeBadge sizeText={cartItem.sizeName} />
                    </div>
                    <p className={cn('text-xl font-semibold sm:text-2xl')}>
                      {totalPrice}
                    </p>
                  </motion.div>
                  <div className="col-span-2 grid max-w-sm grid-cols-[7rem_1fr] items-end justify-between gap-x-4 sm:col-span-1 sm:flex sm:max-w-none sm:flex-col">
                    <AnimatePresence
                      key={'cartItemDeleteBtns'}
                      initial={false}
                      mode="wait"
                    >
                      {!toggleDelete ? (
                        <Button
                          asChild
                          key={'delete'}
                          size={'sm'}
                          className={cn(
                            'h-full text-sm font-normal text-primary-400 transition-none sm:h-8',
                          )}
                          variant={'secondary'}
                        >
                          <motion.button
                            onClick={() => {
                              setToggleDelete(true);
                              startCountdown();
                            }}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'hidden'}
                            variants={deleteVariants}
                            disabled={toggleDelete || confirmDelete}
                          >
                            <Trash size={16} />
                            <span>Remove</span>
                          </motion.button>
                        </Button>
                      ) : (
                        <Button
                          asChild
                          key={'undo'}
                          size={'sm'}
                          className={cn(
                            'h-full text-sm font-normal transition-none sm:h-8',
                          )}
                        >
                          <motion.button
                            onClick={() => {
                              setToggleDelete(false);
                              resetCountdown();
                            }}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'hidden'}
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
                              className="will-change-transform"
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
                        </Button>
                      )}
                    </AnimatePresence>
                    <motion.div
                      className="origin-top [--translate-x-from:0%] [--translate-x-to:0%] [--translate-y-from:0%] [--translate-y-to:-50%] sm:origin-top-left sm:[--translate-x-to:-50%] sm:[--translate-y-to:0%]"
                      animate={
                        toggleDelete
                          ? {
                              opacity: 0,
                              transform:
                                'translateX(var(--translate-x-to)) translateY(var(--translate-y-to)) scale(0.5)',
                            }
                          : {
                              opacity: 1,
                              transform:
                                'translateX(var(--translate-x-from)) translateY(var(--translate-y-from)) scale(1)',
                            }
                      }
                    >
                      <CartQuantityCounter
                        initial={cartItem.quantity}
                        onChange={handleQuantityChange}
                        className="p-1 sm:p-1.5"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
              {index !== totalCartItems - 1 && (
                <Divider className="absolute inset-x-0 bottom-0" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    );
  },
);

CartItem2.displayName = 'CartItem2';

export default CartItem2;
