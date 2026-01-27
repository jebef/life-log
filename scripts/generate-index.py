"""
Generate posts/index.json from post frontmatter.

Usage: python3 scripts/generate-index.py
"""

import os
import json
import re

POSTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'posts')
INDEX_FILE = os.path.join(POSTS_DIR, 'index.json')

def parse_frontmatter(content):
    """
    Extract YAML frontmatter from markdown content.

    Args:
        content: Raw markdown string with frontmatter

    Returns:
        Dictionary of frontmatter key-value pairs
    """
    pattern = r'^---\n(.*?)\n---'
    match = re.search(pattern, content, re.DOTALL)

    if not match:
        return {}

    frontmatter = {}
    for line in match.group(1).split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()

    return frontmatter


def get_post_dirs():
    """
    Find all post directories (numeric folders like 0000, 0001).

    Returns:
        Sorted list of directory names
    """
    dirs = []
    for name in os.listdir(POSTS_DIR):
        path = os.path.join(POSTS_DIR, name)
        if os.path.isdir(path) and name.isdigit():
            dirs.append(name)
    return sorted(dirs)


def build_index():
    """
    Scan all posts and build the index data structure.

    Returns:
        Dictionary with 'posts' array
    """
    posts = []

    for post_id in get_post_dirs():
        md_path = os.path.join(POSTS_DIR, post_id, 'index.md')

        if not os.path.exists(md_path):
            print(f"Warning: {md_path} not found, skipping")
            continue

        with open(md_path, 'r') as f:
            content = f.read()

        meta = parse_frontmatter(content)

        posts.append({
            'id': post_id,
            'title': meta.get('title', 'Untitled'),
            'date-created': meta.get('date', '')
        })

    return {'posts': posts}


def main():
    """Generate and write the index file."""
    index = build_index()

    with open(INDEX_FILE, 'w') as f:
        json.dump(index, f, indent=2)

    print(f"Generated {INDEX_FILE} with {len(index['posts'])} posts")


if __name__ == '__main__':
    main()
