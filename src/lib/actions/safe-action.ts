import { createSafeActionClient } from 'next-safe-action';
import { CustomError } from '../errors/custom-error';
import { auth } from '../server/auth';

export const actionClient = createSafeActionClient({
  handleServerError: (e) => {
    if (e instanceof CustomError) return e.message;
    return 'Oops, something went wrong!';
  },
});

export const authorizedActionClient = actionClient.use(async ({ next }) => {
  const { user } = await auth();
  if (!user) throw new CustomError('Not logged in!');
  return next({ ctx: { user } });
});
