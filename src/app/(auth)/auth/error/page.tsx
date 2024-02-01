import { MessageSquare, RetryIcon } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const AuthErrorPage = () => {
  return (
    <main className="rounded-xl bg-primary-0 p-2.5 shadow sm:w-[min(30rem,100vw-4rem)]">
      {/* ERROR MESSAGE */}
      <div className="mb-2.5 flex w-full items-center justify-center rounded-xl px-4 py-6">
        <div className="flex w-full max-w-xs flex-col items-center gap-4 text-center text-rose-800">
          <ShieldAlert
            className="h-10 w-10 opacity-80 sm:h-16 sm:w-16"
            strokeWidth={1.5}
          />
          <p className="font-medium sm:text-lg">
            Something went wrong with the user authentication process.
          </p>
        </div>
      </div>
      {/* BUTTONS */}
      <div className="grid w-full gap-2.5 font-medium sm:grid-cols-2">
        <Button
          roundness={'lg'}
          variant={'outline'}
          asChild
          className="gap-2 py-2.5 text-primary-400 ring-primary-50 sm:last:col-span-2"
        >
          <Link href={'/shop'}>
            <ArrowLeft className="h-4 w-4" />
            Go Back to Shop
          </Link>
        </Button>
        <Button
          roundness={'lg'}
          variant={'outline'}
          asChild
          className="gap-2 py-2.5 text-primary-400 ring-primary-50 sm:last:col-span-2"
        >
          <Link href={'/auth/sign-in'}>
            <RetryIcon className="h-4 w-4" />
            Try Again
          </Link>
        </Button>
        <Button
          roundness={'lg'}
          variant={'outline'}
          asChild
          className="gap-2 py-2.5 text-primary-400 ring-primary-50 sm:last:col-span-2"
        >
          <Link href={'/support/contact'}>
            <MessageSquare className="h-4 w-4" />
            Contact Support
          </Link>
        </Button>
      </div>
    </main>
  );
};
export default AuthErrorPage;
