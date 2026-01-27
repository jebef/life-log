# Stela
A lightweight blog template with minimal dependencies. Posts are written in markdown and
parsed with a minified version of [markdown-it](https://github.com/markdown-it/markdown-it). 
Hash routing, simple styling, responsive layouts.


## Setup
1. Click **"Use this template"** → **"Create a new repository"**
2. Name your repository (e.g. `my-blog`)
3. Go to **Settings** → **Pages** → set **Branch** to `main` and save 
4. Your site will be live at `https://your-username.github.io/your-repo-name`
5. Clone your repository locally: 
```bash 
  git clone https://github.com/your-username/your-repo-name.git
```


## Adding a post
1. Navigate to your repository and run the following script: 
```bash
  python3 scripts/new-post.py
```
2. Find your new post in the `posts` folder
3. Edit `index.md`, add assets to `media` using relative paths: 
```md
  ![morning coffee](media/coffee.jpg)
```
4. Add, commit, and push changes:
```bash
  git add .
  git commit -m "Added new post!"
  git push
```
Your blog will automatically update and redeploy. 


### Writing Guide 
Font size is uniform. All headers are treated the same and rendered in bold. Horizontal rules (`---`) can emphasize thematic breaks after headers. 


## Deleting a post
Delete the post. Add, commit, push.  


## Local Development
Open `index.html` in a browser or use a local server:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`


## Pulling Updates 
As I refine this layout I will push new updates. If you have already copied the template and 
would like to pull a specific update, I recommend taking the following steps: 
1. Add stela as a remote: 
```bash
  git remote add upstream https://github.com/jebef/stela.git
```      
2. Fetch changes: 
```bash
  git fetch upstream 
```               
3. View upstream updates: 
```bash 
  git log HEAD..upstream/main
```                                                                                              
4. Select an update: 
```bash
  git cherry-pick <commit-hash>
```
5. Resolve conflicts (if any)
6. Push local changes, your blog will update/redeploy automatically 

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

**Last Updated: 2026-01-26**