"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Star } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { getProductById } from "@/api/productApi"; 

const ProductDetails = ({ product }) => {
  const params = useParams();
  const productId = product?. _id || params?.id; 
  const [activeImage, setActiveImage] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [loading, setLoading] = useState(!product);
  const [productData, setProductData] = useState(product || null);
  const router = useRouter();

  useEffect(() => {
    if (!product && productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await getProductById(productId);
          setProductData(res); 
        } catch (err) {
          console.error("Failed to fetch product:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [product, productId]);

  if (loading) return <div className="p-6 text-gray-500">Loading product details...</div>;
  if (!productData) return <div className="p-6 text-red-500">Product not found</div>;

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const prod = productData;

  return (
    <div className="min-h-screen  ">
      {/* Header */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Product</h1>
          <nav className="flex items-center space-x-2 mt-2 text-sm">
            <span
              onClick={() => router.push("/dashboard")}
              className="text-green-600 font-medium cursor-pointer"
            >
              Dashboard
            </span>
            <span className="text-gray-400">›</span>
            <span
              onClick={() => router.push("/dashboard/product")}
              className="text-green-600 font-medium cursor-pointer"
            >
              Product
            </span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-600 font-medium">{prod.title}</span>
          </nav>
          <div className="border-b border-gray-300 mt-4">
            <button className="pb-2 text-gray-600 font-medium">Details</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white h-1/2 rounded-lg shadow-sm p-6 space-y-4">
            <div className="bg-green-700 rounded-lg overflow-hidden">
              <img
                src={prod.images?.[activeImage]?.url || "/placeholder.png"}
                alt={prod.title}
                className="w-full h-80 object-cover"
              />
            </div>

            <div className="flex space-x-2">
              {prod.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden object-contain border-2 ${
                    activeImage === index ? "border-green-500" : "border-gray-200"
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="flex justify-center space-x-2">
              {prod.images?.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-2 h-2 rounded-full ${
                    activeImage === index ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-semibold text-gray-900">{prod.title}</h1>
              {/* <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {prod.status || "Published"}
              </span> */}
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>
                Sold: <span className="font-medium text-gray-900">{prod.sold || 0}</span>
              </span>
              <div className="flex items-center space-x-1">
                <span>Rating:</span>
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-gray-900">{prod.rating || "4.5/5"}</span>
              </div>
              <span>
                Stock: <span className="font-medium text-gray-900">{prod.stock}</span>
              </span>
            </div>

            <div className="text-3xl font-bold text-gray-900">₹ {prod.price}</div>

            {/* Details */}
            {prod.details?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details :</h3>
                {prod.details.map((detail, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleSection(detail.product_que)}
                      className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{detail.product_que}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${
                          expandedSections[detail.product_que] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedSections[detail.product_que] && (
                      <div className="px-4 pb-3 border-t border-gray-200">
                        <p className="text-gray-600 text-sm">{detail.product_ans}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certificates */}
            {prod.certificates?.length > 0 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-600">Certifications & Commitment to Quality</h3>
                  <div className="p-4 rounded-lg flex flex-wrap gap-6">
                    {prod.certificates.map((cert, index) => (
                      <div key={index} className="flex flex-col items-center text-center">
                        <img src={cert.certificate_img} alt={cert.certificate_title} className="w-32 h-32 rounded-lg object-contain bg-white mb-2" />
                        <span className="text-xs font-medium text-black">{cert.certificate_title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

         {prod.certificates?.length > 0 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-600">SDG Goals</h3>
                  <div className="p-4 rounded-lg flex flex-wrap gap-6">
                    {prod.certificates.map((cert, index) => (
                      <div key={index} className="flex flex-col items-center text-center">
                        <img src={cert.sdg_img} alt={cert.sdg_title} className="w-32 h-32 rounded-lg object-contain bg-white mb-2" />
                        <span className="text-xs font-medium text-black">{cert.sdg_title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            

            {/* Footer */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 text-sm text-gray-600">
              <span>
                Product ID: <span className="font-medium">{prod.pro_id}</span>
              </span>
              <span>
                Created:{" "}
                <span className="font-medium">
                  {new Date(prod.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
