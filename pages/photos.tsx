import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import Head from 'next/head';
import moment from "moment";
import { PhotoDataTypes } from "../interfaces";
import autoAnimate from '@formkit/auto-animate'
import Link from "next/link";
import ReactPaginate from 'react-paginate';
import ScrollToTopButton from "../components/scrollToTop";
import FloatingLink from "../components/floatingLink";

const Photos = () => {
    const parent = useRef(null)
    const [allPhotos, setAllPhotos] = useState([]);
    const [query, setQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const PER_PAGE = 20;

    const [currentPage, setCurrentPage] = useState(0);

    function handlePageClick({ selected: selectedPage }) {
        setCurrentPage(selectedPage);
    }

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
        setCurrentPage(0);
        const unsubscribe = suscribeToPhotos(query);
        return unsubscribe;
    }, [query]);

    useEffect(()=>{
        suscribeToPhotos('');
        getPhotos('');
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
    
        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    useEffect(() => {
        setCurrentPage(0);
        getPhotos(debouncedQuery);
    }, [debouncedQuery]);

    useEffect(() => {
        parent.current && autoAnimate(parent.current)
      }, [parent])
      
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(({ top: 0, behavior: 'smooth' }));
        }, 500);
    }, [currentPage]);

    const offset = currentPage * PER_PAGE;

    const currentPageData = allPhotos.slice(offset, offset + PER_PAGE).map((photo: any, index: number) => (
        <Link key={index} className="relative group overflow-hidden" href={photo.url} target="_blank">
            <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" src={photo.url} alt={photo.name} />
            <div className="absolute bottom-0 left-0 w-full p-2 bg-black bg-opacity-60 text-white text-sm transition-transform transform group-hover:-translate-y-4">
                <p>{photo.name || "Anónimo"}</p>
                <p>{photo.travel_name || "Desconocido"}</p>
                <p>{moment(photo.created_at).format("DD/MM/YYYY")}</p>
            </div>
        </Link>
    ));

    const pageCount = Math.ceil(allPhotos.length / PER_PAGE);

    return (
        <>
            <Head>
                <title>Viajes familiares | Álbum de fotos</title>
                <meta name="description" content="Álbum de fotos de Viajes familiares" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <FloatingLink href="/" text="Ir a compartir fotos" />
            <div className="p-4">
                <h1 className="text-5xl font-bold text-center text-green-700 py-5">Álbum de fotos</h1>
                <div className="flex justify-center items-center py-4">
                    <input 
                        type="text" 
                        className="w-full p-3 border border-cyan-900 text-amber-950 rounded-lg" 
                        placeholder="Buscar por nombre" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" ref={parent}>
                    {currentPageData}
                </div>
                <ReactPaginate
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    previousLabel={"<"}
                    nextLabel={">"}
                    containerClassName={"flex justify-center my-8"}
                    pageLinkClassName={"mx-1 px-4 py-2 bg-green-800 font-semibold text-white rounded"}
                    previousLinkClassName={"mx-1 px-4 py-2 bg-green-800 font-semibold text-white rounded"}
                    nextLinkClassName={"mx-1 px-4 py-2 bg-green-800 font-semibold text-white rounded"}
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                    activeClassName={"font-bold"}
                    activeLinkClassName={"bg-green-800 opacity-50"} 
                    pageRangeDisplayed={2}
                    marginPagesDisplayed={0}
                />
            </div>

            <ScrollToTopButton />
        </>
    );
}

export default Photos;