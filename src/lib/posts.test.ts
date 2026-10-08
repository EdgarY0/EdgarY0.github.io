import { describe, expect, test } from "bun:test";
import {
	assertUniqueUrls,
	comparePosts,
	countTags,
	dateParts,
	formatDate,
	groupByMonth,
	isValidSlug,
	monthKey,
	monthLabel,
	neighbors,
	type PostFile,
	parsePostDate,
	parsePostFile,
	postUrl,
	readingTime,
	slugifyTag,
	translationOf,
} from "./posts";

const october7 = new Date("2026-10-07T00:00:00Z");

test("roda no fuso de Brasília (use bun run test), onde o bug de data aparece", () => {
	expect(new Date(2026, 9, 7).getTimezoneOffset()).toBe(180);
});

describe("parsePostFile", () => {
	test("original em português", () => {
		expect(parsePostFile("ola-mundo.md")).toEqual({ key: "ola-mundo", lang: "pt-BR" });
	});

	test("tradução em inglês", () => {
		expect(parsePostFile("ola-mundo.en.md")).toEqual({ key: "ola-mundo", lang: "en" });
	});

	test.each([
		"Ola-Mundo.md",
		"olá-mundo.md",
		"ola mundo.md",
		"ola--mundo.md",
		"-ola.md",
		"ola-mundo.fr.md",
		"ola-mundo.markdown",
	])("recusa %s", (file) => {
		expect(parsePostFile(file)).toBeUndefined();
	});
});

describe("isValidSlug", () => {
	test("aceita minúsculas, números e hífens", () => {
		expect(isValidSlug("hello-world-2")).toBe(true);
	});

	test("recusa maiúscula, acento e barra", () => {
		expect(isValidSlug("Hello")).toBe(false);
		expect(isValidSlug("olá")).toBe(false);
		expect(isValidSlug("a/b")).toBe(false);
	});
});

describe("parsePostDate", () => {
	test("a data do YAML (meia-noite UTC) continua no mesmo dia", () => {
		expect(parsePostDate(october7)?.toISOString()).toBe("2026-10-07T00:00:00.000Z");
	});

	test("aceita AAAA-MM-DD como texto", () => {
		expect(parsePostDate("2026-10-07")?.toISOString()).toBe("2026-10-07T00:00:00.000Z");
	});

	test("recusa data com hora", () => {
		expect(parsePostDate(new Date("2026-10-07T21:00:00Z"))).toBeUndefined();
		expect(parsePostDate("2026-10-07T21:00")).toBeUndefined();
	});

	test("recusa dia que não existe", () => {
		expect(parsePostDate("2026-02-30")).toBeUndefined();
	});

	test("recusa formato brasileiro, vazio e outros tipos", () => {
		expect(parsePostDate("07/10/2026")).toBeUndefined();
		expect(parsePostDate("")).toBeUndefined();
		expect(parsePostDate(20261007)).toBeUndefined();
		expect(parsePostDate(undefined)).toBeUndefined();
	});
});

describe("postUrl", () => {
	test("em Brasília, 07/10 continua 07/10 na URL", () => {
		expect(postUrl("pt-BR", october7, "ola-mundo")).toBe("/2026/10/07/ola-mundo/");
	});

	test("inglês ganha o prefixo /en", () => {
		expect(postUrl("en", october7, "hello-world")).toBe("/en/2026/10/07/hello-world/");
	});
});

describe("datas na tela", () => {
	test("formato curto por idioma", () => {
		expect(formatDate(october7, "pt-BR")).toBe("07/10/2026");
		expect(formatDate(october7, "en")).toBe("Oct 7, 2026");
	});

	test("nome do mês por idioma", () => {
		expect(monthLabel(october7, "pt-BR")).toBe("outubro de 2026");
		expect(monthLabel(october7, "en")).toBe("October 2026");
	});

	test("o primeiro dia do mês não escorrega para o mês anterior", () => {
		const november1 = new Date("2026-11-01T00:00:00Z");
		expect(monthLabel(november1, "pt-BR")).toBe("novembro de 2026");
		expect(monthKey(november1)).toBe("2026-11");
	});
});

describe("groupByMonth", () => {
	test("agrupa mantendo a ordem dos meses", () => {
		const posts = [
			{ title: "c", date: new Date("2026-11-01T00:00:00Z") },
			{ title: "b", date: new Date("2026-10-31T00:00:00Z") },
			{ title: "a", date: new Date("2026-10-01T00:00:00Z") },
		];
		const groups = groupByMonth(posts, "pt-BR");
		expect(groups.map((group) => group.key)).toEqual(["2026-11", "2026-10"]);
		expect(groups.map((group) => group.posts.map((post) => post.title))).toEqual([
			["c"],
			["b", "a"],
		]);
		expect(groups[1]?.label).toBe("outubro de 2026");
	});
});

describe("readingTime", () => {
	test("pelo menos um minuto", () => {
		expect(readingTime("")).toBe(1);
		expect(readingTime("três palavras só")).toBe(1);
	});

	test("arredonda para cima a 200 palavras por minuto", () => {
		expect(readingTime("palavra ".repeat(201))).toBe(2);
	});
});

describe("slugifyTag", () => {
	test("tira acento, espaço e maiúscula", () => {
		expect(slugifyTag("Agentes de Código")).toBe("agentes-de-codigo");
		expect(slugifyTag("  C++ & Rust ")).toBe("c-rust");
		expect(slugifyTag("IA")).toBe("ia");
	});
});

describe("comparePosts", () => {
	test("mais novo primeiro e, no mesmo dia, por título", () => {
		const posts = [
			{ title: "b", date: october7 },
			{ title: "velho", date: new Date("2026-01-01T00:00:00Z") },
			{ title: "a", date: october7 },
		];
		expect(posts.sort(comparePosts).map((post) => post.title)).toEqual(["a", "b", "velho"]);
	});
});

describe("translationOf", () => {
	const pt: PostFile = { key: "ola-mundo", lang: "pt-BR" };
	const en: PostFile = { key: "ola-mundo", lang: "en" };
	const other: PostFile = { key: "outro", lang: "en" };

	test("acha o par pelo nome do arquivo", () => {
		expect(translationOf(pt, [pt, en, other])).toBe(en);
		expect(translationOf(en, [pt, en, other])).toBe(pt);
	});

	test("post sem tradução", () => {
		expect(translationOf(other, [pt, en, other])).toBeUndefined();
	});
});

describe("assertUniqueUrls", () => {
	test("deixa passar URLs diferentes", () => {
		expect(() =>
			assertUniqueUrls([
				{ url: "/a/", file: "a.md" },
				{ url: "/b/", file: "b.md" },
			]),
		).not.toThrow();
	});

	test("falha nomeando os dois arquivos", () => {
		expect(() =>
			assertUniqueUrls([
				{ url: "/2026/10/07/x/", file: "x.md" },
				{ url: "/2026/10/07/x/", file: "y.md" },
			]),
		).toThrow("x.md e y.md");
	});
});

describe("countTags", () => {
	test("mais usada primeiro; empate em ordem alfabética", () => {
		const counts = countTags([
			{ tags: ["linux", "astro"] },
			{ tags: ["astro"] },
			{ tags: ["bun"] },
		]);
		expect(counts).toEqual([
			{ tag: "astro", count: 2 },
			{ tag: "bun", count: 1 },
			{ tag: "linux", count: 1 },
		]);
	});
});

describe("neighbors", () => {
	const novo = { url: "/novo/" };
	const meio = { url: "/meio/" };
	const velho = { url: "/velho/" };
	const posts = [novo, meio, velho];

	test("mais novo antes, mais antigo depois", () => {
		expect(neighbors(posts, "/meio/")).toEqual({ newer: novo, older: velho });
		expect(neighbors(posts, "/novo/")).toEqual({ newer: undefined, older: meio });
		expect(neighbors(posts, "/velho/")).toEqual({ newer: meio, older: undefined });
	});

	test("acha pela URL, não pelo objeto", () => {
		expect(neighbors(posts, "/meio/").older).toBe(velho);
		expect(neighbors(posts, "/sumiu/")).toEqual({ newer: undefined, older: undefined });
	});
});

describe("dateParts", () => {
	test("partes com zero à esquerda, lidas em UTC", () => {
		expect(dateParts(new Date("2026-01-05T00:00:00Z"))).toEqual({
			year: "2026",
			month: "01",
			day: "05",
		});
	});
});
