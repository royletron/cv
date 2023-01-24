declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (data: CollectionEntry<C>) => boolean
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"education": {
"degree.md": {
  id: "degree.md",
  slug: "degree",
  body: string,
  collection: "education",
  data: InferEntrySchema<"education">
},
},
"employment": {
"2009-03-01-technical-analyst.md": {
  id: "2009-03-01-technical-analyst.md",
  slug: "2009-03-01-technical-analyst",
  body: string,
  collection: "employment",
  data: InferEntrySchema<"employment">
},
"2011-12-01-mymaths-platform-manager.md": {
  id: "2011-12-01-mymaths-platform-manager.md",
  slug: "2011-12-01-mymaths-platform-manager",
  body: string,
  collection: "employment",
  data: InferEntrySchema<"employment">
},
"2015-05-01-platform-development-manager.md": {
  id: "2015-05-01-platform-development-manager.md",
  slug: "2015-05-01-platform-development-manager",
  body: string,
  collection: "employment",
  data: InferEntrySchema<"employment">
},
"2016-01-19-chief-technical-officer.md": {
  id: "2016-01-19-chief-technical-officer.md",
  slug: "2016-01-19-chief-technical-officer",
  body: string,
  collection: "employment",
  data: InferEntrySchema<"employment">
},
"2016-10-01-senior-developer-diffblue.md": {
  id: "2016-10-01-senior-developer-diffblue.md",
  slug: "2016-10-01-senior-developer-diffblue",
  body: string,
  collection: "employment",
  data: InferEntrySchema<"employment">
},
"2019-09-01-cto-vh.md": {
  id: "2019-09-01-cto-vh.md",
  slug: "2019-09-01-cto-vh",
  body: string,
  collection: "employment",
  data: InferEntrySchema<"employment">
},
},
"project": {
"2014-10-02-masterbaker.md": {
  id: "2014-10-02-masterbaker.md",
  slug: "2014-10-02-masterbaker",
  body: string,
  collection: "project",
  data: InferEntrySchema<"project">
},
"2014-12-02-ludum-dare.md": {
  id: "2014-12-02-ludum-dare.md",
  slug: "2014-12-02-ludum-dare",
  body: string,
  collection: "project",
  data: InferEntrySchema<"project">
},
"2015-01-01-computing-at-school.md": {
  id: "2015-01-01-computing-at-school.md",
  slug: "2015-01-01-computing-at-school",
  body: string,
  collection: "project",
  data: InferEntrySchema<"project">
},
"2017-04-01-retrospectr.md": {
  id: "2017-04-01-retrospectr.md",
  slug: "2017-04-01-retrospectr",
  body: string,
  collection: "project",
  data: InferEntrySchema<"project">
},
"2021-03-01-sparkle.md": {
  id: "2021-03-01-sparkle.md",
  slug: "2021-03-01-sparkle",
  body: string,
  collection: "project",
  data: InferEntrySchema<"project">
},
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
