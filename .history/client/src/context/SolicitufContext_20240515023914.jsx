import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export function  

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
);
