import { FacebookIcon, GoogleIcon } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { db } from '@/lib/db';
import { oauthAccount } from '@/lib/db/schema/auth2';
import { cn } from '@/lib/util';
import { and, eq } from 'drizzle-orm';
import { Check } from 'lucide-react';
import ConnectAccountButton from './ConnectAccountButton';
import { User } from 'lucia';
import { SupportedOauthProviders } from '@/lib/validation/auth';

type Providers = {
  label: string;
  icon: typeof GoogleIcon;
  provider: SupportedOauthProviders;
}[];

const providers: Providers = [
  { label: 'Google', icon: GoogleIcon, provider: 'google' },
  { label: 'facebook', icon: FacebookIcon, provider: 'facebook' },
];

const SocialAccounts = async ({ user }: { user: User }) => {
  if (user.role === 'TEST_USER') {
    return <div>Not Available for Test Users!</div>;
  }

  const linkedSocialProviders = await db
    .select({
      provider: oauthAccount.provider,
      email: oauthAccount.email,
    })
    .from(oauthAccount)
    .where(and(eq(oauthAccount.userId, user.id)));

  return (
    <div className="grid w-full gap-x-16 gap-y-8 sm:grid-cols-2">
      {providers.map((provider) => {
        const linkedSocialProvider = linkedSocialProviders.find(
          (linked) => linked.provider === provider.provider,
        );
        return (
          <div
            key={provider.label}
            className="flex items-center justify-between gap-2 font-semibold sm:items-start"
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
