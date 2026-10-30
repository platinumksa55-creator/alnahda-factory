import { getRawProducts } from "@/lib/products-store";
import { ProductsManager } from "@/components/admin/products-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إدارة الموديلات | لوحة التحكم",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ edit?: string }>;
}) {
  const products = await getRawProducts();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const editId = resolvedSearchParams?.edit ? parseInt(resolvedSearchParams.edit, 10) : undefined;

  return <ProductsManager initialProducts={products} editIdFromUrl={editId} />;
}
