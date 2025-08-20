import { createServerSupabaseClient } from "../../../lib/supabase";
import ProductDetail from "./product-page";
import { notFound } from "next/navigation";
import type { Product } from "../../../lib/type";


export default async function Page({ params }: { params: { id: string } } | { params: Promise<{ id: string }> }) {
  const resolvedParams = await (params as any);
  const supabase = createServerSupabaseClient();

  // الاستعلام عن المنتج مع العلاقات الصحيحة حسب الأنواع
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price,
      discount_price,
      stock_quantity,
      category_id,
      shop_id,
      main_image,
      images,
      created_at,
      updated_at,
      is_active,
      specifications,
      properties,
      shops:shop_id ( id, name ),
      categories:category_id ( id, name, description, created_at, updated_at )
    `
    )
    .eq("id", resolvedParams.id)
    .single();

  if (error || !product) {
    notFound();
  }

  // تطبيع البيانات لتتوافق مع النوع Product
  const normalizedProduct: Product = {
    id: String(product.id),
    name: product.name ?? "",
    description: product.description ?? null,
    price: Number(product.price) ?? 0,
    discount_price: product.discount_price
      ? Number(product.discount_price)
      : null,
    stock_quantity: product.stock_quantity ?? 0,
    category_id: product.category_id ?? "",
    shop_id: product.shop_id ?? "",
    main_image: product.main_image ?? null,
    images: product.images ?? [],
    created_at: product.created_at ?? "",
    updated_at: product.updated_at ?? "",
    is_active: product.is_active ?? true,
    specifications: product.specifications ?? null,
    properties: product.properties ?? null,
    categories: Array.isArray(product.categories)
      ? product.categories.length > 0
        ? {
            id: String(product.categories[0].id),
            name: String(product.categories[0].name),
            description: product.categories[0].description ?? undefined,
            created_at: product.categories[0].created_at ?? undefined,
            updated_at: product.categories[0].updated_at ?? undefined,
          }
        : null
      : product.categories
      ? {
          id: (product.categories as { id: string; name: string; description?: string; created_at?: string; updated_at?: string }).id,
          name: (product.categories as { id: string; name: string; description?: string; created_at?: string; updated_at?: string }).name,
          description: (product.categories as { id: string; name: string; description?: string; created_at?: string; updated_at?: string }).description ?? undefined,
          created_at: (product.categories as { id: string; name: string; description?: string; created_at?: string; updated_at?: string }).created_at ?? undefined,
          updated_at: (product.categories as { id: string; name: string; description?: string; created_at?: string; updated_at?: string }).updated_at ?? undefined,
        }
      : null,
    shops: Array.isArray(product.shops)
      ? product.shops.length > 0
        ? {
            id: String((product.shops[0] as { id: string; name: string }).id),
            name: String((product.shops[0] as { id: string; name: string }).name),
          }
        : null
      : product.shops && typeof product.shops === "object"
      ? {
          id: String((product.shops as { id: string; name: string }).id),
          name: String((product.shops as { id: string; name: string }).name),
        }
      : null,
  };

  return (
    <ProductDetail params={{ id: resolvedParams.id }} product={normalizedProduct} />
  );
}
