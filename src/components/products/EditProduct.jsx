"use client";
import React, { useEffect, useState } from "react";
import { X, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  updateProductById,
  updateProductDetails,
  updateProductCertificates,
  addProductDetails,
  addProductCertificates,
} from "@/redux/reducer/product/productSlice";

const EditProduct = ({ productId }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, product, error, success } = useSelector(
    (state) => state.product
  );

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("draft");
  const [images, setImages] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [certificates, setCertificates] = useState([]);

  // fetch product
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      setProductName(product.title || "");
      setProductDescription(product.description || "");
      setPrice(product.price || "");
      setStatus(product.status || "draft");
      setImages(product.images || []);
      setProductDetails(product.details || []);
      setCertificates(product.certificates || []);
    }
  }, [product]);

  const handleImageUpload = (event, key) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    if (typeof key === "number") {
      const updatedImages = [...images];
      updatedImages[key] = {
        ...updatedImages[key],
        url: URL.createObjectURL(file),
        file,
      };
      setImages(updatedImages);
    }

    if (typeof key === "string" && key.startsWith("cert-")) {
      const index = parseInt(key.split("-")[1]);
      const updatedCerts = [...certificates];
      updatedCerts[index] = {
        ...updatedCerts[index],
        certificate_img: URL.createObjectURL(file),
        certificate_file: file,
      };
      setCertificates(updatedCerts);
    }

    if (typeof key === "string" && key.startsWith("sdg-")) {
      const index = parseInt(key.split("-")[1]);
      const updatedCerts = [...certificates];
      updatedCerts[index] = {
        ...updatedCerts[index],
        sdg_img: URL.createObjectURL(file),
        sdg_file: file,
      };
      setCertificates(updatedCerts);
    }
  };

  const handleSaveNewDetails = () => {
    const newDetails = productDetails.filter((d) => !d._id);
    if (newDetails.length > 0) {
      const formatted = newDetails.map((d) => ({
        product_id: productId,
        product_que: d.product_que,
        product_ans: d.product_ans,
      }));
      dispatch(addProductDetails(formatted));
    }
  };

  // save handler
  const handleSaveAll = async () => {
    try {
      const productForm = new FormData();
      productForm.append("title", productName);
      productForm.append("description", productDescription);
      productForm.append("price", price);
      productForm.append("status", status);

      const existingImages = images
        .filter((img) => !img.file)
        .map((img) => img.url);
      const newImages = images.filter((img) => img.file).map((img) => img.file);

      existingImages.forEach((url) =>
        productForm.append("existingImages", url)
      );
      newImages.forEach((file) => productForm.append("images", file));

      await dispatch(updateProductById(productId, productForm));

      const existingDetails = productDetails.filter((d) => d._id);
      const newDetails = productDetails.filter((d) => !d._id);

      if (existingDetails.length > 0) {
        await dispatch(
          updateProductDetails(
            existingDetails.map((d) => ({ ...d, product_id: productId }))
          )
        );
      }

      if (newDetails.length > 0) {
        await dispatch(
          addProductDetails(
            newDetails.map((d) => ({ ...d, product_id: productId }))
          )
        );
      }

      const existingCerts = certificates.filter((c) => c._id);
      const newCerts = certificates.filter((c) => !c._id);

      if (existingCerts.length > 0) {
        await dispatch(
          updateProductCertificates(
            existingCerts.map((c) => ({ ...c, product_id: productId }))
          )
        );
      }

      if (newCerts.length > 0 && productId) {
        await dispatch(
          addProductCertificates(
            newCerts.map((c) => ({
              ...c,
              product_id: productId,
              certificate_file: c.certificate_file || null,
              sdg_file: c.sdg_file || null,
            }))
          )
        );
      }

      router.push("/dashboard/product");
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Edit Product
            </h1>
            <nav className="flex items-center space-x-2 mt-1 text-sm">
              <span
                onClick={() => router.push("/dashboard")}
                className="text-green-600 cursor-pointer"
              >
                Dashboard
              </span>
              <span className="text-gray-400">›</span>
              <span
                onClick={() => router.push("/dashboard/product")}

                className="text-green-600 cursor-pointer">Product</span>
              <span className="text-gray-400">›</span>
              <span className="text-gray-600">Edit Product</span>
            </nav>
          </div>
          <button
            onClick={() => router.push("/dashboard/product")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                General Information
              </h2>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Product Name"
              />
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 mt-3.5 outline-none resize-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Product Description"
              />
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Media</h2>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div
                    key={img._id || i}
                    className="relative bg-gray-100 rounded-lg aspect-square overflow-hidden group"
                  >
                    <img
                      src={img.url}
                      alt={`Product ${i}`}
                      className="w-full h-full object-cover"
                    />
                    <label
                      htmlFor={`image-file-${i}`}
                      className="absolute inset-0 bg-gray-200 bg-opacity-50 opacity-0 group-hover:opacity-100 
                               transition-opacity cursor-pointer flex items-center justify-center"
                    >
                      <Edit2 className="w-6 h-6 text-black" />
                    </label>
                    <input
                      id={`image-file-${i}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, i)}
                      className="hidden"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Product Details
              </h2>

              <div className="space-y-4">
                {productDetails.map((detail, idx) => (
                  <div key={detail._id || idx} className="space-y-2">
                    <input
                      type="text"
                      value={detail.product_que}
                      onChange={(e) =>
                        setProductDetails((prev) =>
                          prev.map((d, i) =>
                            i === idx
                              ? { ...d, product_que: e.target.value }
                              : d
                          )
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="Enter question"
                    />
                    <textarea
                      value={detail.product_ans}
                      onChange={(e) =>
                        setProductDetails((prev) =>
                          prev.map((d, i) =>
                            i === idx
                              ? { ...d, product_ans: e.target.value }
                              : d
                          )
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                      placeholder="Enter answer"
                    />
                  </div>
                ))}
              </div>

              {/* Add More button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setProductDetails((prev) => [
                      ...prev,
                      { product_que: "", product_ans: "" },
                    ])
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                >
                  + Add More
                </button>
              </div>
            </div>

            {/* Certificates */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Certifications & Commitment to Quality
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {certificates.map((cert, index) => (
                  <div
                    key={cert._id || index}
                    className="text-center space-y-2"
                  >
                    <div className="relative w-24 h-24 mx-auto bg-green-100 group rounded-md overflow-hidden">
                      {cert.certificate_img ? (
                        <img
                          // src={cert.certificate_img}
                           src={`${apiBase}${cert.certificate_img}`}
                          alt={cert.certificate_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs flex items-center justify-center h-full">
                          No Image
                        </span>
                      )}
                      <label
                        htmlFor={`cert-file-${index}`}
                        className="absolute inset-0 bg-gray-200 bg-opacity-50 opacity-0 group-hover:opacity-100 
                     transition-opacity cursor-pointer flex items-center justify-center rounded-md"
                      >
                        <Edit2 className="w-5 h-5 text-black" />
                      </label>
                      <input
                        id={`cert-file-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, `cert-${index}`)}
                        className="hidden"
                      />
                    </div>
                    {cert.editingTitle ? (
                      <input
                        type="text"
                        value={cert.certificate_title}
                        onChange={(e) =>
                          setCertificates((prev) => {
                            const copy = [...prev];
                            copy[index] = {
                              ...copy[index],
                              certificate_title: e.target.value,
                            };
                            return copy;
                          })
                        }
                        onBlur={() =>
                          setCertificates((prev) => {
                            const copy = [...prev];
                            copy[index] = {
                              ...copy[index],
                              editingTitle: false,
                            };
                            return copy;
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                        autoFocus
                      />
                    ) : (
                      <p
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                        onClick={() =>
                          setCertificates((prev) => {
                            const copy = [...prev];
                            copy[index] = {
                              ...copy[index],
                              editingTitle: true,
                            };
                            return copy;
                          })
                        }
                      >
                        {cert.certificate_title || "Click to edit"}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* ➕ Add New Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setCertificates((prev) => [
                      ...prev,
                      {
                        certificate_img: "",
                        certificate_title: "",
                        sdg_img: "",
                        sdg_title: "",
                      },
                    ])
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                >
                  + Add New Certificate
                </button>
              </div>
            </div>

            {/* SDG Goals */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                SDG Goals
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {certificates.map((cert, index) => (
                  <div
                    key={cert._id || index}
                    className="text-center space-y-2"
                  >
                    <div className="relative w-24 h-24 mx-auto bg-green-100 group rounded-md overflow-hidden">
                      {cert.sdg_img ? (
                        <img
                          // src={cert.sdg_img}
                           src={`${apiBase}${cert.sdg_img}`}
                          alt={cert.sdg_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs flex items-center justify-center h-full">
                          No Image
                        </span>
                      )}
                      <label
                        htmlFor={`sdg-file-${index}`}
                        className="absolute inset-0 bg-gray-200 bg-opacity-50 opacity-0 group-hover:opacity-100 
                     transition-opacity cursor-pointer flex items-center justify-center rounded-md"
                      >
                        <Edit2 className="w-5 h-5 text-black" />
                      </label>
                      <input
                        id={`sdg-file-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, `sdg-${index}`)}
                        className="hidden"
                      />
                    </div>
                    {cert.editingSdg ? (
                      <input
                        type="text"
                        value={cert.sdg_title}
                        onChange={(e) =>
                          setCertificates((prev) => {
                            const copy = [...prev];
                            copy[index] = {
                              ...copy[index],
                              sdg_title: e.target.value,
                            };
                            return copy;
                          })
                        }
                        onBlur={() =>
                          setCertificates((prev) => {
                            const copy = [...prev];
                            copy[index] = { ...copy[index], editingSdg: false };
                            return copy;
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                        autoFocus
                      />
                    ) : (
                      <p
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                        onClick={() =>
                          setCertificates((prev) => {
                            const copy = [...prev];
                            copy[index] = { ...copy[index], editingSdg: true };
                            return copy;
                          })
                        }
                      >
                        {cert.sdg_title || "Click to edit"}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setCertificates((prev) => [
                      ...prev,
                      {
                        certificate_img: "",
                        certificate_title: "",
                        sdg_img: "",
                        sdg_title: "",
                      },
                    ])
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                >
                  + Add New SDG
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-6">
            {/* Price */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Price</h2>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  placeholder="Enter price"
                />
              </div>
            </div>

            {/* Save */}
            <div className="space-y-3">
              <button
                onClick={handleSaveAll}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
