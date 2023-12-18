import { GoogleIcon, FacebookIcon, YahooIcon } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { db } from '@/lib/db';
import { accounts } from '@/lib/db/schema/auth';
import { cn, wait } from '@/lib/util';
import { and, eq } from 'drizzle-orm';
import { Check, Link as LinkIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import ConnectAccountButton from './ConnectAccountButton';
import { SvgIconProps } from '@/lib/types/common';
import { auth, currentUser } from '@clerk/nextjs';

type Providers = {
  label: string;
  icon: typeof GoogleIcon;
  provider: string;
}[];

const providers: Providers = [
  { label: 'Google', icon: GoogleIcon, provider: 'google' },
  { label: 'facebook', icon: FacebookIcon, provider: 'facebook' },
];

const SocialAccounts = async () => {
  const user = await currentUser();

  const externalProviders = user?.externalAccounts;

  const linkedProviders =
    externalProviders?.map((externalProvider) => ({
      provider: externalProvider.verification?.strategy.replace('oauth_', ''),
      email: externalProvider.emailAddress,
    })) || [];

  return (
    <div className="grid w-full grid-cols-2 gap-16">
      {providers.map((provider) => {
        const linkedProvider = linkedProviders.find(
          (linkedProvider) => linkedProvider.provider === provider.provider,
        );
        return (
          <div
            key={provider.label}
            className="flex items-start justify-between gap-2 font-semibold"
          >
            <div className="flex items-start gap-4">
              <provider.icon />
              <div className="flex flex-col gap-2">
                <span className="text-lg/none">{provider.label}</span>
                {linkedProvider?.email && (
                  <span className="text-sm/none font-medium text-primary-400">
                    {linkedProvider.email}
                  </span>
                )}
              </div>
            </div>
            {linkedProvider ? (
              <Button
                className={cn(
                  'gap-2 font-semibold',
                  'text-emerald-500 ring-emerald-500',
                  'cursor-default hover:bg-transparent hover:ring-emerald-500',
                )}
                variant={'outline'}
              >
                <Check className="h-5 w-5" />
                Linked
              </Button>
            ) : (
              <ConnectAccountButton />
            )}
          </div>
        );
      })}
    </div>
  );
};
export default SocialAccounts;
