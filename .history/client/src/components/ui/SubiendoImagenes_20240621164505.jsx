import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { Container, Input, FormGroup } from 'reactstrap';
import '../../css/SubiendoImagenes'
const SubiendoImagenes = (props) => {
    const [image, setImagen] = useState({ Array: {} });
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <Container style={{ textAlign: 'center', color: 'black' }}>
                <h1 className='text-center'> Sube tus imagenes aqui</h1>
                <Dropzone classname="dropzone"
                    // onDrop={}
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
