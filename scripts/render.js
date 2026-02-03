import { stela } from "./stela.js";

//--- REFS ---//
const md = markdownit();
md.use(stela);
const contentRef = document.querySelector(".content");

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
 * Render post index to the content element
 */
export async function renderIndex() {
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
 * Render a post to the content element
 *
 * @param id - unique post identifier
 */
export async function renderPost(id) {
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
 * Get grid cell dimensions 
 */
function getGridDims() {
  const probe = document.createElement("div");
  probe.style.visibility = "hidden";
  probe.style.width = "var(--cell-width)";
  probe.style.height = "var(--cell-height)";
  contentRef.appendChild(probe);
  const { width, height } = probe.getBoundingClientRect();
  probe.remove();

  return { width, height };
}


/**
 * Snap .img-wrap containers to grid
 */
export function snapImages() {
  const { width: cw, height: ch } = getGridDims();
  const clips = document.querySelectorAll(".content .img-wrap__clip");
  let pending = 0;

  const sizeCaptions = () => {
    document.querySelectorAll(".content .img-wrap__cap").forEach(cap => {
      let target = cap.closest("p");
      if (!target) target = cap.closest("ul");
      if (!target) return;

      const targetCaps = [...target.querySelectorAll(".img-wrap__cap")];
      const maxCapH = Math.max(...(targetCaps.map(c => c.getBoundingClientRect().height)));

      target.style.paddingBottom = Math.ceil((maxCapH - 1) / ch) * ch + ch + "px";

    });
  };

  const onSnapped = () => {
    pending--;
    if (pending === 0) sizeCaptions();
  };

  clips.forEach(clip => {
    const img = clip.querySelector("img");
    const snap = () => {
      clip.style.width = "";
      clip.style.height = "";
      const w = img.getBoundingClientRect().width;
      clip.style.width = Math.floor(w / cw) * cw + "px";
      const h = img.getBoundingClientRect().height;
      clip.style.height = Math.floor(h / ch) * ch + "px";
      onSnapped();
    };
    pending++;
    if (img.complete) snap();
    else img.onload = snap;
  });

  if (pending === 0) sizeCaptions();
}

/**
 * Render grid overlay
 */
export function renderGrid() {
  const grid = document.createElement("div");
  grid.className = "grid";
  contentRef.appendChild(grid);
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(snapImages, 200);
});