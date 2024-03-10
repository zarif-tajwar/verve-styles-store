'use client';

import { Button } from '@/components/UI/Button';
import { messageToast } from '@/components/UI/Toaster';
import { cn } from '@/lib/util';
import { SupportedOauthProviders } from '@/lib/validation/auth';
import { LinkIcon } from 'lucide-react';

const ConnectAccountButton = ({
  provider,
}: {
  provider: SupportedOauthProviders;
}) => {
  const handleClick = () => {
    messageToast('Not implemented yet!');
  };

  return (
    <Button
      onClick={handleClick}
      className={cn('min-w-[96px] justify-start gap-2 pl-4 font-medium')}
    >
      <LinkIcon className="h-4 w-4" />
      Link
    </Button>
  );
};
export default ConnectAccountButton;
