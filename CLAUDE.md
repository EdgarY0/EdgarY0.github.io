# EdNotes: blog pessoal (Astro 7 + Bun)

Site estático em <https://edgary0.github.io>, publicado pelo GitHub Actions (`.github/workflows/deploy.yml`). A estrutura segue o blog do Akita: posts em `/AAAA/MM/DD/slug/`, tags, arquivo por mês, PT na raiz e EN em `/en/`, busca com Ctrl+K. O visual reproduz em verde o tema "Terminal Blog" do kasparyan.tec.br. Como escrever um post está no `README.md`.

## Comandos

- `bun run verify`: typecheck (`astro check`), lint (Biome), testes (`bun test` com `TZ=America/Sao_Paulo`) e build (Astro + Pagefind). É o portão; o CI roda o mesmo.
- `bun run dev` para editar. A busca só existe depois de `bun run build && bun run preview`.

## Onde este repo foge da stack padrão do time

- **Astro, não Next.** É um blog estático no GitHub Pages, sem servidor, login nem banco.
- **CSS com tokens, sem Tailwind.** É um tema só, com poucas peças. As cores são OKLCH em `src/styles/tokens.css`, e os componentes só usam `var(--…)`.

## Armadilhas

- **Datas.** O frontmatter aceita só `AAAA-MM-DD`, e o dia é lido em UTC (`dateParts`). Com hora, ou lido no fuso local, o post muda de dia: 06/10 às 21h em Brasília já é 07/10 em UTC. Os testes rodam em `America/Sao_Paulo` para pegar isso.
- **`generateId` no glob loader.** O padrão usaria o `slug` do frontmatter como id e quebraria o par `x.md`/`x.en.md`.
- **`compressHTML: 'jsx'`, padrão do Astro 7.** A quebra de linha entre texto e expressão some. Use `{" "}` onde o espaço importa.
- **TypeScript 6** não inclui `@types/*` sozinho; por isso `"types": ["bun"]` no `tsconfig.json`. O `@astrojs/check` ainda não aceita TS 7.
- **Pagefind.** Os componentes aplicam `all: initial`, então o tema só passa pelas `--pf-*`. Elas ficam em `html:root` para vencer os padrões que o Pagefind declara em `:root`.
- **`astro preview` vira daemon** fora de um terminal interativo. Para encerrar: `bunx astro preview stop`.

## Deploy

Push na `main` publica o site. Isso é decisão humana: não dê push sem pedido.
