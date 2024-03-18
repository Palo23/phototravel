import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import Head from 'next/head';
import moment from "moment";
import { PhotoDataTypes } from "../interfaces";
import autoAnimate from '@formkit/auto-animate'
import Link from "next/link";

const Photos = () => {
    const parent = useRef(null)
    const [allPhotos, setAllPhotos] = useState([]);
    const [query, setQuery] = useState('')

    const getPhotos = async (query: string) => {
        const response = await api.getPhotos(query);
        if (response) setAllPhotos(response);
    }

    const suscribeToPhotos = (query: string) => {
        const subscription = api.suscribeToPhotos((photo: PhotoDataTypes) => {
            if (photo.name.includes(query)) {
                setAllPhotos((prev) => [photo, ...prev]);
            }
        });
    
        return () => {
            subscription.unsubscribe();
        }
    }
    
    useEffect(() => {
        const unsubscribe = suscribeToPhotos(query);
        return unsubscribe;
    }, [query]);

    useEffect(()=>{
        suscribeToPhotos('');
        getPhotos('');
    }, []);

    useEffect(() => {
        getPhotos(query);
    }, [query]);

    useEffect(() => {
        parent.current && autoAnimate(parent.current)
      }, [parent])

    return (
        <>
            <Head>
                <title>Abby y Luis | Album de fotos</title>
                <meta name="description" content="Album de fotos de Abby y Luis" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="p-4">
                <h1 className="text-5xl font-bold text-center text-blue-900 py-5">Album de fotos</h1>
                <div className="flex justify-center items-center py-4">
                    <input 
                        type="text" 
                        className="w-full p-3 border border-cyan-900 text-cyan-900 rounded-lg" 
                        placeholder="Buscar por nombre" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" ref={parent}>
                    {allPhotos?.map((photo: any, index: number) => (
                        <Link key={index} className="relative group overflow-hidden" href={photo.url} target="_blank">
                            <img 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                                src={photo.url} 
                                alt={photo.name} 
                            />
                            <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-60 text-white text-sm transition-transform transform group-hover:-translate-y-4">
                                <p>{photo.name || "Anónimo"}</p>
                                <p>{moment(photo.created_at).format("DD/MM/YYYY")}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Photos;