'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ComponentPropsWithoutRef } from 'react';

type LinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> &
  (
    | { redirectAfter: 'same-url'; redirectAfterTo?: undefined }
    | { redirectAfter: true; redirectAfterTo: string }
    | { redirectAfter?: undefined; redirectAfterTo?: undefined }
  );

const SignInLink = ({
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
        query: { redirectAfter: redirectAfterLinkFinal },
      }}
      {...props}
    >
      {children}
    </Link>
  );
};
export default SignInLink;
