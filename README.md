# Stela
A lightweight blog template with minimal dependencies. Posts are written in markdown and
parsed with a minified version of [markdown-it](https://github.com/markdown-it/markdown-it). 
Hash routing, simple styling, responsive layouts.

## Setup

1. Click **"Use this template"** → **"Create a new repository"**
2. Name your repository (e.g. `my-blog`)
3. Go to **Settings** → **Pages** → set Source to `main` branch
4. Your site will be live at `https://yourusername.github.io/your-repo-name`


## Adding a post
1. Navigate to your repo and run the following script: 
```bash
  python3 scripts/new-post.py
```
2. Find your new post in the `posts` folder
3. Edit `index.md`, add assets to `media` using relative paths: 
```md
  ![morning coffee](media/coffee.jpg)
```
4. Push to `main`

The post index updates automatically via GitHub Actions.

### Writing Guide 
Font size is uniform. All headers are treated the same and rendered in bold. Horizontal rules (`---`) can emphasize thematic breaks after headers. 

## Deleting a post

Delete the post folder and push. 

## Local Development

Open `index.html` in a browser or use a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`

## Project Structure

```
├── index.html              # Entry point
├── posts/
│   ├── index.json          # Auto-generated post index
|   ├── 0000/               # Individual posts
│   └── 0001/               
|       ├── media/          # Post assets
|       └── index.md        # Post content/structure
|   
├── scripts/
|   ├── generate-index.py   # Index generator (runs via GitHub Actions)
│   ├── markdown-it.min.js  # Markdown parser
|   ├── new-post.py         # Post initializer
│   └── router.js           # Client-side routing
|
└── styles/                 # CSS
```
