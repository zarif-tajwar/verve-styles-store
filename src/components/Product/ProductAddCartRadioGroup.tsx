'use client';

import { capitalize, cn, wait } from '@/lib/util';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Button, buttonVariants } from '../UI/Button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCartItemAction } from '@/lib/actions/cart';
import { CART_ITEM_DATA_QUERY_KEY } from '@/lib/constants/query-keys';
import Spinner from '../UI/Spinner';
import { BagCartIconMini } from '../Svgs/icons';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { errorToast } from '../UI/Toaster';
import { FetchedCartItem } from '@/lib/server/cart';
import { ProductSelect } from '@/lib/db/schema/products';
import { ClothingSelect } from '@/lib/db/schema/clothing';
import { ProductImagesSelect } from '@/lib/db/schema/productImages';
import {
  CartQuantityChangeBtn,
  CartQuantityInput,
  CartQuantityCounter,
} from '../Cart/CartQuantityCounter';
import { useQueryState } from 'nuqs';
import useCartDrawerOpen from '@/lib/hooks/useCartDrawerOpen';

type sizeOptions = {
  sizeName: string;
  sizeId: number;
}[];

const ProductAddCartRadioGroup = ({
  sizeOptions,
  productId,
  name,
  price,
  clothing,
}: {
  sizeOptions: sizeOptions;
  productId: number;
  name: ProductSelect['name'];
  price: ProductSelect['price'];
  clothing: ClothingSelect['name'];
}) => {
  const queryClient = useQueryClient();

  const [selectedSizeValue, setSelectedSizeValue] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAllowedToSubmit, setIsAllowedToSubmit] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const { handleOpenChange: setCartDrawerOpen } = useCartDrawerOpen();

  const {
    mutateAsync: addCartItemMutation,
    isPending,
    isSuccess,
    variables,
  } = useMutation({
    mutationFn: addCartItemAction,
    onSuccess: () => {},
    onMutate: async ({ quantity, sizeId }) => {
      setIsAllowedToSubmit(false);
      await queryClient.cancelQueries({ queryKey: CART_ITEM_DATA_QUERY_KEY });
      const previousCartItems = queryClient.getQueriesData({
        queryKey: CART_ITEM_DATA_QUERY_KEY,
      });

      const sizeName = sizeOptions.find(
        (opt) => opt.sizeId === sizeId,
      )!.sizeName;

      const newCartItem: Omit<
        FetchedCartItem,
        'createdAt' | 'cartItemId' | 'image'
      > = {
        quantity,
        name,
        price,
        sizeName,
        clothing,
        productId,
      };

      await wait(100);

      queryClient.setQueryData(
        CART_ITEM_DATA_QUERY_KEY,
        (old: FetchedCartItem[] | undefined) => {
          const isAlreadyInTheCartIndex = old?.findIndex(
            (cart) => cart.name === name && cart.sizeName === sizeName,
          );
          if (!old) return old;
          return isAlreadyInTheCartIndex !== -1
            ? old.map((cart, i) =>
                i === isAlreadyInTheCartIndex ? { ...cart, quantity } : cart,
              )
            : [newCartItem, ...old];
        },
      );

      setShowSuccess(true);
      setCartDrawerOpen(true);

      return { previousCartItems: previousCartItems };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        CART_ITEM_DATA_QUERY_KEY,
        context?.previousCartItems,
      );
      errorToast('Something went wrong!', {
        description: `Failed to add ${name} to your cart!`,
      });
      setIsAllowedToSubmit(true);
      setShowSuccess(false);
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: CART_ITEM_DATA_QUERY_KEY,
      });
    },
  });

  useEffect(() => {
    if (!showSuccess) return;
    if (
      variables?.sizeId === Number.parseInt(selectedSizeValue) &&
      variables?.quantity === selectedQuantity
    ) {
      setIsAllowedToSubmit(false);
      return;
    }
    setIsAllowedToSubmit(true);
  }, [selectedSizeValue, selectedQuantity, variables, isSuccess, showSuccess]);

  // const showSuccess = isSuccess && !isAllowedToSubmit && !isPending;
  const showLoading = !showSuccess && !isAllowedToSubmit;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const quantity = selectedQuantity;
        const sizeId = Number(selectedSizeValue);

        if (Number.isNaN(selectedQuantity) || Number.isNaN(sizeId)) {
          console.error('Inavlid Input');
          return;
        }

        await addCartItemMutation({
          productId,
          quantity,
          sizeId,
        });
      }}
    >
      <label
        htmlFor="clothing-size"
        className="mb-4 block font-medium leading-none text-black/60"
      >
        Choose Size
      </label>
      <RadioGroup.Root
        required
        aria-label="Cloth size options"
        className="flex min-h-[5.25rem] max-w-[19rem] flex-wrap gap-3 text-sm"
        orientation="horizontal"
        name="size"
        id="clothing-size"
        value={selectedSizeValue}
        onValueChange={(value) => setSelectedSizeValue(value)}
      >
        {sizeOptions.map(({ sizeId, sizeName }) => (
          <RadioGroup.Item
            key={sizeId}
            className={buttonVariants({
              align: 'left',
              variant: 'secondary',
              roundness: 'default',
              className:
                'h-max px-6 data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
            })}
            value={sizeId.toString()}
          >
            {sizeName.match(/xl/g)
              ? sizeName.toUpperCase()
              : capitalize(sizeName)}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
      <div className="my-6 h-px w-full bg-black/10" />
      <div className="grid h-[3.25rem] w-full grid-cols-3 gap-5 font-medium">
        {/* <CartQuantityCounter
          initial={selectedQuantity}
          onChange={setSelectedQuantity}
          className="h-full w-full max-w-none"
        /> */}
        <CartQuantityCounter
          value={selectedQuantity}
          onValueChange={setSelectedQuantity}
        >
          <CartQuantityChangeBtn controlType="decrease" />
          <CartQuantityInput />
          <CartQuantityChangeBtn controlType="increase" />
        </CartQuantityCounter>
        <Button
          type="submit"
          size={'md'}
          className={cn(
            'col-span-2 w-full transition-colors duration-200 disabled:opacity-100',
            showSuccess &&
              !isAllowedToSubmit &&
              'cursor-default bg-emerald-500 hover:bg-emerald-500',
          )}
          disabled={!isAllowedToSubmit}
          aria-disabled={!isAllowedToSubmit}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isAllowedToSubmit && (
              <>
                <BagCartIconMini className="-ml-5 mr-1 inline-block -translate-y-0.5" />
                <span>Add to Cart</span>
              </>
            )}
            {showLoading && <Spinner size={24} className="text-primary-50" />}
            {showSuccess && !isAllowedToSubmit && (
              <>
                <CheckCircleIcon className="-ml-5 size-5" />
                <span>Added to cart</span>
              </>
            )}
          </span>
        </Button>
      </div>
    </form>
  );
};
export default ProductAddCartRadioGroup;
