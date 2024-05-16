import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";
import { useEffect, useState } from "react";
import { ImFileEmpty } from "react-icons/im";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const [loading, setLoading] = useState(false); // Cambiado a false inicialmente
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true); // Establecer el estado de carga a true al inicio del envío del formulario
    try {
      await signin(data);
      setLoading(false); // Establecer el estado de carga a false después de la autenticación exitosa
      navigate("/soli");
    } catch (error) {
      setLoading(false); // Establecer el estado de carga a false en caso de error de autenticación
      console.error("Error during sign-in:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/soli");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card>
        {loading && ( // Mostrar el mensaje de carga solo si loading es true
          <div className="flex justify-center items-center h-screen">
            <div className="text-center mt-50">
              <div className="mb-4">Cargando...</div>
              <ImFileEmpty className="animate-spin text-gray-500 text-6xl" />
            </div>
          </div>
        )}

        {loginErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-2xl font-bold">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email">Email:</Label>
          <Input
            label="Write your email"
            type="email"
            name="email"
            placeholder="Ingresa tu email"
            {...register("email", { required: true })}
          />
          <p>{errors.email?.message}</p>

          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            name="password"
            placeholder="Escribe tu contraseña"
            {...register("password", { required: true, minLength: 6 })}
          />
          <p>{errors.password?.message}</p>
          <div className=" font-bold mr-4">
            <Button>Iniciar Sesión</Button>
          </div>
        </form>

        <p className="flex gap-x-2 justify-between">
          ¿No tienes Cuenta? <Link to="/register" className="text-sky-500">Registrarse</Link>
        </p>
      </Card>
    </div>
  );
}
