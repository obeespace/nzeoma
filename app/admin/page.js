"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from "axios";


import { 
  FiPlus, 
  FiSearch, 
  FiLogOut 
} from 'react-icons/fi';
import { Toaster, toast } from 'sonner';

import Link from 'next/link';
import { isAuthenticated, logout, getAuthUser, refreshSession } from '../component/auth';
import LoginForm from '../component/LoginForm';
import EditProductModal from '../component/admin/EditProductModal';
import DeleteConfirmationModal from '../component/admin/DeleteConfirmationModal';
import ProductCard from '../component/admin/ProductCard';

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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const fetchProducts = useCallback(async () => {
    try {
      
      const { data } = await axios.get("/api/products");
      setProducts(data || []); // Fallback to empty array if data is null/undefined
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products. Check your connection.");
      
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
    // Prevent double submission
    if (isSaving) {
      toast.error('Save operation in progress, please wait...');
      return;
    }

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
    setIsSaving(true);

    try {
      if (editingProduct) {
        const result = await productService.updateProduct(editingProduct._id, currentProduct);
        console.log('Update result:', result);
        toast.success(result.message || 'Product updated successfully!');
        
        // Update product in local state immediately
        setProducts(prev => prev.map(p => 
          p._id === editingProduct._id ? { ...result.data } : p
        ));
        setFilteredProducts(prev => prev.map(p => 
          p._id === editingProduct._id ? { ...result.data } : p
        ));
      } else {
        const result = await productService.createProduct(currentProduct);
        console.log('Create result:', result);
        toast.success(result.message || 'Product added successfully!');
        
        // Add new product to local state immediately
        setProducts(prev => [...prev, result.data]);
        setFilteredProducts(prev => [...prev, result.data]);
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Save error details:', error);
      toast.error(`Failed to save product: ${error.message}`);
    } finally {
      setIsSaving(false);
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
    // Prevent double submission
    if (isDeleting) {
      toast.error('Delete operation in progress, please wait...');
      return;
    }

    setIsDeleting(true);
    
    try {
      const result = await productService.deleteProduct(productToDelete.id);
      toast.success(result.message || 'Product deleted successfully!');

      
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete product: ${error.message}`);
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
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
                disabled={isSaving || isDeleting}
                className="group bg-green-800 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hover:bg-green-600 transition-all duration-200 font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center gap-1">
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                  ) : (
                    <FiPlus className="text-base group-hover:rotate-90 transition-transform duration-200" />
                  )}
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
              disabled={isSaving || isDeleting}
              className="group bg-green-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-green-600 transition-all duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center gap-2">
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <FiPlus className="text-lg group-hover:rotate-90 transition-transform duration-200" />
                )}
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
          <ProductCard
            key={product._id || product.id}
            product={product}
            isSaving={isSaving}
            isDeleting={isDeleting}
            handleEditProduct={handleEditProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
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
      <EditProductModal
        showModal={showModal}
        editingProduct={editingProduct}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        uploadingImage={uploadingImage}
        isSaving={isSaving}
        handleImageUpload={handleImageUpload}
        handleSaveProduct={handleSaveProduct}
        handleCloseModal={handleCloseModal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        productToDelete={productToDelete}
        isDeleting={isDeleting}
        confirmDeleteProduct={confirmDeleteProduct}
        cancelDelete={cancelDelete}
      />
    </div>
  );
}