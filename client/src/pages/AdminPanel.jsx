import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { publicRequest } from '../request-methods';
import Navbar from '../layout/Navbar';
import Announcement from '../layout/Announcement';
import Footer from '../layout/Footer';

export const AdminPanel = () => {
  const user = useSelector((store) => store.auth);
  const [product, setProduct] = useState({
    title: '',
    description: '',
    image: '',
    categories: [],
    size: [],
    color: [],
    price: '',
    inStock: true,
  });
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (e, field) => {
    const { value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [field]: value.split(',').map((item) => item.trim()),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', product.title);
    formData.append('description', product.description);
    formData.append('categories', JSON.stringify(product.categories));
    formData.append('size', JSON.stringify(product.size));
    formData.append('color', JSON.stringify(product.color));
    formData.append('price', product.price);
    formData.append('inStock', product.inStock);

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Product creation failed');
      }

      await response.json();
      setMessage('Product added successfully!');
      setTimeout(() => setMessage(''), 3000);
      setProduct({
        title: '',
        description: '',
        image: '',
        categories: [],
        size: [],
        color: [],
        price: '',
        inStock: true,
      });
      setImageFile(null);
    } catch (error) {
      setMessage('Error adding product: ' + error.message);
    }
  };

  if (!user.currentUser || !user.currentUser.isAdmin) return null; // Дополнительная проверка на клиенте

  return (
    <>
      <Announcement />
      <Navbar />
      <section className='p-8 relative'>
        {message &&
          <div className="lg:w-[250px] lg:h-[45px] fixed top-12 justify-center bg-teal-700 border-2 text-white px-4 py-2 rounded shadow z-50 animate-fade-in">
            {message}
          </div>
        }
        <h1 className='text-3xl mb-4'>Admin Panel</h1>
        <form onSubmit={handleSubmit}
              className="grid grid-cols-1 lg:grid-cols-3 lg:min-w-fit md:grid-cols-2 gap-4 max-w-4xl">
          <div className='mb-4'>
            <label className='block mb-2'>Title</label>
            <input
              type='text'
              name='title'
              value={product.title}
              onChange={handleInputChange}
              className='w-full p-2 border'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Description</label>
            <input
              type='text'
              name='description'
              value={product.description}
              onChange={handleInputChange}
              className='w-full p-2 border'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Upload Image</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full p-2 border'
            />
            {product.image && <img src={product.image} alt='Preview' className='mt-2 w-32 h-auto'/>}
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Categories (comma-separated)</label>
            <input
              type='text'
              value={product.categories.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'categories')}
              className='w-full p-2 border'
              placeholder='e.g., shoes, man, casual'
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Sizes (comma-separated)</label>
            <input
              type='text'
              value={product.size.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'size')}
              className='w-full p-2 border'
              placeholder='e.g., s, m, l'
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Colors (comma-separated)</label>
            <input
              type='text'
              value={product.color.join(', ')}
              onChange={(e) => handleArrayInputChange(e, 'color')}
              className='w-full p-2 border'
              placeholder='e.g., black, white'
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>Price</label>
            <input
              type='number'
              name='price'
              value={product.price}
              onChange={handleInputChange}
              className='w-full p-2 border'
              required
            />
          </div>
          <div className='mb-4'>
            <label className='block mb-2'>In Stock</label>
            <input
              type='checkbox'
              name='inStock'
              checked={product.inStock}
              onChange={(e) => setProduct((prev) => ({...prev, inStock: e.target.checked}))}
            />
          </div>
          <button
            type='submit'
            className='bg-teal-700 text-white p-2 rounded hover:bg-teal-800 h-12'
          >
            Add Product
          </button>
          {message && <p className='mt-4'>{message}</p>}
        </form>
      </section>
      <Footer/>
    </>
  );
};
