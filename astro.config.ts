import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
	site: "https://edgary0.github.io",
	// Mesmo formato de URL do Akita (/2026/10/07/slug/) — o GitHub Pages serve /slug/index.html.
	trailingSlash: "always",
	integrations: [sitemap()],
	fonts: [
		{
			// Baixada no build e servida pelo próprio site: sem request ao Google Fonts.
			provider: fontProviders.fontsource(),
			name: "Roboto Mono",
			cssVariable: "--font-mono",
			weights: [400, 600, 700],
			styles: ["normal", "italic"],
			subsets: ["latin"],
			fallbacks: ["ui-monospace", "monospace"],
		},
	],
	markdown: {
		// Cores do código vêm de variáveis CSS (--astro-code-*), definidas em tokens.css com o verde do tema.
		shikiConfig: { theme: "css-variables" },
	},
});
