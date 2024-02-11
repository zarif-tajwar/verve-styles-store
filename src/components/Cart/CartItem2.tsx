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
                  'relative',
                  index > 0 && 'pt-4 sm:pt-5 md:pt-6',
                  index < totalCartItems - 1 && 'pb-4 sm:pb-5 md:pb-6',
                )}
              >
                <div className="grid w-full grid-cols-[auto_1fr] gap-x-4 gap-y-4 sm:grid-cols-[auto_1fr_auto] sm:gap-x-5 md:gap-x-6">
                  <div className="relative aspect-square h-28 overflow-hidden rounded-xl sm:h-32">
                    {cartItem.image && (
                      <Image
                        src={cartItem.image}
                        alt={cartItem.name}
                        className="object-cover"
                        fill
                      />
                    )}
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="line-clamp-1 text-lg font-semibold text-primary-500 sm:text-xl">
                        {cartItem.name}
                      </p>
                      <SizeBadge sizeText={cartItem.sizeName} />
                    </div>
                    <p className="text-xl font-semibold sm:text-2xl">
                      {totalPrice}
                    </p>
                  </div>
                  <div className="col-span-2 grid max-w-sm grid-cols-[7rem_1fr] items-end justify-between gap-x-4 sm:col-span-1 sm:flex sm:max-w-none sm:flex-col">
                    <Button
                      asChild
                      size={'sm'}
                      // variant={'ghost'}
                      className={cn(
                        // 'relative min-w-max bg-transparent px-2 text-sm font-medium tracking-wide transition-none duration-0',
                        // 'relative font-medium text-rose-800 ring-1 ring-inset ring-rose-800 hover:bg-rose-800 hover:text-neutral-50 hover:ring-0',
                        'h-full text-sm font-normal text-primary-400 sm:h-8',
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
                        key={'delete'}
                        variants={deleteVariants}
                        disabled={toggleDelete || confirmDelete}
                      >
                        <Trash size={16} />
                        <span>Remove</span>
                      </motion.button>
                    </Button>
                    <CartQuantityCounter
                      initial={cartItem.quantity}
                      onChange={handleQuantityChange}
                    />
                  </div>
                </div>
              </motion.div>
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
