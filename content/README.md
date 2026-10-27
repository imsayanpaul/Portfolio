# The open notebook

## Study content

The seven Semester 7 subjects were imported from Sayan's Notion SEM 7 database on 27 October 2026.

- notion/sem7.json is the original snapshot returned by the Notion connector.
- study/*.json contains the reader content, grouped into modules and questions.
- ../public/study/diagrams/ contains the ten original SVG illustrations downloaded from Notion.
- ../public/study/search-index.json is the generated full-text search index.

The website serves this content directly. Readers do not need a Notion account.
This is a snapshot, not an automatic live sync. To refresh it, retrieve the same seven Notion pages into the snapshot, resolve/download any new image attachments, and run:

    node scripts/prepare-study.mjs

The importer rejects missing/truncated pages. New attachment references must be downloaded before publishing. Do not commit temporary signed download URLs.
Original wording, code, examples, and syllabus notes are preserved; importing does not independently verify their academic accuracy.

## Write an article

Create a draft:

    npm run article -- what-i-learned-building-reeldex

1. Write in the generated Markdown file in content/articles/.
2. Edit its title, description, and date in content/articles/index.json.
3. Set published to true when ready.
4. Open /writing locally, then build and deploy the site as usual.

Articles support headings, links, images, lists, tables, code blocks, LaTeX math, and Mermaid diagrams. Put article images in public/articles/ and reference them with /articles/filename.

Drafts (published: false) are excluded from the public article list, generated pages, and sitemap. No example articles are published.
