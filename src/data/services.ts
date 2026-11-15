// Single source of truth for the four Femine programmes.
// Used by the home page, /services and /services/[slug].
import type { ImageMetadata } from 'astro';
import problemImg from '../assets/service-problem-solving.jpg';
import relationshipsImg from '../assets/service-relationships.jpg';
import passionImg from '../assets/service-passion.jpg';
import careerImg from '../assets/service-career.jpg';

export interface Service {
  slug: string;
  icon: 'bulb' | 'heart' | 'target' | 'chart';
  title: string;
  short: string;
  long: string;
  duration: string;
  format: string;
  priceFrom: string;
  image: ImageMetadata;
  imageAlt: string;
  benefits: string[];
  outcomes: string[];
}

export const services: Service[] = [
  {
    slug: 'problem-solving',
    icon: 'bulb',
    title: 'Problem Solving',
    short: 'Clear thinking tools that turn everyday stuck moments into confident decisions.',
    long: 'When every option feels wrong, the problem is rarely the choice — it is the noise around it. In this programme you learn a calm, repeatable way to break a problem down, weigh what actually matters, and decide without second-guessing yourself for days.',
    duration: '60 minutes',
    format: '1-to-1 · Online',
    priceFrom: '₹1,999',
    image: problemImg,
    imageAlt: 'Notebook and laptop with a planning session in progress',
    benefits: [
      'A simple 4-step decision framework you can reuse for any problem',
      'How to separate facts from fears before you decide',
      'Tools for handling overthinking and decision fatigue',
      'Practice on your own real, current problems — not theory',
    ],
    outcomes: ['Decide faster, with less stress', 'Stop replaying decisions at 2am', 'Handle setbacks without spiralling'],
  },
  {
    slug: 'relationships',
    icon: 'heart',
    title: 'Relationships',
    short: 'Communicate with warmth and boundaries, and build connections that actually last.',
    long: 'Good relationships are not built on grand gestures — they are built on small, honest conversations done well. This programme helps you say what you mean kindly, listen without getting defensive, and set boundaries without guilt.',
    duration: '60 minutes',
    format: '1-to-1 · Online',
    priceFrom: '₹1,999',
    image: relationshipsImg,
    imageAlt: 'Two people in a warm, focused conversation',
    benefits: [
      'Say no clearly, without guilt or long explanations',
      'Have difficult conversations without them becoming fights',
      'Understand your own patterns in relationships',
      'Rebuild trust after misunderstandings',
    ],
    outcomes: ['Calmer, more honest conversations', 'Boundaries that hold', 'Closer, less draining relationships'],
  },
  {
    slug: 'identifying-passion',
    icon: 'target',
    title: 'Identifying Passion',
    short: 'Find what energises you — then shape a life and career around it.',
    long: '“Follow your passion” is easy advice and hard to act on. This programme turns it into a process: we map what you are good at, what you enjoy, and what the world will pay for — then test small, real steps before you make any big change.',
    duration: '60 minutes',
    format: '1-to-1 · Online',
    priceFrom: '₹1,999',
    image: passionImg,
    imageAlt: 'Woman running at sunrise, full of energy',
    benefits: [
      'A clear map of your strengths, interests and values',
      'Small experiments to test a direction before committing',
      'A realistic 90-day plan — not a vague dream board',
      'How to handle the fear of starting over',
    ],
    outcomes: ['A direction you can name in one sentence', 'A plan with dates, not wishes', 'Confidence to take the first step'],
  },
  {
    slug: 'growth-career',
    icon: 'chart',
    title: 'Growth Career',
    short: 'Present yourself with confidence and grow, step by step, in your career.',
    long: 'Talent alone does not get promoted — visibility, communication and negotiation do. This programme builds the professional side of personality: how you present your work, speak in rooms that matter, and ask for what you deserve.',
    duration: '60 minutes',
    format: '1-to-1 · Online',
    priceFrom: '₹1,999',
    image: careerImg,
    imageAlt: 'Confident professional woman in a blazer',
    benefits: [
      'Present your work clearly, without underselling it',
      'Speak up in meetings and handle tough questions',
      'Negotiate salary and role changes with confidence',
      'Build a personal brand people remember',
    ],
    outcomes: ['Be seen for the work you do', 'Ask for more — and get it', 'A career plan that moves every quarter'],
  },
];

export const plans = [
  {
    name: 'Single Session',
    price: '₹1,999',
    per: 'per session',
    features: ['One 60-minute 1-to-1 session', 'Any one programme', 'Personal action plan after the call', 'Email follow-up within 48 hours'],
    featured: false,
  },
  {
    name: 'Growth Pack',
    price: '₹6,999',
    per: '4 sessions · save ₹997',
    features: ['Four 60-minute 1-to-1 sessions', 'Mix any programmes', 'Personal growth plan + worksheets', 'WhatsApp support between sessions'],
    featured: true,
  },
  {
    name: 'Transform Pack',
    price: '₹12,999',
    per: '8 sessions · save ₹2,993',
    features: ['Eight 60-minute 1-to-1 sessions', 'Full personality transformation plan', 'All worksheets + reading list', 'Priority booking + WhatsApp support'],
    featured: false,
  },
];

export const faqs = [
  { q: 'How does the first session work?', a: 'Your first session is free and lasts 30 minutes. We talk about where you are, what you want to change, and whether Femine is the right fit. There is no pressure to continue — if it is not for you, you leave with at least one useful idea.' },
  { q: 'Are sessions online or in person?', a: 'All sessions are online over video call, so you can join from anywhere. You only need a quiet room and a stable connection. Sessions are 60 minutes, scheduled at a time that suits you, Monday to Saturday.' },
  { q: 'How many sessions will I need?', a: 'Most clients notice a real change in 4 sessions, and deeper change in 8. A single session is enough for one specific decision or conversation. After your free call, we agree on a plan together — never more than you need.' },
  { q: 'Is what I share kept private?', a: 'Yes. Everything you share in a session stays between you and your coach. We never share your details or your story with anyone. See our Privacy Policy for the full details.' },
  { q: 'What if I need to reschedule?', a: 'Life happens. You can reschedule any session free of charge up to 12 hours before it starts. Just send us a message and we will find a new time.' },
];
