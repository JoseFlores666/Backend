import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Dropzone from 'react-dropzone';
import { Container } from 'reactstrap';
import '../../css/SubiendoImagenes.css';
import axios from 'axios';

const SubiendoImagenes = forwardRef((props, ref) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  useImperativeHandle(ref, () => ({
    uploadImages: async () => {
      if (files.length === 0) {
        setError('No hay imágenes para subir');
        return []; // Retorna un array vacío si no hay imágenes
      }

      const uploadedURLs = [];
      const uploaders = files.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("tags", `codeinfuse,medium,gist`);
        formData.append("upload_preset", "Imagenes INNEGO");
        formData.append("api_key", "611133767965517");
        formData.append("timestamp", Math.floor(Date.now() / 1000));

        setLoading(true);
        return axios.post("https://api.cloudinary.com/v1_1/dxmhlxdxo/image/upload", formData, {
          headers: { "X-Requested-With": "XMLHttpRequest" }
        }).then((response) => {
          const data = response.data;
          const fileURL = data.secure_url;
          uploadedURLs.push(fileURL);
        }).catch(error => {
          setError(`Error al subir archivo: ${error.message}`);
        });
      });

      await axios.all(uploaders);
      setLoading(false);
      return uploadedURLs;
    }
  }));

  const imagenPreview = () => {
    if (loading) {
      return <h3>Cargando Imagenes...</h3>;
    }
    return (
      <div className="image-preview-container">
        {files.length <= 0
          ? <h3>No hay imagenes</h3>
          : files.map((file, index) => (
            <div key={index} className="image-container">
              <img
                alt='Imagen'
                className="preview-image"
                src={URL.createObjectURL(file)}
              />
              <button
                onClick={() => removeFile(file)}
                className="remove-button"
              >
                &times;
              </button>
            </div>
          ))
        }
      </div>
    );
  };

  return (
    <div>
      <Container style={{ textAlign: 'center', color: 'black' }}>
        <h1 className='text-center'>Sube tus imagenes aqui</h1>
        {error && <div className="error-message">{error}</div>}
        <Dropzone onDrop={handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <span>📁</span>
                <p>Coloca tus imagenes aqui, o clickea para seleccionar</p>
              </div>
            </section>
          )}
        </Dropzone>
        {imagenPreview()}
      </Container>
    </div>
  );
});

export default SubiendoImagenes;
