import Text from "@/components/Text";
import {
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect } from "react";
import Logo from "@/assets/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "@/contexts/AdminContext";
import { Controller, useForm } from "react-hook-form";

export default function LoginPage() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      lastName: "",
      rut: "",
      address: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const {
    auth: {
      createMaster: { mutate, error, loading },
    },
  } = useContext(AdminContext);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function confirm(data: any) {
    mutate(data);
  }

  return (
    <>
      <form onSubmit={handleSubmit(confirm)}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto 0",
            placeItems: "center",
            gap: "2rem",
            padding: "4rem 0",
            overflow: "auto",
          }}
        >
          <img
            src={Logo}
            alt="logo"
            width="10%"
            style={{ borderRadius: "50%" }}
          />
          <Typography mb="1rem" variant="h2">
            Crea tu usuario master
          </Typography>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Este campo es requerido" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Nombre"
                sx={{ width: "70%" }}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            rules={{ required: "Este campo es requerido" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Apellido"
                sx={{ width: "70%" }}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="rut"
            rules={{
              required: "Este campo es requerido",
              pattern: {
                value: /^([1-9]|[1-9]\d|[1-9]\d{2})((\.\d{3})*|(\d{3})*)-(\d|k|K)$/i,
                message: "Rut inválido",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Rut"
                sx={{ width: "70%" }}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="address"
            rules={{ required: "Este campo es requerido" }}
            render={({ field, fieldState }) => (
              <TextField
                label="Dirección"
                sx={{ width: "70%" }}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            rules={{
              required: "Este campo es requerido",
              pattern: { value: /^[0-9]{9}$/i, message: "Teléfono inválido" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Teléfono"
                sx={{ width: "70%" }}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Este campo es requerido",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                message: "Correo inválido",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Correo"
                sx={{ width: "70%" }}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{ required: "Este campo es requerido", minLength: 8 }}
            render={({ field, fieldState }) => (
              <TextField label="Contraseña" sx={{ width: "70%" }} {...field} error={!!fieldState.error}
              helperText={fieldState.error?.message} />
            )}
          />

          {error && <Text color="error">{error.message}</Text>}
          <Button
            disabled={loading}
            type="submit"
            onClick={() => handleSubmit(confirm)}
          >
            {loading ? <CircularProgress /> : "Crear Master"}
          </Button>
        </Card>
      </form>
    </>
  );
}
