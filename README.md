# EdNotes

Blog do Edgar Bento, publicado em <https://edgary0.github.io>. Feito com [Astro](https://astro.build), no visual de terminal verde.

## Como publicar um post

1. Crie `src/content/posts/meu-post.md`:

   ```md
   ---
   title: "Título do post"
   date: 2026-10-07
   description: "Resumo de uma linha: aparece na lista, no RSS e no preview do link"
   tags: [linux, astro]
   ---

   Texto em **Markdown**.
   ```

2. Dê `git push` na `main`. Em 1 a 2 minutos o GitHub Actions publica o post.

Dá para fazer tudo pelo github.com: em `src/content/posts/`, use **Add file → Create new file**.

### Campos do cabeçalho

| Campo | Obrigatório | O que faz |
|---|---|---|
| `title` | sim | Título do post |
| `date` | sim | Só a data, `AAAA-MM-DD`. Vira a URL: `/2026/10/07/meu-post/` |
| `description` | sim | Resumo de uma linha |
| `tags` | não | Lista de tags; `Agentes de Código` vira `agentes-de-codigo` |
| `featured` | não | `true` põe o post em Destaques |
| `draft` | não | `true` esconde o post do site publicado (ele aparece só no `bun run dev`) |
| `slug` | não | Troca o fim da URL; o padrão é o nome do arquivo |

### O que o build confere

- Nome do arquivo só com minúsculas, números e hífens: `meu-post.md`.
- Data sem hora. `2026-10-07T21:00` é recusado, porque com hora o dia pode virar no fuso e mudar a URL.
- Dois posts não podem cair na mesma URL.

Se algo falha, o build para com a mensagem do problema e o site no ar continua como estava.

### Tradução para o inglês

Crie um arquivo com o mesmo nome e `.en` antes do `.md`: `meu-post.en.md`. Ele sai em `/en/...`, e cada versão ganha um link para a outra. Para traduzir também a URL, use `slug: my-post` no `.en.md`.

### Imagens

Coloque a imagem em `src/content/posts/img/meu-post/` e use o caminho relativo:

```md
![Descrição da imagem](./img/meu-post/foto.png)
```

O build otimiza a imagem. Escreva sempre a descrição: é o que o leitor de tela lê.

## Rodar no computador

Precisa de [Bun](https://bun.sh) e do Node indicado em `.node-version`.

```bash
bun install
bun run dev       # prévia em http://localhost:4321, recarrega ao salvar
bun run build     # gera o site em dist/, com o índice da busca
bun run preview   # serve o dist/ (é onde a busca funciona)
bun run verify    # typecheck + lint + testes + build: o mesmo que o CI roda
```

A busca (Ctrl+K) só funciona depois do `build`, porque o índice é gerado a partir das páginas prontas.

## Publicação

O workflow `.github/workflows/deploy.yml` roda a cada push na `main`: instala as dependências, roda o `verify` e publica `dist/` no GitHub Pages. Para isso, em **Settings → Pages → Build and deployment → Source** do repositório, a opção tem de ser **GitHub Actions**.

## Onde mexer

| Para mudar… | Arquivo |
|---|---|
| Nome do blog, frase de apresentação, link do GitHub | `src/config.ts` |
| Tom do verde e as outras cores | `src/styles/tokens.css` (`--fg` e `--bg`) |
| Página Sobre | `src/pages/sobre.md` e `src/pages/en/about.md` |
| Textos da interface em PT e EN | `src/i18n/ui.ts` |
