'use client';

import { Button } from '@/components/UI/Button';
import { cn } from '@/lib/util';
import { LinkIcon } from 'lucide-react';
import { useEmailLink, useClerk, useSignIn } from '@clerk/nextjs';

const ConnectAccountButton = ({}: {}) => {
  const { signIn } = useSignIn();
  return (
    <Button className={cn('min-w-[96px] justify-start gap-2 pl-4 font-medium')}>
      <LinkIcon className="h-4 w-4" />
      Link
    </Button>
  );
};
export default ConnectAccountButton;
