import { Container, Input, FormGroup } from 'reactstrap';
import React, { useState } from 'react'

const SubiendoImagenes = (props
) => {
    const [imagen, setImagen] = useState("");
    const [loading, setLoading] = useState(false);

    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "Imagenes INNEGO")//Imagenes INNEGO es el nombre de tu carpeta donde se guardaran las imagenes(sitio web cloudinary.com )
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
    }

    return (<div>
        <Container style={{ textAlign: 'center' }}>

            <FormGroup>
                <Input type="file" name="file" placeholder="Sube tu imagen aqui" onChange={uploadImage} />
                {loading ? (<h3>Cargando Imagenes...</h3>) : <img src={imagen} style={{ width: "200px", borderRadius: "7px", margin: '10px 0' }} />}
            </FormGroup>
        </Container>
    </div>);
}

export default SubiendoImagenes;