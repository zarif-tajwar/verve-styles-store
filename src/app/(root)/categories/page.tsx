import DynamicStar from '@/components/UI/DynamicStar';
import { MessageSquare } from 'lucide-react';

const page = () => {
  return (
    <div className="container-main">
      <div className="flex h-[400px] w-full items-center justify-center">
        <DynamicStar />
        <MessageSquare className="h-2 w-2" />
      </div>
    </div>
  );
};
export default page;
