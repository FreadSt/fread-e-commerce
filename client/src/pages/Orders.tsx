import React from 'react';
import {useNavigate} from "react-router-dom";
import img from '../assets/images/e-commerce.webp'

const Orders: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main
        className='min-h-screen relative flex flex-col justify-center items-center '
        style={{backgroundImage: `url(${img})`, backgroundSize: 'cover'}}
    >
      <article className='border gap-6 bg-white p-6 flex flex-col min-w-[200px] max-h-[300px] sm:min-w-[22rem] md:min-w-[25rem] overflow-visible'>
        <h3 className='font-bold text-3xl align-middle self-center'>Success</h3>
        <p>Thank you for purchase, we will send shipment info immediatelly</p>
        <button
          onClick={() => navigate('/')}
          className='text-sm lg:text-md cursor-pointer uppercase block p-4 border-2 hover:text-black hover:border-black hover:bg-white bg-black text-white transition ease-out duration-500 disabled:bg-gray-400 disabled:cursor-not-allowed'
        >
          Return home
        </button>
      </article>
    </main>
  )
};

export default Orders;
