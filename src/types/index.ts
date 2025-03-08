export interface Creator {
  id: string;
  username: string;
  displayName: string;
  name?: string;
  email: string;
  bio: string;
  profileImage?: string;
  coverImage?: string;
  followers: number;
  following: number;
  channels?: Channel[];
  availableDates?: string[]; // ISO date strings
  pricing: {
    seedingPrice?: number;
    adPrice?: number;
    collaborationPrice?: number;
  };
  categories: string[];
  platforms?: {
    name: string;
    url: string;
    followers?: number;
  }[];
  metrics?: CreatorMetrics;
  location?: string;
  languages?: string[];
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

export interface Channel {
  id: string;
  platform: "youtube" | "instagram" | "tiktok" | "other";
  handle: string;
  url: string;
  followers: number;
  engagementRate: number;
}

export interface CreatorMetrics {
  totalViews?: number;
  averageViews?: number;
  avgViews?: number;
  engagementRate?: number;
  avgEngagementRate?: number;
  avgLikes?: number;
  avgComments?: number;
  demographics?: {
    ageGroups: Record<string, number>; // e.g., "18-24": 30 (percent)
    genderDistribution: Record<string, number>; // e.g., "male": 45 (percent)
    topLocations: Record<string, number>; // e.g., "Seoul": 60 (percent)
  };
}

export interface Brand {
  id: string;
  name: string;
  email: string;
  logo?: string;
  industry: string;
  collaborationHistory?: Collaboration[];
}

export interface Collaboration {
  id: string;
  brandId: string;
  creatorId: string;
  brandName?: string;
  brandLogo?: string;
  creatorName?: string;
  creatorImage?: string;
  type: "seeding" | "advertisement" | "partnership" | "other";
  status:
    | "inquiry"
    | "negotiation"
    | "contracted"
    | "in-progress"
    | "completed"
    | "cancelled";
  budget?: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  description: string;
  deliverables: string[];
  milestones: Milestone[];
  messages: Message[];
  contract?: Contract;
  contentPerformance?: ContentPerformance[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  status: "pending" | "in-progress" | "completed" | "delayed";
  feedback?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderType: "creator" | "brand" | "system";
  content: string;
  timestamp: string; // ISO date string
  attachments?: string[]; // URLs to attachments
  isAutomated?: boolean;
}

export interface Contract {
  id: string;
  title: string;
  content: string;
  status: "draft" | "pending" | "signed" | "expired";
  createdAt: string; // ISO date string
  signedAt?: string; // ISO date string
  legalAdvice?: string[];
}

export interface ContentPerformance {
  id: string;
  contentUrl: string;
  platform: "youtube" | "instagram" | "tiktok" | "other";
  publishDate: string; // ISO date string
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares?: number;
    clickThroughRate?: number;
    conversionRate?: number;
  };
  insights: string[];
}

export interface CreatorProfile {
  username: string;
  displayName: string;
  bio: string;
  profileImage?: string;
  bannerImage?: string;
  channels: Channel[];
  categories: string[];
  metrics: {
    totalFollowers: number;
    averageViews: number;
    engagementRate: number;
  };
  inquiryTemplates: InquiryTemplate[];
  availableDates: string[];
}

export interface InquiryTemplate {
  id: string;
  name: string;
  type: "seeding" | "advertisement" | "partnership" | "other";
  description: string;
  fields: InquiryField[];
  isDefault: boolean;
  isActive: boolean;
}

export interface InquiryField {
  id: string;
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "file" | "checkbox";
  options?: string[];
  placeholder?: string;
  required: boolean;
}

export interface Inquiry {
  id: string;
  creatorId: string;
  brandName: string;
  brandEmail: string;
  brandLogo?: string;
  templateId: string;
  type: "seeding" | "advertisement" | "partnership" | "other";
  status: "pending" | "responded" | "converted" | "rejected";
  content: Record<string, any>;
  response?: string;
  isAutoResponded?: boolean;
  createdAt: string;
  respondedAt?: string;
}

export interface Task {
  id: string;
  creatorId: string;
  title: string;
  description?: string;
  dueDate: string; // ISO date string
  status: "pending" | "in-progress" | "completed" | "canceled";
  priority: "low" | "medium" | "high";
  category: "content" | "collaboration" | "personal" | "other";
  tags?: string[];
  collaborationId?: string;
  reminderTime?: string; // ISO date string
  completedAt?: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  subtasks?: SubTask[];
  recurrence?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    interval: number; // 1 = every day/week/month/year, 2 = every other day/week/month/year, etc.
    endDate?: string; // ISO date string
    daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, etc.
  };
}

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  status: "pending" | "completed" | "in-progress";
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string
}

export interface DailySchedule {
  date: string; // ISO date string
  tasks: Task[];
  availabilityStatus: "available" | "partially-available" | "unavailable";
  workHours?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  notes?: string;
}
