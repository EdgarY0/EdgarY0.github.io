import type { Lang } from "./lang";

const pt = {
	skip: "Pular para o conteúdo",
	"nav.label": "Navegação principal",
	"nav.home": "Início",
	"nav.archive": "Arquivo",
	"nav.tags": "Tags",
	"nav.about": "Sobre",
	"lang.label": "Idioma",
	"lang.name": "Português",
	"social.github": "Perfil no GitHub",
	"social.rss": "Assinar o feed RSS",
	"search.label": "Buscar",
	"home.title": "Posts",
	"home.featured": "Destaques",
	"home.empty": "Nenhum post publicado ainda.",
	"home.otherLang": "Ver os posts em inglês",
	"home.onThisPage": "Nesta página",
	"home.topics": "Temas",
	"home.allTags": "Todas as tags",
	"home.backToTop": "Voltar ao topo",
	"post.minutes": "{n} min de leitura",
	"post.publishedOn": "Publicado em",
	"post.readIn": "Leia em português",
	"post.navLabel": "Outros posts",
	"post.newer": "Mais novo",
	"post.older": "Mais antigo",
	"post.tags": "Tags do post",
	draft: "rascunho",
	"archive.title": "Arquivo",
	"archive.description": "Todos os posts do EdNotes, do mais novo para o mais antigo.",
	"tags.title": "Tags",
	"tags.description": "Os assuntos do EdNotes e quantos posts há em cada um.",
	"tag.description": "Posts do EdNotes com a tag {tag}.",
	"count.one": "1 post",
	"count.other": "{n} posts",
	"footer.made": "Feito com Astro, publicado no GitHub Pages.",
};

export type UiKey = keyof typeof pt;

// Tipado pelas chaves do português: faltar uma tradução vira erro no typecheck.
const en: Record<UiKey, string> = {
	skip: "Skip to content",
	"nav.label": "Main navigation",
	"nav.home": "Home",
	"nav.archive": "Archive",
	"nav.tags": "Tags",
	"nav.about": "About",
	"lang.label": "Language",
	"lang.name": "English",
	"social.github": "GitHub profile",
	"social.rss": "Subscribe to the RSS feed",
	"search.label": "Search",
	"home.title": "Posts",
	"home.featured": "Featured",
	"home.empty": "No posts in English yet.",
	"home.otherLang": "See the posts in Portuguese",
	"home.onThisPage": "On this page",
	"home.topics": "Topics",
	"home.allTags": "All tags",
	"home.backToTop": "Back to top",
	"post.minutes": "{n} min read",
	"post.publishedOn": "Published on",
	"post.readIn": "Read in English",
	"post.navLabel": "More posts",
	"post.newer": "Newer",
	"post.older": "Older",
	"post.tags": "Post tags",
	draft: "draft",
	"archive.title": "Archive",
	"archive.description": "Every EdNotes post, newest first.",
	"tags.title": "Tags",
	"tags.description": "EdNotes topics and how many posts each one has.",
	"tag.description": "EdNotes posts tagged {tag}.",
	"count.one": "1 post",
	"count.other": "{n} posts",
	"footer.made": "Built with Astro, published on GitHub Pages.",
};

const ui: Record<Lang, Record<UiKey, string>> = { "pt-BR": pt, en };

export function t(lang: Lang, key: UiKey, vars: Record<string, string | number> = {}): string {
	return ui[lang][key].replace(/\{(\w+)\}/g, (match, name: string) => String(vars[name] ?? match));
}

export function postCount(lang: Lang, count: number): string {
	return count === 1 ? t(lang, "count.one") : t(lang, "count.other", { n: count });
}
