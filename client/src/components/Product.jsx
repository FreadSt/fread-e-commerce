import React, { useState } from 'react';

import { Link } from 'react-router-dom';

const Product = ({ image, id }) => {
  const [overlayIsShown, setOverlayIsShown] = useState(false);

  const imageUrl = `http://localhost:5000${image}`; // Добавляем базовый URL сервера

  return (
    <figure
      className='relative'
      onMouseEnter={() => {
        setOverlayIsShown(true);
      }}
      onMouseLeave={() => {
        setOverlayIsShown(false);
      }}
    >
      <img src={imageUrl} alt='' className='w-full h-[300px] object-cover' />
      {overlayIsShown && (
        <Link
          to={`/products/${id}`}
          className='cursor-pointer absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center'
        ></Link>
      )}
    </figure>
  );
};

export default Product;
