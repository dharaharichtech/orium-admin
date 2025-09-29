"use client";

import React, { useState } from "react";
import { X, Plus, ImageIcon, Video, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  addProduct,
  addProductDetails,
  addProductCertificates,
} from "@/redux/reducer/product/productSlice";

const AddProduct = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("product");
  const [productId, setProductId] = useState(null);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("1");
  const [status, setStatus] = useState("Draft");
  const [stockStatus, setStockStatus] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [details, setDetails] = useState([{ product_que: "", product_ans: "" }]);

  const [certificates, setCertificates] = useState([
    {
      certificationName: "",
      certificationImage: null,
      sdgGoalsName: "",
      sdgGoalsImage: null,
    },
  ]);

  const handleImageUpload = (e) =>
    setImages([...images, ...Array.from(e.target.files)]);
  const handleVideoUpload = (e) =>
    setVideos([...videos, ...Array.from(e.target.files)]);

  const handleTabClick = (tab) => {
    if ((tab === "details" || tab === "certificates") && !productId) return;
    setActiveTab(tab);
  };

  const handleProductSubmit = async () => {
    try {
      const productData = {
        title: productName,
        description: productDescription,
        price,
        stock,
        status,
        stockStatus,
        images,
        videos,
      };
      const res = await dispatch(addProduct(productData));
      const newProductId = res._id || (res.payload && res.payload._id);
      setProductId(newProductId);
      setActiveTab("details");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

const handleDetailsChange = (index, field, value) => {
  const newDetails = [...details];
  newDetails[index][field] = value;
  setDetails(newDetails);
};


const addMoreDetails = () =>
  setDetails([...details, { product_que: "", product_ans: "" }]);


const handleDetailsSubmit = async () => {
  if (!productId) return;

  for (let i = 0; i < details.length; i++) {
    if (!details[i].product_que || !details[i].product_ans) {
      alert("Please fill all fields for each question and answer");
      return;
    }
  }

  const payload = details.map((d) => ({
    product_id: productId,
    product_que: d.product_que,
    product_ans: d.product_ans,
  }));

  await dispatch(addProductDetails(payload));
  setActiveTab("certificates");
};

  const handleCertificatesChange = (index, field, value) => {
    const newCerts = [...certificates];
    newCerts[index][field] = value;
    setCertificates(newCerts);
  };
  const handleCertificationImageUpload = (index, e) => {
    if (e.target.files[0]) {
      const newCerts = [...certificates];
      newCerts[index].certificationImage = e.target.files[0];
      setCertificates(newCerts);
    }
  };
  const handleSDGImageUpload = (index, e) => {
    if (e.target.files[0]) {
      const newCerts = [...certificates];
      newCerts[index].sdgGoalsImage = e.target.files[0];
      setCertificates(newCerts);
    }
  };
  const addMoreCertificates = () =>
    setCertificates([
      ...certificates,
      {
        certificationName: "",
        certificationImage: null,
        sdgGoalsName: "",
        sdgGoalsImage: null,
      },
    ]);
  const handleCertificatesSubmit = async () => {
    if (!productId) return;
    const payload = certificates.map((c) => ({
      product_id: productId,
      certificate_title: c.certificationName,
      sdg_title: c.sdgGoalsName,
      certificate_file: c.certificationImage,
      sdg_file: c.sdgGoalsImage,
    }));
    await dispatch(addProductCertificates(payload));
    router.push("/dashboard/product");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>
          <button
            onClick={() => router.push("/dashboard/product")}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <X size={20} />
            Cancel
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span
            onClick={() => router.push("/dashboard")}
            className="text-green-600 hover:text-green-700 cursor-pointer font-semibold"
          >
            Dashboard
          </span>
          <span>›</span>
          <span
            onClick={() => router.push("/dashboard/product")}
            className="text-green-600 hover:text-green-700 cursor-pointer font-semibold"
          >
            Product
          </span>
          <span>›</span>
          <span className="text-gray-700 font-medium">Add Product</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {["product", "details", "certificates"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            disabled={tab !== "product" && !productId}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-white border border-gray-200 text-gray-500"
            } ${
              !productId && tab !== "product"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {tab === "product"
              ? "Product"
              : tab === "details"
              ? "Details"
              : "Certificates"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "product" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border-gray-50 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Product Title
                </h2>
                <input
                  type="text"
                  placeholder="Type product name here..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-4"
                />
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Description
                </h2>
                <textarea
                  rows={4}
                  placeholder="Type product description here..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm border-gray-50 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6">
                  Media
                </h2>
                <div className="mb-8">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        Drag and drop image here, or click add image
                      </p>
                      <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                        <Plus size={16} /> Add Image
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          hidden
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                  {images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {images.map((file, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <Video className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        Drag and drop video here, or click add video
                      </p>
                      <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                        <Plus size={16} /> Add Video
                        <input
                          type="file"
                          accept="video/*"
                          multiple
                          hidden
                          onChange={handleVideoUpload}
                        />
                      </label>
                    </div>
                  </div>
                  {videos.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4">
                      {videos.map((file, idx) => (
                        <video
                          key={idx}
                          src={URL.createObjectURL(file)}
                          controls
                          className="w-40 h-24 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleProductSubmit}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save & Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="bg-white rounded-lg shadow-sm border-gray-50 p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Product Details
                </h2>
                <button
                  onClick={addMoreDetails}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} /> Add More
                </button>
              </div>
              {details.map((item, index) => (
                <div key={index} className="space-y-4 border p-4 rounded-lg">
                  <input
                    type="text"
                    placeholder="Enter Question"
                    value={item.product_que}
                    onChange={(e) =>
                      handleDetailsChange(index, "product_que", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <textarea
                    rows={6}
                    placeholder="Enter Answer"
                    value={item.product_ans}
                    onChange={(e) =>
                      handleDetailsChange(index, "product_ans", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              ))}

              <div className="flex justify-end">
                <button
                  onClick={handleDetailsSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Save & Next
                </button>
              </div>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Certifications & SDG Goals
                </h2>
                <button
                  onClick={addMoreCertificates}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} /> Add More
                </button>
              </div>
              {certificates.map((cert, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border-gray-50 p-6 space-y-6"
                >
                  <input
                    type="text"
                    placeholder="Enter certification name"
                    value={cert.certificationName}
                    onChange={(e) =>
                      handleCertificatesChange(
                        index,
                        "certificationName",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center bg-gray-50">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        Drag and drop image here, or click add image
                      </p>
                      <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                        <Plus size={16} /> Add Image
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            handleCertificationImageUpload(index, e)
                          }
                        />
                      </label>
                    </div>
                  </div>
                  {cert.certificationImage && (
                    <img
                      src={URL.createObjectURL(cert.certificationImage)}
                      alt="certification preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  )}
                  <input
                    type="text"
                    placeholder="Enter SDG goals name"
                    value={cert.sdgGoalsName}
                    onChange={(e) =>
                      handleCertificatesChange(
                        index,
                        "sdgGoalsName",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center bg-gray-50">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        Drag and drop image here, or click add image
                      </p>
                      <label className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50">
                        <Plus size={16} /> Add Image
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => handleSDGImageUpload(index, e)}
                        />
                      </label>
                    </div>
                  </div>
                  {cert.sdgGoalsImage && (
                    <img
                      src={URL.createObjectURL(cert.sdgGoalsImage)}
                      alt="SDG preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end mt-6">
                <button
                  onClick={handleCertificatesSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Save & Finish
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {activeTab === "product" && (
            <>
              <div className="bg-white rounded-lg shadow-sm border-gray-50 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Price
                </h2>
                <input
                  type="number"
                  placeholder="Enter Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* <div className="bg-white rounded-lg shadow-sm border-gray-50 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Status
                </h2>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div> */}

              <div className="bg-white rounded-lg shadow-sm border-gray-50 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Stock
                </h2>
                <input
                  type="number"
                  placeholder="Enter Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
