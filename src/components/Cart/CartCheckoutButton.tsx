'use client';

import React from 'react';
import { revalidatePathAction } from '@/lib/actions/checkout';
import { MoveRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../UI/Button';
import SignInLink from '../auth/SignInLink';
import { useAuthQuery } from '@/lib/queries/auth';

const CartCheckoutButton = () => {
  const { data } = useAuthQuery();
  const isLoggedIn = !!data;
  return (
    <div className="flex items-center justify-center">
      {isLoggedIn ? (
        <Button
          asChild
          size={'xl'}
          className="w-full gap-3"
          onClick={() => revalidatePathAction('/checkout')}
        >
          <Link href={'/checkout'}>
            Go to checkout
            <MoveRight />
          </Link>
        </Button>
      ) : (
        <Button asChild size={'xl'} className="w-full gap-3">
          <SignInLink redirectAfter redirectAfterTo="/checkout">
            Sign in to Checkout
            <MoveRight />
          </SignInLink>
        </Button>
      )}
    </div>
  );
};

export default CartCheckoutButton;
