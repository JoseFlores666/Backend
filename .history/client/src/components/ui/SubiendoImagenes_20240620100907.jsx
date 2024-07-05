import { Container, Input, FormGroup } from 'reactstrap';
import React from 'react'

const SubiendoImagenes = (props
) => {
    const [imagen, setImagen] = useState("");
    const [loading, setLoading] = useState(false);

    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "Imagenes INNEGO")//nombre de tu carpeta donde se guardaran las imagenes(sitio web cloudinary.com )
        setLoading(true);
        const res = await fetch(
            "https://"
            )
    }

    return (<div>
        <Container style={{ textAlign: 'center' }}>
            <h1>Subiendo Imagenes</h1>
            <FormGroup>
                <Input type="file" name="file" placeholder="Sube tu imagen aqui" />
            </FormGroup>
        </Container>
    </div>);
}

export default SubiendoImagenes;