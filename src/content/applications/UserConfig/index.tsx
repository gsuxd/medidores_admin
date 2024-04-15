import PageTitleWrapper from "@/components/PageTitleWrapper";
import { AdminContext } from "@/contexts/AdminContext";
import { Button, Card, Container, Grid, TextField } from "@mui/material";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";

export default function UserConfig() {
  const {
    auth: { user: actualUser, update, updateMutation: {loading} },
  } = useContext(AdminContext);

  const [user, setUser] = useState(actualUser!);
  const [password, setPassword] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "password") {
      setPassword(e.target.value);
      return;
    }
    setUser((val) => val.copyWith({ [e.target.name]: e.target.value }));
  };

  return (
    <>
      <motion.div
        initial={{
          y: window.innerHeight * 0.5,
        }}
        animate={{
          y: 0,
        }}
        exit={{
          y: parseInt("-" + window.innerHeight.toString()),
        }}
      >
        {
          <Helmet>
            <title>Editar Perfil</title>
          </Helmet>
        }
        <PageTitleWrapper>
          <h1>Editar perfil</h1>
        </PageTitleWrapper>

        <Card>
          <Container maxWidth="lg">
            <Grid
              p={2}
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={3}
            >
              <Grid item xs={12}>
                <TextField
                  label="Nombre"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Apellido"
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Nueva Contraseña"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Teléfono"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Rut"
                  name="rut"
                  value={user.rut}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button disabled={loading} variant="contained" onClick={() => {
                    const userData = password.trim() === "" ? user : user.copyWith({ password });
                    update(userData);
                }}>
                  {loading ? "Guardando..." : "Guardar"}
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Card>
      </motion.div>
    </>
  );
}
