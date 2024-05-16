import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { TaskFormPage } from "./pages/TaskFormPage";
import { LoginPage } from "./pages/LoginPage";
import { TasksPage } from "./pages/TasksPage";
import { TaskProvider } from "./context/tasksContext";
import SolicitudPage from "./pages/SolicitudPage";



function App() {
  return (
    <AuthProvider>
      <TaskProvider>
       
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
