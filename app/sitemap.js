import subjects from '../content/study/index.json';
import articles from '../content/articles/index.json';
const siteUrl = process.env.SITE_URL || 'https://www.sayanpaul.in';

export const dynamic = 'force-static';

export default function sitemap() {
  return [
    { url: `${siteUrl}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: siteUrl + '/writing', changeFrequency: 'weekly', priority: 0.7 },
    { url: siteUrl + '/writing/articles', changeFrequency: 'weekly', priority: 0.7 },
    ...subjects.map(subject => ({ url: siteUrl + '/writing/notes/' + subject.slug, lastModified: subject.updated, changeFrequency: 'weekly', priority: 0.8 })),
    ...articles.filter(article => article.published).map(article => ({ url: siteUrl + '/writing/' + article.slug, lastModified: article.date, changeFrequency: 'monthly', priority: 0.7 })),
  ];
}
