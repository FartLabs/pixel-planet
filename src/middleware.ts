import { defineMiddleware } from "astro:middleware"
import registryData from "../registry.json"

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context

  // Intercept the root endpoint "/"
  if (url.pathname === "/") {
    const acceptHeader = request.headers.get("accept") || ""

    // If the client prefers JSON or explicitly asks for it
    if (acceptHeader.includes("application/json")) {
      return new Response(JSON.stringify(registryData), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
    }
  }

  // Otherwise, proceed to render the page normally
  return next()
})
