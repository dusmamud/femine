// Femine's social profiles — one place to update them everywhere.
// TODO: replace each '#' with Femine's real profile URL when Dus shares
// them (e.g. 'https://www.instagram.com/femine'). Until then the icons
// link nowhere — do not point them at a stranger's account.
export interface Social {
  label: string;
  href: string;
  icon: 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'x';
}

export const socials: Social[] = [
  { label: 'Femine on Instagram', href: '#', icon: 'instagram' },
  { label: 'Femine on Facebook', href: '#', icon: 'facebook' },
  { label: 'Femine on YouTube', href: '#', icon: 'youtube' },
  { label: 'Femine on LinkedIn', href: '#', icon: 'linkedin' },
  { label: 'Femine on X', href: '#', icon: 'x' },
];
