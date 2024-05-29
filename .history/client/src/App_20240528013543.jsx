import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { SoliProvider } from "./context/SolicitudContext";
import {RegisterSolicitudPage} from "./pages/RegisterSolicitudPage";
import {SolicitudPage} from "./pages/SolicitudPage";
import { RegisterTecnicoPage } from "./pages/RegisterTecnicoPage";



function App() {
  return (
    <AuthProvider>
      <SoliProvider>
        <BrowserRouter>
          <main className="container content-container mx-auto px-10 md:px-0">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <ProtectedRoute>
                <Route path="/soli" element={<RegisterSolicitudPage />} />
                <Route path="/soli/:data" element={<RegisterSolicitudPage />} />
                <Route path="/soliPager" element={<SolicitudPage />} />
                <Route path="/tecnico" element={<RegisterTecnicoPage />} />
              </ProtectedRoute>
            </Routes>
          </main>
        </BrowserRouter>
      </SoliProvider>
    </AuthProvider>
  );
}

export default App;
