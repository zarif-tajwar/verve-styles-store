export type Review = {
  userFirstName: string;
  userLastName: string | null;
  rating: string;
  postDate: Date | null;
  review: string | null;
  totalReviews: number;
};
