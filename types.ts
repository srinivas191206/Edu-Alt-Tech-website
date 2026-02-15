
export interface TeamMember {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
  linkedin?: string;
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}
