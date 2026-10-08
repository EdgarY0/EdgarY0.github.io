import { type Lang, langPrefix } from "../i18n/lang";

const FILE_RE = /^([a-z0-9]+(?:-[a-z0-9]+)*)(\.en)?\.md$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const WORDS_PER_MINUTE = 200;

export interface PostFile {
	key: string;
	lang: Lang;
}

/**
 * `ola-mundo.md` é o original em português e `ola-mundo.en.md` a tradução; a
 * chave em comum é o que liga os dois. O nome vira URL, por isso o formato estrito.
 */
export function parsePostFile(file: string): PostFile | undefined {
	const match = FILE_RE.exec(file);
	if (match === null) return undefined;
	const [, key, en] = match;
	if (key === undefined) return undefined;
	return { key, lang: en === undefined ? "pt-BR" : "en" };
}

export function isValidSlug(slug: string): boolean {
	return SLUG_RE.test(slug);
}

function toIsoDay(value: unknown): string | undefined {
	if (typeof value === "string") return value.trim();
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		const iso = value.toISOString();
		return iso.endsWith("T00:00:00.000Z") ? iso.slice(0, 10) : undefined;
	}
	return undefined;
}

/**
 * Aceita só a data (AAAA-MM-DD) e devolve meia-noite UTC. O YAML entrega
 * `2026-10-07` como meia-noite UTC — 06/10 às 21h em Brasília —, então o dia é
 * sempre lido em UTC. Com hora, esse dia poderia virar e mudar a URL do post.
 */
export function parsePostDate(value: unknown): Date | undefined {
	const day = toIsoDay(value);
	if (day === undefined || !DATE_ONLY_RE.test(day)) return undefined;
	const date = new Date(`${day}T00:00:00Z`);
	// O Date aceita 2026-02-30 e rola para março; a volta para texto denuncia.
	if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== day) {
		return undefined;
	}
	return date;
}

function pad(value: number): string {
	return String(value).padStart(2, "0");
}

/** Ano, mês e dia lidos em UTC — o mesmo dia que está escrito no frontmatter. */
export function dateParts(date: Date): { year: string; month: string; day: string } {
	return {
		year: String(date.getUTCFullYear()),
		month: pad(date.getUTCMonth() + 1),
		day: pad(date.getUTCDate()),
	};
}

export function postUrl(lang: Lang, date: Date, slug: string): string {
	const { year, month, day } = dateParts(date);
	return `${langPrefix(lang)}/${year}/${month}/${day}/${slug}/`;
}

const shortDate: Record<Lang, Intl.DateTimeFormat> = {
	"pt-BR": new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		timeZone: "UTC",
	}),
	en: new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}),
};

const monthYear: Record<Lang, Intl.DateTimeFormat> = {
	"pt-BR": new Intl.DateTimeFormat("pt-BR", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}),
	en: new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	}),
};

/** Data de post: 07/10/2026 em português, Oct 7, 2026 em inglês. */
export function formatDate(date: Date, lang: Lang): string {
	return shortDate[lang].format(date);
}

/** Data por extenso num fuso real — usada para "hoje", não para datas de post. */
export function formatLongDate(date: Date, lang: Lang, timeZone: string): string {
	return new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone }).format(date);
}

export function monthLabel(date: Date, lang: Lang): string {
	return monthYear[lang].format(date);
}

/** Âncora do mês na home e no arquivo (2026-10). */
export function monthKey(date: Date): string {
	const { year, month } = dateParts(date);
	return `${year}-${month}`;
}

export interface MonthGroup<T> {
	key: string;
	label: string;
	posts: T[];
}

/** Agrupa por mês mantendo a ordem em que os meses aparecem. */
export function groupByMonth<T extends { date: Date }>(
	posts: readonly T[],
	lang: Lang,
): MonthGroup<T>[] {
	const groups = new Map<string, MonthGroup<T>>();
	for (const post of posts) {
		const key = monthKey(post.date);
		const group = groups.get(key);
		if (group === undefined) {
			groups.set(key, { key, label: monthLabel(post.date, lang), posts: [post] });
		} else {
			group.posts.push(post);
		}
	}
	return [...groups.values()];
}

export function readingTime(markdown: string): number {
	const words = markdown.split(/\s+/).filter((word) => word.length > 0).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** "Agentes de Código" → "agentes-de-codigo": a tag vira URL, então sem acento nem espaço. */
export function slugifyTag(tag: string): string {
	return tag
		.normalize("NFD")
		.replace(/\p{M}/gu, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

interface Sortable {
	date: Date;
	title: string;
}

/** Mais novo primeiro; no mesmo dia, ordem alfabética para o build ser estável. */
export function comparePosts(a: Sortable, b: Sortable): number {
	return b.date.getTime() - a.date.getTime() || a.title.localeCompare(b.title, "pt-BR");
}

export function translationOf<T extends { key: string; lang: Lang }>(
	post: T,
	posts: readonly T[],
): T | undefined {
	return posts.find((other) => other.key === post.key && other.lang !== post.lang);
}

/** Dois posts na mesma URL fariam um sobrescrever o outro em silêncio no build. */
export function assertUniqueUrls(posts: readonly { url: string; file: string }[]): void {
	const seen = new Map<string, string>();
	for (const post of posts) {
		const previous = seen.get(post.url);
		if (previous !== undefined) {
			throw new Error(
				`Dois posts geram a mesma URL ${post.url}: ${previous} e ${post.file}. Mude o slug ou a data de um deles.`,
			);
		}
		seen.set(post.url, post.file);
	}
}

export interface TagCount {
	tag: string;
	count: number;
}

export function countTags(posts: readonly { tags: readonly string[] }[]): TagCount[] {
	const counts = new Map<string, number>();
	for (const post of posts) {
		for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	return [...counts]
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Vizinhos numa lista do mais novo para o mais antigo. Procura pela URL porque o
 * post que chega pelo getStaticPaths não é o mesmo objeto de uma nova leitura.
 */
export function neighbors<T extends { url: string }>(
	posts: readonly T[],
	url: string,
): { newer: T | undefined; older: T | undefined } {
	const index = posts.findIndex((post) => post.url === url);
	if (index === -1) return { newer: undefined, older: undefined };
	return { newer: posts[index - 1], older: posts[index + 1] };
}
