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

//las tablas de nombre
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

$output = [];
$return_var = 0;
exec('node apiPDF.js formSolicitud.docx formResult.pdf');
