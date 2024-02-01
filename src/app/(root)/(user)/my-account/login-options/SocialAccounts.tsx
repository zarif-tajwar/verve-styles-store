import { FacebookIcon, GoogleIcon } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { db } from '@/lib/db';
import { accounts } from '@/lib/db/schema/auth';
import { cn } from '@/lib/util';
import { BuiltInProviderType } from '@auth/core/providers';
import { and, eq } from 'drizzle-orm';
import { Check } from 'lucide-react';
import { Session } from 'next-auth/types';
import ConnectAccountButton from './ConnectAccountButton';

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
  const userRole = session.user.role;

  if (userRole === 'TEST USER') {
    return <div>Not Available for Test Users!</div>;
  }

  const linkedSocialProviders = await db
    .select({
      provider: accounts.provider,
      email: accounts.email,
      name: accounts.name,
    })
    .from(accounts)
    .where(and(eq(accounts.userId, session.user.id)));

  return (
    <div className="grid w-full grid-cols-2 gap-16">
      {providers.map((provider) => {
        const linkedSocialProvider = linkedSocialProviders.find(
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
                {linkedSocialProvider?.email && (
                  <span className="text-sm/none font-medium text-primary-400">
                    {linkedSocialProvider.email}
                  </span>
                )}
              </div>
            </div>
            {linkedSocialProvider ? (
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
