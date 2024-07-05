import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Dropzone from 'react-dropzone';
import { Container } from 'reactstrap';
import '../../css/SubiendoImagenes.css';
import axios from 'axios'

const SubiendoImagenes = forwardRef((props, ref) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
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
      <h3>
        {files.length <= 0
          ? "No hay imagenes"
          : files.map((file, index) => (
            <img
              alt='Imagen'
              key={index}
              style={{ width: "125px", height: "70px", backgroundSize: "cover", paddingRight: "15px" }}
              src={URL.createObjectURL(file)}
            />
          ))
        }
      </h3>
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
