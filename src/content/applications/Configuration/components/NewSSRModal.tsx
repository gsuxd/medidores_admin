import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Grid,
  DialogActions,
  TextField,
  Divider,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useContext, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@mui/icons-material";
import SSR from "@/models/ssr";
import Config from "@/models/config";
import AdminAccount from "@/models/user/adminAccount";
import { AdminContext } from "@/contexts/AdminContext";
import UsersApi from "@/api/usersApi";
import SellerAccount from "@/models/user/sellerAccount";
import User, { UserRole } from "@/models/user/user";

interface IProps {
  isOpen: boolean;
  onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
  setIsOpen: (open: boolean) => void;
}

const AssignModal: React.FC<IProps> = ({ isOpen, onClose, setIsOpen }) => {
  const {
    auth: { user: actualUser },
  } = useContext(AdminContext);
  const sellersQuery = useQuery({
    queryKey: ["sellers"],
    queryFn: async () =>
      await UsersApi.listUsers({
        role: "seller",
      }),
  });

  const sellers = useMemo(
    () =>
      sellersQuery.data
        ? actualUser!.role === "seller"
          ? [...Array.from(sellersQuery.data.users.values()), actualUser!].map(
              (val) => (
                <MenuItem key={val.id} value={val.id}>
                  {val.fullName}
                </MenuItem>
              )
            )
          : Array.from(sellersQuery.data.users.values()).map((val) => (
              <MenuItem key={val.id} value={val.id}>
                {val.fullName}
              </MenuItem>
            ))
        : [],
    [sellersQuery.data, actualUser]
  );

  const [admin, setAdmin] = useState<User>(
    new User({
      id: -1,
      name: "",
      lastName: "",
      email: "",
      rut: "",
      phone: "",
      address: "",
      password: "",
      emailVerified: true,
      role: UserRole.admin,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      adminAccount: new AdminAccount({
        billDate: new Date(Date.now()),
        billPrice: 100,
        createdAt: new Date(Date.now()),
        fixedPrice: 100,
        id: 2,
        section1Limit: 1,
        section1Price: 0,
        section2Limit: 10,
        section2Price: 0,
        section3Limit: 100,
        section3Price: 0,
        ssrId: 34,
        totalDebt: 32,
        updatedAt: new Date(Date.now()),
        userId: 0,
      }),
    })
  );

  const [ssr, setSSR] = useState<SSR>(
    new SSR({
      id: -1,
      name: "",
      email: "",
      phone: "",
      address: "",
      bankNumber: "",
      admins: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      seller:
        actualUser!.sellerAccount ??
        new SellerAccount({
          id: -1,
          createdAt: new Date(),
          organizations: [],
          updatedAt: new Date(),
          userId: -1,
        }),
      president: new AdminAccount({
        billDate: new Date(),
        updatedAt: new Date(),
        billPrice: 2000,
        fixedPrice: 1000,
        createdAt: new Date(),
        id: -1,
        section1Limit: 1,
        section2Limit: 5,
        section3Limit: 10,
        section1Price: 2,
        section2Price: 20,
        section3Price: 200,
        ssrId: -1,
        totalDebt: 0,
        userId: -1,
      }),
      config: new Config({
        billDate: new Date(),
        billPrice: 1000,
        billLimitSection1: 1,
        billLimitSection2: 5,
        billLimitSection3: 10,
        billPriceSection1: 2,
        billPriceSection2: 20,
        billPriceSection3: 200,
        fixedPrice: 1000,
        id: -1,
        ssrId: -1,
        subsidy: 0,
      }),
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    const [key, subKey] = (name as string).split(".");
    switch (key) {
      case "user":
        setAdmin((val) => val.copyWith({ [subKey]: value }));
        break;
      case "ssr":
        setSSR((val) => val.copyWith({ [subKey]: value }));
        break;
      default:
        break;
    }
  };

  const confirm = async () => {
    //format(user.data.profile.date_birth, "yyyy-MM-dd");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendData: any = {
      ...ssr.toJson(),
      user: admin.toJson(),
      sellerId: ssr.seller.id
    };
    delete sendData["config"];
    delete sendData["seller"];
    delete sendData["president"];
    const { data } = await axios({
      method: "post",
      url: import.meta.env.VITE_SERVER_URL + "/api/admin/ssr/",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")!}`,
      },
      data: sendData,
    });
    setIsOpen(false);
    return data;
  };
  const confirmQuery = useMutation({ mutationFn: () => confirm() });

  const handleConfirm = async () => {
    await confirmQuery.mutateAsync();
    if (confirmQuery.data) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog fullWidth open={isOpen} onClose={onClose}>
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Creación de SSR
            <Button onClick={(e) => onClose(e, "backdropClick")}>
              <CloseIcon />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          <Grid
            sx={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
            }}
            gap={2}
          >
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .name
                  }
                  label="Nombre"
                  id="ssr.name"
                  name="ssr.name"
                  value={ssr.name}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  label="Email"
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .email
                  }
                  id="ssr.email"
                  name="ssr.email"
                  type="email"
                  value={ssr.email}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .phone
                  }
                  label="Teléfono"
                  id="ssr.phone"
                  name="ssr.phone"
                  value={ssr.phone}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .address
                  }
                  label="Dirección"
                  id="ssr.address"
                  name="ssr.address"
                  value={ssr.address}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .bankNumber
                  }
                  label="Número de cuenta"
                  id="ssr.bankNumber"
                  name="ssr.bankNumber"
                  value={ssr.bankNumber}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            {actualUser!.role === "master" && (
              <Grid item>
                <FormControl
                  sx={{
                    minWidth: "100%",
                  }}
                >
                  <InputLabel htmlFor="ssr.seller">Vendedor</InputLabel>
                  <Select
                    error={
                      //@ts-expect-error 321
                      (confirmQuery.error as AxiosError)?.response?.data.error
                        .sellerId
                    }
                    labelId="ssr.seller"
                    label="Vendedor"
                    id="ssr.seller"
                    name="ssr.seller"
                    value={ssr.seller.userId}
                    onChange={(e) =>
                      setSSR((val) =>
                        val.copyWith({
                          seller: sellersQuery.data!.users.get(
                            e.target.value as number
                          )!.sellerAccount!,
                        })
                      )
                    }
                  >
                    {sellers}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item gap="1rem">
              <Divider/>
              <Typography>Presidente (Admin)</Typography>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .name
                  }
                  label="Nombre"
                  id="user.name"
                  name="user.name"
                  value={admin.name}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .lastName
                  }
                  label="Apellido"
                  id="user.lastName"
                  name="user.lastName"
                  value={admin.lastName}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .email
                  }
                  label="Email"
                  id="user.email"
                  name="user.email"
                  type="email"
                  value={admin.email}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error.rut
                  }
                  label="Rut"
                  id="user.rut"
                  name="user.rut"
                  value={admin.rut}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .phone
                  }
                  label="Teléfono"
                  id="user.phone"
                  name="user.phone"
                  value={admin.phone}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .address
                  }
                  label="Dirección"
                  id="user.address"
                  name="user.address"
                  value={admin.address}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  error={
                    //@ts-expect-error 321
                    (confirmQuery.error as AxiosError)?.response?.data.error
                      .password
                  }
                  label="Contraseña"
                  id="user.password"
                  name="user.password"
                  value={admin.password}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              if (confirmQuery.data) {
                onClose({}, "backdropClick");
                return;
              }
              handleConfirm();
            }}
          >
            {" "}
            {confirmQuery.data ? (
              <Label color="success">Creado</Label>
            ) : confirmQuery.isPending ? (
              <CircularProgress color="secondary" />
            ) : (
              "Crear"
            )}{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AssignModal;
