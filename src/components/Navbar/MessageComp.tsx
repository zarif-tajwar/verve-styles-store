import React from 'react';

const MessageComp = ({
  Icon,
  message,
}: {
  Icon: React.JSX.Element;
  message: string;
}) => {
  return (
    <div className="flex max-w-[13rem] flex-col items-start justify-start gap-2 p-4 text-primary-500">
      {Icon}
      <span className="block text-base">{message}</span>
    </div>
  );
};

export default MessageComp;
