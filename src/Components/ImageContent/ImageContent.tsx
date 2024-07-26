import React from 'react';
import './_ImageContent.scss';

interface ImageContentProps {
    id: string;
    url: string;
    uploadDate: string; 
}

const ImageContent: React.FC<ImageContentProps> = ({ id, url, uploadDate }) => {
    const date = new Date(uploadDate)
    
    return (
        <div key={id} className="galleryItem">
            <img 
                src={`http://localhost:6053/${url}`} 
                alt={`Image ${id}`} 
                className="galleryImage"
            />
            <p>Uploaded on: {date.toLocaleDateString()}</p>

        </div>
    );
};

export default ImageContent;
