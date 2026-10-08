import { type CollectionEntry, getCollection } from "astro:content";
import type { Lang } from "../i18n/lang";
import {
	assertUniqueUrls,
	comparePosts,
	countTags,
	dateParts,
	parsePostFile,
	postUrl,
	readingTime,
} from "./posts";

export interface Post {
	entry: CollectionEntry<"posts">;
	file: string;
	key: string;
	lang: Lang;
	slug: string;
	url: string;
	title: string;
	description: string;
	date: Date;
	tags: string[];
	featured: boolean;
	draft: boolean;
	minutes: number;
}

function toPost(entry: CollectionEntry<"posts">): Post {
	const file = parsePostFile(entry.id);
	if (file === undefined) {
		throw new Error(
			`Nome de arquivo inválido em src/content/posts: "${entry.id}". Use minúsculas, números e hífens, como meu-post.md (ou meu-post.en.md para a tradução).`,
		);
	}
	const slug = entry.data.slug ?? file.key;
	return {
		entry,
		file: entry.id,
		key: file.key,
		lang: file.lang,
		slug,
		url: postUrl(file.lang, entry.data.date, slug),
		title: entry.data.title,
		description: entry.data.description,
		date: entry.data.date,
		tags: entry.data.tags,
		featured: entry.data.featured,
		draft: entry.data.draft,
		minutes: readingTime(entry.body ?? ""),
	};
}

/** Todos os posts, do mais novo para o mais antigo. Rascunhos só aparecem no `bun run dev`. */
export async function getAllPosts(): Promise<Post[]> {
	const entries = await getCollection("posts", ({ data }) => import.meta.env.DEV || !data.draft);
	const posts = entries.map(toPost).sort(comparePosts);
	assertUniqueUrls(posts);
	return posts;
}

export async function getPosts(lang: Lang): Promise<Post[]> {
	const posts = await getAllPosts();
	return posts.filter((post) => post.lang === lang);
}

/** Rotas dos posts: /AAAA/MM/DD/slug/ (e /en/... para o inglês). */
export async function postStaticPaths(lang: Lang) {
	const posts = await getPosts(lang);
	return posts.map((post) => ({
		params: { ...dateParts(post.date), slug: post.slug },
		props: { post },
	}));
}

export async function tagStaticPaths(lang: Lang) {
	const tags = countTags(await getPosts(lang));
	return tags.map(({ tag }) => ({ params: { tag }, props: { tag } }));
}
