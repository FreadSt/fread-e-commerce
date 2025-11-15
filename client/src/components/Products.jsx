import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Product from './Product';

const Products = ({ category, filter }) => {
  const [products, setProducts] = useState([]);
  const [data, setData] = useState([]); // Отдельное состояние для сырых данных

  // Мемоизация функции getProducts с useCallback
  const getProducts = useCallback(async () => {
    try {
      const url = category
        ? `http://localhost:5000/api/products?category=${encodeURIComponent(category)}`
        : 'http://localhost:5000/api/products';

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const fetchedData = await res.json();
      setData(fetchedData); // Обновляем сырые данные
    } catch (err) {
      console.error('Product fetch error:', err);
      setData([]); // Устанавливаем пустой массив при ошибке
    }
  }, [category]); // Зависимость: category (изменяет URL)

  // Мемоизация фильтрации с useMemo
  const filteredProducts = useMemo(() => {
    let filtered = data || [];

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        filtered = filtered.filter((item) =>
          item[key]?.toString().includes(value)
        );
      });
    }

    return filtered;
  }, [data, filter]); // Зависимости: data и filter

  // useEffect для вызова getProducts при изменении category
  useEffect(() => {
    let isMounted = true;

    getProducts();

    return () => {
      isMounted = false;
    };
  }, [getProducts]);

  // Обновляем products после фильтрации
  useEffect(() => {
    setProducts(filteredProducts);
  }, [filteredProducts]);

  return (
    <section className="pb-8 px-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" id="products">
      {products.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">No products found.</p>
      ) : (
        products.map((product) => (
          <Product key={product._id} image={product.image} id={product._id} />
        ))
      )}
    </section>
  );
};

export default Products;
