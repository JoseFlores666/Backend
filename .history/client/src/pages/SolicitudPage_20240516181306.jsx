import { useEffect, useState } from "react";
import { useSoli } from "../context/SolicitudContext";
import { ImFileEmpty } from "react-icons/im";
import { SolicitudCard } from "../components/card/SolicitudCard";

export function SolicitudPage() {
  const { soli, getSoli } = useSoli();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoli = async () => {
      try {
        await getSoli();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching solicitudzes:", error);
      }
    };

    fetchSoli();
  }, [getSoli]);
  
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {soli.map((solicitud) => (
            <SolicitudCard solicitud={solicitud} key={solicitud._id} />
          ))}
        </div>
      )}
    </>
  );
}
