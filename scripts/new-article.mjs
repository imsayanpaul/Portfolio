import fs from 'node:fs/promises';
import path from 'node:path';

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || ['notes', 'articles'].includes(slug)) {
  console.error('Usage: npm run article -- my-article-title');
  process.exit(1);
}
const directory = path.join(process.cwd(), 'content/articles');
const indexPath = path.join(directory, 'index.json');
const articles = JSON.parse(await fs.readFile(indexPath, 'utf8'));
if (articles.some(article => article.slug === slug)) throw new Error('An article with this slug already exists.');
const title = process.argv.slice(3).join(' ') || slug.replace(/-/g, ' ').replace(/^./, value => value.toUpperCase());
await fs.writeFile(path.join(directory, slug + '.md'), 'Write your article here.\n\n## A place to begin\n\nAdd your ideas, code examples, or images.\n', { flag: 'wx' });
articles.unshift({ slug, title, description: '', date: new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }), published: false });
await fs.writeFile(indexPath, JSON.stringify(articles, null, 2) + '\n');
console.log('Draft created: content/articles/' + slug + '.md');
console.log('Add its description in content/articles/index.json, then set published to true when ready.');
