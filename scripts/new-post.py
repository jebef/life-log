"""
Create a new skeleton post with auto-generated ID.

Usage: python3 scripts/new-post.py
"""

import os
from datetime import date

POSTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'posts')

# skeleton template for new posts
SKELETON = """---
title: Untitled
date: {date}
author: 
---

# Untitled
---

Write your post here.
"""


def get_next_id():
    """
    Find the next available post ID.

    Scans existing directories and returns the next sequential number,
    zero-padded to 4 digits.

    Returns:
        String like '0000', '0001', etc.
    """
    existing_ids = []

    for name in os.listdir(POSTS_DIR):
        path = os.path.join(POSTS_DIR, name)
        if os.path.isdir(path) and name.isdigit():
            existing_ids.append(int(name))

    if not existing_ids:
        return '0000'

    next_id = max(existing_ids) + 1
    return str(next_id).zfill(4)


def create_post(post_id):
    """
    Create the post directory structure and files.

    Args:
        post_id: The ID for the new post (e.g., '0001')

    Creates:
        posts/{id}/
        posts/{id}/index.md
        posts/{id}/media/
    """
    post_dir = os.path.join(POSTS_DIR, post_id)
    images_dir = os.path.join(post_dir, 'media')
    index_file = os.path.join(post_dir, 'index.md')

    os.makedirs(images_dir, exist_ok=True)

    content = SKELETON.format(date=date.today().isoformat())
    with open(index_file, 'w') as f:
        f.write(content)

    return post_dir


def main():
    """Generate a new post and print the path."""
    post_id = get_next_id()
    post_dir = create_post(post_id)

    print(f"Created new post: {post_dir}")
    print(f"Post ID: {post_id}")
    print(f"Edit: posts/{post_id}/index.md")


if __name__ == '__main__':
    main()
