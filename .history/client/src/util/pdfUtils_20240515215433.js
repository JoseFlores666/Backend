import jsPDF from 'jspdf';
import pruebaImage from '../img/Formato.jpeg'; 

export const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (this.status === 200) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    const res = event.target.result;
                    resolve(res);
                };
                const file = this.response;
                reader.readAsDataURL(file);
            } else {
                reject(new Error('Failed to load image'));
            }
        };
        xhr.onerror = function () {
            reject(new Error('Network error'));
        };
        xhr.send();
    });
};

export const generatePDF = async (data) => {
    const {
        folio,
        suministro,
        pc,
        proyecto,
        actividad,
        justificacion,
        fecha,
        items,
    } = data;

    try {
        const image = await loadImage(require('../img/Papeleria.jpg'));

        const pdf = new jsPDF('p', 'pt', 'letter');
        pdf.addImage(image, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
        pdf.setFontSize(8);
        pdf.text(folio, 495, 120);
        pdf.setFontSize(10);

        const day = fecha.getUTCDate().toString();
        const month = (fecha.getUTCMonth() + 1).toString();
        const year = fecha.getUTCFullYear().toString();
        pdf.text(day, 471, 152.4);
        pdf.text(month, 518, 152.4);
        pdf.text(year, 550, 152.4);

        //listo
        pdf.setFontSize(10);
        if (suministro === "Normal") {
            pdf.circle(100, 208, 4, 'FD');
        } else {
            pdf.circle(174, 207, 4, 'FD');
        }

        //listo
        pdf.setFontSize(10);
        if (pc === "Educativo") {
            pdf.circle(315, 190, 4, 'FD');
        } else {
            pdf.circle(306, 212, 4, 'FD');
        }

        pdf.setFontSize(10);
        pdf.text(proyecto, 37, 298);
        pdf.text(actividad, 37, 368);

        // Añadir los items dinámicos
        pdf.setFontSize(8);
        items.forEach((item, index) => {
            const yPosition = 273 + (index * 15); // Ajusta el espaciado vertical entre las filas
            pdf.text(item.cantidad, 220, yPosition);
            pdf.text(item.unidad, 300, yPosition);
            pdf.text(item.descripcion, 345, yPosition);
        });

        pdf.setFontSize(10);
        const lines = pdf.splitTextToSize(justificacion, 420);
        const line1 = lines.slice(0, 1).join('\n');
        const line2 = lines.slice(1).join('\n');
        pdf.text(line1, 137, 424);
        pdf.text(line2, 137, 434);

        pdf.save('example.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error.message);
    }
};