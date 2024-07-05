import { Container, Input } from 'reactstrap';
import React from 'react'

const SubiendoImagenes = (props
) => {
    return (<div>
        <Container style={{textAlign:'center'}}>
            <h1>Subiendo Imagenes</h1>
            <FormGroup>
                <Input type="file" name="file" pla/>
            </FormGroup>
        </Container>
    </div>);

}

export default SubiendoImagenes;