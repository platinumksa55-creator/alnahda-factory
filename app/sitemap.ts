import { MetadataRoute } from 'next';
import { getRawProducts } from '@/lib/products-store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://alnahda-factory-delta.vercel.app';
  const products = await getRawProducts();

  const staticPages = ['', '/about', '/products', '/contact'];
  const locales = ['ar', 'en'];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages in both languages
  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic products pages in both languages
  for (const product of products) {
    for (const locale of locales) {
      entries.push({
        url: `${baseUrl}/${locale}/products/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(product.createdAt || Date.now()),
        changeFrequency: 'weekly',
        priority: product.featured ? 0.9 : 0.7,
      });
    }
  }

  return entries;
}
