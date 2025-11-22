import { motion } from 'framer-motion';
import { FiX, FiSave, FiTrash2 } from 'react-icons/fi';

export default function EditProductModal({
  showModal,
  editingProduct,
  currentProduct,
  setCurrentProduct,
  imagePreview,
  setImagePreview,
  uploadingImage,
  isSaving,
  handleImageUpload,
  handleSaveProduct,
  handleCloseModal
}) {
  if (!showModal) return null;

  return (
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
            disabled={!currentProduct.name || !currentProduct.price || !currentProduct.alt || !currentProduct.image || isSaving}
            className="group flex-1 bg-green-800 text-white py-3 px-4 lg:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-green-600 transition-all duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            <div className="flex items-center justify-center gap-2">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="group-hover:scale-110 transition-transform duration-200" />
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </>
              )}
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
  );
}
