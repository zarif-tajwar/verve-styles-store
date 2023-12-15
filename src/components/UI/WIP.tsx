import { AlertTriangle } from 'lucide-react';

const WIP = () => {
  return (
    <div className="flex h-full min-h-[600px] w-full items-center justify-center">
      <div className="flex h-[400px] w-[600px] flex-col items-center justify-center gap-8 rounded-3xl bg-primary-50 ring-2 ring-primary-100">
        <AlertTriangle size={120} className="text-primary-200" />
        <strong className="text-4xl font-semibold text-primary-300">
          Work In Progress
        </strong>
      </div>
    </div>
  );
};
export default WIP;
