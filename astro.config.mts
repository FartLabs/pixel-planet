// @ts-check
import { defineConfig, envField } from "astro/config"
import starlight from "@astrojs/starlight"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
import starlightThemeBlack from "starlight-theme-black"
import vercel from "@astrojs/vercel"

const GITHUB_REPO_URL =
  process.env.GITHUB_REPO_URL || "https://github.com/FartLabs/pixel-planet"

// https://astro.build/config
export default defineConfig({
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  site: "https://pixel-planet.fartlabs.org",
  base: "/",
  env: {
    schema: {
      GITHUB_REPO_URL: envField.string({ context: "client", access: "public" }),
      DEPLOY_PRIME_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      URL: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },
  integrations: [
    starlight({
      components: {
        Head: "./src/components/overrides/head.astro",
        Footer: "./src/components/overrides/footer.astro",
      },
      head: [
        // Add Fart.css
        {
          tag: "link",
          attrs: {
            rel: "stylesheet",
            type: "text/css",
            href: "https://css.fart.tools",
          },
        },
        // Add PNG favicon
        {
          tag: "link",
          attrs: {
            rel: "icon",
            href: "/favicon.png",
            type: "image/png",
          },
        },
      ],
      title: "Pixel Planet",
      editLink: {
        baseUrl: `${GITHUB_REPO_URL}/tree/main`,
      },
      logo: {
        src: "./src/assets/logo/pixel-planet.png",
        replacesTitle: false,
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: GITHUB_REPO_URL,
        },
      ],
      customCss: ["./src/styles/global.css"],
      sidebar: [
        {
          label: "Getting started",
          items: [
            { label: "Introduction", slug: "getting-started/introduction" },
            { label: "Installation", slug: "getting-started/installation" },
          ],
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
        },
        {
          label: "Contributing",
          items: [
            { label: "Introduction", slug: "contributing" },
            {
              label: "Feature request",
              slug: "contributing/feature-request",
            },
            {
              label: "Contribute code",
              slug: "contributing/contributing-code",
            },
          ],
        },
      ],
      plugins: [
        starlightThemeBlack({
          navLinks: [
            {
              label: "Docs",
              link: "/getting-started/installation",
            },
            {
              label: "Components",
              link: "/components",
            },
            {
              label: "Contributing",
              link: "/contributing",
            },
          ],
        }),
      ],
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // FIXME: Once starlight supports Zod 4 we can probably remove this.
      // Zod should normally be imported from astro, but I want my code to use its own zod version to reflect the version used in the shadcn components.
      noExternal: ["zod"],
    },
  },
})
