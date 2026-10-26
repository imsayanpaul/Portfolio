const siteUrl = process.env.SITE_URL || 'https://www.sayanpaul.in';

export const dynamic = 'force-static';

export default function sitemap() {
  return [
    { url: `${siteUrl}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
