import { dedupedAuth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await dedupedAuth();
  if (session) redirect('/shop');

  return (
    <div className="flex min-h-[100svh] w-screen items-center justify-center bg-primary-50 p-4 sm:p-8">
      {children}
    </div>
  );
}
