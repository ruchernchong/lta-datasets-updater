import { DOMAIN_NAME, SITE_TITLE } from "@web/config";

/**
 * OG image configuration
 */
export const OG_CONFIG = {
  /** Standard OG image dimensions */
  width: 1200,
  height: 630,

  /** Font family (must match fonts.ts) */
  fontFamily: "Urbanist",

  /** Site name for branding */
  siteName: SITE_TITLE,

  /** Site URL for branding */
  siteUrl: DOMAIN_NAME,
} as const;

/** og:image size (1200×630) for `opengraph-image.tsx` files */
export const OG_SIZE = {
  width: OG_CONFIG.width,
  height: OG_CONFIG.height,
} as const;

/** twitter:image size (1200×600, summary_large_image) for `twitter-image.tsx` files */
export const TWITTER_SIZE = {
  width: OG_CONFIG.width,
  height: 600,
} as const;

/** Content type every image file exports */
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared-cache headers for data-driven cards.
 *
 * Every share image calls `connection()` to avoid the prerender bailout, so
 * without these each request renders the PNG on a function. An hour at the
 * CDN with a day of stale-while-revalidate caps that at one render per hour
 * per card while keeping the figures within an hour of the data.
 */
export const OG_CACHE_HEADERS = {
  "Cache-Control":
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;

/** Long-lived cache headers, only for cards whose content never changes (PARF) */
export const OG_HEADERS = {
  "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
} as const;
