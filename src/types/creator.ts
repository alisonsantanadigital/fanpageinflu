export type TemplateId = 
  | 'editorial-luxury'
  | 'dark-creator'
  | 'minimal-personal'
  | 'lifestyle-journal'
  | 'fashion-portfolio'
  | 'cinematic-story'
  | 'modern-magazine'
  | 'bold-creator'
  | 'professional-identity'
  | 'artistic-experience';

export interface TrajectoryItem {
  year: string;
  title: string;
  description: string;
}

export interface CreatorProfile {
  id: string;
  username: string; // e.g. "helenavogue"
  displayName: string;
  tagline: string;
  bio: string;
  fullStory: string;
  avatarUrl: string;
  coverUrl: string;
  logoUrl?: string;
  location: string;
  interests: string[];
  trajectory: TrajectoryItem[];
  instagramUsername?: string;
  tiktokUsername?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
}

export interface DesignColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  buttonBg: string;
  buttonText: string;
  accent: string;
  cardBg: string;
}

export interface DesignFonts {
  titleFont: 'Playfair Display' | 'Cormorant Garamond' | 'Outfit' | 'Plus Jakarta Sans' | 'DM Sans';
  bodyFont: 'Plus Jakarta Sans' | 'DM Sans' | 'Outfit';
  titleSize: 'sm' | 'md' | 'lg' | 'xl';
  titleWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  letterSpacing: 'tight' | 'normal' | 'wide';
}

export interface DesignVisual {
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  cardStyle: 'glass' | 'solid' | 'bordered' | 'minimal';
  animationStyle: 'smooth' | 'snappy' | 'cinematic';
  enableGrain: boolean;
  enableGlow: boolean;
}

export interface DesignSettings {
  templateId: TemplateId;
  colors: DesignColors;
  fonts: DesignFonts;
  visual: DesignVisual;
}

export type LinkCategory = 'redes' | 'produtos' | 'conteudos' | 'comunidade' | 'contato' | 'parcerias';

export interface SocialLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon: string;
  category: LinkCategory;
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  clicksCount: number;
  image?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  mediaUrl: string;
  thumbnail?: string;
  caption: string;
  tags: string[];
  category: string;
  date: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4';
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  readTime: string;
  category: string;
  externalUrl?: string;
  published: boolean;
}

export interface FanLetter {
  id: string;
  title: string;
  teaser: string;
  text: string;
  signature: string;
  date: string;
  photoUrl?: string;
  waxSealColor: string;
  envelopeStyle: 'classic' | 'noir' | 'parchment';
}

export interface ProductItem {
  id: string;
  title: string;
  description: string;
  price?: string;
  benefits: string[];
  imageUrl: string;
  buyUrl: string;
  badge?: string;
  active: boolean;
}

export interface CreatorAnalytics {
  totalViews: number;
  linkClicks: number;
  letterOpens: number;
  productViews: number;
  dailyStats: { date: string; views: number }[];
}

export interface CreatorAccount {
  id: string;
  initialTemplateId?: TemplateId;
  initialUsername?: string;
  initialDisplayName?: string;
  user: {
    id: string;
    email: string;
    role: 'creator' | 'admin';
  };
  profile: CreatorProfile;
  design: DesignSettings;
  links: SocialLink[];
  gallery: GalleryItem[];
  posts: Post[];
  letter: FanLetter;
  products: ProductItem[];
  analytics: CreatorAnalytics;
  isPublished: boolean;
  publishedUrl: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  instagramIntegration?: {
    connected: boolean;
    connectedAt?: string;
    handle?: string;
    autoSync: boolean;
  };
}
