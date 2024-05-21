import React, { useState } from "react";
import { useSoli } from "../../context/SolicitudContext";
import { Button, ButtonLink, Card } from "../ui";

export function SolicitudCard({ solicitud }) {
  const { deleteSoli } = useSoli();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      await deleteSoli(id);
      setDeleted(true);
    } catch (error) {
      console.error("Error deleting solicitud:", error);
      setIsDeleting(false); // Reset deleting state on error
    }
  };

  return (
    !deleted && (
      <Card className="p-4 mb-4 shadow-md rounded-lg bg-white">
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
              {solicitud.fecha
                ? new Date(solicitud.fecha).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Fecha no disponible"}
            </span>
          </h3>
          <br />
          <h3 className="text-md font-semibold">
            Area del Solicitante:{" "}
            <span className="text-slate-500">
              {solicitud.areaSolicitante || "Area no especificada"}
            </span>
          </h3>
        </header>
        <br />
        <section className="mb-2">
          <h3 className="text-md font-semibold">Detalles del Proyecto:</h3>
          <p className="text-slate-500">
            {solicitud.proyecto || "Detalles del proyecto no disponibles"}
          </p>
        </section>
        <br />
        <section className="mb-4">
          <h3 className="text-md font-semibold">Actividades:</h3>
          <p className="text-slate-500">
            {solicitud.actividades || "Actividades no disponibles"}
          </p>
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
