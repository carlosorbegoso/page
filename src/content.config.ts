import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');

const profile = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/profile' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    tagline: z.string(),
    location: z.string(),
    summary: z.array(z.string()).min(1),
    photoAlt: z.string(),
    education: z.object({
      institution: z.string(),
      degree: z.string(),
      status: z.string()
    }),
    company: z.object({
      name: z.string(),
      legalName: z.string(),
      role: z.string(),
      summary: z.array(z.string()).min(1)
    }),
    stack: z
      .array(
        z.object({
          category: z.string(),
          items: z.array(z.string()).min(1)
        })
      )
      .min(1)
  })
});

const experience = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/experience' }),
  schema: z.object({
    entries: z
      .array(
        z.object({
          id: z.string(),
          company: z.string(),
          client: z.string().optional(),
          role: z.string(),
          start: yearMonth,
          end: yearMonth.nullable(),
          summary: z.string(),
          highlights: z.array(z.string()),
          stack: z.array(z.string()),
          compact: z.boolean().optional()
        })
      )
      .min(1)
  })
});

const products = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/products' }),
  schema: z.object({
    entries: z
      .array(
        z.object({
          id: z.enum(['skymek', 'parati', 'ventixs']),
          name: z.string(),
          url: z.url(),
          status: z.enum(['production', 'building']),
          role: z.string(),
          tagline: z.string(),
          description: z.string(),
          features: z.array(z.string()),
          featured: z.boolean().optional()
        })
      )
      .length(3)
  })
});

export const collections = { profile, experience, products };
