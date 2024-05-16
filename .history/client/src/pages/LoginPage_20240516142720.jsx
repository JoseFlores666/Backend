import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";
import { useEffect, useState } from "react";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const [loading, setLoading] = useState(true);
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/soli");
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center mt-50">
          <div className="mb-4">Cargando...</div>
          <ImFileEmpty className="animate-spin text-gray-500 text-6xl" />
        </div>
      </div>
    );
  }
  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card>
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
          <Button >Iniciar Sesión</Button>
          </div>
        </form>

        <p className="flex gap-x-2 justify-between">
          ¿No tienes Cuenta? <Link to="/register" className="text-sky-500">Registrarse</Link>
        </p>
      </Card>
    </div>
  );
}
