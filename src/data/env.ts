import { GITHUB_REPO_URL as gh, URL } from "astro:env/client"

export const GITHUB_REPO_URL = gh
export const SERVER_URL =
  process.env.NODE_ENV === "production" ? URL : "http://localhost:4321"
