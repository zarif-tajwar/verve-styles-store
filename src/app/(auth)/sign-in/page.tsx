'use client';

import { FacebookIcon, GoogleIcon } from '@/components/Svgs/icons';
import { Button } from '@/components/UI/Button';
import { signInAction } from '@/lib/actions/auth';
import Image from 'next/image';

const SignInPage = () => {
  return (
    <div className="flex h-[100svh] w-screen items-center justify-center bg-primary-100 p-8">
      <main className="h-[800px] w-full max-w-6xl rounded-main bg-primary-0 p-6">
        <div className="grid h-full grid-cols-2 gap-6">
          {/* Login Visual */}
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src={'/sign-in-image-2.jpg'}
              fill
              alt="A young man with good cloths"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
          {/* Login Prompt */}
          <div className="flex flex-col items-start justify-center px-16">
            <div className="mb-8 flex gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="inline-block h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              </span>

              <div>
                <h1 className="mb-1 text-3xl font-medium">Sign In To Clothy</h1>
                <p className="text-primary-500">
                  Your dream wardrobe is waiting for you!
                </p>
              </div>
            </div>
            <Button
              size={'lg'}
              onClick={async () => {
                await signInAction();
              }}
              variant={'outline'}
              className="mb-4 w-full gap-4 py-7 text-lg"
            >
              <GoogleIcon />
              Sign In using Google
            </Button>
            <Button
              size={'lg'}
              onClick={async () => {
                await signInAction();
              }}
              variant={'outline'}
              className="w-full gap-4 py-7 text-lg"
            >
              <FacebookIcon />
              Sign In using Facebook
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default SignInPage;
