import React, { useState } from "react";
import { useSoli } from "../../context/SolicitudContext";
import { Button, ButtonLink, Card } from "../ui";

export function SolicitudCard({ solicitud }) {
  const { deleteSoli } = useSoli();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    await deleteSoli(id);
    setTimeout(() => {
      setDeleted(true);
    }, 1000);
  };

  return (
    !deleted && (
      <Card className={` p-4 mb-4 rounded-lg bg-white ${isDeleting ? 'opacity-50' : '' } shadow-lg shadow-indigo-500/40`}>
        <header className="mb-2">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{"ID: " + solicitud.folio}</h1>
            <h4
              className={`text-xl font-bold ${
                solicitud.estado === "Approved" ? "text-green-500" : "text-red-500"
              }`}
            >
              {solicitud.estado}
            </h4>
          </div>
          <h3 className="text-md font-semibold">
            Fecha:{" "}
            <span className="text-slate-400 text-sm">
              {solicitud.fecha &&
                new Date(solicitud.fecha).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </span>
          </h3>
          <br/>
          <h3 className="text-md font-semibold">
            Area del Solicitante:{" "}
            <span className="text-slate-500">{solicitud.areaSolicitante}</span>
          </h3>
        </header>
        <br />
        <section className="mb-2">
          <h3 className="text-md font-semibold">Detalles del Proyecto:</h3>
          <p className="text-slate-500">{solicitud.proyecto}</p>
        </section>
        <br />
        <section className="mb-4">
          <h3 className="text-md font-semibold">Actividades:</h3>
          <p className="text-slate-500">{solicitud.actividades}</p>
        </section>
         <br />
        <footer className="flex justify-between items-center">
          <div className="flex gap-4 mb-4">
            <Button onClick={() => handleDelete(solicitud._id)}>Delete</Button>
            <ButtonLink to={`/soliPager/${solicitud._id}`}>Edit</ButtonLink>
          </div>
          <div className="text-slate-400 text-sm">
            {solicitud.firmas.solicitud && (
              <p>Firma Solicitud: {solicitud.firmas.solicitud}</p>
            )}
            {solicitud.firmas.revision && (
              <p>Firma Revisión: {solicitud.firmas.revision}</p>
            )}
            {solicitud.firmas.validacion && (
              <p>Firma Validación: {solicitud.firmas.validacion}</p>
            )}
            {solicitud.firmas.autorizacion && (
              <p>Firma Autorización: {solicitud.firmas.autorizacion}</p>
            )}
          </div>
        </footer>
        {isDeleting && (
          <div className="text-blue-500 text-center mt-2">
            Eliminando solicitud...
          </div>
        )}

      </Card>
    )
  );
}