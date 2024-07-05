import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { useSoli } from "../context/SolicitudContext";

export const TecnicoPage = () => {
  const { getInfo, info } = useSoli();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [solicitudesPerPage, setSolicitudesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);

  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    setFilteredSolicitudes(info);
    console.log(info)
  }, [info]);

  useEffect(() => {
    // Ensure info is not undefined before filtering
    if (!info) return;
  
    const results = info.filter((solicitud) =>
      (solicitud.folio && solicitud.folio.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.Solicita.nombre && solicitud.informe.Solicita.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.Solicita.areaSolicitante && solicitud.informe.Solicita.areaSolicitante.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.tipoDeMantenimiento && solicitud.informe.tipoDeMantenimiento.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.tipoDeTrabajo && solicitud.informe.tipoDeTrabajo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.tipoDeSolicitud && solicitud.informe.tipoDeSolicitud.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.informe.solicitud.insumosSolicitados.imagen && solicitud.informe.solicitud.insumosSolicitados.imagen.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (solicitud.estado && solicitud.estado.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  
    setFilteredSolicitudes(results);
    setCurrentPage(1);
  }, [searchTerm, info]);
  



  const sortedSolicitudes = useMemo(() => {
    let sortableSolicitudes = [...filteredSolicitudes];
    if (sortConfig.key !== null) {
      sortableSolicitudes.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableSolicitudes;
  }, [filteredSolicitudes, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';2
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastSolicitud = currentPage * solicitudesPerPage;
  const indexOfFirstSolicitud = indexOfLastSolicitud - solicitudesPerPage;
  const currentSolicitudes = sortedSolicitudes.slice(indexOfFirstSolicitud, indexOfLastSolicitud);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-1 flex justify-between items-center">
        <div className="relative">
          <input
            type="text"
            id="table-search"
            className="block p-2 ps-10 text-sm text-black border border-black rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={clearSearch}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
        <div>
          <label htmlFor="entries-per-page" className="mr-2 text-black">Entradas por página:</label>
          <select
            id="entries-per-page"
            className="p-1 border border-black rounded-lg text-black"
            value={solicitudesPerPage}
            onChange={(e) => setSolicitudesPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
      <table className="w-full min-w-full divide-y divide-white-200 text-sm text-black rounded-lg overflow-hidden">
        <thead className="bg-black text-white">
          <tr>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('folio')}>Folio</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('fecha')}>Fecha</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoDeMantenimiento')}>Tipo de Mantenimiento</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoDeTrabajo')}>Tipo de Trabajo</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('tipoDeSolicitud')}>Tipo de Solicitud</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-2/12" onClick={() => requestSort('descripcionDelServicio')}>Descripción del Servicio</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('estado')}>Estado</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center cursor-pointer w-1/12" onClick={() => requestSort('estado')}>Estado</th>
            <th className="px-3 py-1 text-left font-medium uppercase tracking-wider border text-center w-1/12">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentSolicitudes.map((solicitud, index) => (
            <tr
              key={solicitud.folio}
              className={index % 2 === 0 ? "bg-gray-100 hover:bg-gray-200" : "hover:bg-gray-200"}
            >
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.folio}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{new Date(solicitud.informe.fecha).toLocaleDateString()}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.informe.tipoDeMantenimiento}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.informe.tipoDeTrabajo}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.informe.tipoDeSolicitud}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.informe.descripcionDelServicio}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">{solicitud.estado}</td>
              <td className="px-3 py-2 whitespace-normal break-words border text-center">
                <button
                  onClick={() => console.log(`Delete ${solicitud.folio}`)}
                  className="text-red-500 hover mx-2"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <button
                  onClick={() => console.log(`Edit ${solicitud.folio}`)}
                  className="text-blue-600 hover:text-blue-800 mx-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => console.log(`View ${solicitud.folio}`)}
                  className="text-green-600 hover:text-green-800 mx-2"
                >
                  <FontAwesomeIcon icon={faClipboardCheck} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav aria-label="Page navigation example" className="flex items-center justify-between pt-4">
        <span className="text-sm font-normal text-black dark:text-black-400">
          Mostrando <span className="font-semibold text-black">{indexOfFirstSolicitud + 1}-{indexOfLastSolicitud}</span> de <span className="font-semibold text-gray-900 dark:text-black">{filteredSolicitudes.length}</span> Solicitudes
        </span>
        <ul className="inline-flex items-center -space-x-px h-8 text-sm">
          <li>
            <a
              href="#!"
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === 1
                ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              <span className="sr-only">Previous</span>
              <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
              </svg>
            </a>
          </li>
          {Array.from({ length: Math.ceil(filteredSolicitudes.length / solicitudesPerPage) }, (_, i) => (
            <li key={i}>
              <a
                href="#!"
                onClick={() => paginate(i + 1)}
                className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === i + 1
                  ? "text-black border border-black bg-blue-400 hover:bg-blue hover:text-black" : "text-black bg-white border border-black hover:bg-gray-100 hover:text-gray-700"}`}
              >
                {i + 1}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#!"
              onClick={() => currentPage < Math.ceil(filteredSolicitudes.length / solicitudesPerPage) && paginate(currentPage + 1)}
              className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === Math.ceil(filteredSolicitudes.length / solicitudesPerPage)
                ? "text-gray-400 border-gray-300 cursor-not-allowed" : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                } dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
            >
              <span className="sr-only">Next</span>
              <svg className="w-2.5 h-2.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};
