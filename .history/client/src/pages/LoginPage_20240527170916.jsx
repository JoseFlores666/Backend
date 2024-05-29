import { useAuth } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Message, Button, Input, Label } from "../components/ui";
import { loginSchema } from "../schemas/auth";

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { signin, errors: loginErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = (data) => signin(data);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/soli");
    }
  }, [isAuthenticated]);

  
  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
      <Card className="shadow-xl">
        {loginErrors.map((error, i) => (
          <Message message={error} key={i} />
        ))}
        <h1 className="text-2xl font-bold caret-light-50 text-black" >Login</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="email">Email:</Label>
          <Input
            label="Write your email"
            type="email"
            name="email"
            className="text-black"
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
          <div className=" font-bold mr-4 ">
          <Button className="">Iniciar Sesión</Button>
          </div>
        </form>

        <p className="flex gap-x-2 justify-between">
          ¿No tienes Cuenta? <Link to="/register" className="text-sky-500">Registrarse</Link>
        </p>
      </Card>
    </div>
  );
}
