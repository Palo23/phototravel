import { useEffect, useState } from "react";
import api from "../utils/api";
import Head from 'next/head';
import moment from "moment";

const Photos = () => {
    const [allPhotos, setAllPhotos] = useState([]);

    const getPhotos = async () => {
        const response = await api.getPhotos();

        console.log(response)

        if (response) {
            setAllPhotos(response);
        }
    }

    useEffect(() => {
        getPhotos();
    }, []);

    return (
        <>
            <Head>
                <title>Abby y Luis | Album de fotos</title>
                <meta name="description" content="Sube tus fotos" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="p-4">
                <h1 className="text-4xl mb-4">Album de fotos</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {allPhotos?.map((photo: any, index: number) => (
                        <div key={index} className="relative group overflow-hidden">
                            <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" src={photo.url} alt={photo.name} />
                            <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-60 text-white text-sm transition-transform transform group-hover:-translate-y-4">
                                <p>{photo.name || "Anónimo"}</p>
                                <p>{moment(photo.created_at).format("DD/MM/YYYY")}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Photos;