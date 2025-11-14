export interface UnsplashPhoto {
  id: string;
  slug: string;
  alternative_slugs: AlternativeSlugs;
  created_at: string;
  updated_at: string;
  promoted_at: string | null;
  width: number;
  height: number;
  color: string | null;
  blur_hash: string | null;
  description: string | null;
  alt_description: string | null;
  breadcrumbs: any[];
  urls: UnsplashUrls;
  links: UnsplashLinks;
  likes: number;
  liked_by_user: boolean;
  bookmarked: boolean;
  current_user_collections: any[];
  sponsorship: any | null;
  topic_submissions: TopicSubmissions;
  asset_type: "photo" | string;
  user: UnsplashUser;
}

export interface AlternativeSlugs {
  en: string;
  es: string;
  ja: string;
  fr: string;
  it: string;
  ko: string;
  de: string;
  pt: string;
  id: string;
}

export interface UnsplashUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
}

export interface UnsplashLinks {
  self: string;
  html: string;
  download: string;
  download_location: string;
}

export interface TopicSubmissions {
  spirituality?: TopicStatus;
  wallpapers?: TopicStatus;
  [key: string]: TopicStatus | undefined;
}

export interface TopicStatus {
  status: string;
  approved_on: string;
}

export interface UnsplashUser {
  id: string;
  updated_at: string;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  twitter_username: string | null;
  portfolio_url: string | null;
  bio: string | null;
  location: string | null;
  links: UnsplashUserLinks;
  profile_image: UserProfileImage;
  instagram_username: string | null;
  total_collections: number;
  total_likes: number;
  total_photos: number;
  total_promoted_photos: number;
  total_illustrations: number;
  total_promoted_illustrations: number;
  accepted_tos: boolean;
  for_hire: boolean;
  social: UnsplashUserSocial;
}

export interface UnsplashUserLinks {
  self: string;
  html: string;
  photos: string;
  likes: string;
  portfolio: string;
}

export interface UserProfileImage {
  small: string;
  medium: string;
  large: string;
}

export interface UnsplashUserSocial {
  instagram_username: string | null;
  portfolio_url: string | null;
  twitter_username: string | null;
  paypal_email: string | null;
}
