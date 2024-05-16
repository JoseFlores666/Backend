import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export function  TaskProvider({ children }) {
    const [tasks, setTasks] = useState([]);
  
    const getTasks = async () => {
      const res = await getTasksRequest();
      setTasks(res.data);
    };

<TaskContext.Provider
value={{
  tasks,
  getTasks,
  deleteTask,
  createTask,
  getTask,
  updateTask,
}}
>
{children}
</TaskContext.Provider>

}