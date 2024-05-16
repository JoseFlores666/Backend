import { useEffect } from "react";
import { useSoli } from "../context/SolicitudContext";

export function TasksPage() {
  const { tasks, getTasks } = useSoli();

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      {tasks.length === 0 && (
        <div className="flex justify-center items-center p-10">
          <div>
            <ImFileEmpty className="text-6xl text-gray-400 m-auto my-2" />
            <h1 className="font-bold text-xl">
              No tasks yet, please add a new task
            </h1>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
        {tasks.map((task) => (
          <TaskCard task={task} key={task._id} />
        ))}
      </div>
    </>
  );
}
