'use client';
import Cookies from 'js-cookie';
import Link from 'next/link';
import './index.scss'
import { useEffect, useState } from 'react';
import FileDropzone from '@/Components/fileDropzone/FIleDropzone';
import useAuth from '@/hooks/useAuth';
import fetchApi from '@/utils/fetchApi';
import ImageContent from '@/Components/ImageContent/ImageContent';

interface Picture {
    _id: string;
    url: string;
    public: boolean;
    user: string;
    uploadDate: string;
}

export default function Home() {
    const [files, setFiles] = useState<File[]>([]);
    const { isAuthenticated, loading } = useAuth();
    const [publicPictures, setPublicPictures] = useState<Picture[]>([])

    useEffect(() => {
        const displayPublicImages = async () => {
            try {
                const response = await fetchApi('/pictures', 'GET');
                console.log('Response:', response);
                
                if (response.ok && response.data) {
                    const data: Picture[] = response.data;
                    setPublicPictures(data);
                    console.log("Public images fetched successfully.");
                } else {
                    throw new Error(response.message || 'Unknown error');
                }
                
            } catch (error: any) {
                console.log('Erreur lors de la récupération des images publiques : ' + error.message);
            }
        };

        displayPublicImages();
    }, []);


    const handleLogOut = async () => {
        try {
            const response = await fetchApi('/user/logout', 'POST');
            if (response.ok) {
            console.log('Déconnexion réussie');
            window.location.reload();
            } else {
            console.error('Erreur lors de la déconnexion:', response.message);
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion : ', error);
        }
    }

    const displayButtonConnexion = () => {
        
        if (!isAuthenticated) {
        return (
            <div className='displayConnexionButton'>
            <Link href='/login'>
                <button className='StyleButton'>Login</button>
            </Link>
            <Link href='/register'>
                <button className='StyleButton'>Register</button>
            </Link>
            </div>
        )
        }

        return (
            <div className='displayConnexionButton'>
                <button>Supprimer son compte</button>
                <button onClick={handleLogOut}>Se déconnecter</button>
            </div>
        );
    }

    const handleDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    };
     
    const displayDropzone = () => {
        if (isAuthenticated) {
        return (
            <div className='dragDropContent'>
            <h1>Système de Drag & Drop de Fichiers</h1>
            <FileDropzone onDrop={handleDrop} />
                <div style={{ marginTop: '20px' }}>
                    <h2>Fichiers téléchargés :</h2>
                    <ul>
                    {files.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))}
                    </ul>
                </div>
                {!files ? '' : <button className='StyleButton'>Envoyer</button>}
                <div className="privateGalery">
                    <h2>Private galery</h2>
                </div>
            </div>
        )
        }
    }

    console.log(publicPictures);

    if (loading) {
        return <div>Chargement...</div>;
    }

  return (
    <main className='mainPage'>
        {displayButtonConnexion()}
        <h1>Galery Picture</h1>
        <div className="allGalery">
            {displayDropzone()}
            <div className="publicGalery">
                <h2>Public galery</h2>
                {publicPictures.length > 0 ? (
                    publicPictures.map(picture => (
                        <ImageContent id={picture._id} url={picture.url} uploadDate={picture.uploadDate} />
                    ))
                ) : (
                    <p>Auncune photos publique n'est disponible.</p>
                )}
            </div>
        </div>
    </main>
  );
}