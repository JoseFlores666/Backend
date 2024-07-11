<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once('tbs_class.php');
include_once('plugins/tbs_plugin_opentbs.php');

$TBS = new clsTinyButStrong;
$TBS->Plugin(TBS_INSTALL, OPENTBS_PLUGIN);

ini_set('display_errors', 1);

$template = __DIR__ . '/ordenTrabajo.docx';

if (!file_exists($template)) {
    die("Error: Template file 'ordenTrabajo.docx' not found.");
}

$TBS->LoadTemplate($template, OPENTBS_ALREADY_UTF8);

// Verificar si se pasó la ruta del archivo temporal como argumento
if ($argc < 2) {
    die("Error: Missing temporary file path argument.");
}

// Obtener la ruta del archivo temporal desde los argumentos
$tempFilePath = $argv[1];

// Leer el contenido del archivo temporal
$jsonContent = file_get_contents($tempFilePath);


// Verificar si hubo un error al leer el archivo
if ($jsonContent === false) {
    die("Error: Failed to read temporary file.");
}

// Decodificar el JSON de los items
$data = json_decode($jsonContent, true);

// Verificar si hubo un error en la decodificación
if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
    die("Error: Failed to decode JSON items. Syntax error: " . json_last_error_msg());
}

// Extraer datos del array
$folio = isset($data['folio']) ? $data['folio'] : '';
$fecha = isset($data['fecha']) ? $data['fecha'] : '';
$fechaAtencion = isset($data['fechaAtencion']) ? $data['fechaAtencion'] : '';
$solicita = isset($data['solicita']) ? $data['solicita'] : '';
$areasoli = isset($data['areasoli']) ? $data['areasoli'] : '';
$edificio = isset($data['edificio']) ? $data['edificio'] : '';
$tipoMantenimiento = isset($data['tipoMantenimiento']) ? $data['tipoMantenimiento'] : '';
$tipoTrabajo = isset($data['tipoTrabajo']) ? $data['tipoTrabajo'] : '';
$tipoSolicitud = isset($data['tipoSolicitud']) ? $data['tipoSolicitud'] : '';
$desc = isset($data['desc']) ? $data['desc'] : '';
$obs = isset($data['obs']) ? $data['obs'] : '';
$items = isset($data['items']) ? $data['items'] : [];

// Continuar con la lógica para procesar los datos recibidos
list($year, $mes, $dia) = explode('-', $fecha);

$TBS->MergeField('folio.numero', $folio);
$TBS->MergeField('fecha.dia', $dia);
$TBS->MergeField('fecha.mes', $mes);
$TBS->MergeField('fecha.año', $year);
$TBS->MergeField('fecha_atencion', $fechaAtencion);
$TBS->MergeField('sol.nombre', $solicita);
$TBS->MergeField('area.nombre', $areasoli);
$TBS->MergeField('edificio.nombre', $edificio);
$TBS->MergeField('tm.nombre', $tipoMantenimiento);
$TBS->MergeField('tt.nombre', $tipoTrabajo);
$TBS->MergeField('ts.nombre', $tipoSolicitud);
$TBS->MergeField('desc.texto', $desc);
$TBS->MergeField('obs.texto', $obs);

$items_count = count($items);
$max_items = 10;
if ($items_count < $max_items) {
    for ($i = $items_count; $i < $max_items; $i++) {
        $items[] = array('cantidad' => '', 'unidad' => '', 'descripcion' => '');
    }
}

foreach ($items as $index => $item) {
    $TBS->MergeField("col." . ($index + 1), isset($item['cantidad']) ? $item['cantidad'] : '');
    $TBS->MergeField("uni." . ($index + 1), isset($item['unidad']) ? $item['unidad'] : '');
    $TBS->MergeField("desc." . ($index + 1), isset($item['descripcion']) ? $item['descripcion'] : '');
}

$TBS->PlugIn(OPENTBS_DELETE_COMMENTS);

$output_file_name = 'ordenTrabajo.docx';
$TBS->Show(OPENTBS_FILE, $output_file_name);

$output = [];
$return_var = 0;

exec('node apiPDF.js SolicOrden.docx ordenResult.pdf');
?>