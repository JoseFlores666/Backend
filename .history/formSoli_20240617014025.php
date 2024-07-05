<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once('tbs_class.php');
include_once('plugins/tbs_plugin_opentbs.php');

$TBS = new clsTinyButStrong;
$TBS->Plugin(TBS_INSTALL, OPENTBS_PLUGIN);

// Capturando datos del formulario
$fecha = $_POST['fecha'];
$suministro = $_POST['suministro'];
$pc = $_POST['pc'];
$proyecto = $_POST['myProyecto'];
$actividad = $_POST['myActividad'];
$justificacion = $_POST['justificacion'];
$items = $_POST['items'];

// Las tablas de nombre
$solicitud = $_POST['solicitud'];
$revision = $_POST['JefeInmediato'];
$validacion = $_POST['Validacion'];
$autorizo = $_POST['Autorizo'];

// Dividir la fecha en día, mes y año
list($year, $mes, $dia) = explode('-', $fecha);

// Cargando template
$template = 'solicBienes.docx';
$TBS->LoadTemplate($template, OPENTBS_ALREADY_UTF8);

// Escribir Nuevos campos
$TBS->MergeField('area.nombre', 'Administración y Finanzas Mantenimiento y Servicios Generales');
$TBS->MergeField('fecha.dia', $dia);
$TBS->MergeField('fecha.mes', $mes);
$TBS->MergeField('fecha.año', $year);
$TBS->MergeField('pro.proyecto', $proyecto);
$TBS->MergeField('Act.actividad', $actividad);
$TBS->MergeField('just.justificacion', $justificacion);

if ($suministro === 'Normal') {
    $TBS->MergeField('y', '⬛');
    $TBS->MergeField('x', '☐');
} else {
    $TBS->MergeField('x', '⬛');
    $TBS->MergeField('y', '☐');
}

if ($pc === 'Educativo') {
    $TBS->MergeField('pce', '⬛');
    $TBS->MergeField('pco', '☐');
} else {
    $TBS->MergeField('pco', '⬛');
    $TBS->MergeField('pce', '☐');
}

$items_count = count($items);
$max_items = 10;
if ($items_count < $max_items) {
    // Agregar elementos vacíos hasta llegar a 10
    for ($i = $items_count; $i < $max_items; $i++) {
        $items[] = array(
            'cantidad' => '',
            'unidad' => '',
            'descripcion' => ''
        );
    }
}

foreach ($items as $index => $item) {
    $TBS->MergeField("col." . ($index + 1), $item['cantidad']);
    $TBS->MergeField("uni." . ($index + 1), $item['unidad']);
    $TBS->MergeField("desc." . ($index + 1), $item['descripcion']);
}

$TBS->MergeField('sol.nombre', $solicitud);
$TBS->MergeField('rev.nombre', $revision);
$TBS->MergeField('val.nombre', $validacion);
$TBS->MergeField('aut.nombre', $autorizo);

$TBS->PlugIn(OPENTBS_DELETE_COMMENTS);

$output_file_name = 'formSolicitud.docx';
$TBS->Show(OPENTBS_FILE, $output_file_name);

// Realizar una solicitud HTTP POST al servidor Node.js para convertir el archivo DOCX a PDF
$url = 'http://localhost:3000/api/convertirPDF/upload'; // Ajusta la URL según donde esté alojado tu servidor Node.js
$fileData = file_get_contents($output_file_name);
$postData = array(
    'file' => base64_encode($fileData) // Convertir el archivo a base64 para enviarlo como cuerpo de la solicitud
);

$options = array(
    'http' => array(
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($postData)
    )
);
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === FALSE) {
    // Manejar el error si la solicitud falla
    echo "Error al enviar solicitud a Node.js";
} else {
    // Procesar la respuesta de Node.js si es necesario
    $responseData = json_decode($response, true);
    echo "Respuesta de Node.js: " . print_r($responseData, true);
}
?>
