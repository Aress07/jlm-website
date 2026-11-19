import { z } from "zod";

/**
 * Single source of truth for types (master plan Section 5 / Section 3 "Conventions").
 * Every external input (API routes, admin writes) validates against one of these.
 */

export const localizedSchema = z.object({
  fr: z.string().min(1),
  ar: z.string().optional(),
  en: z.string().optional(),
});
export type Localized = z.infer<typeof localizedSchema>;

export const poleSlugSchema = z.enum([
  "solidarity",
  "environment",
  "social-entrepreneurship",
]);
export type PoleSlug = z.infer<typeof poleSlugSchema>;

export const poleSchema = z.object({
  slug: poleSlugSchema,
  name: localizedSchema,
  tagline: localizedSchema,
  description: localizedSchema,
  color: z.string(),
  icon: z.string(),
  order: z.number().int(),
});
export type Pole = z.infer<typeof poleSchema>;

export const statSchema = z.object({
  key: z.string(),
  value: z.number(),
  unit: localizedSchema.optional(),
  label: localizedSchema,
});

export const projectSchema = z.object({
  slug: z.string().min(1),
  poleSlug: poleSlugSchema,
  name: localizedSchema,
  tagline: localizedSchema,
  description: localizedSchema,
  logo: z.string(),
  cover: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  stats: z.array(statSchema).default([]),
  platformIds: z.array(z.string()).default([]),
  leads: z
    .array(
      z.object({
        name: z.string(),
        role: localizedSchema,
        photo: z.string().optional(),
        consent: z.boolean(),
      }),
    )
    .optional(),
  published: z.boolean(),
  order: z.number().int(),
});
export type Project = z.infer<typeof projectSchema>;

export const platformSchema = z.object({
  id: z.string(),
  name: localizedSchema,
  description: localizedSchema,
  url: z.string().url(),
  kind: z.enum(["platform", "game", "website", "shop", "prototype"]),
  projectSlug: z.string(),
  status: z.enum(["live", "beta", "in-development", "prototype"]),
  screenshot: z.string().optional(),
  order: z.number().int(),
  published: z.boolean(),
});
export type Platform = z.infer<typeof platformSchema>;

export const postTypeSchema = z.enum([
  "news",
  "announcement",
  "ad",
  "volunteer-call",
  "report",
]);

export const postSchema = z.object({
  slug: z.string().min(1),
  type: postTypeSchema,
  title: localizedSchema,
  excerpt: localizedSchema,
  body: localizedSchema,
  cover: z.string().optional(),
  tags: z.array(z.string()).default([]),
  projectSlug: z.string().optional(),
  publishAt: z.coerce.date(),
  expiresAt: z.coerce.date().optional(),
  sponsorId: z.string().optional(),
  pinned: z.boolean().default(false),
  published: z.boolean().default(false),
  authorUid: z.string(),
});
export type Post = z.infer<typeof postSchema>;

export const campaignSchema = z.object({
  slug: z.string().min(1),
  kind: z.enum(["ramadan", "adha", "caravan", "well", "education", "other"]),
  title: localizedSchema,
  summary: localizedSchema,
  story: localizedSchema,
  goalMAD: z.number().positive(),
  receivedMAD: z.number().nonnegative().default(0),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  featured: z.boolean().default(false),
  cover: z.string().optional(),
  breakdown: z
    .array(
      z.object({
        label: localizedSchema,
        amountMAD: z.number().positive(),
      }),
    )
    .default([]),
  inKindAccepted: z.boolean().default(false),
  published: z.boolean().default(false),
});
export type Campaign = z.infer<typeof campaignSchema>;

export const pledgeInputSchema = z.object({
  campaignSlug: z.string().min(1),
  amountMAD: z.number().positive(),
  currencyDisplay: z.enum(["MAD", "EUR"]).default("MAD"),
  donorName: z.string().max(200).optional(),
  anonymous: z.boolean().default(false),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  message: z.string().max(1000).optional(),
  kind: z.enum(["money", "in-kind"]).default("money"),
  inKindDescription: z.string().max(500).optional(),
  locale: z.enum(["fr", "ar", "en"]),
  idempotencyKey: z.string().min(1),
  turnstileToken: z.string().min(1),
  // Honeypot: real users never fill this; bots that fill every field do.
  website: z.string().max(0).optional(),
});
export type PledgeInput = z.infer<typeof pledgeInputSchema>;

export const pledgeSchema = z.object({
  id: z.string(),
  reference: z.string(),
  campaignSlug: z.string(),
  amountMAD: z.number().positive(),
  currencyDisplay: z.enum(["MAD", "EUR"]),
  donorName: z.string().optional(),
  anonymous: z.boolean(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  kind: z.enum(["money", "in-kind"]),
  inKindDescription: z.string().optional(),
  status: z.enum(["pledged", "received", "cancelled"]),
  createdAt: z.coerce.date(),
  receivedAt: z.coerce.date().optional(),
  locale: z.enum(["fr", "ar", "en"]),
  updatedBy: z.string().optional(),
  updatedAt: z.coerce.date().optional(),
});
export type Pledge = z.infer<typeof pledgeSchema>;

export const partnerSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string(),
  url: z.string().url().optional(),
  tier: z.enum(["institutional", "sponsor", "supplier"]),
  since: z.number().int().optional(),
  published: z.boolean(),
  order: z.number().int(),
});
export type Partner = z.infer<typeof partnerSchema>;

export const statItemSchema = z.object({
  key: z.string(),
  label: localizedSchema,
  value: z.number(),
  unit: localizedSchema.optional(),
  source: z.string(),
  asOf: z.string(),
});
export type StatItem = z.infer<typeof statItemSchema>;

export const flagshipActionSchema = z.object({
  slug: z.string(),
  title: localizedSchema,
  year: z.number().int(),
  investedMAD: z.number().optional(),
  people: z.number().optional(),
  summary: localizedSchema,
  photos: z.array(z.string()).default([]),
});
export type FlagshipAction = z.infer<typeof flagshipActionSchema>;

export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: localizedSchema,
  pole: z.string().optional(),
  photo: z.string().optional(),
  consent: z.boolean(),
  order: z.number().int(),
});
export type TeamMember = z.infer<typeof teamMemberSchema>;

export const settingsSchema = z.object({
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    address: localizedSchema.optional(),
  }),
  social: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
  }),
  bank: z.object({
    holder: z.string(),
    bankName: z.string(),
    rib: z.string(),
    iban: z.string().optional(),
    swift: z.string().optional(),
  }),
  fundraisingAuthorization: z
    .object({
      number: z.string(),
      date: z.string(),
      authority: z.string(),
    })
    .optional(),
  donationsEnabled: z.boolean().default(false),
  joinOpen: z.boolean().default(true),
});
export type Settings = z.infer<typeof settingsSchema>;

export const userRoleSchema = z.enum(["admin", "editor"]);

export const contactFormSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  topic: z.enum([
    "general",
    "sponsorship",
    "press",
    "volunteer",
    "beneficiary",
  ]),
  message: z.string().min(1).max(4000),
  locale: z.enum(["fr", "ar", "en"]),
  consent: z.literal(true),
  turnstileToken: z.string().min(1),
  website: z.string().max(0).optional(),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const joinFormSchema = z.object({
  name: z.string().min(1).max(200),
  school: z.string().min(1).max(200),
  year: z.string().min(1).max(50),
  poleInterest: poleSlugSchema,
  motivation: z.string().min(1).max(4000),
  phone: z.string().max(40).optional(),
  email: z.string().email().optional(),
  locale: z.enum(["fr", "ar", "en"]),
  consent: z.literal(true),
  turnstileToken: z.string().min(1),
  website: z.string().max(0).optional(),
});
export type JoinFormInput = z.infer<typeof joinFormSchema>;
