import type { Lang } from "./i18n/lang";

const tagline: Record<Lang, string> = {
	// Provisório: troque pela frase que apresenta o blog.
	"pt-BR": "Notas sobre código, ferramentas e o que mais eu estiver aprendendo.",
	en: "Notes on code, tools and whatever else I'm learning.",
};

export const site = {
	title: "EdNotes",
	author: "Edgar Bento",
	tagline,
	github: "https://github.com/EdgarY0",
	// Fuso da data "de hoje" gerada no build; no navegador vale o fuso de quem lê.
	timeZone: "America/Sao_Paulo",
	// A meta theme-color não lê variável CSS: repete o --bg de tokens.css.
	themeColor: "#0b140d",
};
