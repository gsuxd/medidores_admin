import AuthApi from "@/api/authApi";
import CustomSnackbar from "@/components/Snackbar";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function RecoverPassword() {
  const { token } = useParams<{ token: string }>();
  const mutation = useMutation({
    mutationFn: AuthApi.recoverPassword,
    onError: (error) => {
      setSnack({
        open: true,
        message: error.message,
        severity: "error",
      });
    },
    onSuccess: () => {
      setSnack({
        open: true,
        message: "Contraseña actualizada",
        severity: "success",
      });
    },
  });

  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
    visiblePassword: false,
    visibleConfirmPassword: false,
  })


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  if (!token) {
    return (
      <Box>
        <Typography>Se necesita un token para poder continuar</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <CustomSnackbar
        onClose={() => setSnack({ ...snack, open: false })}
        snackState={snack}
      />
      <Typography>Recuperar contraseña</Typography>
      <TextField
        type="password"
        name="password"
        label="Contraseña"
        value={values.password}
        error={values.password.trim().length < 6}
        aria-errormessage="La contraseña debe tener al menos 6 caracteres"
        onChange={handleChange}
        InputProps={{ // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Cambiar visibilidad de la contraseña"
                  onClick={() => setValues({ ...values, visiblePassword: !values.visiblePassword })}
                  onMouseDown={() => setValues({ ...values, visiblePassword: !values.visiblePassword })}
                >
                  {values.visiblePassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
      />
      <TextField
        type="password"
        name="confirmPassword"
        label="Confirmar contraseña"
        value={values.confirmPassword}
        error={values.password !== values.confirmPassword}
        aria-errormessage="Las contraseñas no coinciden"
        onChange={handleChange}
        InputProps={{ // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Cambiar visibilidad de la contraseña"
                  onClick={() => setValues({ ...values, visibleConfirmPassword: !values.visibleConfirmPassword })}
                  onMouseDown={() => setValues({ ...values, visibleConfirmPassword: !values.visibleConfirmPassword })}
                >
                  {values.visibleConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
      />
      <LoadingButton
        loading={mutation.isPending}
        disabled={values.password.trim().length < 6 || values.password !== values.confirmPassword}
        onClick={() => mutation.mutate({ token, newPassword: values.password })}
      >
        Recuperar
      </LoadingButton>
    </Box>
  );
}
