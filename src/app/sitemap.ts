import { MetadataRoute } from 'next';

const baseUrl = 'https://parent-stories.vercel.app';
const locales = ['en', 'zh', 'es'];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  // Add landing pages for each locale
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    });
  });

  // Add auth pages for each locale
  const authPages = ['login', 'signup', 'reset-password'];
  locales.forEach((locale) => {
    authPages.forEach((page) => {
      routes.push({
        url: `${baseUrl}/${locale}/${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });
  });

  return routes;
}
