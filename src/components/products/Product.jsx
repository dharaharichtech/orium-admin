"use client";
import React, { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash2, Plus } from "lucide-react";
import { getAllProducts } from "@/api/productApi";
import Image from "next/image";
import ProductDetailsModal from "./ProductDetailsModal";
import { useRouter } from "next/navigation";
import ProductDetails from "./ProductDetails";
import {
  deleteProductById,
  fetchAllProducts,
  removeProduct,
} from "@/redux/reducer/product/productSlice";
import { useDispatch, useSelector } from "react-redux";

const Product = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const { products, loading } = useSelector((state) => state.product);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filterType, setFilterType] = useState(""); // 👈 NEW state
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const handleOpenDetailsModal = (product) => {
    setSelectedProduct(product);
    setOpenDetailsModal(true);
  };

  // const handleOpenViewModal = (product) => {
  //   setSelectedProduct(product);
  //   setOpenViewModal(true);
  // };

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const getStatusBadge = (stock) => {
    if (stock > 0) {
      return (
        <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-l-4xl">
          Available
        </span>
      );
    } else {
      return (
        <span className="inline-flex px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-l-4xl">
          Out of Stock
        </span>
      );
    }
  };

  // const filteredProducts = products.filter(
  //   (p) =>
  //     p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     p.pro_id?.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  let filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pro_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterType === "available") {
    filteredProducts = filteredProducts.filter((p) => p.stock > 0);
  } else if (filterType === "title") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (filterType === "date") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }

  const confirmDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProductById(productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span
                onClick={() => router.push("/dashboard")}
                className="text-green-600 font-bold cursor-pointer"
              >
                Dashboard
              </span>
              <span>›</span>
              <span className="text-gray-900">Product</span>
            </nav>
            <h1 className="text-2xl font-semibold text-gray-900">Product</h1>
          </div>
          <button
            onClick={() => router.push("/dashboard/product/add")}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown((prev) => !prev)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
            >
              <Image
                src="/icons/product/slider.svg"
                alt="Filter"
                width={16}
                height={16}
                className="mr-2"
              />
              Filters
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setFilterType("");
                    setShowFilterDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  All Products
                </button>
                <button
                  onClick={() => {
                    setFilterType("available");
                    setShowFilterDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Available
                </button>
                <button
                  onClick={() => {
                    setFilterType("title");
                    setShowFilterDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  By Title
                </button>
                <button
                  onClick={() => {
                    setFilterType("date");
                    setShowFilterDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  By Date
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white mx-6 mt-6 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Id
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.pro_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {product.images?.length > 0 ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.title}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          {}
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenDetailsModal(product)}
                      className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 rounded-l-4xl px-3 py-1"
                    >
                      See The Details
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(product.stock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(product.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/product/${product._id}/view`)
                        }
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/dashboard/product/${product._id}/edit`)
                        }
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowDeleteModal(false)}
              >
                <div className="w-5 h-5">✕</div>
              </button>

              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                Delete Product
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Do you want to delete this product? This action can’t be undone.
              </p>

              <div className="flex justify-between mt-6 space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <ProductDetailsModal
          open={openDetailsModal}
          onClose={() => setOpenDetailsModal(false)}
          product={selectedProduct}
        />

        <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
            {filteredProducts.length}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 text-sm ${
                  currentPage === i + 1
                    ? "bg-gray-900 text-white rounded"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
