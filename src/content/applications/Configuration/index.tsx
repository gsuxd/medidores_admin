import SSRApi from "@/api/ssrAPI";
import UsersApi from "@/api/usersApi";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { AdminContext } from "@/contexts/AdminContext";
import Config from "@/models/config";
import SSR from "@/models/ssr";
import SellerAccount from "@/models/user/sellerAccount";
import { UserRole } from "@/models/user/user";
import { Save } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import {
  Alert,
  Box,
  Card,
  CircularProgress,
  Divider,
  Fab,
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

export default function SSRConfiguration() {
  const {
    auth: { user: actualUser },
  } = useContext(AdminContext);
  const query = useQuery({
    queryKey: ["ssrList"],
    queryFn: SSRApi.list,
  });

  const ssrList = useMemo(
    () =>
      query.data &&
      Array.from(query.data.ssr.values()).map((val) => (
        <MenuItem key={val.id} value={val.id}>
          {val.name}
        </MenuItem>
      )),
    [query.data]
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
      email: "",
      phone: "",
      president: new SellerAccount({
        id: -1,
        ssrId: -1,
        userId: -1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: undefined,
      }),
      sellers: [],
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
      }),
    })
  );

  useEffect(() => {
    if (selectedSSR === -1 && query.data) {
      setSelectedSSR(query.data!.ssr.keys().next().value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  useEffect(() => {
    if (selectedSSR !== -1) {
      setEditSSR(query.data!.ssr.get(selectedSSR)!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSSR]);

  const handleChange = (e: React.ChangeEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    if (name.includes(".")) {
      const [obj, key] = name.split(".");
      setEditSSR((val) => {
        return val.copyWith({
          [obj]: {
            //@ts-expect-error 3943
            ...val[obj],
            [key]: value,
          },
        });
      });
      return;
    }
    setEditSSR((val) => {
      return val.copyWith({
        [name]: value,
      });
    });
  };

  const sellers = useQuery({
    queryFn: async () =>
      await UsersApi.listUsers({
        role: "seller",
        ssrId: selectedSSR,
        enabled: true,
      }),
    queryKey: ["sellers", selectedSSR],
  });

  const sellersList = useMemo(
    () =>
      sellers.data
        ? Array.from(sellers.data.users.values()).map((seller) => (
            <MenuItem key={seller.id} value={seller.id}>
              {seller.name}
            </MenuItem>
          ))
        : [],
    [sellers.data]
  );

  const [showAlert, setShowAlert] = useState(false);

  const mutation = useMutation({
    mutationKey: ["updateSSR", editSSR.id],
    mutationFn: SSRApi.update,
    onMutate: async () => {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      await query.refetch();
    },
  });

  function update() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = editSSR.toJson();
    const ssr = query.data!.ssr.get(selectedSSR)?.toJson();
    for (const key in data) {
      if (key === "president") {
        if (data["president"] === ssr["president"]["id"]) {
          data["presidentId"] = data["president"]["id"];
        }
        delete data["president"];
        continue;
      }
      if (key === "config") {
        for (const subKey in data["config"]) {
          if (ssr["config"][subKey] === data["config"][subKey]) {
            delete data["config"][subKey];
            continue;
          }
          data[subKey] = data["config"][subKey];
        }
      }
      if (!data[key]) {
        delete data[key];
        continue;
      }
      if (key === "sellers") {
        delete data[key];
      }
      if (data[key] === ssr![key]) {
        delete data[key];
        continue;
      }
    }
    data["id"] = selectedSSR;
    mutation.mutate(data);
  }

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
      {showAlert && (
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        Actualizado exitosamente.
      </Alert>
      )}
      {
        <Helmet>
          <title>Configuración de SSR</title>
        </Helmet>
      }

      <PageTitleWrapper>
        <Stack direction="row" justifyContent="space-evenly">
          <Box>
            <h1>Seleccionar SSR</h1>
          </Box>
          <Select
            value={selectedSSR}
            label="SSR"
            onChange={(e) => setSelectedSSR(e.target.value as number)}
          >
            {ssrList}
          </Select>
        </Stack>
      </PageTitleWrapper>
      {editSSR.id !== -1 && (
        <Fab
          color="primary"
          style={{ position: "fixed", bottom: "10px", right: "10px" }}
          disabled={mutation.isPending}
          onClick={update}
        >
          {mutation.isPending ? <CircularProgress /> : <Save />}
        </Fab>
      )}
      <Card sx={{ marginLeft: 2, marginRight: 2 }}>
        <Box p={3}>
          <Stack direction="row" justifyContent="start">
            <Box flexBasis={"50%"}>
              <Typography variant="h2">Información</Typography>
              <Box gap={2} p={2}>
                <Box mb={2}>
                  <Typography variant="h5">Nombre</Typography>
                  <TextField
                    name={"name"}
                    value={editSSR.name}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="h5">Dirección</Typography>
                  <TextField
                    name={"address"}
                    value={editSSR.address}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={1}>
                  <Typography variant="h5">Teléfono</Typography>
                  <TextField
                    name={"phone"}
                    value={editSSR.phone}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={1}>
                  <Typography variant="h5">Email</Typography>
                  <TextField
                    name={"email"}
                    value={editSSR.email}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={1}>
                  <Typography variant="h5">Número de cuenta</Typography>
                  <TextField
                    name={"bankNumber"}
                    value={editSSR.bankNumber}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>

                <Box mb={1}>
                  <Typography variant="h5">Presidente</Typography>
                  <Select
                    label="Presidente"
                    value={editSSR.president.userId}
                    onChange={(e) =>
                      setEditSSR((val) =>
                        val.copyWith({
                          president: sellers.data!.users.get(
                            e.target.value as number
                          )!.sellerAccount,
                        })
                      )
                    }
                  >
                    {sellersList}
                  </Select>
                </Box>
              </Box>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box ml={2}>
              <Typography variant="h2">Predeterminados</Typography>
              <Box gap={2} alignItems="start" p={2}>
                {actualUser!.role === UserRole.master && (
                  <Box mb={2}>
                    <Typography variant="h5">Precio de factura</Typography>
                    <TextField
                      name={"config.billPrice"}
                      value={editSSR.config.billPrice}
                      onChange={(e) => handleChange(e)}
                    />
                  </Box>
                )}
                <Box mb={2}>
                  <Typography variant="h5">
                    Precio de factura sección 1
                  </Typography>
                  <TextField
                    name={"config.billPriceSection1"}
                    value={editSSR.config.billPriceSection1}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="h5">
                    Precio de factura sección 2
                  </Typography>
                  <TextField
                    name={"config.billPriceSection2"}
                    value={editSSR.config.billPriceSection2}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="h5">
                    Precio de factura sección 3
                  </Typography>
                  <TextField
                    name={"config.billPriceSection3"}
                    value={editSSR.config.billPriceSection3}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="h5">
                    Límite de factura sección 1
                  </Typography>
                  <TextField
                    name={"config.billLimitSection1"}
                    value={editSSR.config.billLimitSection1}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="h5">
                    Límite de factura sección 2
                  </Typography>
                  <TextField
                    name={"config.billLimitSection2"}
                    value={editSSR.config.billLimitSection2}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="h5">
                    Límite de factura sección 3
                  </Typography>
                  <TextField
                    name={"config.billLimitSection3"}
                    value={editSSR.config.billLimitSection3}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="h5">Precio fijo</Typography>
                  <TextField
                    name={"config.fixedPrice"}
                    value={editSSR.config.fixedPrice}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="h5">Subsidio</Typography>
                  <TextField
                    name={"config.subsidy"}
                    value={editSSR.config.subsidy}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Card>
    </motion.div>
  );
}
