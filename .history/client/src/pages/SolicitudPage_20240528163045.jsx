import { useEffect, useState } from "react";
import { useSoli } from "../context/SolicitudContext";
import { ImFileEmpty } from "react-icons/im";
import SolicitudTable from "../"; // Asegúrate de importar correctamente SolicitudTable

export function SolicitudPage() {
  const { soli, getSoli, deleteSoli } = useSoli();
  const [loading, setLoading] = useState(true);
  const [solicitudesFetched, setSolicitudesFetched] = useState(false);

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

  const handleDelete = async (id) => {
    try {
      await deleteSoli(id);
    } catch (error) {
      console.error("Error deleting solicitud:", error);
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
