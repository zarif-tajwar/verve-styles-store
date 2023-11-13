'use client';

import { capitalize } from '@/lib/util';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Button, buttonVariants } from '../UI/Button';
import CartQuantityCounter from '../Cart/CartQuantityCounter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addCartItemServer } from '@/lib/actions/cart';
import * as queryKeys from '@/lib/constants/query-keys';

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
  const { mutateAsync: addCartItemMutation } = useMutation({
    mutationFn: addCartItemServer,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: queryKeys.CART_ITEM_DATA,
      });
    },
  });
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const start = performance.now();
        const formEl = new FormData(e.currentTarget);
        const data = Object.fromEntries(formEl.entries());

        console.log(data);

        const quantity = Number(data.quantity);
        const sizeId = Number(data.size);

        console.log(quantity, sizeId);

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
          className={'col-span-2 w-full'}
        >
          Add to Cart
        </Button>
      </div>
    </form>
  );
};
export default ProductAddCartRadioGroup;
