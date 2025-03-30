export interface DailyReport {
  id: string;
  date: string;
  totalBuzz: number;
  companyPositive: number;
  companyNegative: number;
  companyInquiry: number;
  competitorPositive: number;
  competitorNegative: number;
  competitorInquiry: number;
  keywordFrequency?: Record<string, number>;
  createdAt: string;
}

export interface WeeklyReport {
  id: string;
  startDate: string;
  endDate: string;
  totalBuzz: number;
  companyPositive: number;
  companyNegative: number;
  companyInquiry: number;
  competitorPositive: number;
  competitorNegative: number;
  competitorInquiry: number;
  entrepreneurStartupMentions: number;
  businessClosureMentions: number;
  businessTypeSwitchMentions: number;
  keywordFrequency?: Record<string, number>;
  trendAnalysis?: {
    topics: string[];
    sentiments: Record<string, number>;
    insights: string[];
  };
  createdAt: string;
}

export interface MonthlyReport {
  id: string;
  month: string;
  totalBuzz: number;
  companyPositive: number;
  companyNegative: number;
  companyInquiry: number;
  competitorPositive: number;
  competitorNegative: number;
  competitorInquiry: number;
  entrepreneurStartupMentions: number;
  businessClosureMentions: number;
  businessTypeSwitchMentions: number;
  keywordFrequency?: Record<string, number>;
  trendAnalysis?: {
    topics: string[];
    sentiments: Record<string, number>;
    insights: string[];
  };
  createdAt: string;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea' | 'wordCloud';

export interface ChartOptions {
  type: ChartType;
  data: any;
  options?: any;
}
