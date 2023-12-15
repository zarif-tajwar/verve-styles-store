import { GoogleIcon, FacebookIcon } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { cn, wait } from '@/lib/util';
import { Check, Link as LinkIcon } from 'lucide-react';

const providers = [
  { label: 'Google', icon: GoogleIcon },
  { label: 'facebook', icon: FacebookIcon },
];

const SocialAccounts = async () => {
  await wait(700);

  return (
    <div className="mt-8 grid w-full grid-cols-2 gap-16">
      {providers.map((provider) => {
        const isLoggedIn = provider.label === 'Google';

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
                    zariftjwr@gmail.com
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
                  // 'bg-emerald-500',
                )}
                variant={'outline'}
              >
                <Check className="h-5 w-5" />
                Linked
              </Button>
            ) : (
              <Button
                className={cn(
                  'min-w-[96px] justify-start gap-2 pl-4 font-medium',
                )}
              >
                <LinkIcon className="h-4 w-4" />
                Link
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default SocialAccounts;
