import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '../../site-header';
import Markdown from '../_components/markdown';
import SubjectReader from '../_components/subject-reader';
import WritingCollection from '../_components/collection';
import { subjects, getSubject } from '../_components/data';
import articles from '../../../content/articles/index.json';
import '../_components/study.css';
import 'katex/dist/katex.min.css';

const published = articles.filter(article => article.published === true);
export const dynamicParams = false;
export function generateStaticParams() {
  return [{ slug: [] }, { slug: ['articles'] }, ...subjects.map(subject => ({ slug: ['notes', subject.slug] })), ...published.map(article => ({ slug: [article.slug] }))];
}
function resolve(slug) {
  if (!slug.length) return { kind: 'collection', tab: 'notes' };
  if (slug.length === 1 && slug[0] === 'articles') return { kind: 'collection', tab: 'articles' };
  if (slug.length === 2 && slug[0] === 'notes') {
    const subject = getSubject(slug[1]);
    if (subject) return { kind: 'subject', subject };
  }
  const article = slug.length === 1 ? published.find(item => item.slug === slug[0]) : null;
  if (article) return { kind: 'article', article };
  return null;
}
export async function generateMetadata({ params }) {
  const { slug = [] } = await params;
  const page = resolve(slug);
  if (!page) return {};
  const title = page.subject ? `${page.subject.name} Notes (${page.subject.code}) — MAKAUT BCA Semester 7` : page.article ? page.article.title + ' — Sayan Paul' : page.tab === 'notes' ? 'MAKAUT BCA Semester 7 Notes — All Subjects | Sayan Paul' : 'Blog — Sayan Paul';
  const description = page.subject ? `Free MAKAUT BCA Semester 7 ${page.subject.name} notes (${page.subject.code}): ${page.subject.count} answers and practicals, organised by module. Student-written study material by Sayan Paul.` : page.article?.description || (page.tab === 'notes' ? 'Study MAKAUT BCA Sem 7 with free subject notes, questions, answers and lab practicals. Cyber Security, Machine Learning, Research Methodology and more.' : 'Personal reflections and stories about building software, learning, and everyday life. By Sayan Paul.');
  const url = '/writing' + (slug.length ? '/' + slug.join('/') : '');
  return { title, description, alternates: { canonical: url }, twitter: { card: 'summary_large_image', title, description }, openGraph: { title, description, url, type: page.article ? 'article' : 'website', images: ['/opengraph-image.png'] } };
}
export default async function WritingPage({ params }) {
  const { slug = [] } = await params;
  const page = resolve(slug);
  if (!page) notFound();
  let body = '';
  if (page.article) {
    if (!/^[a-z0-9-]+$/.test(page.article.slug)) notFound();
    body = fs.readFileSync(path.join(process.cwd(), 'content/articles', page.article.slug + '.md'), 'utf8');
  }
  return <><a className="skip" href="#writing-main">Skip to writing</a><div className="topline"><span>NOTES FROM THE WORKBENCH</span><span>BY SAYAN PAUL</span></div><SiteHeader activePage="writing" />
    {page.subject ? <SubjectReader data={page.subject} /> : <main className="wrap writing-page" id="writing-main">
      {page.article ? <article className="article-body"><Link className="mono" href="/writing/articles">← BACK TO BLOG</Link><header className="article-header"><span className="mono">{page.article.date} · BY SAYAN PAUL</span><h1>{page.article.title}</h1><p>{page.article.description}</p></header><Markdown>{body}</Markdown></article> : <WritingCollection subjects={subjects} articles={published} activeTab={page.tab} />}
    </main>}
    <footer className="wrap study-footer"><span>© 2026 Sayan Paul</span><div><Link href="/writing">All writing ↗</Link><Link href="/">Portfolio ↗</Link></div></footer></>;
}
