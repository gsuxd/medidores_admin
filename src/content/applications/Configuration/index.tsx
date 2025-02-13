import SSRApi from "@/api/ssrAPI";
import UsersApi from "@/api/usersApi";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { AdminContext } from "@/contexts/AdminContext";
import Config from "@/models/config";
import SSR from "@/models/ssr";
import AdminAccount from "@/models/user/adminAccount";
import SellerAccount from "@/models/user/sellerAccount";
import { UserRole } from "@/models/user/user";
import { Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  Fab,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useContext, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import AssignModal from "./components/NewSSRModal";
import CustomSnackbar from "@/components/Snackbar";
import { useForm, Controller } from "react-hook-form";

export default function SSRConfiguration() {
  const {
    auth: { user: actualUser },
  } = useContext(AdminContext);
  const query = useQuery({
    queryKey: ["ssrList"],
    queryFn: async () => await SSRApi.list(undefined),
  });

  const [showModal, setShowModal] = useState(false);

  const ssrList = useMemo(
    () =>
      query.data
        ? Array.from(query.data.ssr.values()).map((val) => (
            <MenuItem key={val.id} value={val.id}>
              {val.name}
            </MenuItem>
          ))
        : [
            <MenuItem key={-1} value={-1}>
              {query.isLoading ? "Cargando..." : "No hay SSRs"}
            </MenuItem>,
          ],
    [query.data, query.isLoading]
  );

  const [selectedSSR, setSelectedSSR] = useState<number>(-1);

  const [editSSR, setEditSSR] = useState<SSR>(
    new SSR({
      id: -1,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      address: "",
      bankNumber: "",
      bankHolder: "",
      bankName: "",
      bankRut: "",
      bankType: "",
      email: "",
      phone: "",
      president: new AdminAccount({
        id: -1,
        ssrId: -1,
        userId: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
        billDate: new Date(),
        totalDebt: 0,
        billPrice: 0,
        section1Limit: 0,
        section1Price: 0,
        section2Limit: 0,
        section2Price: 0,
        section3Limit: 0,
        section3Price: 0,
        fixedPrice: 0,
      }),
      admins: [],
      seller: new SellerAccount({
        id: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
        userId: -1,
        organizations: [],
      }),
      name: "",
      config: new Config({
        id: -1,
        billPrice: 0,
        billDate: new Date(),
        ssrId: -1,
        billPriceSection1: 0,
        billPriceSection2: 0,
        billPriceSection3: 0,
        billLimitSection1: 0,
        billLimitSection2: 0,
        billLimitSection3: 0,
        fixedPrice: 0,
        subsidy: 0,
        paymentEnabled: false,
        paymentToken: "",
      }),
    })
  );

  useEffect(() => {
    if (selectedSSR === -1 && query.data) {
      setSelectedSSR(query.data!.ssr.keys().next().value!);
    } else {
      setSelectedSSR(selectedSSR);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  useEffect(() => {
    if (selectedSSR !== -1) {
      setEditSSR(query.data!.ssr.get(selectedSSR)!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSSR]);

  const admins = useQuery({
    queryFn: async () =>
      await UsersApi.listUsers({
        role: "admin",
        ssrId: selectedSSR,
        enabled: true,
      }),
    queryKey: ["admin", selectedSSR],
  });

  const adminsList = useMemo(
    () =>
      admins.data
        ? editSSR.president.id === actualUser?.adminAccount?.id
          ? [actualUser, ...Array.from(admins.data.users.values())].map(
              (admin) => (
                <MenuItem key={admin.id} value={admin.id}>
                  {admin.fullName}
                </MenuItem>
              )
            )
          : Array.from(admins.data.users.values()).map((admin) => (
              <MenuItem key={admin.id} value={admin.id}>
                {admin.fullName}
              </MenuItem>
            ))
        : [],
    [admins.data, editSSR.president.id, actualUser]
  );

  const mutation = useMutation({
    mutationKey: ["updateSSR", editSSR.id],
    mutationFn: SSRApi.update,
  });

  async function update(formData: Partial<SSR>): Promise<void> {
    try {
      const currentSSR = query.data!.ssr.get(selectedSSR)?.toJson();
      if (!currentSSR) throw new Error("SSR no encontrado");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updates: Record<string, any> = {};

      // Procesar el campo "president"
      if (formData.president) {
        // Verificamos si el id del presidente cambió
        if (currentSSR.president.id !== formData.president.id) {
          updates.presidentId = formData.president.id;
        }
      }

      // Procesar la configuración (config)
      if (formData.config) {
        const newConfig = formData.config as Partial<Config>;
        for (const key in newConfig) {
          if (Object.prototype.hasOwnProperty.call(newConfig, key)) {
            const newVal = newConfig[key as keyof Config];
            // Excepción: no convertir a número los campos paymentEnabled y paymentToken
            if (key === "paymentEnabled" || key === "paymentToken") {
              if (currentSSR.config[key] !== newVal) {
                updates[key] = newVal;
              }
            } else {
              /// @ts-expect-error: key dinámico
              if (currentSSR.config[key] !== newVal) {
                updates[key] = Number(newVal);
              }
            }
          }
        }
      }

      // Procesar otros campos de primer nivel (excluyendo president, config y sellers)
      Object.keys(formData).forEach((key) => {
        if (["president", "config", "sellers"].includes(key)) return;
        // @ts-expect-error: key dinámico
        const newVal = formData[key];
        // Comparación simple, se asume que los valores primitivos pueden compararse directamente
        // @ts-expect-error 2532
        if (newVal !== undefined && newVal !== currentSSR[key]) {
          updates[key] = newVal;
        }
      });
      //updates.paymentToken = "mKaTZ4yBm3rVFapqNctziKCvXsjD6fDO";
      updates.id = selectedSSR;

      await mutation.mutateAsync(updates);
      setSnack({
        open: true,
        message: "SSR actualizado correctamente",
        severity: "success",
      });
      await query.refetch();
    } catch (error) {
      setSnack({
        open: true,
        message: "Error al actualizar SSR",
        severity: "error",
      });
    }
  }

  const gridStyle = {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    },
    gap: 2,
    p: 2,
  };

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { control, handleSubmit, reset, watch } = useForm<Partial<SSR>>({
    defaultValues: editSSR,
  });

  const paymentEnabled = watch("config.paymentEnabled");

  // Si editSSR cambia, actualizamos los valores del formulario.
  useEffect(() => {
    reset(editSSR);
  }, [editSSR, reset]);

  return (
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
      <CustomSnackbar
        snackState={snack}
        onClose={() => setSnack({ ...snack, open: false })}
      />
      <Helmet>
        <title>Configuración de SSR</title>
      </Helmet>
      <AssignModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        onClose={() => setShowModal(false)}
      />
      <PageTitleWrapper>
        <Stack direction="row" justifyContent="space-evenly">
          <Box>
            <Box>
              <h1>Seleccionar SSR</h1>
            </Box>
          </Box>
          <Stack direction="column">
            <Button onClick={() => setShowModal(true)}>
              <Typography variant="h5">Crear nuevo SSR</Typography>
            </Button>
            <Select
              value={selectedSSR}
              label="SSR"
              onChange={(e) => setSelectedSSR(e.target.value as number)}
            >
              {ssrList}
            </Select>
          </Stack>
        </Stack>
      </PageTitleWrapper>
      <Card sx={{ marginLeft: 2, marginRight: 2 }}>
        <form onSubmit={handleSubmit(update)}>
          {editSSR.id !== -1 && (
            <Fab
              type="submit"
              color="primary"
              style={{ position: "fixed", bottom: "10px", right: "10px" }}
              disabled={mutation.isPending}
              onClick={handleSubmit(update)}
            >
              {mutation.isPending ? <CircularProgress /> : <Save />}
            </Fab>
          )}
          {selectedSSR !== -1 ? (
            <Box p={3}>
              <Stack direction="row" justifyContent="start">
                <Box flexBasis={"50%"}>
                  <Typography variant="h2">Información</Typography>
                  <Grid {...gridStyle}>
                    <Box mb={2}>
                      <Controller
                        name="name"
                        control={control}
                        rules={{ required: "El nombre es obligatorio." }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Nombre"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                    <Box mb={2}>
                      <Controller
                        name="address"
                        control={control}
                        rules={{ required: "La dirección es obligatoria." }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Dirección"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                    <Box mb={1}>
                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          required: "El teléfono es obligatorio.",
                          pattern: {
                            value: /^[0-9\-+()\s]*$/,
                            message: "Teléfono inválido.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Teléfono"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                    <Box mb={1}>
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          required: "El correo es obligatorio.",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: "Correo inválido.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Email"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                  <Divider sx={{ mb: 1 }}>
                    <Typography variant="h5">Cuenta Bancaria</Typography>
                  </Divider>
                  <Grid {...gridStyle}>
                    <Grid item>
                      <Controller
                        name="bankName"
                        control={control}
                        rules={{
                          required: "El nombre del banco es obligatorio.",
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Banco"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Controller
                        name="bankHolder"
                        control={control}
                        rules={{
                          required: "El nombre del titular es obligatorio.",
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Nombre de Titular"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Controller
                        name="bankRut"
                        control={control}
                        rules={{ required: "El RUT es obligatorio." }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Rut de Titular"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Controller
                        name="bankNumber"
                        control={control}
                        rules={{
                          required: "El número de cuenta es obligatorio.",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Número de Cuenta"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Controller
                        name="bankType"
                        control={control}
                        rules={{
                          required: "El tipo de cuenta es obligatorio.",
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Tipo de Cuenta"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Select
                        label="Presidente"
                        value={editSSR.president.userId}
                        onChange={(e) =>
                          setEditSSR((val) =>
                            val.copyWith({
                              president: admins.data!.users.get(
                                e.target.value as number
                              )!.adminAccount,
                            })
                          )
                        }
                      >
                        {adminsList}
                      </Select>
                    </Grid>
                    <Grid item sx={{ alignItems: "center" }}>
                      <Controller
                        name="config.paymentEnabled"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Checkbox
                              {...field}
                              checked={field.value}
                              aria-label="Habilitar pagos"
                            />
                            Habilitar Pagos
                          </>
                        )}
                      />
                    </Grid>
                    {paymentEnabled && (
                      <Grid item>
                        <Controller
                          name="config.paymentToken"
                          control={control}
                          rules={{
                            required:
                              "El token es obligatorio si se habilitan pagos.",
                          }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              label="Token de Acceso"
                              value={field.value ?? ""}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box ml={2}>
                  <Typography variant="h2">Predeterminados</Typography>
                  <Box alignItems="start" p={2}>
                    {actualUser!.role === UserRole.master && (
                      <Box mb={2}>
                        <Typography variant="h5">Precio de factura</Typography>
                        <Controller
                          name="config.billPrice"
                          control={control}
                          rules={{
                            required: "El precio de factura es obligatorio.",
                            pattern: {
                              value: /^[0-9]+(\.[0-9]+)?$/,
                              message: "Formato numérico inválido.",
                            },
                          }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              label="Precio de factura"
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                            />
                          )}
                        />
                      </Box>
                    )}
                    <Box mb="1.3rem">
                      <Divider sx={{ mb: 2 }}>
                        <Typography variant="h5">Sección 1</Typography>
                      </Divider>
                      <Controller
                        name="config.billPriceSection1"
                        control={control}
                        rules={{
                          required: "El precio es obligatorio.",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]+)?$/,
                            message: "Formato numérico inválido.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Precio"
                            sx={{ mr: "1rem" }}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                      <Controller
                        name="config.billLimitSection1"
                        control={control}
                        rules={{
                          required: "El límite es obligatorio.",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Límite"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                    <Box mb="1.2rem">
                      <Divider sx={{ mb: 2 }}>
                        <Typography variant="h5">Sección 2</Typography>
                      </Divider>
                      <Controller
                        name="config.billPriceSection2"
                        control={control}
                        rules={{
                          required: "El precio es obligatorio.",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]+)?$/,
                            message: "Formato numérico inválido.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Precio"
                            sx={{ mr: "1rem" }}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                      <Controller
                        name="config.billLimitSection2"
                        control={control}
                        rules={{
                          required: "El límite es obligatorio.",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Límite"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                    <Box mb="1.3rem">
                      <Divider sx={{ mb: 2 }}>
                        <Typography variant="h5">Sección 3</Typography>
                      </Divider>
                      <Controller
                        name="config.billPriceSection3"
                        control={control}
                        rules={{
                          required: "El precio es obligatorio.",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]+)?$/,
                            message: "Formato numérico inválido.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Precio"
                            sx={{ mr: "1rem" }}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                      <Controller
                        name="config.billLimitSection3"
                        control={control}
                        rules={{
                          required: "El límite es obligatorio.",
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Solo se permiten números.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Límite"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                    <Box mb="1.3rem">
                      <Typography variant="h5">Precio fijo</Typography>
                      <Controller
                        name="config.fixedPrice"
                        control={control}
                        rules={{
                          required: "El precio fijo es obligatorio.",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]+)?$/,
                            message: "Formato numérico inválido.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Precio fijo"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h5">Subsidio</Typography>
                      <Controller
                        name="config.subsidy"
                        control={control}
                        rules={{
                          required: "El subsidio es obligatorio.",
                          pattern: {
                            value: /^[0-9]+(\.[0-9]+)?$/,
                            message: "Formato numérico inválido.",
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Subsidio"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                          />
                        )}
                      />
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </Box>
          ) : (
            <Box p={3}>
              <Typography variant="h2">No hay SSR seleccionado</Typography>
            </Box>
          )}
        </form>
      </Card>
    </motion.div>
  );
}
