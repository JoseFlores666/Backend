import jsPDF from 'jspdf';

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
    } = data;

    try {
        const image = await loadImage(require('../img/Papeleria.jpg'));

        const pdf = new jsPDF('p', 'pt', 'letter');
        pdf.addImage(image, 'PNG', 0, 0, 565, 792);

        pdf.setFontSize(12);
        pdf.text(folio, 260, 125);

        const date = new Date();
        pdf.text(date.getUTCDate().toString(), 235, 150);
        pdf.text((date.getUTCMonth() + 1).toString(), 275, 150);
        pdf.text(date.getUTCFullYear().toString(), 320, 150);

        pdf.setFontSize(10);
        pdf.text(suministro, 170, 213);
        pdf.text(pc, 170, 230);
        pdf.text(proyecto, 170, 250);
        pdf.text(actividad, 170, 270);
        pdf.text(cantidad, 170, 290);
        pdf.text(unidad, 170, 310);
        pdf.text(descripcion, 170, 330);
        pdf.text(justificacion, 170, 350);

        pdf.save('example.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error.message);
    }
};