import Image from 'next/image';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { fileToBase64URL, resizeImage, uploadPicturoToImageKit } from '../utils/utils';
import Head from 'next/head';
import { BeatLoader, CircleLoader, ClimbingBoxLoader, RingLoader } from 'react-spinners';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { MdAddCircleOutline, MdDelete, MdOutlineFileUpload } from "react-icons/md";
import config from '../utils/config';
import api from '../utils/api';
import { FaExternalLinkAlt, FaLink } from 'react-icons/fa';
import Link from 'next/link';
import FloatingLink from '../components/floatingLink';

const swal = withReactContent(Swal)

const IndexPage = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any>([]);
  const [username, setUsername] = useState('');

  const removeImage = (index: number) => {
    swal.fire({
      title: '¿Estás seguro?',
      color: '#164e63',
      text: 'Esta imagen no será compartida si la quitas',
      icon: 'warning',
      iconColor: '#F39C12',
      showCancelButton: true,
      confirmButtonText: 'Sí, quiero quitarla',
      confirmButtonColor: '#374151',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#ef4444',
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
      }
    });
  }

  const handleFileChange = async (event: any) => {
    const files: FileList = event.target.files;
    if (files.length > 10) {
      toast.error('No puedes seleccionar más de 10 imágenes');
      return;
    }
    setLoading(true);
    for (const file of Array.from(files)) {
      const { type, name } = file;
      let _base64;
    
      try {
        _base64 = await fileToBase64URL(file);
      } catch (err) {
        setLoading(false);
        toast.error('Hubo un error al convertir la imagen a base64');
        return;
      }
    
      setSelectedImages(prevImages => [
        ...prevImages,
        {
          base64: _base64,
          type,
          name,
        },
      ]);
    }

    setLoading(false);
  };

  const onSubmit = async () => {
    setUploading(true);

    toast.warning('Compartiendo tus fotos, esto puede tardar un momento, por favor espera');

    for (const img of selectedImages) {
      try {
        const response: any = await uploadPicturoToImageKit(img.base64, img.type, img.name);

        const imageUrl = response;

        await api.postPhoto({
          url: imageUrl,
          name: username || 'Anónimo',
        });
      } catch (error) {
        toast.error('Error subiendo tus fotos, por favor intenta de nuevo');
        setUploading(false);
        return;
      }
    }

    toast.success('Se han subido correctamente, muchas gracias por compartir tus fotos con nosotros!');
    setSelectedImages([]);

    setUploading(false);
  };

  return (
    <>
    <Head>
      <title>Abby y Luis | Comparte tus fotos</title>
      <meta name="description" content="Sube tus fotos" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className='bg-zinc-100'>
      <FloatingLink href="/photos" text="Ver album de fotos" />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col justify-center items-center p-4 space-y-5">
          <p className="text-4xl font-bold text-center text-blue-900">
            Bienvenido
          </p>
          <p 
            className="text-xl font-medium text-center text-cyan-900"
          >
            Acá podrás compartir con nosotros los mejores momentos que capturaste en nuestra boda
          </p>
          <p className='text-xl font-medium text-center text-cyan-900'>
            También puedes ver las fotos que los demás han compartido, presionando <a href="/photos" className="text-blue-900">aquí</a>
          </p>
          <p
            className="text-lg font-medium text-center text-cyan-900"
          >
            Presiona el botón de abajo para seleccionar las fotos (Puedes agregar 10 fotos a la vez, si quieres subir más, repite el proceso)
          </p>
          <label htmlFor="file-upload" className="cursor-pointer bg-gray-700 font-semibold text-white py-4 px-4 rounded-lg text-center flex items-center justify-center">
            <MdAddCircleOutline className='text-[24px] mr-2' /> Agrega tus fotos
          </label>
          <input id="file-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>
        {
          loading ? (
            <div className="flex items-center justify-center p-8">
              <RingLoader color="#F39C12" />
            </div>
          ) : (
            <>
              <div className="flex flex-col px-5">
        {
          selectedImages?.length > 0 && (
            <div className="flex flex-col space-y-2">
              {
                !uploading && (
                  <div className="flex flex-col justify-center items-center space-y-5">
                    <input 
                      type="text" 
                      placeholder='Ingresa tu nombre para que podamos identificar tus fotos' 
                      className='w-full md:w-1/2 lg:w-1/3 p-4 border border-cyan-900 text-cyan-900 rounded-lg' 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <button 
                      className={`w-full cursor-pointer bg-gray-700 font-semibold text-white py-4 px-4 rounded-lg text-center flex items-center justify-center
                        ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `} 
                      disabled={uploading}
                      onClick={onSubmit}
                    >
                      <div className="flex items-center justify-center">
                        <MdOutlineFileUpload className="text-[24px] mr-4" /> Subir las fotos
                      </div>
                    </button>
                  </div>
                )
              }

              {
                !uploading && (
                  <p className="text-xl font-medium text-center text-cyan-900">
                    Si deseas quitar alguna foto puedes hacer click sobre ella o sobre el ícono del basurero
                  </p>
                )
              }
            </div>
          )
        }
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {
              uploading ? (
              <div className="flex justify-center items-center">
                <RingLoader color="#F39C12" />
              </div>)
            : (
              selectedImages.map((image, index) => (
                <div className="relative" key={index} onClick={() => removeImage(index)}>
                  <img
                    className="w-full h-full object-contain rounded-lg"
                    src={image?.base64}
                    alt={`Imagen ${index + 1}`}
                  />
                  <div
                    className="absolute top-1 right-1 text-red-500 text-[32px] cursor-pointer"
                  ><MdDelete /></div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex-flex-col pb-4 px-5">
        {
          selectedImages?.length > 0 && (
            <div className="flex flex-col space-y-2">
              <button 
              className={`w-full cursor-pointer bg-gray-700 font-semibold text-white py-4 px-4 rounded-lg text-center flex items-center justify-center
                ${uploading ? 'cursor-not-allowed' : 'cursor-pointer'}
              `} 
              disabled={uploading}
              onClick={onSubmit}>
                {
                  uploading ? (
                    <RingLoader color="#F39C12" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <MdOutlineFileUpload className='text-[24px] mr-4'/> Subir las fotos
                    </div>
                  )
                }
              </button>
            </div>
          )
        }
        </div>
            </>
          )
        } 
      </div>
    </div>
  </>
  );
};

export default IndexPage;
