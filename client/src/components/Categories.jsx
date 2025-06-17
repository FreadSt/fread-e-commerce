import React from 'react';
import shoes from '../assets/images/shoes.jpg';
import phone from '../assets/images/iphone.jpg';
import clothes from '../assets/images/clothes.jpg';
import furniture from '../assets/images/furniture.jpg';
import toys from '../assets/images/toys.jpg';

import Categorie from './Categorie';

const Categories = () => {
  return (
    <section className='p-8' id='categories'>
      <div className='grid gap-2 md:grid-cols-3 mb-2'>
        <Categorie name='man' image={clothes} />
        <Categorie name='shoes' image={shoes} />
        <Categorie name='pants' image={phone} />
      </div>
      <div className='grid gap-2 md:grid-cols-2'>
        <Categorie name='woman' image={furniture} />
        <Categorie name='sport' image={toys} />
      </div>
    </section>
  );
};

export default Categories;
