import { motion } from 'framer-motion';
import { FiTrash2, FiX } from 'react-icons/fi';

export default function DeleteConfirmationModal({
  showDeleteModal,
  productToDelete,
  isDeleting,
  confirmDeleteProduct,
  cancelDelete
}) {
  if (!showDeleteModal) return null;

  return (
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
              disabled={isDeleting}
              className="group bg-red-600 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:bg-red-700 transition-all duration-200 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center justify-center gap-2">
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 className="group-hover:scale-110 transition-transform duration-200" />
                    Yes, Delete
                  </>
                )}
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
  );
}
