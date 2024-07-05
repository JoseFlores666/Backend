import React, { useState } from 'react';
import Dropzone from 'react-dropzone';

import { Container, Input, FormGroup } from 'reactstrap';

const SubiendoImagenes = () => {
    const [imagen, setImagen] = useState({ Array: {} });
    const [loading, setLoading] = useState(false);

    return (
        <div>
            <Container style={{ textAlign: 'center' }}>
                <Dropzone classname="dropzone"
                    // onDrop={}
                    onChange={(e) => setImage(e.target.value)}
                    value={image}>
                        {({getRootProps,getInputPropos})}
                </Dropzone>
            </Container>
        </div >
    );
};

export default SubiendoImagenes;
