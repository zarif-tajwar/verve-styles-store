import { FacebookIcon, GoogleIcon } from '@/components/Svgs/icons';
import Image from 'next/image';
import SignInButton from './SignInButton';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

const SignInPage = async () => {
  const session = await auth();
  // if (session) redirect('/shop');

  return (
    <div className="flex h-[100vh] w-screen items-center justify-center bg-primary-50 p-8 sm:bg-primary-50">
      <main className="max-h-[50rem] w-full max-w-6xl rounded-main shadow-light-drop sm:h-full sm:bg-primary-0 sm:p-6 sm:pr-12 lg:py-2 lg:pl-2 lg:pr-6">
        <div className="relative h-full grid-cols-[2fr_1fr] sm:grid lg:grid-cols-[0.8fr_1fr] lg:gap-6 xl:grid-cols-2">
          {/* Login Visual */}
          <div className="relative hidden overflow-hidden rounded-2xl lg:block">
            <Image
              src={'/sign-in-image-2.jpg'}
              // fill
              width={640}
              height={844}
              alt="A young man with good cloths"
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              priority
            />
          </div>
          {/* Login Prompt */}
          <div className="flex items-center justify-center">
            <div className="right-0 flex w-full max-w-md flex-col items-start justify-center rounded-2xl bg-primary-0 p-8 py-10 shadow-light-drop sm:absolute sm:shadow-drop lg:static lg:max-w-none lg:p-8 lg:shadow-none xl:p-16 landscape:static">
              <div className="mb-12 flex flex-col gap-x-4 gap-y-3 lg:mb-8 lg:flex-row">
                <span className="inline-flex aspect-square h-12 w-12 flex-grow items-center justify-center rounded-full bg-primary-50 text-primary-400 lg:h-16 lg:w-16">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="inline-block h-6 w-6 lg:h-8 lg:w-8"
                    width={24}
                    height={24}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                </span>

                <div>
                  <h1 className="mb-1 text-2xl font-medium lg:text-3xl">
                    Sign In To Clothy
                  </h1>
                  <p className="text-primary-500">
                    Your dream wardrobe is waiting{' '}
                    <span className="whitespace-nowrap">for you!</span>
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <SignInButton>
                  <GoogleIcon
                    width={20}
                    height={20}
                    className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5"
                  />
                  Sign In using Google
                </SignInButton>
                <SignInButton provider="facebook">
                  <FacebookIcon
                    width={20}
                    height={20}
                    className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5"
                  />
                  Sign In using Facebook
                </SignInButton>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default SignInPage;
