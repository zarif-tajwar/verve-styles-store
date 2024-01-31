import { dedupedAuth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await dedupedAuth();
  if (!session) redirect('/auth/sign-in');

  return (
    <div className="flex min-h-[100svh] flex-col bg-primary-0">{children}</div>
  );
}
