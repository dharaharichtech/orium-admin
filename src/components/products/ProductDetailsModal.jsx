import React, { useState } from "react";

const AccordionItem = ({ title, content }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-3 text-left text-gray-900"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium">{title}</span>
        <span className="text-gray-500">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="pb-3 text-gray-600">{content}</div>}
    </div>
  );
};

const ProductDetailsModal = ({ open, onClose, product }) => {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-sidebar-gradient-start">
          {product.title} - Details
        </h2>

        <div className="space-y-2">
          {product.details && product.details.length > 0 ? (
            product.details.map((item) => (
              <AccordionItem
                key={item._id}
                title={item.product_que}
                content={item.product_ans}
              />
            ))
          ) : (
            <p className="text-gray-500">No details available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
