import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Container, Input, FormGroup } from 'reactstrap';
import '../../css/SubiendoImagenes.css'
const SubiendoImagenes = (props) => {
    const [image, setImagen] = useState({ Array: {} });
    const [loading, setLoading] = useState(false);

    const handleDrop= (files) =>{
        const uploaders = files.map((file) =>{
            const formData= new FormData();
            formData.append("file",file)
            formData.append("tags",`codeinfuse,medium,gist`);
            formData.append("upload_preset",Imagenes INNEGO")
        })
    }
    return (
        <div>
            <Container style={{ textAlign: 'center', color: 'black' }}>
                <h1 className='text-center'> Sube tus imagenes aqui</h1>
                <Dropzone classname="dropzone"
                    onDrop={handleDrop}
                    onChange={(e) => setImage(e.target.value)}
                    value={image}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps({ className: "dropzone" })}>
                                <input {...getInputProps()} />
                                <span>
                                    📁
                                </span>
                                <p>Coloca tus imagenes aqui,O clickea para selectionar</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </Container>
        </div >
    );
};

export default SubiendoImagenes;
