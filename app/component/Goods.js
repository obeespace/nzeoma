import Image from 'next/image'
import React from 'react'
import item1 from '../../public/landing picture.jpg'

const Goods = () => {
  return (
    <div className='relative'>
        <Image src={item1} alt="Sharp Items" className='h-[300px] rounded-4xl object-cover'/>
        {/* Dark gradient overlay at the bottom */}
        <div className='absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-black/90 via-black/60 to-transparent rounded-b-4xl'></div>
        <p className='absolute top-5 right-6 bg-green-700 text-white py-1 px-2 rounded-2xl'>N20,000</p>
        <p className='absolute bottom-5 left-6 text-white text-2xl font-semibold z-10'>2000 Watts Solar Street Light</p>
    </div>
  )
}

export default Goods