export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-primary-100 p-[var(--screen-padding)] [--screen-padding:0.5rem] sm:[--screen-padding:1rem]">
      <div className="grid min-h-[calc(100svh-var(--screen-padding)*2)]">
        {children}
      </div>
    </div>
  );
}
