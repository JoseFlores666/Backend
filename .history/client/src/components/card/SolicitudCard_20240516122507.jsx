import React from "react";
import { useSoli } from "../../context/SolicitudContext";
import { Button, ButtonLink, Card } from "../ui";

export function SolicitudCard({ solicitud }) {
  const { deleteSoli } = useSoli();

  return (
    <Card>
      <header className="flex justify-between">
        <h1 className="text-2xl font-bold">{solicitud.title}</h1>
        <div className="flex gap-x-2 items-center">
          <Button onClick={() => deleteTask(solicitud._id)}>Delete</Button>
          <ButtonLink to={`/tasks/${solicitud._id}`}>Edit</ButtonLink>
        </div>
      </header>
      <p className="text-slate-300">{solicitud.description}</p>
    
      <p>
        {task.date &&
          new Date(solicitud.date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
      </p>
    </Card>
  );
}
