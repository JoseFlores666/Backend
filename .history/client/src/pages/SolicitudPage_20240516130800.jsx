import { useEffect } from "react";
import { useSoli } from "../context/SolicitudContext";
import { SolicitudCard } from "../components/card/SolicitudCard";
import { ImFileEmpty } from "react-icons/im";

export function SolicitudPage() {
  const { soli, getSoli } = useSoli();

  useEffect(() => {
    let result = getSoli() ? true : false;
    console.log(result)
  }, []);

  return (
    <>
      {soli.length === 0 && (
        <div className="flex justify-center items-center p-10">
          <div>
            <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
            <h1 className="font-bold text-xl">
              No se encontraron solicitudes
            </h1>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        {soli.map((soli) => (
          <SolicitudCard soli={soli} key={soli._id} />
        ))}
      </div>
    </>
  );
}
