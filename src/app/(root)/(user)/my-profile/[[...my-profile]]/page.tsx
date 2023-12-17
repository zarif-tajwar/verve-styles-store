import { UserProfile } from '@clerk/nextjs';

const page = () => {
  return (
    <div className="flex items-center justify-center py-16">
      <UserProfile routing="path" path="/my-profile" />
    </div>
  );
};
export default page;
