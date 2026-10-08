export type Lang = "pt-BR" | "en";

export const LANGS: readonly Lang[] = ["pt-BR", "en"];

export function otherLang(lang: Lang): Lang {
	return lang === "pt-BR" ? "en" : "pt-BR";
}

/** Prefixo das rotas: o português fica na raiz, como no blog do Akita. */
export function langPrefix(lang: Lang): string {
	return lang === "pt-BR" ? "" : "/en";
}

/** Locale do Open Graph, que usa sublinhado e exige país. */
export function ogLocale(lang: Lang): string {
	return lang === "pt-BR" ? "pt_BR" : "en_US";
}

export const routes = {
	home: { "pt-BR": "/", en: "/en/" },
	archive: { "pt-BR": "/arquivo/", en: "/en/archive/" },
	tags: { "pt-BR": "/tags/", en: "/en/tags/" },
	about: { "pt-BR": "/sobre/", en: "/en/about/" },
	rss: { "pt-BR": "/rss.xml", en: "/en/rss.xml" },
} satisfies Record<string, Record<Lang, string>>;

/** Páginas fixas que aparecem na navegação. */
export type NavPage = "home" | "archive" | "tags" | "about";

export function tagUrl(lang: Lang, tag: string): string {
	return `${routes.tags[lang]}${tag}/`;
}
