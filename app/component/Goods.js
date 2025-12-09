import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiEye } from 'react-icons/fi'

const Goods = ({ 
  image, 
  description, 
  price, 
  name,
  _id,
  id,
  onAddToCart,
  onViewDetails
}) => {
  // Format price to display with Naira symbol and commas
  const formatPrice = (priceValue) => {
    if (!priceValue && priceValue !== 0) {
      return '₦0'; // Handle undefined/null/empty values
    }
    if (typeof priceValue === 'string' && priceValue.includes('₦')) {
      return priceValue; // Already formatted
    }
    const numericPrice = Number(priceValue);
    if (isNaN(numericPrice)) {
      return '₦0'; // Handle invalid numbers
    }
    return `₦${numericPrice.toLocaleString()}`;
  };

  const productId = _id || id;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className='relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300'
    >
        <div 
          onClick={() => onViewDetails && onViewDetails({ _id: productId, id: productId, image, description, price, name })}
          className='cursor-pointer relative'
        >
          <Image 
            src={image} 
            alt={description}
            width={400}
            height={300}
            className='h-[500px] lg:h-[300px] w-full object-cover'
          />
          {/* Dark gradient overlay at the bottom */}
          <div className='absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/90 via-black/60 to-transparent'></div>
          <p className='absolute top-5 right-6 bg-green-700 text-white py-2 px-3 rounded-xl font-semibold shadow-lg'>{formatPrice(price)}</p>
          <p className='absolute bottom-5 left-6 text-white text-xl lg:text-2xl font-semibold z-10 pr-4'>{name}</p>
          
          {/* View Details Badge */}
          <div className='absolute top-5 left-6 bg-white/90 backdrop-blur-sm text-gray-800 py-1.5 px-3 rounded-lg flex items-center gap-2 text-sm font-medium'>
            <FiEye className="w-4 h-4" />
            <span>View Details</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className='p-4'>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart && onAddToCart({ _id: productId, id: productId, image, description, price, name })}
            className='w-full bg-green-800 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg'
          >
            <FiShoppingCart className="w-5 h-5" />
            Add to Cart
          </motion.button>
        </div>
    </motion.div>
  )
}

export default Goods