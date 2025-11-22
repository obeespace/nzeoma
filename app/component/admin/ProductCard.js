import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';

export default function ProductCard({
  product,
  isSaving,
  isDeleting,
  handleEditProduct,
  handleDeleteProduct
}) {
  return (
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
            disabled={isSaving || isDeleting}
            className="group flex-1 bg-green-800 text-white py-2.5 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border border-white border-t-transparent"></div>
            ) : (
              <FiEdit2 size={14} className="sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform duration-200" />
            )}
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDeleteProduct(product._id, product.name)}
            disabled={isSaving || isDeleting}
            className="group flex-1 bg-gray-200 text-gray-700 py-2.5 px-3 sm:px-4 rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-red-100 hover:text-red-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium border border-gray-300 hover:border-red-300 text-sm sm:text-base disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:text-gray-500"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border border-gray-700 border-t-transparent"></div>
            ) : (
              <FiTrash2 size={14} className="sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-200" />
            )}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
