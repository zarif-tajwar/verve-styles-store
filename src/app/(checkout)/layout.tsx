import { dedupedAuth } from '@/auth';
import { Button } from '@/components/UI/Button';
import { Container } from '@/components/UI/Container';
import Logo from '@/components/UI/Logo';
import { ChevronLeftIcon } from '@heroicons/react/16/solid';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await dedupedAuth();
  if (!session) redirect('/auth/sign-in');

  return (
    <div className="flex min-h-[100svh] flex-col bg-primary-0">
      <div className="border-b-2 border-primary-50">
        <Container>
          <div className="relative flex h-[var(--nav-height)] items-center justify-between">
            <Button
              variant={'outline'}
              roundness={'lg'}
              className="-ml-2 font-medium md:ml-0"
              asChild
            >
              <Link href={'/shop'}>
                <ChevronLeftIcon className="size-4" />
                Go back to shopping
              </Link>
            </Button>
            <Link
              href={'/shop'}
              className="sm:absolute sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2"
            >
              <Logo />
            </Link>
          </div>
        </Container>
      </div>
      {children}
    </div>
  );
}
