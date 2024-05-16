import React from "react";
import { useSoli } from "../../context/SolicitudContext";
import { Button, ButtonLink, Card } from "../ui";

export function SolicitudCard({ soli }) {
  const { deleteSoli } = useSoli();

  return (
    <Card className="p-4 mb-4 shadow-md rounded-lg bg-white">
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-xl font-bold">{soli.folio}</h1>
          <h2 className="text-md text-gray-500">{soli.areaSolicitante}</h2>
        
        <h4 className={`text-xl font-bold ${soli.estado === "Approved" ? "text-green-500" : "text-red-500"}`}>
          {soli.estado}
        </h4>
      </header>
      <section className="mb-2">
        <p className="text-slate-500 mb-1">{soli.descripcion}</p>
        <p className="text-slate-400 text-sm">
          {soli.fecha &&
            new Date(soli.fecha).toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
        </p>
      </section>
      {/* <section className="mb-2">
        <h3 className="text-md font-semibold">Suministros:</h3>
        <ul className="list-disc list-inside ml-4">
          {soli.suministros.map((item, index) => (
            <li key={index} className="text-slate-500">
              {item.cantidad} {item.unidadMedida} - {item.descripcion} (Entregados: {item.cantidadEntregada})
            </li>
          ))}
        </ul>
      </section> */}
      <section className="mb-2">
        <h3 className="text-md font-semibold">Detalles del Proyecto:</h3>
        <p className="text-slate-500">{soli.proyecto}</p>
      </section>
      <section className="mb-4">
        <h3 className="text-md font-semibold">Actividades:</h3>
        <p className="text-slate-500">{soli.actividades}</p>
      </section>
      <footer className="flex justify-between items-center">
        <div className="flex gap-x-2">
          <Button onClick={() => deleteSoli(soli._id)}>Delete</Button>
          <ButtonLink to={`/soliPager/${soli._id}`}>Edit</ButtonLink>
        </div>
        <div className="text-slate-400 text-sm">
          {soli.firmas.solicitud && <p>Firma Solicitud: {soli.firmas.solicitud}</p>}
          {soli.firmas.revision && <p>Firma Revisión: {soli.firmas.revision}</p>}
          {soli.firmas.validacion && <p>Firma Validación: {soli.firmas.validacion}</p>}
          {soli.firmas.autorizacion && <p>Firma Autorización: {soli.firmas.autorizacion}</p>}
        </div>
        </footer>
      </div>
    </Card>
  );
}
