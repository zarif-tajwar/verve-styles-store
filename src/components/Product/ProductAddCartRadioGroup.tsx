'use client';

import { capitalize, cn, wait } from '@/lib/util';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Button, buttonVariants } from '../UI/Button';
import CartQuantityCounter from '../Cart/CartQuantityCounter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCartItemAction } from '@/lib/actions/cart';
import { CART_ITEM_DATA_QUERY_KEY } from '@/lib/constants/query-keys';
import Spinner from '../UI/Spinner';
import {
  BagCartIcon,
  BagCartIconMini,
  CheckIcon,
  CheckMini,
} from '../Svgs/icons';
import { Check } from 'lucide-react';

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
  // const cartQueryKey = getQueryKey(trpc.getCartItems);
  const {
    mutateAsync: addCartItemMutation,
    isPending,
    isSuccess,
    isIdle,
    isError,
  } = useMutation({
    mutationFn: addCartItemAction,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: CART_ITEM_DATA_QUERY_KEY,
      });
    },
  });

  const disableAddToCartButton = isPending;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const start = performance.now();
        const formEl = new FormData(e.currentTarget);
        const data = Object.fromEntries(formEl.entries());

        const quantity = Number(data.quantity);
        const sizeId = Number(data.size);

        if (Number.isNaN(quantity) || Number.isNaN(sizeId)) {
          console.error('Inavlid Input');
          return;
        }

        const cartItem = await addCartItemMutation({
          productId,
          quantity,
          sizeId,
        });

        console.log(cartItem);
        const end = performance.now();
        console.log(end - start);
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
        <CartQuantityCounter className="h-full w-full max-w-none" />
        <Button
          // onClick={(e) => e.preventDefault()}
          size={'md'}
          className={cn(
            'col-span-2 w-full transition-colors duration-200 disabled:opacity-100',
            isSuccess && 'cursor-default bg-emerald-500 hover:bg-emerald-500',
          )}
          disabled={disableAddToCartButton}
          aria-disabled={disableAddToCartButton}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isIdle && (
              <>
                <BagCartIconMini className="-ml-5 mr-1 inline-block -translate-y-0.5" />
                <span>Add to Cart</span>
              </>
            )}
            {isPending && <Spinner size={24} className="text-primary-50" />}
            {isSuccess && (
              <>
                <Check
                  strokeWidth={2.5}
                  className="-ml-5 inline-block h-5 w-5"
                />
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
