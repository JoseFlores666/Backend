import { useEffect, useState } from "react";
import { useSoli } from "../context/SolicitudContext";
import { ImFileEmpty } from "react-icons/im";
import { SolicitudCard } from "../components/card/SolicitudCard";
import '../'
export function SolicitudPage() {
  const { soli, getSoli, getUnPorEstado } = useSoli();
  const [loading, setLoading] = useState(true);
  const [solicitudesFetched, setSolicitudesFetched] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState("");

  useEffect(() => {
    if (!solicitudesFetched) {
      const fetchSoli = async () => {
        try {
          await getSoli();
          setSolicitudesFetched(true);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching solicitudes:", error);
        }
      };
      fetchSoli();
    }
  }, [solicitudesFetched, getSoli]);

  const handleDelete = async (id) => {};

  const handleFilterChange = (event) => {
    setSelectedEstado(event.target.value);
  };

  const handleFilterClick = async () => {
    if (selectedEstado) {
      setLoading(true);
      try {
        await getUnPorEstado(selectedEstado);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching solicitudes by estado:", error);
        setLoading(false);
      }
    }
  };

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
      <div className="flex justify-end items-center p-4 ">
        <select  
          value={selectedEstado}
          onChange={handleFilterChange}
          className="p-2 border rounded mr-2 "
        >
          <option value="">Seleccionar Estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Asignada">Asignada</option>
          <option value="Diagnosticada">Diagnosticada</option>
          <option value="Atendida">Atendida</option>
          <option value="Rechazada">Rechazada</option>
        </select>
        <button
          onClick={handleFilterClick}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Filtrar
        </button>
      </div>
      {soli.length === 0 ? (
        <div className="flex justify-center items-center p-10">
          <div>
            <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
            <h1 className="font-bold text-xl">No se encontraron solicitudes</h1>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {soli.map((solicitud) => (
            <SolicitudCard
              solicitud={solicitud}
              key={solicitud._id}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </>
  );
}
