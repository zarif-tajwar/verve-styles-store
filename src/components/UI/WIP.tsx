import { AlertTriangle } from 'lucide-react';

const WIP = () => {
  return (
    <div className="flex h-full min-h-[600px] w-full items-center justify-center">
      <div className="flex items-center justify-center gap-8 rounded-xl bg-primary-50 py-8 pl-4 pr-12">
        <div className="grid grid-cols-[auto_auto]">
          <AlertTriangle
            className="h-full w-full text-primary-300"
            strokeWidth={1.5}
          />
          <strong className="text-3xl font-semibold text-primary-300">
            Work <br /> <span className="pl-[2.2%]">In Progress</span>
          </strong>
        </div>
      </div>
    </div>
  );
};
export default WIP;
