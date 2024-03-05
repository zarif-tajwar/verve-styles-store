import { dedupedAuth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await dedupedAuth();
  // if (session) redirect('/shop');

  return (
    <div className="bg-primary-100 p-[var(--screen-padding)] [--screen-padding:0.5rem] sm:[--screen-padding:1rem]">
      {children}
    </div>
  );
}
