import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/shop',
    '/categories',
    '/cart',
    '/:category/:productName*',
  ],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/'],
};
