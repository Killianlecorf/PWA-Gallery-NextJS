'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import './index.scss';
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

type PicturesByMonth = {
    [month: string]: Picture[];
};

interface User {
    id: string;
    name: string;
    password: string;
    pictures: Picture[];
}

export default function Home() {
    const [files, setFiles] = useState<File[]>([]);
    const { isAuthenticated, loading } = useAuth();
    const [publicPictures, setPublicPictures] = useState<PicturesByMonth>({});
    const [informationUser, setInformationUser] = useState<User>();

    useEffect(() => {
        const getInformationUser = async () => {
            try {
                const response = await fetchApi('/user/user', 'GET');
                const data = await response.data;
                setInformationUser(data);
            } catch (error: any) {
                console.log('Erreur lors de la récupération de l\'utilisateur: ' + error);
            }
        }

        getInformationUser();
    }, []);

    const displayPublicImages = async () => {
        try {
            const response = await fetchApi('/pictures', 'GET');
            console.log('Response:', response);

            if (response.ok && response.data) {
                const data: PicturesByMonth = response.data;
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

    const deleteUser = async () => {
        try {
            const response = await fetchApi(`/user/${informationUser?.id}`, "DELETE");
            if (response.ok) {
                window.location.reload();
            }
        } catch (error: any) {
            console.log("Erreur lors de la suppression de l'utilisateur: " + error);
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
                <button onClick={deleteUser}>Supprimer son compte</button>
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
                window.location.reload();
                setFiles([]);
            } else {
                console.error('Upload error:', response.status, response.message, response.data);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleDeleteImage = async (pictureId: string) => {
        try {
            const response = await fetchApi(`/pictures/${pictureId}`, 'DELETE');
            if (response.ok) {
                console.log('Image successfully deleted');
                window.location.reload();
            } else {
                throw new Error(response.message || 'Erreur inconnue');
            }
        } catch (error: any) {
            console.error('Erreur lors de la suppression de l\'image privée : ' + error.message);
        }
    }

    const handleChangeImage = async (pictureId: string) => {
        try {
            const response = await fetchApi(`/pictures/visibility/${pictureId}`, 'PUT');
            if (response.ok) {
                console.log('Image successfully change visibility');
                window.location.reload();
            } else {
                throw new Error(response.message || 'Erreur inconnue');
            }
        } catch (error: any) {
            console.error('Erreur lors du changelent de l\'image privée : ' + error.message);
        }
    }


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
                        <h2>Galerie Privée</h2>
                        <div className='ImageContent'>
                            <div className="imageCenter">
                                {informationUser?.pictures && informationUser?.pictures.length > 0 ? (
                                    informationUser.pictures.map(picture => (
                                        <div className='privateImage' key={picture._id}>
                                            <ImageContent id={picture._id} url={picture.url} uploadDate={picture.uploadDate} />
                                            <button className='StyleButton' onClick={() => handleDeleteImage(picture._id)}>Supprimer l'image</button>
                                            <button className='StyleButton' onClick={() => handleChangeImage(picture._id)}>Modifier la visibilité</button>
                                        </div>
                                    ))
                                ) : (
                                    <p>Aucune photo privée n'est disponible.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <main className='mainPage'>
            {displayButtonConnexion()}
            <h1>Galerie</h1>
            <div className="allGalery">
                {displayDropzone()}
                <div className="publicGalery">
                    <h2>Galerie Publique</h2>
                    <div className='ImageContent'>
                        {Object.keys(publicPictures).length > 0 ? (
                            Object.keys(publicPictures).map(month => (
                                <div key={month}>
                                    <h3>{month}</h3>
                                    <div className='ImageContent'>
                                        <div className="imageCenter">
                                            {publicPictures[month].map(picture => (
                                                <ImageContent id={picture._id} url={picture.url} uploadDate={picture.uploadDate} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Aucune photo publique n'est disponible.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
