function guardarDatosYGenerarPDF() {
    const folio = document.getElementById('Folio').value;
    const fecha = document.getElementById('fecha').value;
    const suministro = document.getElementById('Suministro').value;
    const pc = document.getElementById('PC').value;
    const proyecto = document.getElementById('Proyecto').value;
    const actividad = document.getElementById('Actividad').value;
    const justificacion = document.getElementById('Justificacion').value;

    const items = Array.from(document.querySelectorAll('#itemsContainer .division')).map(division => ({
        cantidad: division.querySelector('.item-cantidad').value,
        unidad: division.querySelector('.item-unidad').value,
        descripcion: division.querySelector('.item-descripcion').value
    }));

    const datosSolicitud = {
        folio,
        fecha,
        suministro,
        pc,
        proyecto,
        actividad,
        justificacion,
        items
    };

    localStorage.setItem('datosSolicitud', JSON.stringify(datosSolicitud));
    window.location.href = 'tabla.html';
}

function agregarItem() {
    const itemsContainer = document.getElementById('itemsContainer');
    const newItem = document.createElement('div');
    newItem.classList.add('division');
    newItem.innerHTML = `
        <label class="labels">Cantidad:</label>
        <input type="number" class="item-cantidad" />
        <label class="labels">Unidad de medida:</label>
        <select class="item-unidad">
            <option value="">Seleccione la Unidad</option>
            <option value="Paquete">Paquete</option>
            <option value="Rollo">Rollo</option>
            <option value="Caja">Caja</option>
        </select>
        <label class="labels">Descripcion del bien solicitado:</label>
        <textarea class="inputs3 item-descripcion"></textarea>
    `;
    itemsContainer.appendChild(newItem);
}
