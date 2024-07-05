import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Dropzone from 'react-dropzone';
import { Container } from 'reactstrap';
import '../../css/SubiendoImagenes.css';
import axios from 'axios';

const SubiendoImagenes = forwardRef((props, ref) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDrop = (acceptedFiles) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  useImperativeHandle(ref, () => ({
    uploadImages: async () => {
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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
        {files.length <= 0
          ? <h3>No hay imagenes</h3>
          : files.map((file, index) => (
            <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
              <img
                alt='Imagen'
                style={{ width: '150px', height: 'auto', objectFit: 'cover', marginTop: "15px" }}
                src={URL.createObjectURL(file)}
              />
              <button
                onClick={() => removeFile(file)}
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
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
