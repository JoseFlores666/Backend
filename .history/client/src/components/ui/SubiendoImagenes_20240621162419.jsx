import React, { useState } from 'react';
import Dropzone from 'react-dropzone';

import { Container, Input, FormGroup } from 'reactstrap';

const SubiendoImagenes = () => {
    // const [imagen, setImagen] = useState("");
    // const [loading, setLoading] = useState(false);

    return (
        <div>
            <Container style={{ textAlign: 'center' }}>
                <Dropzone classname="dropzone"
                    // onDrop={}
                    onChange={(e) => setImage(e.target.value)}
                    value={image}>
                </Dropzone>
            </Container>
        </div >
    );
};

export default SubiendoImagenes;
