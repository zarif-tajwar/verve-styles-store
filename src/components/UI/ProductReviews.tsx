import { Check } from 'lucide-react';
import ProductReviewMenu from './ProductReviewMenu';
import Star from './Star';
import { Review } from '@/lib/types/product-page';

const ProductReviews = ({ reviews }: { reviews: Review[] }) => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-inter text-2xl font-bold capitalize leading-none">
            All Reviews
          </h2>
          <span
            aria-label={`${reviews?.at(0)?.totalReviews} product reviews`}
            className="flex items-center text-sm leading-none text-primary-300"
          >
            ({reviews?.at(0)?.totalReviews})
          </span>
        </div>
        <ProductReviewMenu />
      </div>
      <div className="grid grid-cols-3 gap-5">
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
    <div className="w-full rounded-main p-8 ring-1 ring-primary-50">
      <div className="mb-2 flex items-center gap-2">
        <Star rating={rating} size="sm" />
        <span className="text-sm font-medium leading-none">
          {ratingStr}
          <span className="font-normal text-primary-300">/5.0</span>
        </span>
      </div>
      <div className="mb-3 flex items-center gap-2">
        <span className="block text-lg font-semibold">
          {[review.userFirstName, review.userLastName?.at(0)?.concat('.')].join(
            ' ',
          )}
        </span>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500">
          <Check size={12} className="text-white" />
        </span>
      </div>
      <blockquote className="mb-6 block text-primary-400">
        &ldquo;{comment}&rdquo;
      </blockquote>
      <span className="block text-sm font-medium text-primary-400">
        Posted on{' '}
        {new Intl.DateTimeFormat('en-us', { dateStyle: 'long' }).format(
          review.postDate!,
        )}
      </span>
    </div>
  );
};
