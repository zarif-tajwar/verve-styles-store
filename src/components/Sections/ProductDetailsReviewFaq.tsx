import { db } from '@/lib/db';
import ProductReviews from '../UI/ProductReviews';
import { users } from '@/lib/db/schema/users';
import { userReviews } from '@/lib/db/schema/userReviews';
import { orderLine } from '@/lib/db/schema/orderLine';
import { productEntries } from '@/lib/db/schema/productEntries';
import { desc, eq, sql } from 'drizzle-orm';
import { orders } from '@/lib/db/schema/orders';
import ProductDetailsReviewFaqTab from '../UI/ProductDetailsReviewFaqTab';
import { Suspense } from 'react';

const ProductDetailsReviewFaq = async ({
  productId,
  searchParams,
}: {
  productId: number;
  searchParams: SearchParamsServer;
}) => {
  const reviews = await db
    .select({
      userFirstName: users.firstName,
      userLastName: users.lastName,
      rating: userReviews.rating,
      postDate: userReviews.createdAt,
      review: userReviews.comment,
      totalReviews: sql<number>`COUNT(*) OVER()`.as('total_reviews'),
    })
    .from(userReviews)
    .innerJoin(orderLine, eq(orderLine.id, userReviews.orderLineId))
    .innerJoin(productEntries, eq(productEntries.id, orderLine.productEntryId))
    .innerJoin(orders, eq(orders.id, orderLine.orderId))
    .innerJoin(users, eq(users.id, orders.userId))
    .where(eq(productEntries.productID, productId))
    .orderBy(desc(userReviews.createdAt))
    .limit(9);

  return (
    <div>
      <ProductDetailsReviewFaqTab
        reviews={reviews}
        searchParams={searchParams}
      />
    </div>
  );
};
export default ProductDetailsReviewFaq;
