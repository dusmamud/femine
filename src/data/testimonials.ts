// Client stories — shared by the home page (first 3) and /testimonials (all).
import type { ImageMetadata } from 'astro';
import avatarAnanya from '../assets/avatar-ananya.jpg';
import avatarPriya from '../assets/avatar-priya.jpg';
import avatarKavya from '../assets/avatar-kavya.jpg';
import avatarRohan from '../assets/avatar-rohan.jpg';
import avatarVikram from '../assets/avatar-vikram.jpg';
import avatarNeha from '../assets/avatar-neha.jpg';

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  programme: string;
  img: ImageMetadata;
  // Mock review month (MOCK DATA — Dus replaces with real dates before launch).
  date: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: 'I walked in doubting myself at work. Three months later I led my first team presentation — calmly.',
    name: 'Ananya Sharma',
    date: 'September 2026',
    role: 'Marketing Manager',
    programme: 'Growth Career',
    img: avatarAnanya,
  },
  {
    quote: 'Femine taught me to say no without guilt. My relationships feel lighter and more honest now.',
    name: 'Priya Verma',
    date: 'October 2026',
    role: 'School Teacher',
    programme: 'Relationships',
    img: avatarPriya,
  },
  {
    quote: 'The sessions are practical, never preachy. Every week I left with one small change that stuck.',
    name: 'Kavya Nair',
    date: 'August 2026',
    role: 'Startup Founder',
    programme: 'Identifying Passion',
    img: avatarKavya,
  },
  {
    quote: 'I used to freeze in every meeting. Now I speak first — and my manager noticed before I did.',
    name: 'Rohan Mehta',
    date: 'September 2026',
    role: 'Software Engineer',
    programme: 'Growth Career',
    img: avatarRohan,
  },
  {
    quote: 'After twenty years in the same role, I finally had a plan. Six months later I moved into the job I actually wanted.',
    name: 'Vikram Singh',
    date: 'July 2026',
    role: 'Operations Lead',
    programme: 'Identifying Passion',
    img: avatarVikram,
  },
  {
    quote: 'My husband and I were talking past each other for years. The sessions gave us the words we were missing.',
    name: 'Neha Gupta',
    date: 'October 2026',
    role: 'Architect',
    programme: 'Relationships',
    img: avatarNeha,
  },
];
