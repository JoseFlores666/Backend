<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
var_dump($_POST);
include_once('tbs_class.php');
include_once('plugins/tbs_plugin_opentbs.php');

$TBS = new clsTinyButStrong;
$TBS->Plugin(TBS_INSTALL, OPENTBS_PLUGIN);

$template = 'formSolicitud.docx';
try {
    $TBS->LoadTemplate($template, OPENTBS_ALREADY_UTF8);
} catch (Exception $e) {
    echo 'Error loading template: ' . $e->getMessage();
    exit;
}

// Capturar datos desde los argumentos del script (para pruebas desde la línea de comandos)
$fecha = $argv[1] ?? '';
$suministro = $argv[2] ?? '';
$pc = $argv[3] ?? '';
$proyecto = $argv[4] ?? '';
$actividad = $argv[5] ?? '';
$justificacion = $argv[6] ?? '';
$items = json_decode($argv[7], true) ?? [];
$solicitud = $argv[8] ?? '';
$jefeInmediato = $argv[9] ?? '';
$validacion = $argv[10] ?? '';
$autorizo = $argv[11] ?? '';

list($year, $mes, $dia) = explode('-', $fecha);

// Fusionar datos en la plantilla DOCX
$TBS->MergeField('area.nombre', 'Administración y Finanzas Mantenimiento y Servicios Generales');
$TBS->MergeField('fecha.dia', $dia);
$TBS->MergeField('fecha.mes', $mes);
$TBS->MergeField('fecha.año', $year);
$TBS->MergeField('pro.proyecto', $proyecto);
$TBS->MergeField('Act.actividad', $actividad);
$TBS->MergeField('just.justificacion', $justificacion);

// Ejemplo de fusión condicional
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

// Asegurar que siempre haya 10 elementos en la tabla de items
$max_items = 10;
for ($i = count($items); $i < $max_items; $i++) {
    $items[] = array(
        'cantidad' => '',
        'unidad' => '',
        'descripcion' => ''
    );
}

foreach ($items as $index => $item) {
    $TBS->MergeField("col." . ($index + 1), $item['cantidad']);
    $TBS->MergeField("uni." . ($index + 1), $item['unidad']);
    $TBS->MergeField("desc." . ($index + 1), $item['descripcion']);
}

$TBS->MergeField('sol.nombre', $solicitud);
$TBS->MergeField('rev.nombre', $jefeInmediato);
$TBS->MergeField('val.nombre', $validacion);
$TBS->MergeField('aut.nombre', $autorizo);

$TBS->PlugIn(OPENTBS_DELETE_COMMENTS);

$output_file_name = 'formSolicitud.docx';
$TBS->Show(OPENTBS_FILE, $output_file_name);

// Ejecutar el script Node.js para convertir DOCX a PDF
$output = [];
$return_var = 0;
exec('node apiPDF.js formSolicitud.docx formResult.pdf', $output, $return_var);

if ($return_var === 0) {
    echo 'PDF generation successful.';
} else {
    echo 'Error generating PDF.';
}
