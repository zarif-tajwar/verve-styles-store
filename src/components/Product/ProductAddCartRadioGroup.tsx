'use client';

import { capitalize, cn } from '@/lib/util';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Button, buttonVariants } from '../UI/Button';
import CartQuantityCounter from '../Cart/CartQuantityCounter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCartItemAction } from '@/lib/actions/cart';
import { CART_ITEM_DATA_QUERY_KEY } from '@/lib/constants/query-keys';
import Spinner from '../UI/Spinner';
import { BagCartIconMini } from '../Svgs/icons';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { errorToast } from '../UI/Toaster';

type sizeOptions = {
  sizeName: string;
  sizeId: number;
}[];

const ProductAddCartRadioGroup = ({
  sizeOptions,
  productId,
}: {
  sizeOptions: sizeOptions;
  productId: number;
}) => {
  const queryClient = useQueryClient();

  const [selectedSizeValue, setSelectedSizeValue] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isAllowedToSubmit, setIsAllowedToSubmit] = useState(true);

  const {
    mutateAsync: addCartItemMutation,
    isPending,
    isSuccess,
    variables,
  } = useMutation({
    mutationFn: addCartItemAction,
    onSuccess: () => {
      setIsAllowedToSubmit(false);
      queryClient.refetchQueries({
        queryKey: CART_ITEM_DATA_QUERY_KEY,
      });
    },
    onMutate: () => {
      setIsAllowedToSubmit(false);
    },
    onError: () => {
      errorToast('Something went wrong!');
      setIsAllowedToSubmit(true);
    },
  });

  useEffect(() => {
    if (!isSuccess) return;
    if (
      variables.sizeId === Number.parseInt(selectedSizeValue) &&
      variables.quantity === selectedQuantity
    ) {
      setIsAllowedToSubmit(false);
      return;
    }
    setIsAllowedToSubmit(true);
  }, [selectedSizeValue, selectedQuantity, variables, isSuccess]);

  const showSuccess = isSuccess && !isAllowedToSubmit && !isPending;
  const showLoading = isPending && !isAllowedToSubmit;

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
        className="flex max-w-[19rem] flex-wrap gap-3 text-sm"
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
                'px-6 data-[state=checked]:bg-primary-900 data-[state=checked]:text-primary-0',
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
        <CartQuantityCounter
          initial={selectedQuantity}
          onChange={setSelectedQuantity}
          className="h-full w-full max-w-none"
        />
        <Button
          type="submit"
          size={'md'}
          className={cn(
            'col-span-2 w-full transition-colors duration-200 disabled:opacity-100',
            showSuccess && 'cursor-default bg-emerald-500 hover:bg-emerald-500',
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
            {showSuccess && (
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
