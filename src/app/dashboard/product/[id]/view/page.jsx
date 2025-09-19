import ProductDetails from "@/components/products/ProductDetails";

export default function ViewProductPage({ params }) {
  const { id } = params; 
  return <ProductDetails productId={id} />;
}
