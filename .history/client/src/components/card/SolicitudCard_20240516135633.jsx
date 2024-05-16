import React, { useState } from "react";
import { useSoli } from "../../context/SolicitudContext";
import { Button, ButtonLink, Card } from "../ui";


export function SolicitudCard({ soli }) {
  const { deleteSoli } = useSoli();
  const [deleted, setDeleted] = useState(false);

  const handleDelete = (id) => {
    deleteSoli(id);
    setDeleted(true);
  };

  return (
    <Card className="p-4 mb-4 shadow-md rounded-lg bg-white">
      <header className="mb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{"ID: " + soli.folio}</h1>
          <h4
            className={`text-xl font-bold ${
              soli.estado === "Approved" ? "text-green-500" : "text-red-500"
            }`}
          >
            {soli.estado}
          </h4>
        </div>
        <h3 className="text-md font-semibold">
          Fecha:{" "}
          <span className="text-slate-400 text-sm">
            {soli.fecha &&
              new Date(soli.fecha).toLocaleDateString("es-ES", {
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
          <span className="text-slate-500">{soli.areaSolicitante}</span>
        </h3>
      </header>
      <br />
      <section className="mb-2">
        <h3 className="text-md font-semibold">Detalles del Proyecto:</h3>
        <p className="text-slate-500">{soli.proyecto}</p>
      </section>
      <br />
      <section className="mb-4">
        <h3 className="text-md font-semibold">Actividades:</h3>
        <p className="text-slate-500">{soli.actividades}</p>
      </section>
       <br />
      <footer className="flex justify-between items-center">
        <div className="flex gap-4 mb-4">
          <Button onClick={() => handleDelete(soli._id)}>Delete</Button>
          <ButtonLink to={`/soliPager/${soli._id}`}>Edit</ButtonLink>
        </div>
        <div className="text-slate-400 text-sm">
          {soli.firmas.solicitud && (
            <p>Firma Solicitud: {soli.firmas.solicitud}</p>
          )}
          {soli.firmas.revision && (
            <p>Firma Revisión: {soli.firmas.revision}</p>
          )}
          {soli.firmas.validacion && (
            <p>Firma Validación: {soli.firmas.validacion}</p>
          )}
          {soli.firmas.autorizacion && (
            <p>Firma Autorización: {soli.firmas.autorizacion}</p>
          )}
        </div>
      </footer>
      {deleted && (
        <div className="text-green-500 text-center mt-2">
          Solicitud eliminada exitosamente.
        </div>
      )}
    </Card>
  );
}
