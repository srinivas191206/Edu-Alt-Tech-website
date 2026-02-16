
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
    image: "https://picsum.photos/seed/alrihab/400/400",
    linkedin: "https://www.linkedin.com/in/al-rihab-chandhini-mohammed-745160296/"
  },
  {
    name: "CH. Uma Krishna Kanth",
    role: "CFO",
    phone: "+91 91215 05879",
    email: "ukkukk97@gmail.com",
    image: "https://picsum.photos/seed/uma/400/400",
    linkedin: "https://www.linkedin.com/in/chokkapu-uma-krishna-kanth-50a502288/"
  },

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