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

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  demoUrl: string;
  thumbnail: string;
  tags: string[];
  ourPrice: number;
  outsourcePrice: number;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
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
