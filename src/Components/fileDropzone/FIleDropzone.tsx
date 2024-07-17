import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onDrop }) => {
  const onDropCallback = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: '2px dashed #0070f3',
        borderRadius: '10px',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: isDragActive ? '#e6f7ff' : '#fafafa',
        transition: 'background-color 0.3s ease',
      }}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Déposez les fichiers ici...</p>
      ) : (
        <p>Glissez et déposez des fichiers ici, ou cliquez pour sélectionner des fichiers</p>
      )}
    </div>
  );
};

export default FileDropzone;