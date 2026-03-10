// @ts-check
import { defineConfig, envField } from "astro/config"
import starlight from "@astrojs/starlight"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"
import starlightThemeBlack from "starlight-theme-black"
import { loadEnv } from "vite"

if (process.env.NODE_ENV == null) throw new Error("NODE_ENV is not set.")

const {
  GITHUB_REPO_URL,
  DEPLOY_PRIME_URL,
  URL: ENV_URL,
} = loadEnv(process.env.NODE_ENV, process.cwd(), "")

const SERVER_URL =
  process.env.NODE_ENV === "production" ? ENV_URL : DEPLOY_PRIME_URL

const serverUrlObject = new URL(SERVER_URL || "http://localhost:4321")

const base =
  serverUrlObject.pathname !== "/"
    ? serverUrlObject.pathname.replace(/\/$/, "")
    : ""

// https://astro.build/config
export default defineConfig({
  site: serverUrlObject.origin,
  base: base || undefined,
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
            href: `${base}/favicon.png`,
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
