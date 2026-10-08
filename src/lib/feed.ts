import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { site } from "../config";
import type { Lang } from "../i18n/lang";
import { getPosts } from "./content";

export async function feed(context: APIContext, lang: Lang): Promise<Response> {
	if (context.site === undefined) {
		throw new Error("Defina `site` no astro.config.ts: o RSS precisa de URLs absolutas.");
	}
	const posts = await getPosts(lang);
	return rss({
		title: site.title,
		description: site.tagline[lang],
		site: context.site,
		items: posts.map((post) => ({
			title: post.title,
			description: post.description,
			pubDate: post.date,
			link: post.url,
			categories: post.tags,
		})),
		// O RSS usa os códigos de idioma em minúsculas (pt-br).
		customData: `<language>${lang.toLowerCase()}</language>`,
	});
}
