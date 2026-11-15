// MOCK DATA — demo placeholders for the client presentation.
// Case studies and Google reviews are invented examples so the client can
// see the sections. Dus will replace them with real client stories and the
// real Google Business Profile link before launch.
export interface CaseStudy {
  name: string;
  role: string;
  programme: string;
  duration: string;
  before: string;
  after: string;
  outcomes: string[];
  quote: string;
}

export const caseStudies: CaseStudy[] = [
  {
    name: 'Sneha Desai',
    role: 'Marketing Manager, Mumbai',
    programme: 'Growth Career',
    duration: '8 sessions · 4 months',
    before: 'Talented but invisible — her ideas were presented by others, and she had been passed over for promotion twice.',
    after: 'She now leads the weekly team meeting, presented her own campaign to leadership, and was promoted to Senior Manager in month five.',
    outcomes: ['Promoted within 5 months', 'Leads meetings every week', 'Negotiated a 22% raise'],
    quote: 'I stopped waiting to be noticed. Meera taught me how to make my work visible — without feeling pushy.',
  },
  {
    name: 'Ritu Malhotra',
    role: 'Returning to work after a career break, Delhi',
    programme: 'Relationships',
    duration: '4 sessions · 2 months',
    before: 'Dreading difficult conversations at home and at work — she said yes to everything and resented it quietly.',
    after: 'She set clear boundaries with her family and her manager, and now says no without the guilt spiral.',
    outcomes: ['Boundaries that hold', 'No more Sunday-night dread', 'Closer relationship with her partner'],
    quote: 'For the first time in years I am not angry at everyone. I just say what I need — kindly, and it works.',
  },
  {
    name: 'Aisha Khan',
    role: 'Final-year student, Bengaluru',
    programme: 'Identifying Passion',
    duration: '4 sessions · 6 weeks',
    before: 'Good grades, no direction — choosing between a safe job and a creative career she was afraid to name.',
    after: 'She mapped her strengths, tested two directions with small projects, and chose a UX design path with a 90-day plan.',
    outcomes: ['A direction in one sentence', 'Two real projects shipped', '90-day plan with dates'],
    quote: 'I thought I had to choose between passion and security. Turns out I just needed a plan that had both.',
  },
];

export interface GoogleReview {
  name: string;
  date: string;
  text: string;
}

export const googleReviews: GoogleReview[] = [
  {
    name: 'Nandini Rao',
    date: 'October 2026',
    text: 'I was nervous about coaching, but the free call felt like talking to a wise friend. Four sessions later I finally asked for the role I deserved — and got it.',
  },
  {
    name: 'Karan Mehta',
    date: 'September 2026',
    text: 'Booked the Growth Pack for my wife and ended up taking sessions myself. Practical, no fluff, and the worksheets actually get used.',
  },
  {
    name: 'Divya Nair',
    date: 'August 2026',
    text: 'The best decision I made this year. Meera listens first and never judges — I leave every session with one clear thing to do, and it works.',
  },
];

export const outcomeStats = [
  { value: '92%', label: 'of clients say they speak up more in meetings' },
  { value: '9 in 10', label: 'would recommend Femine to a friend' },
  { value: '500+', label: 'women coached since 2012' },
  { value: '4.9 / 5', label: 'average rating across 120+ reviews' },
];
