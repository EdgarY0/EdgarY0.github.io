import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { isValidSlug, parsePostDate, slugifyTag } from "./lib/posts";

const posts = defineCollection({
	loader: glob({
		base: "./src/content/posts",
		pattern: "*.md",
		// O id padrão sai do `slug` do frontmatter: o .en.md com slug traduzido
		// perderia o vínculo com o .md. O nome do arquivo é o que liga os dois.
		generateId: ({ entry }) => entry,
	}),
	schema: z.object({
		title: z
			.string({ error: "todo post precisa de um título" })
			.trim()
			.min(1, "o título está vazio"),
		date: z.unknown().transform((value, ctx) => {
			const date = parsePostDate(value);
			if (date === undefined) {
				ctx.addIssue("use só a data, no formato AAAA-MM-DD (ex.: 2026-10-07), sem hora");
				return z.NEVER;
			}
			return date;
		}),
		description: z
			.string({
				error: "escreva um resumo de uma linha (vai na lista, no RSS e no preview do link)",
			})
			.trim()
			.min(1, "o resumo está vazio"),
		tags: z
			.array(z.string(), { error: "use uma lista, como [astro, linux]" })
			.default([])
			.transform((tags) => [...new Set(tags.map(slugifyTag))])
			.refine((tags) => tags.every((tag) => tag.length > 0), "há uma tag sem letras nem números"),
		featured: z.boolean().default(false),
		draft: z.boolean().default(false),
		slug: z
			.string()
			.refine(isValidSlug, "use minúsculas, números e hífens (ex.: hello-world)")
			.optional(),
	}),
});

export const collections = { posts };
