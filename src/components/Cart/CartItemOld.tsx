'use client';

import { capitalize, cn, makeValidURL, priceFormat } from '@/lib/util';
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

const CartItem = memo(
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
              key={'cartItemMainContainer'}
              className="group relative"
            >
              <motion.div
                layout
                className={cn(
                  'relative flex w-full justify-between',
                  index > 0 && 'pt-4 sm:pt-5 md:pt-6',
                  index < totalCartItems - 1 && 'pb-4 sm:pb-5 md:pb-6',
                )}
              >
                <MotionLink
                  layout
                  className={cn(
                    'relative flex w-full items-start gap-4',
                    toggleDelete && 'gap-2',
                  )}
                  animate={toggleDelete ? { opacity: 0.3 } : { opacity: 1 }}
                  href={href}
                >
                  <motion.div
                    layout
                    className={cn(
                      'aspect-square h-24 origin-top-left overflow-hidden bg-primary-100 sm:h-32',
                      toggleDelete && 'h-16',
                    )}
                    style={{
                      borderRadius: 12,
                    }}
                  >
                    {cartItem.image && (
                      <div className="relative h-full w-full">
                        <Image
                          src={cartItem.image}
                          alt={cartItem.name}
                          className="object-cover"
                          fill
                        />
                      </div>
                    )}
                  </motion.div>
                  <motion.div
                    layout
                    className="flex min-h-full justify-between"
                  >
                    <motion.div
                      layout
                      className="relative flex min-h-full flex-col items-start justify-start gap-1"
                    >
                      <motion.p
                        className={cn(
                          'origin-top-left text-base font-medium sm:text-lg md:text-xl',
                          toggleDelete && 'text-sm md:text-base',
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
                            'absolute bottom-0 left-0 inline-block origin-top-left text-base font-semibold sm:text-lg md:text-xl md:font-medium',
                            toggleDelete && 'static text-base',
                          )}
                        >
                          {totalPrice}
                        </motion.span>
                        <motion.span layout>
                          <SizeBadge sizeText={cartItem.sizeName} />
                        </motion.span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </MotionLink>
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
                        <Button
                          asChild
                          size={'sm'}
                          variant={'ghost'}
                          className="relative h-7 min-w-max bg-transparent px-2 text-sm font-medium tracking-wide text-red-500 ring-1 ring-inset ring-red-400 transition-none duration-0 hover:bg-red-500 hover:text-neutral-50"
                        >
                          <motion.button
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
                        </Button>
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
  },
);

CartItem.displayName = 'CartItem';

export default CartItem;