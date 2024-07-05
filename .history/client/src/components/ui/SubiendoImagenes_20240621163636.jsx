import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { Container, Input, FormGroup } from 'reactstrap';

const SubiendoImagenes = (props) => {
    const [imagen, setImagen] = useState({ Array: {} });
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <Container style={{ textAlign: 'center' }}>
                <Dropzone classname="dropzone"
                    // onDrop={}
                    onChange={(e) => setImage(e.target.value)}
                    value={image}>
                    {({ getRootProps, getInputProps }) => (
                        <section>
                            <div {...getRootProps({ className: "dropzone" })}>
                                <input {...getInputProps()} />
                                <span> <FontAwesomeIcon icon={faFolder} size="2x" /></span>
                                <p>Coloca tus imagenes aqui</p>
                            </div>
                        </section>
                    )}
                </Dropzone>
            </Container>
        </div >
    );
};

export default SubiendoImagenes;
