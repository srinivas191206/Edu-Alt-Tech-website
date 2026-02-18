
import React from 'react';
import { Users, Target, BookOpen, Brain, Zap, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { StatItem } from './types';

export const LINKS = {
  enroll: "https://forms.gle/Qce46JjDwAifmHPS7",
  whatsapp: "https://chat.whatsapp.com/Bzd430nwAtb6pP0lJUam35",
  instagram: "https://www.instagram.com/edu_alt_tech/"
};

export interface TeamMember {
  name: string;
  role: string;
  phone: string;
  email: string;
  image: string;
  linkedin?: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "MOHAMMED AL RIHAB CHANDHINI",
    role: "CEO",
    phone: "+91 80191 25121",
    email: "alrihabchandhinimohammed@gmail.com",
    image: "/images/team/alrihab.jpg",
    linkedin: "https://www.linkedin.com/in/al-rihab-chandhini-mohammed-745160296/"
  },
  {
    name: "CH. Uma Krishna Kanth",
    role: "CFO",
    phone: "+91 91215 05879",
    email: "ukkukk97@gmail.com",
    image: "/images/team/uma.jpg",
    linkedin: "https://www.linkedin.com/in/chokkapu-uma-krishna-kanth-50a502288/"
  },
  {
    name: "Vinukonda Ranadeep",
    role: "CTO",
    phone: "+91 8919473722",
    email: "viranadeep@gmail.com",
    image: "/images/team/ranadeep.jpg"
  },
  {
    name: "Kakara Sandeep",
    role: "CMO",
    phone: "+91 93461 05182",
    email: "sandeepkakara2005@gmail.com",
    image: "/images/team/sandeep.jpg"
  },
  {
    name: "Akula Venkat Surya Satyanarayana",
    role: "COO",
    phone: "+91 81438 53022",
    email: "akulasatish49@gmail.com",
    image: "/images/team/venkat.jpg"
  },
  {
    name: "Byra Lava Raju",
    role: "Customer Service Manager",
    phone: "+91 8497981640",
    email: "lavaraju5751@gmail.com",
    image: "/images/team/lavaraju.jpg"
  },
  {
    name: "Gnana Sri Bathina",
    role: "CHRO",
    phone: "+91 7569197763",
    email: "gnanasribathinagmail.com",
    image: "/images/team/gnanasri.jpg"
  }
];

export const HOW_IT_WORKS: FeatureCard[] = [
  {
    title: "Peer-to-peer teaching",
    description: "Learn by teaching others, solidifying your own understanding while helping peers grow.",
    icon: "Users"
  },
  {
    title: "Mentor-guided accountability",
    description: "Get personalized guidance and stay on track with dedicated mentors who care about your success.",
    icon: "Target"
  },
  {
    title: "Structured planning",
    description: "Follow a clear, actionable roadmap designed to bridge the gap between learning and doing.",
    icon: "Calendar"
  },
  {
    title: "Assistive AI",
    description: "Leverage cutting-edge AI tools to enhance your learning experience and boost productivity.",
    icon: "Zap"
  }
];


export const COMPARISON = [
  { feature: "Primary Focus", traditional: "Content Heavy", altTech: "System Heavy" },
  { feature: "Accountability", traditional: "Low Accountability", altTech: "High Accountability" },
  { feature: "Learning Mode", traditional: "Passive Learning", altTech: "Active Participation" },
  { feature: "Approach", traditional: "AI-First", altTech: "Human-First" }
];