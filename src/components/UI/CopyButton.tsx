'use client';

import * as React from 'react';
import copy from 'copy-to-clipboard';
import { CheckIcon, ClipboardIcon } from '@radix-ui/react-icons';

export const CopyCodeButton = ({ code }: { code: string }) => {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) setTimeout(() => setHasCopied(false), 1500);
  }, [hasCopied]);

  return (
    <button
      aria-label="Copy code to clipboard"
      onClick={() => {
        copy(code);
        setHasCopied(true);
      }}
    >
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
    </button>
  );
};
