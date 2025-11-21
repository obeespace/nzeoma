"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductDataManager from '../../lib/dataManager';
import { 
  fileToBase64,
  compressImage
} from '../component/dataManager';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiSave, 
  FiX,
  FiEye,
  FiLogOut 
} from 'react-icons/fi';
import { Toaster, toast } from 'sonner';
import Image from 'next/image';

import Link from 'next/link';
import { isAuthenticated, logout, getAuthUser, refreshSession } from '../component/auth';
import LoginForm from '../component/LoginForm';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    alt: '',
    image: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const authUser = getAuthUser();
        setUser(authUser);
        setIsLoggedIn(true);
        refreshSession(); // Refresh session timestamp
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadProducts();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (searchTerm) {
      // Filter products locally for now
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const handleLoginSuccess = () => {
    const authUser = getAuthUser();
    setUser(authUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logged out successfully!');
  };

  const loadProducts = async () => {
    try {
      const data = await ProductDataManager.getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
      setFilteredProducts([]);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setCurrentProduct({
      name: '',
      price: '',
      alt: '',
      image: ''
    });
    setImagePreview('');
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    // Ensure price has naira symbol when editing
    const formattedProduct = {
      ...product,
      price: product.price && !product.price.includes('₦') 
        ? `₦${product.price}` 
        : product.price
    };
    setCurrentProduct(formattedProduct);
    setImagePreview(product.image || '');
    setShowModal(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      // Compress image if it's large
      const compressedFile = await compressImage(file);
      const base64 = await fileToBase64(compressedFile);
      
      setCurrentProduct({
        ...currentProduct,
        image: base64
      });
      setImagePreview(base64);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async () => {
    // Validate required fields
    if (!currentProduct.name || !currentProduct.price) {
      toast.error('Please fill in product name and price');
      return;
    }
    
    if (!currentProduct.alt) {
      toast.error('Please fill in alt text for accessibility');
      return;
    }
    
    if (!currentProduct.image) {
      toast.error('Please upload a product image');
      return;
    }

    console.log('Saving product:', currentProduct); // Debug log

    try {
      if (editingProduct) {
        const result = await ProductDataManager.updateProduct(editingProduct._id, currentProduct);
        console.log('Update result:', result);
        toast.success('Product updated successfully!');
      } else {
        const result = await ProductDataManager.createProduct(currentProduct);
        console.log('Create result:', result);
        toast.success('Product added successfully!');
      }
      await loadProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Save error details:', error);
      toast.error(`Failed to save product: ${error.message}`);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImagePreview('');
    setCurrentProduct({
      name: '',
      price: '',
      alt: '',
      image: ''
    });
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id, name) => {
    setProductToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      await ProductDataManager.deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully!');
      await loadProducts();
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Delete error:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const formatPrice = (price) => {
    // Remove currency symbol and commas, then add them back properly
    const numericPrice = price.replace(/[₦,]/g, '');
    return `₦${parseInt(numericPrice).toLocaleString()}`;
  };

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-800 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 lg:p-4">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 lg:p-6 mb-6">
        {/* Mobile Header */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <button className="group flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-gray-600 transition-all duration-200 font-medium text-sm">
                <span className="text-base group-hover:-translate-x-1 transition-transform duration-200">←</span>
                Back
              </button>
            </Link>
            <div className="flex gap-2">
              <button
                onClick={handleAddProduct}
                className="group bg-green-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-green-600 transition-all duration-200 font-semibold text-sm"
              >
                <div className="flex items-center gap-1">
                  <FiPlus className="text-base group-hover:rotate-90 transition-transform duration-200" />
                  Add
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="group bg-gray-200 text-gray-700 px-3 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-red-100 hover:text-red-700 transition-all duration-200 font-semibold border border-gray-300 hover:border-red-300 text-sm"
              >
                <FiLogOut className="text-base group-hover:scale-110 transition-transform duration-200" />
              </button>
            </div>
          </div>
          <div className="text-center mb-3">
            <h1 className="text-xl font-bold text-green-800 mb-1">
              🔆 Admin Panel
            </h1>
            
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className="group flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-gray-600 transition-all duration-200 font-medium">
                <span className="text-lg group-hover:-translate-x-1 transition-transform duration-200">←</span>
                Back to Site
              </button>
            </Link>
            <h1 className="text-3xl font-bold text-green-800">
              🔆 Nzeoma Solar - Admin Panel
            </h1>
            
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAddProduct}
              className="group bg-green-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-green-600 transition-all duration-200 font-semibold"
            >
              <div className="flex items-center gap-2">
                <FiPlus className="text-lg group-hover:rotate-90 transition-transform duration-200" />
                Add Product
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="group bg-gray-200 text-gray-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-red-100 hover:text-red-700 transition-all duration-200 font-semibold border border-gray-300 hover:border-red-300"
            >
              <div className="flex items-center gap-2">
                <FiLogOut className="text-lg group-hover:scale-110 transition-transform duration-200" />
                Logout
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <FiSearch className="text-lg" />
          </div>
          <input
            type="text"
            placeholder="Search products by name, price, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
          />
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Total Products: {products.length} | Showing: {filteredProducts.length}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product._id || product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product Image */}
            <div className="h-96 lg:h-52 bg-gray-200 relative">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.alt || product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                {product.price}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-800 mb-2 text-base sm:text-sm lg:text-base line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                ID: {product.id}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="group flex-1 bg-green-800 text-white py-2.5 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  <FiEdit2 size={14} className="sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-200" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id, product.name)}
                  className="group flex-1 bg-gray-200 text-gray-700 py-2.5 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-red-100 hover:text-red-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium border border-gray-300 hover:border-red-300 text-sm sm:text-base"
                >
                  <FiTrash2 size={14} className="sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No products found</div>
          <div className="text-gray-600">
            {searchTerm ? 'Try adjusting your search' : 'Add your first product to get started'}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            // Close modal when clicking outside
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-4 lg:p-6 w-full max-w-sm lg:max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-800">
                {editingProduct ? '✏️ Edit Product' : '➕ Add Product'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="group p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 transition-all duration-200"
                type="button"
              >
                <FiX size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Enter product name..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="text"
                  value={currentProduct.price}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Remove any existing naira symbol and clean the input
                    value = value.replace(/₦/g, '').replace(/,/g, '');
                    
                    // Only allow numbers and format with naira symbol
                    if (value === '' || /^\d+$/.test(value)) {
                      const formattedValue = value ? `₦${parseInt(value).toLocaleString()}` : '';
                      setCurrentProduct({...currentProduct, price: formattedValue});
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="₦25,000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description/Alt Text
                </label>
                <input
                  type="text"
                  value={currentProduct.alt}
                  onChange={(e) => setCurrentProduct({...currentProduct, alt: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  placeholder="Product description..."
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Image
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-40 h-40 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                    />
                  </div>
                )}
                
                {/* Upload Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="group bg-green-800 text-white px-4 lg:px-6 py-3 rounded-xl cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-green-600 transition-all duration-200 font-semibold text-center">
                    <div className="flex items-center justify-center gap-2">
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span className="text-sm lg:text-base">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg">📁</span>
                          <span className="text-sm lg:text-base">Upload Image</span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setCurrentProduct({...currentProduct, image: ''});
                      }}
                      className="group bg-gray-200 text-gray-700 px-4 lg:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-red-100 hover:text-red-700 transition-all duration-200 font-semibold border border-gray-300 hover:border-red-300"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FiTrash2 className="group-hover:scale-110 transition-transform duration-200" />
                        <span className="text-sm lg:text-base">Remove</span>
                      </div>
                    </button>
                  )}
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  Upload images up to 5MB. Images will be automatically compressed for better performance.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mt-6 lg:mt-8 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={!currentProduct.name || !currentProduct.price || !currentProduct.alt || !currentProduct.image}
                className="group flex-1 bg-green-800 text-white py-3 px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-green-600 transition-all duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                <div className="flex items-center justify-center gap-2">
                  <FiSave className="group-hover:scale-110 transition-transform duration-200" />
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </div>
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="group bg-gray-200 text-gray-700 py-3 px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-gray-300 transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400"
              >
                <div className="flex items-center justify-center gap-2">
                  <FiX className="group-hover:rotate-90 transition-transform duration-200" />
                  Cancel
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelDelete();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-4 lg:p-6 w-full max-w-sm lg:max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <FiTrash2 className="h-8 w-8 text-red-600" />
              </div>
              
              {/* Title */}
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                Delete Product
              </h3>
              
              {/* Message */}
              <p className="text-sm lg:text-base text-gray-600 mb-6">
                Are you sure you want to delete <strong>"{productToDelete?.name}"</strong>? 
                This action cannot be undone.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  className="group bg-red-600 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-red-700 transition-all duration-200 font-semibold"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiTrash2 className="group-hover:scale-110 transition-transform duration-200" />
                    Yes, Delete
                  </div>
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="group bg-gray-200 text-gray-700 py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-gray-300 transition-all duration-200 font-semibold border border-gray-300 hover:border-gray-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiX className="group-hover:rotate-90 transition-transform duration-200" />
                    Cancel
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}