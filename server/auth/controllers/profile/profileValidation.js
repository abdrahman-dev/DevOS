import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  username: z.string()
    .min(3).max(30)
    .regex(/^[a-z0-9_-]+$/, 'Only lowercase letters, numbers, underscores, hyphens')
    .optional(),
  bio: z.string().max(200).optional(),
  avatar: z.string().url().optional().or(z.literal('')),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  socials: z.object({
    github: z.string().max(100).optional(),
    linkedin: z.string().max(100).optional(),
    twitter: z.string().max(100).optional(),
    devto: z.string().max(100).optional(),
  }).optional(),
  isProfilePublic: z.boolean().optional(),
});
