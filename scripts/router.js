import { renderIndex, renderPost, renderGrid } from "./render.js";

const routes = {
  '/': renderIndex,
  '/posts/:id': renderPost
};

/**
 * Match URL path to route handler
 *
 * @param path - URL pathname
 * @returns handler function or null
 */
function matchRoute(path) {
  if (path === "/" || path === "") return () => routes["/"]();

  const postMatch = path.match(/^\/posts\/([^/]+)$/);
  if (postMatch) return () => routes["/posts/:id"](postMatch[1]);

  return null;
}

/**
 * Navigate to a path
 *
 * @param path - URL pathname
 */
async function navigate(path) {
  const handler = matchRoute(path);
  if (handler) {
    await handler();
    renderGrid();
  } else {
    const contentRef = document.querySelector(".content");
    if (contentRef) contentRef.innerHTML = "<p>Page not found.</p>";
  }
}

/**
 * Get current path from hash
 *
 * @returns path string
 */
function getPath() {
  return location.hash.slice(1) || "/";
}

// make header a home link
const headerRef = document.querySelector(".header");
if (headerRef) {
  headerRef.addEventListener("click", () => {
  location.hash = "#/";
});
}

// listen for hash changes, initial route 
window.addEventListener("hashchange", () => navigate(getPath()));
navigate(getPath());