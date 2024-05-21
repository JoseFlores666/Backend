document.addEventListener('DOMContentLoaded', () => {
    const datos = JSON.parse(localStorage.getItem('datosSolicitud'));

    if (datos) {
        document.getElementById('td-proyecto').innerText = `Proyecto:\n${datos.proyecto}`;
        document.getElementById('td-actividad').innerText = `Actividad:\n${datos.actividad}`;
        document.getElementById('td-justificacion').innerText = datos.justificacion;

        document.getElementById('td-cantidad').innerText = datos.items[0].cantidad;
        document.getElementById('td-unidad').innerText = datos.items[0].unidad;
        document.getElementById('td-descripcion').innerText = datos.items[0].descripcion;

        const filas = document.querySelectorAll('#miTabla tbody tr');

        datos.items.forEach((item, index) => {
            if (filas[index-1]) {
                filas[index].cells[1].innerText = item.cantidad;
                filas[index].cells[3].innerText = item.unidad; // Columna POA (vacía)
                filas[index].cells[4].innerText = item.descripcion;
            
            }
        });
    }
});

function generarPDF() {
    const { jsPDF } = window.jspdf;

    const datos = JSON.parse(localStorage.getItem('datosSolicitud'));
    if (!datos) {
        console.error('Datos no encontrados en el localStorage');
        return;
    }

    const maxItemsPerPage = 10;
    const itemsChunks = [];

    for (let i = 0; i < datos.items.length; i += maxItemsPerPage) {
        itemsChunks.push(datos.items.slice(i, i + maxItemsPerPage));
    }

    itemsChunks.forEach((items, pageIndex) => {
        const doc = new jsPDF('p', 'pt', 'letter'); // Tamaño carta

        // Convertir imágenes a base64
        const img1 = document.getElementById('image1');
        const img2 = document.getElementById('image2');

        const canvas1 = document.createElement('canvas');
        const context1 = canvas1.getContext('2d');
        canvas1.width = img1.width;
        canvas1.height = img1.height;
        context1.drawImage(img1, 0, 0, img1.width, img1.height);
        const imgData1 = canvas1.toDataURL('image/jpeg');

        const canvas2 = document.createElement('canvas');
        const context2 = canvas2.getContext('2d');
        canvas2.width = img2.width;
        canvas2.height = img2.height;
        context2.drawImage(img2, 0, 0, img2.width, img2.height);
        const imgData2 = canvas2.toDataURL('image/jpeg');

        // Calcular las posiciones de las imágenes y la tabla
        const img1Height = img1.height * 600 / img1.width;
        const img2Height = img2.height * 600 / img2.width;

        // Agregar la primera imagen al PDF
        doc.addImage(imgData1, 'JPEG', 0, 0, 600, img1Height);

        // Usar autoTable para generar la tabla del HTML al PDF
        doc.autoTable({
            html: '#miTabla',
            startY: img1Height + 3,
            margin: { top: 0, bottom: 0, left: 30, right: 100 },
            styles: {
                fontSize: 8,
                cellPadding: 2,
                valign: 'middle',
                halign: 'center',
                textColor: [0, 0, 0],
                fillColor: [255, 255, 255],
                lineWidth: 0.1,
                lineColor: [0, 0, 0],
                cellHeight: 'auto'
            },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 50 },
                2: { cellWidth: 50 },
                3: { cellWidth: 50 },
                4: { cellWidth: 50 },
                5: { cellWidth: 200 },
                6: { cellWidth: 50 }
            },
            rowPageBreak: 'auto',
        });

        // Obtener la fecha del localStorage
        if (datos.fecha) {
            const [year, month, day] = datos.fecha.split('-');

            // Agregar la fecha seleccionada al PDF
            doc.setFontSize(9); // Establecer el tamaño de la fuente
            doc.text(day, 460, img1Height - 70.3);
            doc.text(month, 505, img1Height - 70.3);
            doc.text(year, 545, img1Height - 70.3);
        } else {
            console.error('Fecha no encontrada en los datos almacenados');
        }

        //lsito para suministro
        doc.setFontSize(30);
        if (datos.suministro == "Normal") {
            doc.text('•', 92, img1Height + -5);
        } else {
            doc.text('•', 165, img1Height + -4.9);
        }

        doc.setFontSize(30);
        if (datos.pc == "Educativo") {
            doc.text('•', 304, img1Height + -22);
        } else {
            doc.text('•', 298, img1Height + -1);
        }

        // Agregar la segunda imagen al PDF
        doc.addImage(imgData2, 'JPEG', 0, doc.previousAutoTable.finalY, 600, img2Height);
        
        doc.save(`solicitud_page_${pageIndex + 1}.pdf`);
    });
}
