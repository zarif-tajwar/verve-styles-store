'use client';

import { FacebookIcon, GoogleIcon } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import Spinner from '@/components/UI/Spinner';
import { oauthSignInAction } from '@/lib/actions/auth';
import { cn } from '@/lib/util';
import { SupportedOauthProviders } from '@/lib/validation/auth';
import { useMutation } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';

const supportedOauthProviders: {
  provider: SupportedOauthProviders;
  text: string;
  icon: typeof FacebookIcon;
}[] = [
  {
    provider: 'facebook',
    text: 'facebook',
    icon: FacebookIcon,
  },
  {
    provider: 'google',
    text: 'Google',
    icon: GoogleIcon,
  },
] as const;

type OauthSignInButtonProps = {
  provider: SupportedOauthProviders;
  className?: string;
};

const OauthSignInButton = ({ provider, className }: OauthSignInButtonProps) => {
  const ProviderObject = supportedOauthProviders.find(
    (x) => x.provider === provider,
  );

  const { status, execute } = useAction(oauthSignInAction);

  const currentSearchParamsObject = useSearchParams();

  let redirectAfterPathname = currentSearchParamsObject.get('redirectAfter');

  const isLoading = status === 'executing';

  if (!ProviderObject) return null;

  return (
    <Button
      size={'md'}
      variant={'outline'}
      className={cn(
        'w-full gap-x-4 text-sm font-medium disabled:opacity-50',
        className,
      )}
      roundness={'lg'}
      onClick={() => {
        execute({ provider, redirectAfterPathname });
      }}
      disabled={isLoading}
    >
      {!isLoading && (
        <ProviderObject.icon width={20} height={20} className="size-5" />
      )}
      {isLoading && <Spinner className="size-5" />}
      {<span>{`Continue with ${ProviderObject.text}`}</span>}
    </Button>
  );
};
export default OauthSignInButton;