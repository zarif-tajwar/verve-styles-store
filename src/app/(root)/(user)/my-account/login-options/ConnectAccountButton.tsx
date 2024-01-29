'use client';

import { Button } from '@/components/UI/Button';
import { signInAction } from '@/lib/actions/auth';
import { cn } from '@/lib/util';
import { BuiltInProviderType } from '@auth/core/providers';
import { LinkIcon } from 'lucide-react';

const ConnectAccountButton = ({
  provider,
}: {
  provider: BuiltInProviderType;
}) => {
  return (
    <Button
      onClick={() =>
        signInAction(provider, { redirectTo: '/my-account/login-options' })
      }
      className={cn('min-w-[96px] justify-start gap-2 pl-4 font-medium')}
    >
      <LinkIcon className="h-4 w-4" />
      Link
    </Button>
  );
};
export default ConnectAccountButton;
