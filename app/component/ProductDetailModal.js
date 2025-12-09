import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FiX, FiShoppingCart } from 'react-icons/fi';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }) {
  if (!product) return null;

  const formatPrice = (priceValue) => {
    if (!priceValue && priceValue !== 0) {
      return '₦0';
    }
    if (typeof priceValue === 'string' && priceValue.includes('₦')) {
      return priceValue;
    }
    const numericPrice = Number(priceValue);
    if (isNaN(numericPrice)) {
      return '₦0';
    }
    return `₦${numericPrice.toLocaleString()}`;
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-700" />
              </button>

              {/* Content */}
              <div className="grid md:grid-cols-2 gap-0 overflow-y-auto max-h-[90vh]">
                {/* Image Section */}
                <div className="relative h-96 md:h-full bg-gray-100">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.description}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute top-4 left-4 bg-green-700 text-white py-2 px-4 rounded-xl font-bold text-lg shadow-lg">
                    {formatPrice(product.price)}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 md:p-8 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {product.name}
                    </h2>

                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Description
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {product.description || 'High-quality solar street light with excellent durability and performance.'}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Product Features
                      </h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Energy Saving & Environmentally Friendly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>IP65 Water & Dust Resistance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Up to 10 Years Lifespan</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>Warranty Included</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                      <p className="text-green-800 font-semibold text-center">
                        💡 Limited Time Offer: Buy 10, Get 1 Free!
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddToCart}
                      className="w-full bg-green-800 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl"
                    >
                      <FiShoppingCart className="w-6 h-6" />
                      Add to Cart
                    </motion.button>

                    <button
                      onClick={onClose}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
