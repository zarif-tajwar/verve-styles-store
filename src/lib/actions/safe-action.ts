import { auth } from '@/auth';
import { DEFAULT_SERVER_ERROR, createSafeActionClient } from 'next-safe-action';
import { CustomError } from '../errors/custom-error';

export const authorizedActionClient = createSafeActionClient({
  middleware: async () => {
    const session = await auth();
    if (!session) throw new CustomError('Not logged in!');
    return { userId: session.user.id, session };
  },
  handleReturnedServerError: (e) => {
    if (e instanceof CustomError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR;
  },
});

export const actionClient = createSafeActionClient({
  handleReturnedServerError: (e) => {
    if (e instanceof CustomError) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR;
  },
});
