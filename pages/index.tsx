import Image from 'next/image';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { fileToBase64URL, resizeImage, uploadPicturoToImageKit } from '../utils/utils';
import Head from 'next/head';

const IndexPage = () => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any>([]);

  const removeImage = (index: number) => {
    setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
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

    toast.warning('Subiendo tus fotos, esto puede tardar un momento, por favor espera');

    for (const img of selectedImages) {
      try {
        const response = await uploadPicturoToImageKit(img.base64, img.type, img.name);
      } catch (error) {
        toast.error('Error subiendo tus fotos, por favor intenta de nuevo');
        setUploading(false);
        return;
      }
    }

    toast.success('Tus fotos han sido subidas correctamente, muchas gracias por compartir tus fotos con nosotros!');
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
    <div className=''>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col justify-center items-center p-4 space-y-2">
          <p className="text-4xl font-bold text-center">
            Bienvenido a la página de subida de fotos
          </p>
          <p 
            className="text-xl font-light text-center"
          >
            Acá podrás compartir con nosotros los mejores momentos que captaste en nuestra boda
          </p>
          <p
            className="text-lg font-light text-center"
          >
            Presiona el botón de abajo para seleccionar tus fotos, de ser posible, selecciona fotos de 10 en 10 para no ralentizar el proceso de carga
          </p>
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded text-center">
            Selecciona acá tus fotos
          </label>
          <input id="file-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </div>
        <div className="flex flex-col px-5">
        {
          !uploading && !loading && selectedImages?.length > 0 && (
            <button className="w-full p-4 text-center mb-4 border rounded-lg bg-blue-400 text-white" onClick={onSubmit}>
              Subir las fotos
            </button>
          )
        }
        {
          !uploading && !loading && selectedImages?.length > 0 && (
            <p className="text-lg text-center text-gray-500">
              Puedes eliminar las fotos que no quieras subir haciendo click sobre ellas o sobre el ícono del basurero
            </p>
          )
        }
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {selectedImages.map((image, index) => (
              <div className="relative" key={index} onClick={() => removeImage(index)}>
                <img
                  className="w-full h-full object-contain rounded-lg"
                  src={image?.base64}
                  alt={`Imagen ${index + 1}`}
                />
                <span
                  className="absolute material-icons top-1 right-1 text-red-500 text-[32px] cursor-pointer"
                >delete</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-flex-col pb-4 px-5">
        {
          !uploading && !loading && selectedImages?.length > 0 && (
            <button className="w-full p-4 text-center mb-4 border rounded-lg bg-blue-400 text-white" onClick={onSubmit}>
              Subir las fotos
            </button>
          )
        }
        </div>
      </div>
    </div>
  </>
  );
};

export default IndexPage;
