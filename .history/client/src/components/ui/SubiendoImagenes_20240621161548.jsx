import React, { useState } from 'react';

import { Container, Input, FormGroup } from 'reactstrap';

const SubiendoImagenes = () => {
    const [imagen, setImagen] = useState("");
    const [loading, setLoading] = useState(false);

    const uploadImage = async (e) => {
        const files = e.target.files;
        if (!files.length) return;

        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "Imagenes INNEGO"); // Update with your actual upload preset

        setLoading(true);

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dxmhlxdxo/upload", { // Update with your actual Cloudinary URL
                    method: "POST",
                    body: data,
                }
            );

            const file = await res.json();
            setImagen(file.secure_url); // Obtains the URL of the uploaded image
            console.log(file.secure_url);
        } catch (error) {
            console.error("Error uploading the image:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container style={{ textAlign: 'center' }}>
            <FormGroup>
                <Input 
                    type="file" 
                    name="file" 
                    placeholder="Sube tu imagen aquí" 
                    onChange={uploadImage} 
                />
                {loading ? (
                    <h3>Cargando Imagen...</h3>
                ) : (
                    imagen && <img src={imagen} alt="Uploaded" style={{ width: "200px", borderRadius: "7px", margin: '10px 0' }} />
                )}
            </FormGroup>
        </Container>
    );
};

export default SubiendoImagenes;
