import { useEffect, useState } from "react";
import { useSoli } from "../context/SolicitudContext";
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

export function SolicitudPage() {
  const { soli, getSoli, deleteSoli } = useSoli(); // Agregar deleteSoli
  const [loading, setLoading] = useState(true);
  const [solicitudesFetched, setSolicitudesFetched] = useState(false);

  useEffect(() => {
    if (!solicitudesFetched) {
      const fetchSoli = async () => {
        try {
          await getSoli();
          setSolicitudesFetched(true);
          setLoading(false); // establece que ya terminó de cargar
        } catch (error) {
          console.error("Error fetching solicitudes:", error);
        }
      };
      fetchSoli();
    }
  }, [solicitudesFetched, getSoli]);

  const handleDelete = async (id) => {
    // Lógica para eliminar la solicitud con el ID proporcionado
    try {
      await deleteSoli(id);
    } catch (error) {
      console.error("Error deleting solicitud:", error);
    }
  };

  // si está cargando muestra este mensaje
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center mt-50">
          <div className="mb-4">Cargando...</div>
          <ImFileEmpty className="animate-spin text-gray-500 text-6xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      {soli.length === 0 ? (
        <div className="flex justify-center items-center p-10">
          <div>
            <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
            <h1 className="font-bold text-xl">No se encontraron solicitudes</h1>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <SolicitudTable solicitudes={soli} handleDelete={handleDelete} />
        </div>
      )}
    </>
  );
}