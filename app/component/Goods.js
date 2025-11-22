import Image from 'next/image'
import React from 'react'

const Goods = ({ 
  image, 
  description, 
  price, 
  name 
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

  return (
    <div className='relative'>
        <Image 
          src={image} 
          alt={description}
          width={400}
          height={300}
          className='h-[500px] lg:h-[300px] w-full rounded-4xl object-cover'
        />
        {/* Dark gradient overlay at the bottom */}
        <div className='absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/90 via-black/60 to-transparent rounded-b-4xl'></div>
        <p className='absolute top-5 right-6 bg-green-700 text-white py-1 px-2 rounded-2xl'>{formatPrice(price)}</p>
        <p className='absolute bottom-5 left-6 text-white text-2xl font-semibold z-10'>{name}</p>
    </div>
  )
}

export default Goods