# How to write a blog post or newsletter

You can publish straight from the GitHub website. No software to install.

## 1. Create the post

1. Open the repository on GitHub and go into the **`_posts`** folder.
2. Click **Add file → Create new file**.
3. Name the file using the date and a short title, all lowercase with dashes:

   ```
   2026-11-15-our-first-toy-drive.md
   ```

4. Paste this template at the top and fill it in:

   ```markdown
   ---
   title: "Our First Toy Drive"
   author: Your Name
   category: Blog          # or: Newsletter
   image: /assets/blog/toy-drive.jpg   # optional cover photo (delete this line if none)
   image_alt: Volunteers sorting donated toys   # describe the photo
   ---

   Write your post here. Leave a blank line between paragraphs.

   ## You can add headings like this

   **Bold**, *italics*, and [links](https://example.com) work too.

   > Quotes look like this.
   ```

5. Click **Commit changes**. The site updates in about a minute.

## 2. Adding photos

1. Go into the **`assets/blog`** folder and click **Add file → Upload files**.
2. Use simple file names like `toy-drive.jpg` (no spaces).
3. Use it as a cover with `image: /assets/blog/toy-drive.jpg`, or inside your post with:

   ```markdown
   ![Describe the photo](/assets/blog/toy-drive.jpg)
   ```

**Please don't post photos of patients or anything that shows a hospital patient's face, name, or room** unless the hospital and family have given written permission.

## 3. Editing or removing a post

Open the file in `_posts`, click the pencil icon to edit, or the **⋯ → Delete file** menu to remove it.

## Need access?

Writers need to be added as collaborators on the GitHub repository. Ask a founder, or email hopeinthehallssacramento@gmail.com.
