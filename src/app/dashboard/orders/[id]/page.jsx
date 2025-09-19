import OrderDetails from "@/components/orders/OrderDetails";

export default function ViewOrderPage({ params }) {
  const { id } = params; 
  return <OrderDetails OrderId={id} />;
}
