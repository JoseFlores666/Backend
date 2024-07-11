<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include_once('tbs_class.php');
include_once('plugins/tbs_plugin_opentbs.php');

$TBS = new clsTinyButStrong;
$TBS->Plugin(TBS_INSTALL, OPENTBS_PLUGIN);

$template = __DIR__ . '/ordenTrabajo.docx';

if (!file_exists($template)) {
    die("Error: Template file 'ordenTrabajo.docx' not found.");
}

$TBS->LoadTemplate($template, OPENTBS_ALREADY_UTF8);

$folio = $argv[1];
$fecha = $argv[2];
$fechaAtencion = $argv[3];
$solicita = $argv[4];
$areasoli = $argv[5];
$edificio = $argv[6];
$tipoMantenimiento = $argv[7];
$tipoTrabajo = $argv[8];
$tipoSolicitud = $argv[9];
$desc = $argv[10];
$obs = $argv[11];
$itemsJson = $argv[12];

$items = json_decode($itemsJson, true);

// Verifica si $items es null
if ($items === null) {
    die("Error: Failed to decode JSON items.");
}

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
    $TBS->MergeField("col." . ($index + 1), $item['cantidad']);
    $TBS->MergeField("uni." . ($index + 1), $item['unidad']);
    $TBS->MergeField("desc." . ($index + 1), $item['descripcion']);
}

$TBS->PlugIn(OPENTBS_DELETE_COMMENTS);

$output_file_name = 'ordenTrabajo.docx';
$TBS->Show(OPENTBS_FILE, $output_file_name);

$output = [];
$return_var = 0;

exec('libreoffice --convert-to pdf ' . $output_file_name . ' --outdir ./', $output, $return_var);

if ($return_var === 0) {
    echo 'PDF generation successful.';
} else {
    echo 'Error generating PDF.';
}
