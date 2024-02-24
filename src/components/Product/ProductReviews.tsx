import { db } from '@/lib/db';
import { dummyUser } from '@/lib/db/schema/dummyUser';
import { orderLine } from '@/lib/db/schema/orderLine';
import { orders } from '@/lib/db/schema/orders';
import { productEntries } from '@/lib/db/schema/productEntries';
import { userReviews } from '@/lib/db/schema/userReviews';
import { Review } from '@/lib/types/product-page';
import { desc, eq, sql } from 'drizzle-orm';
import { Verified } from '../Svgs/icons';
import Star from '../UI/Star';
import ProductReviewMenu from './ProductReviewMenu';

const ProductReviews = async ({ productId }: { productId: number }) => {
  const reviews = await db
    .select({
      reviewerName: dummyUser.name,
      rating: userReviews.rating,
      postDate: userReviews.createdAt,
      review: userReviews.comment,
      totalReviews: sql<number>`COUNT(*) OVER()`.as('total_reviews'),
    })
    .from(userReviews)
    .innerJoin(orderLine, eq(orderLine.id, userReviews.orderLineId))
    .innerJoin(productEntries, eq(productEntries.id, orderLine.productEntryId))
    .innerJoin(orders, eq(orders.id, orderLine.orderId))
    .innerJoin(dummyUser, eq(dummyUser.id, orders.dummyUserId))
    .where(eq(productEntries.productID, productId))
    .orderBy(desc(userReviews.createdAt))
    .limit(9);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between xl:items-start">
        <div className="flex items-end gap-2">
          <h2 className="font-inter text-2xl font-bold capitalize leading-none">
            All Reviews
          </h2>
          <span
            aria-label={`${reviews?.at(0)?.totalReviews} product reviews`}
            className="flex -translate-y-0.5 items-center text-sm leading-none text-primary-300"
          >
            ({reviews?.at(0)?.totalReviews})
          </span>
        </div>
        <ProductReviewMenu />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        {reviews.map((review, i) => (
          <ProductReviewCard review={review} key={i} />
        ))}
      </div>
    </div>
  );
};
export default ProductReviews;

const ProductReviewCard = ({ review }: { review: Review }) => {
  const ratingStr = review.rating || '0.0';
  const rating = Number.parseFloat(ratingStr);

  if (!review.review) return null;

  const comment =
    review.review?.length > 130
      ? `${review.review?.slice(0, 130)}...`
      : review.review;
  return (
    <div className="w-full rounded-main p-6 ring-1 ring-primary-50 lg:p-8">
      <div className="mb-2 flex items-center gap-2">
        <Star rating={rating} size="sm" />
        <span className="text-sm font-medium leading-none">
          {ratingStr}
          <span className="font-normal text-primary-300">/5.0</span>
        </span>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <span className="block font-semibold lg:text-lg">
          {review.reviewerName}
        </span>
        <Verified />
      </div>
      <blockquote className="mb-2 block text-sm text-primary-400 sm:mb-4 md:mb-6 md:text-base">
        &ldquo;{comment}&rdquo;
      </blockquote>
      <span className="block text-sm font-medium text-primary-300">
        Posted on{' '}
        {new Intl.DateTimeFormat('en-us', { dateStyle: 'long' }).format(
          review.postDate!,
        )}
      </span>
    </div>
  );
};
