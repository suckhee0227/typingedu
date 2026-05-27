export interface Inquiry {
  _id: string;
  name: string;
  organization: string;
  phone: string;
  message: string;
  status: "pending" | "contacted" | "converted" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface InquiryForm {
  name: string;
  organization: string;
  phone: string;
  message: string;
  privacyAgree: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export type Tier = "베이직" | "스탠다드" | "프리미엄";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  demoUrl: string;
  thumbnail: string;
  tier: Tier;
  tags: string[];
  priceDisplay: string;
  period: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
  logoUrl?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}
