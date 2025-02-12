import Text from "@/components/Text";
import { AdminContext } from "@/contexts/AdminContext";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useContext, useEffect } from "react";
import Logo from "../../assets/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";

export default function LoginPage() {
  const {control, handleSubmit} = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    auth: {
      loginMutation: { error, loading },
      login,
    },
  } = useContext(AdminContext);

  const phone = useMediaQuery("max-width: 640px");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin/dashboard", { replace: true });

    }
  }, [navigate]);

  return (
    <>
      <Box
        display="flex"
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <form onSubmit={handleSubmit(login)}>

        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            placeItems: "center",
            gap: "2rem",
            padding: "4rem 0",
            maxWidth: phone ? 400 : "unset",
            maxHeight: phone ? 400 : "unset",
          }}
        >
          <img
            src={Logo}
            alt="logo"
            width="20%"
            style={{ borderRadius: "50%" }}
          />
          <Typography mb="1rem" variant="h2">
            Iniciar Sesión
          </Typography>
          <Controller 
          control={control}
          name="email"
          rules={{ required: "Este campo es requerido", pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" } }}
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
          rules={{ required: "Este campo es requerido" }}
          render={({ field, fieldState }) => (
            <TextField
            label="Contraseña"
            sx={{ width: "70%" }}
            type="password"
            {...field}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            />
          )}
          />
          {error && <Text color="error">{error.message}</Text>}
          <Button type="submit" variant="contained" sx={{ width: "70%" }}>
            {error ? "Intentar de nuevo" : loading ? <CircularProgress color="secondary" /> : "Iniciar Sesión"}
          </Button>
        </Card>
            </form>
      </Box>
    </>
  );
}
