export const SolicitudPage = () => {
  const formRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [items, setItems] = useState([{ cantidad: '', unidad: '', descripcion: '' }]);

  const handleGuardarCambios = (event) => {
    event.preventDefault(); 
  
    const formData = new FormData(formRef.current);
    const data = {
      folio: formData.get('Folio'),
      areaSolicitante: '', 
      fecha: selectedDate,
      tipoSuministro: formData.get('Suministro'),
      procesoClave: formData.get('PC'),
      suministros: items.map(item => ({
        cantidad: parseInt(item.cantidad),
        unidadMedida: item.unidad,
        descripcion: item.descripcion,
        cantidadEntregada: 0 
      })),
      proyecto: formData.get('Proyecto'),
      actividades: formData.get('Actividad'),
      justificacionAdquisicion: formData.get('Justificacion'),
      firmas: {
        solicitud: '',
        revision: '',
        validacion: '',
        autorizacion: ''
      },
      estado: 'Pendiente'
    };
  
    // Llama a la función para enviar a la base de datos
    console.log(data);
  };
  
  const addItem = () => {
    setItems([...items, { cantidad: '', unidad: '', descripcion: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className='body2 solicitud-form'>
      <form className="formulariodatos" ref={formRef} onSubmit={handleGuardarCambios}>
        <div className='division'>
          <label htmlFor='Folio' className="labels">No. de folio:</label>
          <input type="number" name='Folio' id='Folio' className='Inputfolio font-bold' />
          <label htmlFor="" className="labels">Selecciona la fecha:</label>
          <DatePicker name='Fecha' selected={selectedDate} onChange={date => setSelectedDate(date)} className='select font-bold' />
        </div>
        <div className='division'>
          <label className="labels">Tipo de Suministro:</label>
          <label className="labels">Proceso Clave (PC):</label>
        </div>
        <div className='division'>
          <select id="Suministro" className='select font-bold'>
            <option value="">Seleccione un suministro</option>
            <option value="Normal">Normal</option>
            <option value="Urgente">Urgente</option>
          </select>
          <select id="PC" className='select font-bold'>
            <option value="">Seleccione el PC</option>
            <option value="Educativo">PC Educativo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className='division'>
          <label className="labels">Proyecto:</label>
          <label className="labels">Actividad:</label>
        </div>
        <div className='division'>
          <select id="Proyecto" className='select font-bold'>
            <option value="" >Seleccione el Proyecto</option>
            <option value="ProyectoA" >Mantenimiento</option>
            <option value="ProyectoB" >Mantenimiento 2</option>
          </select>
          <select id="Actividad" className='select font-bold'>
            <option value="" >Seleccione la Actividad</option>
            <option value="Actividad A" >Verificación de la verificación del programa anual de mantenimiento</option>
            <option value="Actividad B" >Actividad B</option>
          </select>
        </div>
        {items.map((item, index) => (
          <div className='division' key={index}>
            <label className='labels'>Cantidad:</label>
            <input 
              type="number" 
              value={item.cantidad} 
              onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)} 
              className='Inputs2 font-bold'
            />
            <label className="labels">Unidad de medida:</label>
            <select 
              value={item.unidad} 
              onChange={(e) => handleItemChange(index, 'unidad', e.target.value)}
              className='select font-bold'
            >
              <option value="">Seleccione la Unidad</option>
              <option value="Paquete">Paquete</option>
              <option value="Rollo">Rollo</option>
              <option value="Caja">Caja</option>
            </select>
            <label className="labels">Descripcion del bien solicitado:</label>
            <textarea 
              className='inputs3 font-bold' 
              value={item.descripcion} 
              onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
            ></textarea>
          </div>
        ))}
        <button onClick={addItem} className='btn-primary'>Agregar otra fila</button>
        <div className='division'>
          <label className="labels">Justificacion para la adquisición:</label>
        </div>
        <textarea className='inputs3 font-bold' id="Justificacion"></textarea>
        <div className='botones'>
          <button type="submit" className="btn-primary">Guardar cambios</button>
          <button onClick={handleGeneratePDF} className="btn-primary">Generar PDF</button>
        </div>
      </form>
    </div>
  );
};

export default SolicitudPage;
