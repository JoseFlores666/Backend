import { useEffect, useState } from "react";
import { useSoli } from "../../context/SolicitudContext";
import { ImFileEmpty } from "react-icons/im";

function SolicitudTable({ solicitudes, handleDelete }) {
  return (
    <div className="overflow-x-auto">
    <table className="w-full min-w-full divide-y divide-gray-200 text-sm text-black rounded-lg overflow-hidden">
      <thead className="bg-blue-500 text-white">
        <tr>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Folio</th>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Área Solicitante</th>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Fecha</th>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Tipo Suministro</th>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Proceso Clave</th>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Proyecto</th>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Actividades</th>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Justificación</th>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Estado</th>
          <th className="px-4 py-3 text-left font-medium uppercase tracking-wider border">Acciones</th> {/* Nueva columna para acciones */}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {solicitudes.map((solicitud, index) => (
          <tr key={solicitud._id} className={index % 2 === 0 ? 'bg-gray-100 hover:bg-gray-200' : 'hover:bg-gray-200'}>
            <td className="px-4 py-3 whitespace-nowrap border">{solicitud.folio}</td>
            <td className="px-4 py-3 whitespace-nowrap border">{solicitud.areaSolicitante}</td>
            <td className="px-4 py-3 whitespace-nowrap border">{new Date(solicitud.fecha).toLocaleDateString()}</td>
            <td className="px-4 py-3 whitespace-nowrap border">{solicitud.tipoSuministro}</td>
            <td className="px-4 py-3 whitespace-nowrap border">{solicitud.procesoClave}</td>
            <td className="px-4 py-3 whitespace-nowrap border">{solicitud.proyecto}</td>
            <td className="px-4 py-3 whitespace-nowrap border">{solicitud.actividades}</td>
            <td className="px-4 py-3 whitespace-nowrap border">{solicitud.justificacionAdquisicion}</td>
            <td className="px-4 py-3 whitespace-nowrap border">{solicitud.estado}</td>
            <td className="px-4 py-3 whitespace-nowrap border">
              <button onClick={() => handleDelete(solicitud._id)} className="text-red-600 hover:text-red-800">Eliminar</button> {/* Botón para eliminar */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}