export const SITE = {
  name: 'Carlos Orbegoso',
  handle: '@carlosorbegoso',
  email: 'car_11.09@hotmail.com',
  cvPath: 'cv/Carlos-Orbegoso-CV.pdf',
  social: {
    linkedin: 'https://linkedin.com/in/carlos-orbergoso-loayza',
    github: 'https://github.com/carlosorbegoso',
    x: 'https://x.com/carlosorbegoso'
  }
} as const;

export const SECTION_IDS = {
  hero: 'hero',
  about: 'about',
  company: 'company',
  products: 'products',
  experience: 'experience',
  contact: 'contact'
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];
