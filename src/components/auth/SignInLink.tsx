'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ComponentPropsWithoutRef, Suspense } from 'react';

type LinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> &
  (
    | { redirectAfter: 'same-url'; redirectAfterTo?: undefined }
    | { redirectAfter: true; redirectAfterTo: string }
    | { redirectAfter?: undefined; redirectAfterTo?: undefined }
  );

const SignInLinkClient = ({
  children,
  redirectAfter,
  redirectAfterTo,
  ...props
}: LinkProps) => {
  const currentPathname = usePathname();

  const currentSearchParamsObject = useSearchParams();
  const currentSearchParams = currentSearchParamsObject.toString();

  let redirectAfterLinkFinal: string | undefined = undefined;

  if (redirectAfter === 'same-url') {
    redirectAfterLinkFinal = encodeURIComponent(
      `${currentPathname}?${currentSearchParams}`,
    );
  }

  if (redirectAfter && redirectAfter !== 'same-url') {
    redirectAfterLinkFinal = encodeURIComponent(redirectAfterTo);
  }

  return (
    <Link
      href={{
        pathname: '/auth/sign-in',
        query: {
          ...(redirectAfter ? { redirectAfter: redirectAfterLinkFinal } : {}),
        },
      }}
      {...props}
    >
      {children}
    </Link>
  );
};

const SignInLink = ({ ...props }: LinkProps) => {
  return (
    <Suspense>
      <SignInLinkClient {...props} />
    </Suspense>
  );
};

export default SignInLink;
