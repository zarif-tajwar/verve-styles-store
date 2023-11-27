import React from 'react';

const MessageComp = ({
  Icon,
  message,
}: {
  Icon: React.JSX.Element;
  message: string;
}) => {
  return (
    <div className="flex min-w-[16rem] flex-col items-start justify-start gap-2 p-4 text-primary-500">
      {Icon}
      <span className="block max-w-[12rem] text-base">{message}</span>
    </div>
  );
};

export default MessageComp;
