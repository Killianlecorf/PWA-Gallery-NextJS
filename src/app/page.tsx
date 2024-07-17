'use client';
import Cookies from 'js-cookie';
import Link from 'next/link';
import './index.scss'
import { useState } from 'react';
import FileDropzone from '@/Components/fileDropzone/FIleDropzone';
import useAuth from '@/hooks/useAuth';
import fetchApi from '@/utils/fetchApi';

export default function Home() {
    const [files, setFiles] = useState<File[]>([]);
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Chargement...</div>;
    }

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

  return (
    <main className='mainPage'>
        {displayButtonConnexion()}
        <h1>Galery Picture</h1>
        <div className="allGalery">
            {displayDropzone()}
            <div className="publicGalery">
                <h2>Public galery</h2>
            </div>
        </div>
    </main>
  );
}