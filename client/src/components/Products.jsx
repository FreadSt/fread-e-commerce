import React, { useEffect, useState } from 'react';

import { publicRequest } from '../request-methods';

import Product from './Product';

const Products = ({ category, filter }) => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const url = category ? `/products?category=${category}` : '/products';
      console.log('Request URL:', url); // Логируем URL
      const response = await publicRequest.get(url);
      console.log('Response data:', response.data); // Логируем данные
      setProducts(response.data || []);
    } catch (error) {
      setProducts([]); // Устанавливаем пустой массив при ошибке
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    getProducts();
  }, [category]);

  return (
    <section
      className='pb-8 mx-8 grid gap-2 md:grid-cols-2 lg:grid-cols-4'
      id='products'
    >
      {products.map((product) => (
        <Product key={product._id} image={product.image} id={product._id} />
      ))}
    </section>
  );
};

export default Products;
