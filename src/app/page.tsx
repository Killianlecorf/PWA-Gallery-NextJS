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

interface User {
    id: string;
    name: string;
    password: string;
    pictures: Picture[];
  }
  

export default function Home() {
    const [files, setFiles] = useState<File[]>([]);
    const { isAuthenticated, loading } = useAuth();
    const [publicPictures, setPublicPictures] = useState<Picture[]>([])
    const [informationUser, setInformationUser] = useState<User>()

    useEffect(()=>{
        const getInformattionUser = async () => {
            try {
                const response = await fetchApi('/user/user','GET')
                const data = await response.data
                setInformationUser(data)
            } catch (error: any) {
                console.log('Erreur lors de la récuperation du user: ' + error);
            }
        }

        getInformattionUser()
    },[]) 
    
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

    useEffect(() => {
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
    

    const uploadFiles = async () => {
        if (files.length === 0) {
            console.error('No files to upload');
            return;
        }
    
        if (!informationUser) {
            console.error('User information is not available');
            return;
        }
    
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('image', file);
            });
    
            const response = await fetchApi(`/pictures/upload/${informationUser.id}`, 'POST', formData);
    
            if (response.ok) {
                console.log('Files uploaded successfully:', response.data);
                await displayPublicImages();
                setFiles([])
            } else {
                console.error('Upload error:', response.status, response.message, response.data);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
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
                {!files ? '' : <button className='StyleButton' onClick={uploadFiles}>Envoyer</button>}
                <div className="privateGalery">
                    <h2>Private galery</h2>
                </div>
            </div>
        )
        }
    }

    console.log(files);
    

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
                <div className='ImageContent'>
                    <div className="imageCenter">
                        {publicPictures.length > 0 ? (
                            publicPictures.map(picture => (
                                <ImageContent id={picture._id} url={picture.url} uploadDate={picture.uploadDate} />
                                
                            ))
                        ) : (
                            <p>Auncune photos publique n'est disponible.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </main>
  );
}