import EditProduct from "@/components/products/EditProduct";

export default function EditProductPage({ params }) {
  const { id } = params; 

  return <EditProduct productId={id} />;
}
