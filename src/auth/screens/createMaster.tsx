import Text from "@/components/Text";
import {
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Logo from "@/assets/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "@/contexts/AdminContext";

export default function LoginPage() {
  const [values, setValues] = useState({
    name: "",
    lastName: "",
    rut: "",
    address: "",
    phone: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const {auth: {createMaster: {mutate, error, loading}}} = useContext(AdminContext);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/admin/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto 0",
            placeItems: "center",
            gap: "2rem",
            padding: "4rem 0",
            overflow: "auto"
          }}
        >
          <img
            src={Logo}
            alt="logo"
            width="20%"
            style={{ borderRadius: "50%" }}
          />
          <Typography mb="1rem" variant="h2">
            Crea tu usuario master
          </Typography>
          <TextField
            label="Nombre"
            value={values.name}
            sx={{ width: "70%" }}
            required
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
          <TextField
            label="Apellido"
            value={values.lastName}
            sx={{ width: "70%" }}
            required
            onChange={(e) => setValues({ ...values, lastName: e.target.value })}
          />
          <TextField
            label="Rut"
            value={values.rut}
            sx={{ width: "70%" }}
            required
            onChange={(e) => setValues({ ...values, rut: e.target.value })}
          />
          <TextField
            label="Dirección"
            value={values.address}
            sx={{ width: "70%" }}
            required
            onChange={(e) => setValues({ ...values, address: e.target.value })}
          />
          <TextField
            label="Teléfono"
            value={values.phone}
            sx={{ width: "70%" }}
            required
            onChange={(e) => setValues({ ...values, phone: e.target.value })}
          />
          <TextField
            label="Correo"
            value={values.email}
            sx={{ width: "70%" }}
            type="email"
            required
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          <TextField
            label="Contraseña"
            value={values.password}
            sx={{ width: "70%" }}
            type="password"
            required
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          {error && (
            <Text color="error">{error.message}</Text>
          )}
          <Button
            disabled={loading}
            onClick={() => mutate(values)}
          >
            {loading ? <CircularProgress /> : "Crear Master"}
          </Button>
        </Card>
    </>
  );
}
