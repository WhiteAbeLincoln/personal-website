// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import md from "@astropub/md";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeDocument from "rehype-document";

// https://astro.build/config
export default defineConfig({
  site: "https://abewhite.dev",
  integrations: [sitemap(), mdx(), md()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      (opts) =>
        rehypeDocument({
          // Get the latest one from: <https://katex.org/docs/browser>.
          css: "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
          ...opts,
        }),
      rehypeKatex,
    ],
  },
});
