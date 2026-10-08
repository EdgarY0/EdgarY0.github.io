---
title: "Hello, world"
date: 2026-10-07
description: "The first EdNotes post: what this blog is and how it is built."
tags: [blog, astro]
featured: true
slug: hello-world
---

This is the first **EdNotes** post. The idea is simple: keep notes here on what I learn about code, tools and whatever else shows up along the way.

![Green terminal window running the EdNotes build](./img/ola-mundo/terminal.svg)

## How the blog works

Each post is a Markdown file in `src/content/posts/`. The file header holds the title, the date and the tags:

```yaml
---
title: "Hello, world"
date: 2026-10-07
description: "The first EdNotes post"
tags: [blog, astro]
---
```

When the file reaches GitHub, a workflow builds the pages with [Astro](https://astro.build) and publishes everything to GitHub Pages. If the header has a mistake, the build fails and the site stays as it was.

## What's next

- study notes;
- tools I use every day;
- side projects.

> To follow along, subscribe to the [RSS feed](/en/rss.xml) or search with `Ctrl+K`.
