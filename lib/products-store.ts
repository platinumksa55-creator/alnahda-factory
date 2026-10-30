import fs from 'fs';
import path from 'path';
import { ProductItem, ProductCategory } from './types';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

// Default fallback categories
export const defaultCategories: ProductCategory[] = [
  { id: 'cotton', name: { ar: 'أقمشة القطن', en: 'Cotton Fabrics' } },
  { id: 'linen', name: { ar: 'منسوجات الكتان', en: 'Linen Textiles' } },
  { id: 'silk', name: { ar: 'أقمشة الحرير', en: 'Silk Fabrics' } },
  { id: 'blended', name: { ar: 'منسوجات مخلوطة', en: 'Blended Textiles' } },
  { id: 'home-decor', name: { ar: 'أقمشة الديكور', en: 'Decor Fabrics' } },
  { id: 'industrial', name: { ar: 'منسوجات صناعية', en: 'Industrial Textiles' } },
];

export function getRawProducts(): ProductItem[] {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const content = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(content) as ProductItem[];
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

export function saveRawProducts(products: ProductItem[]): boolean {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving products file:', error);
    return false;
  }
}

// Convert product for specific locale (ar or en)
export function localizeProduct(product: ProductItem, locale: 'ar' | 'en' = 'ar') {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name?.[locale] || product.name?.ar || '',
    description: product.description?.[locale] || product.description?.ar || '',
    longDescription: product.longDescription?.[locale] || product.longDescription?.ar || '',
    category: product.category?.[locale] || product.category?.ar || '',
    categoryId: product.categoryId || 'cotton',
    availability: product.availability?.[locale] || product.availability?.ar || 'متوفر',
    rating: product.rating || 5.0,
    reviews: product.reviews || 0,
    price: product.price || '',
    images: product.images && product.images.length > 0 ? product.images : ['/placeholder.svg'],
    specifications: product.specifications?.[locale] || product.specifications?.ar || {},
    features: product.features?.[locale] || product.features?.ar || [],
    applications: product.applications?.[locale] || product.applications?.ar || [],
    featured: !!product.featured,
    createdAt: product.createdAt,
  };
}

export function getAllProducts(locale?: 'ar' | 'en') {
  const products = getRawProducts();
  if (!locale) return products;
  return products.map(p => localizeProduct(p, locale));
}

export function getFeaturedProducts(locale?: 'ar' | 'en') {
  const products = getRawProducts();
  const featured = products.filter(p => p.featured);
  // If no featured products, return first 3
  const selection = featured.length > 0 ? featured : products.slice(0, 3);
  if (!locale) return selection;
  return selection.map(p => localizeProduct(p, locale));
}

export function getProductBySlug(slug: string, locale?: 'ar' | 'en') {
  const products = getRawProducts();
  const product = products.find(p => p.slug === slug);
  if (!product) return null;
  if (!locale) return product;
  return localizeProduct(product, locale);
}

export function getProductById(id: number): ProductItem | null {
  const products = getRawProducts();
  return products.find(p => p.id === id) || null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createOrUpdateProduct(data: Partial<ProductItem>): ProductItem {
  const products = getRawProducts();
  
  if (data.id) {
    // Update existing product
    const index = products.findIndex(p => p.id === data.id);
    if (index === -1) {
      throw new Error(`Product with ID ${data.id} not found`);
    }
    
    const existing = products[index];
    const updated: ProductItem = {
      ...existing,
      ...data,
      id: existing.id,
      slug: data.slug || existing.slug,
      updatedAt: new Date().toISOString(),
    };
    
    products[index] = updated;
    saveRawProducts(products);
    return updated;
  } else {
    // Create new product
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newId = maxId + 1;
    
    let generatedSlug = data.slug;
    if (!generatedSlug) {
      const baseName = data.name?.en || data.name?.ar || `model-${newId}`;
      generatedSlug = slugify(baseName) || `model-${newId}`;
    }
    
    // Ensure slug uniqueness
    let finalSlug = generatedSlug;
    let counter = 1;
    while (products.some(p => p.slug === finalSlug)) {
      finalSlug = `${generatedSlug}-${counter}`;
      counter++;
    }

    const newProduct: ProductItem = {
      id: newId,
      slug: finalSlug,
      name: data.name || { ar: 'موديل جديد', en: 'New Model' },
      description: data.description || { ar: '', en: '' },
      longDescription: data.longDescription || { ar: '', en: '' },
      category: data.category || { ar: 'أقمشة القطن', en: 'Cotton Fabrics' },
      categoryId: data.categoryId || 'cotton',
      availability: data.availability || { ar: 'متوفر', en: 'Available' },
      rating: data.rating || 5.0,
      reviews: data.reviews || 0,
      price: data.price || '',
      images: data.images && data.images.length > 0 ? data.images : ['/images/luxury-cotton-fabric.png'],
      specifications: data.specifications || { ar: {}, en: {} },
      features: data.features || { ar: [], en: [] },
      applications: data.applications || { ar: [], en: [] },
      featured: data.featured ?? false,
      createdAt: new Date().toISOString(),
    };

    products.unshift(newProduct);
    saveRawProducts(products);
    return newProduct;
  }
}

export function deleteProduct(id: number): boolean {
  const products = getRawProducts();
  const filtered = products.filter(p => p.id !== id);
  if (filtered.length === products.length) {
    return false;
  }
  return saveRawProducts(filtered);
}

export function bulkImportProducts(items: Partial<ProductItem>[]): {
  addedCount: number;
  updatedCount: number;
  products: ProductItem[];
} {
  const products = getRawProducts();
  let addedCount = 0;
  let updatedCount = 0;

  let maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);

  for (const data of items) {
    if (!data.name?.ar && !data.name?.en) continue;

    // Check if an existing product matches by ID, slug, or exact Arabic/English name
    const existingIndex = products.findIndex(
      p =>
        (data.id && p.id === data.id) ||
        (data.slug && p.slug === data.slug) ||
        (data.name?.ar && p.name.ar.trim() === data.name.ar.trim())
    );

    if (existingIndex !== -1) {
      const existing = products[existingIndex];
      products[existingIndex] = {
        ...existing,
        name: {
          ar: data.name?.ar?.trim() || existing.name.ar,
          en: data.name?.en?.trim() || existing.name.en || data.name?.ar?.trim() || existing.name.ar,
        },
        description: {
          ar: data.description?.ar?.trim() ?? existing.description.ar,
          en: data.description?.en?.trim() || existing.description.en || data.description?.ar?.trim() || existing.description.ar,
        },
        longDescription: {
          ar: data.longDescription?.ar?.trim() || data.description?.ar?.trim() || existing.longDescription.ar,
          en: data.longDescription?.en?.trim() || data.description?.en?.trim() || existing.longDescription.en || data.longDescription?.ar?.trim() || existing.longDescription.ar,
        },
        category: data.category || existing.category,
        categoryId: data.categoryId || existing.categoryId,
        availability: data.availability || existing.availability,
        price: data.price !== undefined ? data.price : existing.price,
        images: data.images && data.images.length > 0 ? data.images : existing.images,
        specifications:
          data.specifications && Object.keys(data.specifications.ar || {}).length > 0
            ? data.specifications
            : existing.specifications,
        features:
          data.features && (data.features.ar?.length || 0) > 0
            ? data.features
            : existing.features,
        applications:
          data.applications && (data.applications.ar?.length || 0) > 0
            ? data.applications
            : existing.applications,
        featured: data.featured !== undefined ? data.featured : existing.featured,
        updatedAt: new Date().toISOString(),
      };
      updatedCount++;
    } else {
      maxId++;
      const newId = maxId;
      const baseName = data.name?.en || data.name?.ar || `model-${newId}`;
      let generatedSlug = data.slug || slugify(baseName) || `model-${newId}`;

      let finalSlug = generatedSlug;
      let counter = 1;
      while (products.some(p => p.slug === finalSlug)) {
        finalSlug = `${generatedSlug}-${counter}`;
        counter++;
      }

      const newProduct: ProductItem = {
        id: newId,
        slug: finalSlug,
        name: {
          ar: data.name?.ar?.trim() || data.name?.en?.trim() || 'موديل جديد',
          en: data.name?.en?.trim() || data.name?.ar?.trim() || 'New Model',
        },
        description: {
          ar: data.description?.ar?.trim() || '',
          en: data.description?.en?.trim() || data.description?.ar?.trim() || '',
        },
        longDescription: {
          ar: data.longDescription?.ar?.trim() || data.description?.ar?.trim() || '',
          en: data.longDescription?.en?.trim() || data.description?.en?.trim() || data.longDescription?.ar?.trim() || data.description?.ar?.trim() || '',
        },
        category: data.category || { ar: 'أقمشة القطن', en: 'Cotton Fabrics' },
        categoryId: data.categoryId || 'cotton',
        availability: data.availability || { ar: 'متوفر', en: 'Available' },
        rating: data.rating || 5.0,
        reviews: data.reviews || 0,
        price: data.price || 'حسب الكمية والمواصفات',
        images: data.images && data.images.length > 0 ? data.images : ['/images/luxury-cotton-fabric.png'],
        specifications: data.specifications || { ar: {}, en: {} },
        features: data.features || { ar: [], en: [] },
        applications: data.applications || {
          ar: ['الاستخدام المنزلي والملابس', 'الفنادق والمنتجعات'],
          en: ['Home & Apparel', 'Hotels & Resorts'],
        },
        featured: data.featured ?? false,
        createdAt: new Date().toISOString(),
      };

      products.unshift(newProduct);
      addedCount++;
    }
  }

  saveRawProducts(products);
  return { addedCount, updatedCount, products };
}
