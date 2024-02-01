'use client';

import { Button } from '@/components/UI/Button';
import { useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { performDummyCheckout } from '@/lib/actions/checkout';
import { useAction } from 'next-safe-action/hooks';
import { errorToast, successToast } from '@/components/UI/Toaster';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/16/solid';
import Spinner from '@/components/UI/Spinner';
import { wait } from '@/lib/util';

const TestArea = () => {
  const cardNumber = '4242 4242 4242 4242';

  const [hasCopied, setHasCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleDummyCheckout = async () => {
    setLoading(true);
    const { data, serverError, validationErrors } = await performDummyCheckout(
      {},
    );

    if (serverError) {
      errorToast(serverError);
      return;
    }
    if (validationErrors) {
      errorToast('Something went wrong with data validation');
      return;
    }

    if (!data) {
      errorToast('Something went wrong with the checkout', {
        description: 'Please try again',
      });
      return;
    }

    if (data.orderId === undefined && data.isThereUnavailableProduct) {
      errorToast(
        'At least one of your ordered products is not available due to low stock',
        {
          description: 'Redirecting you to the cart page',
          duration: 5000,
        },
      );
      router.replace('/cart');
      return;
    }

    const href = `/my-account/orders/${data.orderId}`;

    setSuccess(true);
    successToast('Your order was placed successfully', {
      position: 'top-center',
    });
    await wait(1000);
    router.replace(href);
  };

  return (
    <div className="rounded-xl bg-primary-50 p-8">
      <div className="mb-6">
        <p className="mb-2 text-balance text-sm text-primary-400">
          <span className="font-semibold text-primary-500">
            Note:&nbsp;&nbsp;
          </span>
          You can copy and use this test card number&nbsp;
          <span className="font-semibold">(provided by Stripe)</span> for
          testing checkout!
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-md bg-primary-100 px-2 py-1 text-sm font-medium text-primary-400">
            {cardNumber}
          </span>
          <Button
            onClick={() => {
              copy(cardNumber);
              setHasCopied(true);
            }}
            size={'xs'}
            className="rounded-md bg-primary-400"
          >
            {hasCopied ? `Copied` : `Copy`}
          </Button>
        </div>
      </div>
      <div>
        <p className="mb-2 text-balance text-sm text-primary-400">
          <span className="font-semibold text-primary-500">
            Skip payment test:&nbsp;&nbsp;
          </span>
          Complete the checkout without payment simulation!
        </p>
        {!success && (
          <Button
            onClick={async () => {
              setLoading(true);
              await handleDummyCheckout();
              setLoading(false);
            }}
            size={'sm'}
            className="min-w-64 rounded-md bg-primary-400"
            disabled={loading}
          >
            {!loading && `Skip payment & checkout`}
            {loading && (
              <>
                <Spinner className="size-4" />
                {'Placing your order'}
              </>
            )}
          </Button>
        )}
        {success && (
          <Button
            size={'sm'}
            asChild
            className="min-w-64 items-center justify-center gap-2 rounded-md bg-emerald-500 text-primary-0 hover:bg-emerald-500"
          >
            <span className="">
              <CheckCircleIcon className="size-4" />
              {'Success'}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};
export default TestArea;
