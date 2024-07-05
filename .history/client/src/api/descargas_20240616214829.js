//Esta es mi axios personalizada
import axios from "./axios";

const getDescarga = async () => {
    const response = await fetch('http://localhost:4000/api/descargar/');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'result.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };
  