import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes";
import HomePage from "./pages/HomePage";
import { Firmas } from "./pages/Firmas";
import RegisterPage from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { SoliProvider } from "./context/SolicitudContext";
import { FiltroProvider } from "./context/filtroContext";
import { RegisterSolicitudPage } from "./pages/RegisterSolicitudPage";
import { SolicitudPage } from "./pages/SolicitudPage";
import { RegisterTecnicoPage } from "./pages/RegisterTecnicoPage";
import TecnicoPage from "./pages/TecnicoPage";
import { AbonoSolicitud } from "./pages/AbonoSolicitud";
import "./App.css"; // Importa tus estilos personalizados si los tienes

function App() {
  return (
    <AuthProvider>
      <FiltroProvider>
        <SoliProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar />
              <main className="content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path="/soli/registro/:id" element={<RegisterSolicitudPage />} />
                    <Route path="/soli/abonar/:id" element={<AbonoSolicitud />} />
                    <Route path="/soli" element={<SolicitudPage />} />
                    <Route path="/soli/editarFirmas" element={<Firmas />} />
                    <Route path="/tecnico" element={<RegisterTecnicoPage />} />
                    <Route path="/tecnico/orden" element={<TecnicoPage />} />
                  </Route>
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </SoliProvider>
      </FiltroProvider>
    </AuthProvider>
  );
}

export default App;
