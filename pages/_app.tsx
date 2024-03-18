import React from 'react'
import { AppProps } from 'next/app'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/index.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='bg-zinc-100'>
      <Component {...pageProps} />
      <ToastContainer />
    </div>
  );
}

export default MyApp;