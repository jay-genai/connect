export interface Creator {
  id: string;
  username: string;
  displayName: string;
  email: string;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  followers: number;
  following: number;
  categories: string[];
  platforms: {
    name: string;
    url: string;
    followers?: number;
  }[];
  pricing: {
    seedingPrice?: number;
    adPrice?: number;
    collaborationPrice?: number;
  };
  availableDates?: string[];
  location?: string;
  languages?: string[];
  metrics?: {
    avgEngagementRate: number;
    avgViews: number;
    avgLikes: number;
    avgComments: number;
  };
  portfolio?: {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    videoUrl?: string;
    date: string;
    brand?: string;
  }[];
  reviews?: {
    id: string;
    brandId: string;
    brandName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}
