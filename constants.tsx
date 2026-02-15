
import React from 'react';
import { Users, Target, BookOpen, Brain, Zap, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { TeamMember, FeatureCard } from './types';

export const LINKS = {
  enroll: "https://forms.gle/Qce46JjDwAifmHPS7",
  whatsapp: "https://chat.whatsapp.com/Bzd430nwAtb6pP0lJUam35",
  instagram: "https://www.instagram.com/edu_alt_tech/"
};

export const TEAM: TeamMember[] = [
  {
    name: "MOHAMMED AL RIHAB CHANDHINI",
    role: "CEO",
    phone: "+91 80191 25121",
    email: "alrihabchandhinimohammed@gmail.com",
    image: "https://picsum.photos/seed/alrihab/400/400"
  },
  {
    name: "CH. Uma Krishna Kanth",
    role: "CFO",
    phone: "+91 91215 05879",
    email: "ukkukk97@gmail.com",
    image: "https://picsum.photos/seed/uma/400/400"
  },
  {
    name: "Vinukonda Ranadeep",
    role: "CTO",
    phone: "+91 8919473722",
    email: "viranadeep@gmail.com",
    image: "https://picsum.photos/seed/ranadeep/400/400"
  },
  {
    name: "Kakara Sandeep",
    role: "CMO",
    phone: "+91 93461 05182",
    email: "sandeepkakara2005@gmail.com",
    image: "https://picsum.photos/seed/sandeep/400/400"
  },
  {
    name: "Akula Venkat Surya Satyanarayana",
    role: "COO",
    phone: "+91 81438 53022",
    email: "akulasatish49@gmail.com",
    image: "https://picsum.photos/seed/venkat/400/400"
  },
  {
    name: "Byra Lava Raju",
    role: "Customer Service Manager",
    phone: "+91 8497981640",
    email: "lavaraju5751@gmail.com",
    image: "https://picsum.photos/seed/lavaraju/400/400"
  },
  {
    name: "Gnana Sri Bathina",
    role: "CHRO",
    phone: "+91 7569197763",
    email: "gnanasribathinagmail.com",
    image: "https://picsum.photos/seed/gnanasri/400/400"
  }
];

export const HOW_IT_WORKS: FeatureCard[] = [
  {
    title: "Peer-to-Peer Teaching",
    description: "Learn faster by teaching others. Our model ensures concepts are deeply rooted through collaboration.",
    icon: <Users className="w-6 h-6 text-emerald-600" />
  },
  {
    title: "Mentor Guided Accountability",
    description: "Dedicated mentors track your progress and keep you aligned with your goals every step of the way.",
    icon: <Target className="w-6 h-6 text-emerald-600" />
  },
  {
    title: "Structured Weekly Planning",
    description: "No more chaotic learning. Get clear, actionable weekly plans designed for maximum efficiency.",
    icon: <BookOpen className="w-6 h-6 text-emerald-600" />
  },
  {
    title: "Assistive AI",
    description: "Future-ready integration that powers risk alerts and smart summaries for optimized learning.",
    icon: <Brain className="w-6 h-6 text-emerald-600" />
  }
];

export const COMPARISON = [
  { feature: "Primary Focus", traditional: "Content Heavy", altTech: "System Heavy" },
  { feature: "Accountability", traditional: "Low Accountability", altTech: "High Accountability" },
  { feature: "Learning Mode", traditional: "Passive Learning", altTech: "Active Participation" },
  { feature: "Approach", traditional: "AI-First", altTech: "Human-First" }
];
