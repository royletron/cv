import { z, defineCollection } from "astro:content";

const education = defineCollection({
  schema: z.object({
    published: z.boolean().default(true),
    title: z.string(),
    institution: z.string(),
    from: z.string().transform((str: string) => new Date(str)),
    to: z.string().transform((str: string) => new Date(str)),
  }),
});

const project = defineCollection({
  schema: z.object({
    published: z.boolean().default(true),
    title: z.string(),
    description: z.string(),
    date: z.string().transform((str: string) => new Date(str)),
  }),
});

const employment = defineCollection({
  schema: z.object({
    published: z.boolean().default(true),
    title: z.string(),
    employer: z.string(),
    date: z.string().transform((str: string) => new Date(str)),
    to: z
      .string()
      .transform((str: string) => new Date(str))
      .optional(),
    skills: z.array(z.string()),
  }),
});

export const collections = {
  education: education,
  employment: employment,
  project: project,
};
