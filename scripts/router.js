// markdown parser
const md = markdownit();

// element references
const contentRef = document.querySelector(".content");
const headerRef = document.querySelector(".header");

// routes
const routes = {
  '/': renderIndex,
  '/posts/:id': renderPost
};

/**
 * Fetch the post index 
 * 
 * @returns Promise - post index or null
 */
async function fetchIndex() {
  try {
    const res = await fetch("./posts/index.json");
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error(`Failed to fetch posts: ${err.message}`);
    return null;
  }
}

/**
 * Fetch a post 
 * 
 * @param id - post identifier 
 * @returns Promise - md text or null 
 */
async function fetchPost(id) {
  try {
    const res = await fetch(`./posts/${id}/index.md`);

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    return res.text();
  } catch (err) {
    console.error(`Failed to fetch post ${id}: ${err.message}`);
    return null;
  }
}

/**
 * Parse post metadata and content
 *
 * @param markdown - md file
 * @returns post metadata and body
 */
function parsePost(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: markdown };

  const meta = {};
  match[1].split("\n").forEach(line => {
    const [key, ...rest] = line.split(":");
    if (key) meta[key.trim()] = rest.join(":").trim();
  });

  return { meta, body: match[2] };
}

/**
 * Rewrite relative paths in markdown to be relative to post directory
 *
 * @param markdown - markdown content
 * @param postId - post identifier for path prefix
 * @returns markdown with rewritten paths
 */
function rewritePaths(markdown, postId) {
  const basePath = `./posts/${postId}/`;

  // match markdown images and links: ![alt](path) or [text](path)
  return markdown.replace(
    /(!?\[[^\]]*\]\()([^)]+)(\))/g,
    (match, prefix, path, suffix) => {
      // skip absolute URLs, hashes, and protocol-relative URLs
      if (path.startsWith('/') ||
          path.startsWith('#') ||
          path.startsWith('http://') ||
          path.startsWith('https://') ||
          path.startsWith('//')) {
        return match;
      }
      return prefix + basePath + path + suffix;
    }
  );
}

/**
 * Render post index to the content element
 */
async function renderIndex() {
  contentRef.innerHTML = "";
  const data = await fetchIndex();

  if (!data) {
    contentRef.innerHTML = "<p>Failed to load posts.</p>";
    return;
  }

  const list = document.createElement("ul");
  list.className = "post-list";

  data.posts.forEach(post => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.style.textDecoration = "none";
    link.href = `#/posts/${post.id}`;
    link.textContent = post.title;
    item.appendChild(link);
    list.appendChild(item);
  });

  contentRef.appendChild(list);
  return;
}

/**
 * Render a post to the content element
 *
 * @param id - unique post identifier
 */
async function renderPost(id) {
  contentRef.innerHTML = "";
  const post = await fetchPost(id);

  if (!post) {
    contentRef.innerHTML = "<p>An error occurred, please try again.</p>";
    return;
  }

  const { meta, body } = parsePost(post);

  const postDate = document.createElement("p");
  postDate.className = "date";
  postDate.textContent = meta.date;
  contentRef.appendChild(postDate);

  const rewrittenBody = rewritePaths(body, id);
  const postBody = md.render(rewrittenBody);
  contentRef.innerHTML += postBody;
  return;
}

/**
 * Render grid overlay
 */
function renderGrid() {
  const grid = document.createElement("div");
  grid.className = "grid";
  contentRef.appendChild(grid);
  return;
}

/**
 * Get current path from hash
 *
 * @returns path string
 */
function getPath() {
  return location.hash.slice(1) || "/";
}

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
    contentRef.innerHTML = "<p>Page not found.</p>";
  }
}

// hash change listener
window.addEventListener("hashchange", () => navigate(getPath()));

// make header a home link
headerRef.addEventListener("click", () => {
  location.hash = "#/";
});

// initial route on page load
navigate(getPath());