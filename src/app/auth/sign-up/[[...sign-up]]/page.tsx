import Spinner from '@/components/UI/Spinner';
import { ClerkLoading, SignUp, ClerkLoaded } from '@clerk/nextjs';

const SignupPage = () => {
  return (
    <div className="flex min-h-[100svh] w-screen items-center justify-center bg-primary-50">
      <main>
        <div className="flex items-center justify-center p-8">
          <ClerkLoading>
            <Spinner variant={2} className="h-12 w-12" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignUp />
          </ClerkLoaded>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
