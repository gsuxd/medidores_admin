import Text from "@/components/Text";
import { AdminContext } from "@/contexts/AdminContext";
import { Box, Button, Card, TextField, Typography, useMediaQuery } from "@mui/material";
import { useContext, useState } from "react";
import Logo from "@/assets/logo.jpeg";

export default function LoginPage() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const {
    auth: {
      loginMutation: { error },
      login,
    },
  } = useContext(AdminContext);
  const phone = useMediaQuery('max-width: 640px')
  return (
    <>
      <Box
        display="flex"
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            placeItems: "center",
            gap: "2rem",
            padding: "4rem 0",
            maxWidth: phone ? 400 : 'unset',
            maxHeight: phone ? 400 : 'unset'
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
          <TextField
            value={values.email}
            sx={{width: "70%"}}
            type="email"
            required
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          <TextField
            value={values.password}
            sx={{width: "70%"}}
            type="password"
            required
            onChange={(e) => setValues({ ...values, password: e.target.value })}
          />
          {error && <Text color="error">{error.message}</Text>}
          <Button onClick={() => login(values.email, values.password)}>
            Iniciar Sesión
          </Button>
        </Card>
      </Box>
    </>
  );
}
