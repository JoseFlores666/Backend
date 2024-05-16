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
        cantidad,
        unidad,
        descripcion,
        justificacion,
        fecha,

    } = data;

    try {
        const image = await loadImage(pruebaImage);

        const pdf = new jsPDF('p', 'pt', 'letter');
        pdf.addImage(image, 'PNG', 0, 0, 565, 792);

        pdf.setFontSize(8);
        pdf.text(folio, 455, 120);
        pdf.setFontSize(10);

        const day = fecha.getUTCDate().toString();
        const month = (fecha.getUTCMonth() + 1).toString();
        const year = fecha.getUTCFullYear().toString();
        pdf.text(day, 432, 152.4);
        pdf.text(month, 478, 152.4);
        pdf.text(year, 510, 152.4);

        //listo
        pdf.setFontSize(10);
        if (suministro === "Normal") {
            pdf.circle(92, 208, 4, 'FD');
        } else {
            pdf.circle(160, 208, 4, 'FD');
        }

        //listo
        pdf.setFontSize(10);
        if (pc === "Educativo") {
            pdf.circle(290, 190, 4, 'FD');
        } else {
            pdf.circle(283, 212, 4, 'FD');
        }

        //izq, derecha y arriba,abajo

        pdf.setFontSize(8);

        pdf.text(proyecto, 35, 298);

        pdf.text(actividad, 35, 368);


        //listo
        pdf.text(cantidad, 200, 273);
        
        //listo
        pdf.text(unidad, 275, 273);

        //listo
        pdf.text(descripcion, 316, 273);

        //listo
        pdf.setFontSize(10);
        const lines = pdf.splitTextToSize(justificacion, 420);
        const line1 = lines.slice(0, 1).join('\n');
        const line2 = lines.slice(1).join('\n');
        pdf.text(line1, 127, 424);
        pdf.text(line2, 127, 434);

        pdf.save('example.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error.message);
    }
};