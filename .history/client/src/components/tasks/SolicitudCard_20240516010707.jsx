import React from "react";
import { useSoli } from "../context/SolicitudContext";
import { Button, ButtonLink, Card } from "../ui";

export function SolicitudCard({ solicitud }) {

  const { deleteTask } = useSoli();
  
  return (
    <Card>
      <table>
        <tbody>
          <tr>
            <th>Folio</th>
            <td>{solicitud.folio}</td>
          </tr>
          <tr>
            <th>Area</th>
            <td>{solicitud.areaSolicitante}</td>
          </tr>
          <tr>
            <th>Fecha</th>
            <td>
              {solicitud.fecha &&
                new Date(solicitud.fecha).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </td>
          </tr>
          <tr>
            <th>Proyecto</th>
            <td>{solicitud.proyecto}</td>
          </tr>
          <tr>
            <th>Actividad</th>
            <td>{solicitud.actividad}</td>
          </tr>
          <tr>
            <th>Estado</th>
            <td>{solicitud.estado}</td>
          </tr>
          <tr>
            <td colSpan="2">
              <div className="flex gap-x-2 items-center">
                <Button>Acción 1</Button>
                <ButtonLink to={`/solicitudes/${solicitud._id}`}>Acción 2</ButtonLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
