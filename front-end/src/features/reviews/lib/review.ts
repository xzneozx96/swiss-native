/** One review per product per booking (spec §4.11), so the id doubles as "already reviewed". */
export const reviewId = (bookingId: string, productId: string) =>
  `rv-${bookingId}-${productId}`;

/** "Erich Haldi" -> "Erich H.", as the seeded reviewers are shown. */
export const reviewerName = (name: string) => {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.at(-1);

  return last ? `${first} ${last.charAt(0)}.` : first;
};

/** What the review sheet shows about the thing being reviewed. */
export interface ReviewableProduct {
  productId: string;
  /** Id the guest's review of this product has, or would have. */
  reviewId: string;
  name: string;
  /** One muted line under the name. */
  detail: string;
  photo?: string;
  /** Slug for the link to the posted review. */
  slug?: string;
  isReviewed: boolean;
}
