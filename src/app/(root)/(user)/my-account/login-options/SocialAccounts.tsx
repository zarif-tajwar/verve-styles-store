import { auth } from '@/auth';
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
import { BuiltInProviderType } from '@auth/core/providers';
import { Session } from 'next-auth/types';

type Providers = {
  label: string;
  icon: typeof GoogleIcon;
  provider: BuiltInProviderType;
}[];

const providers: Providers = [
  { label: 'Google', icon: GoogleIcon, provider: 'google' },
  { label: 'facebook', icon: FacebookIcon, provider: 'facebook' },
];

const SocialAccounts = async ({ session }: { session: Session }) => {
  const linkedSocialProviders = await db
    .select({
      provider: accounts.provider,
    })
    .from(accounts)
    .where(and(eq(accounts.userId, session.user.id)));

  return (
    <div className="grid w-full grid-cols-2 gap-16">
      {providers.map((provider) => {
        const isLoggedIn = linkedSocialProviders.some(
          (linked) => linked.provider === provider.provider,
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
                {isLoggedIn && (
                  <span className="text-sm/none font-medium text-primary-400">
                    placeholder@email.com
                  </span>
                )}
              </div>
            </div>
            {isLoggedIn ? (
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
              <ConnectAccountButton provider={provider.provider} />
            )}
          </div>
        );
      })}
    </div>
  );
};
export default SocialAccounts;
