import { DEFAULT_SERVER_ERROR, createSafeActionClient } from 'next-safe-action';
import { CustomError } from '../errors/custom-error';
import { auth } from '../server/auth';

export const authorizedActionClient = createSafeActionClient({
  middleware: async () => {
    const { user } = await auth();
    if (!user) throw new CustomError('Not logged in!');
    return user;
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
