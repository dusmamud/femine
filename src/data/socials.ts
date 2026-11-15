// Femine's social profiles — MOCK handles for the client demo.
// TODO: replace each URL with Femine's real profile URL when Dus shares
// them. These handles are invented for the presentation only.
export interface Social {
  label: string;
  href: string;
  icon: 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'x';
}

export const socials: Social[] = [
  { label: 'Femine on Instagram', href: 'https://www.instagram.com/femine.coaching', icon: 'instagram' },
  { label: 'Femine on Facebook', href: 'https://www.facebook.com/femine.coaching', icon: 'facebook' },
  { label: 'Femine on YouTube', href: 'https://www.youtube.com/@feminecoaching', icon: 'youtube' },
  { label: 'Femine on LinkedIn', href: 'https://www.linkedin.com/company/femine-coaching', icon: 'linkedin' },
  { label: 'Femine on X', href: 'https://x.com/feminecoaching', icon: 'x' },
];
