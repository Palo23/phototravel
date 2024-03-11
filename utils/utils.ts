import axios from 'axios';
import imageCompression from "browser-image-compression"
import { toast } from 'react-toastify'
import ImageKit from "imagekit-javascript";
import { ImageKitOptions } from 'imagekit-javascript/dist/src/interfaces';

async function resizeImage(file: any) {
  const options = {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
  }
  try {
      const compressedFile = await imageCompression(file, options)
      console.log('compressedFile instanceof Blob', compressedFile) // true
      return compressedFile
  } catch (error) {
      console.error(error)
      return file
  }
}

const fileToBase64URL = async (file: any) => {
  const maxFileSize = 8
  const maxCompressionSize = 1.5

  const _imageSize = file.size / 1024 / 1024

  if (_imageSize > maxFileSize) {
      toast.error(
          'La imagen excede los 4MB de tamaño, por favor selecciona una imagen más pequeña'
      )
      return Promise.reject('Imagen demasiado grande')
  }

  const _compresedFile = await compressImage(file)
  const _compresedFileSize = _compresedFile.size / 1024 / 1024

  if (_compresedFileSize > maxCompressionSize) {
      toast.error(`El tamaño de la imagen no puede ser mayor a ${maxFileSize}MB`)
      return Promise.reject('Imagen demasiado grande')
  }

  return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(_compresedFile)
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject('Error al convertir la imagen')
  })
}

const uploadPicturoToImageKit = async (base64file: any, type: any, name: string, path = '') => {
  const imagekit = new ImageKit({
      publicKey: 'public_FH4kJNCOJBLs9SN7e5WY+HGO43c=',
      urlEndpoint: 'https://ik.imagekit.io/gpf4b6oyooa',
      authenticationEndpoint: 'https://photoapi-three.vercel.app/imagekitsignature',
  } as ImageKitOptions);

  const fileKey = `${path?.length > 0 ? `${path}/` : ''}${new Date()
      .getTime()
      .toString()}`

  return await axios.get('https://photoapi-three.vercel.app/imagekitsignature').then(async (response) => {
          const data = response.data

           return new Promise((resolve, reject) => {
              imagekit
                  .upload({
                      file: base64file,
                      fileName: fileKey,
                      signature: data.signature,
                      expire: data.expire,
                      token: data.token,
                      folder: '/Wedding',
                  })
                  .then((response) => {
                      resolve(response.url)
                  })
                  .catch((error) => {
                      reject(error)
                  })
              })
          }).catch((error) => {
              return '/images/placeholder.png';
          });
}

async function compressImage(file: any) {
  const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
  }
  try {
      const compressedFile = await imageCompression(file, options)

      return compressedFile
  } catch (error) {
      console.error(error)
      return file
  }
}

export { resizeImage, fileToBase64URL, uploadPicturoToImageKit }