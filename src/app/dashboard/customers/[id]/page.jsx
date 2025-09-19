import CustomerDetail from "@/components/customers/CustomerDetail";

export default function Page({ params }) {
  const { id } = params; 

  return <CustomerDetail customerId={id} />;
}
