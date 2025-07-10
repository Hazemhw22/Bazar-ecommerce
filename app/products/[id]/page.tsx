import { createServerSupabaseClient } from "../../../lib/supabase";
import ProductDetail from "./product-page";
import { notFound } from "next/navigation";
import type { Product } from "../../../lib/type";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
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
      shops:shop_id ( id, name ),
      categories:category_id ( id, name, description, created_at, updated_at )
    `
    )
    .eq("id", params.id)
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
  };

  return (
    <ProductDetail params={{ id: params.id }} product={normalizedProduct} />
  );
}
