import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createObjectURL, readFile } from './file-helpers';
import './ImageResizer.css';

const App = () => {
  const [resizedImage, setResizedImage] = useState(null);
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(200);

  const getFileExt = (type) => {
    if (type.includes('png')) return 'png';
    if (type.includes('jpg') || type.includes('jpeg')) return 'jpg';
  }

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log(file);
    const dataURL = await readFile(file);
    const image = new Image();
    image.src = dataURL;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = image.naturalWidth/2;
      canvas.height = image.naturalHeight/2;
      context.drawImage(image, 0, 0, image.naturalWidth/2, image.naturalHeight/2);
      const resizedDataURL = canvas.toDataURL(file.type);
      const byteString = atob(resizedDataURL.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      const resizedBlob = new Blob([ab], { type: file.type });
      const size = resizedBlob.size / 1024 ;
      setResizedImage({ dataURL: resizedDataURL, name: file.name, size });
    };
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="image-resizer-container">
      <div {...getRootProps()} className="dropzone-container">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        
      </div>
      <div className="controls-container">
        <label>Width:</label>
        <input
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
        />
        <label>Height:</label>
        <input
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />
      </div>
      {resizedImage && (
        <div className="resized-image">
          <img src={resizedImage.dataURL} alt="Resized Image" />
          <p>Size: {resizedImage.size.toFixed(2)} KB</p>
          <a
            href={resizedImage.dataURL}
            download={resizedImage.name}
            className="download-button"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
};

export default App;
