import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  InputLabel,
  FormControl,
  Input,
  Select,
  MenuItem,
  Grid,
  DialogActions,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@mui/icons-material";
import { usersContext } from "../context";
// import { DesktopDatePicker } from "@mui/x-date-pickers";
import User, { UserRole } from "@/models/user/user";
import { AdminContext } from "@/contexts/AdminContext";
import PartnerAccount from "@/models/user/partnerAccount";
import AdminAccount from "@/models/user/adminAccount";
import OperatorAccount from "@/models/user/operatorAccount";
import UsersApi from "@/api/usersApi";

interface IProps {
  isOpen: boolean;
  user?: User | null;
  onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
  setIsOpen: (open: boolean) => void;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AssignModal: React.FC<IProps> = ({
  isOpen,
  user: userSelected,
  onClose,
  setIsOpen,
  setSelectedUser,
}) => {
  const {
    auth: { user: actualUser },
  } = useContext(AdminContext);
  const [user, setUser] = useState<User>(
    userSelected ??
      new User({
        address: "",
        createdAt: new Date(Date.now()),
        emailVerified: true,
        id: -1,
        lastName: "",
        name: "",
        phone: "",
        role: UserRole.partner,
        rut: "",
        updatedAt: new Date(Date.now()),
        email: "",
        password: "",
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
        operatorAccount: new OperatorAccount({
          adminId: 0,
          createdAt: new Date(Date.now()),
          id: 0,
          updatedAt: new Date(Date.now()),
          userId: 0,
        }),
        partnerAccount: new PartnerAccount({
          id: -1,
          measurer: "",
          totalConsumed: 0,
          totalDebt: 0,
          userId: -1,
          adminId: -1,
        }),
      })
  );
  const { filters } = useContext(usersContext);

  const query = useQuery({
    queryFn: () =>
      UsersApi.listUsers({
        role:
          user.role === UserRole.operator || user.role === UserRole.partner
            ? "admin"
            : "seller",
        ssrId: filters.ssrId,
      }),
    queryKey: ["usersModal"],
  });

  const selectionUsers = useMemo<Map<number, User>>(() => {
    const users = new Map();
    const filtered =
      Array.from(query.data?.users.values() ?? []).filter((val) => {
        if (userSelected && userSelected.id === val.id) return false;
        switch (user?.role) {
          case UserRole.admin:
            return val.role === UserRole.seller;
          case UserRole.seller:
            return false;
          case UserRole.operator:
            return val.role === UserRole.admin;
          case UserRole.partner:
            return val.role === UserRole.admin;
          default:
            return false;
        }
      }) ?? [];
    for (const user of filtered!) {
      users.set(user.id, user);
    }
    return users;
  }, [query.data?.users, user?.role, userSelected]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [adminId, setAdminId] = useState<number>(
    userSelected &&
      userSelected.getSuperior(Array.from(query.data?.users.values() ?? []))
      ? userSelected.getSuperior(Array.from(query.data!.users!.values()))!.id
      : (actualUser!.role === UserRole.admin &&
          user?.role !== UserRole.admin) ||
        (actualUser?.role === UserRole.seller && user?.role === UserRole.admin)
      ? actualUser!.id
      : selectionUsers.size > 0
      ? selectionUsers.entries().next().value[0]
      : ""
  );

  useEffect(() => {
    //@ts-expect-error 3212
    if (adminId === "") {
      setAdminId(
        userSelected &&
          userSelected.getSuperior(Array.from(query.data?.users.values() ?? []))
          ? userSelected.getSuperior(Array.from(query.data!.users!.values()))!
              .id
          : (actualUser!.role === UserRole.admin &&
              user?.role !== UserRole.admin) ||
            (actualUser?.role === UserRole.seller &&
              user?.role === UserRole.admin)
          ? actualUser!.id
          : selectionUsers.size > 0
          ? selectionUsers.entries().next().value[0]
          : ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    let newUser = user;
    if (name.includes(".")) {
      const [key, subKey] = name.split(".");
      switch (key) {
        case "partnerAccount":
          newUser = newUser.copyWith({
            partnerAccount: newUser.partnerAccount?.copyWith({
              [subKey]: value,
            }),
          });
          setUser(newUser);
          return;
        case "adminAccount":
          newUser = newUser.copyWith({
            adminAccount: newUser.adminAccount?.copyWith({ [subKey]: value }),
          });
          setUser(newUser);
          return;
        case "operatorAccount":
          newUser = newUser.copyWith({
            operatorAccount: newUser.operatorAccount?.copyWith({
              [subKey]: value,
            }),
          });
          setUser(newUser);
          return;
        // case 'sellerAccount':
        //   newUser = newUser.copyWith({
        //     [key]: newUser[key].copyWith({ [subKey]: value }),
        //   });
        //   break;
      }
      newUser = newUser.copyWith({
        [key]: {
          //@ts-expect-error 40392
          ...newUser[key],
          [subKey]: value,
        },
      });
    }
    setUser(newUser.copyWith({ [name]: value }));
  };

  const confirm = async () => {
    //format(user.data.profile.date_birth, "yyyy-MM-dd");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendData: any = {
      ...user.toJson(),
      adminId,
    };

    switch (user.role) {
      case UserRole.partner:
        sendData["totalDebt"] = user.partnerAccount?.totalDebt;
        sendData["totalConsumed"] = user.partnerAccount?.totalConsumed;
        sendData["measurer"] = user.partnerAccount?.measurer;
        sendData["adminId"] =
          actualUser!.role === UserRole.admin
            ? actualUser?.adminAccount?.id
            : selectionUsers.get(adminId)?.adminAccount?.id;
        break;
      case UserRole.operator:
        sendData["adminId"] =
          actualUser!.role === UserRole.admin
            ? actualUser?.adminAccount?.id
            : selectionUsers.get(adminId)?.adminAccount?.id;
        break;
      case UserRole.admin:
        sendData["ssrId"] = filters.ssrId!;
        sendData["sellerId"] =
          actualUser!.role === UserRole.seller
            ? actualUser?.sellerAccount?.id
            : selectionUsers.get(adminId)?.sellerAccount?.id;
        sendData["fixedPrice"] = parseFloat(
          user.adminAccount?.fixedPrice as unknown as string
        );
        sendData["section1Limit"] = parseFloat(
          user.adminAccount?.section1Limit as unknown as string
        );
        sendData["section1Price"] = parseFloat(
          user.adminAccount?.section1Price as unknown as string
        );
        sendData["section2Limit"] = parseFloat(
          user.adminAccount?.section2Limit as unknown as string
        );
        sendData["section2Price"] = parseFloat(
          user.adminAccount?.section2Price as unknown as string
        );
        sendData["section3Limit"] = parseFloat(
          user.adminAccount?.section3Limit as unknown as string
        );
        sendData["section3Price"] = parseFloat(
          user.adminAccount?.section3Price as unknown as string
        );
        if (actualUser!.role === UserRole.master) {
          sendData["billDate"] = user.adminAccount?.billDate;
          sendData["billPrice"] = parseFloat(
            user.adminAccount?.billPrice as unknown as string
          );
        }
    }
    const userData = user.toJson();
    for (const key of Object.keys(userSelected ?? {})) {
      if (key === "id") continue;
      //@ts-expect-error 40392
      const val = userData[key];
      //@ts-expect-error 40392
      if (userSelected?.toJson()[key] === val) {
        delete sendData[key];
      }
    }

    const { data } = await axios({
      method: user.id > 0 ? "put" : "post",
      url: import.meta.env.VITE_SERVER_URL + "/api/admin/user/",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")!}`,
      },
      data: sendData,
    });
    setSelectedUser(null);
    setIsOpen(false);
    return data;
  };

  const confirmQuery = useMutation({ mutationFn: async () => await confirm(), throwOnError: false });

  const handleConfirm = async () => {
    await confirmQuery.mutateAsync();
    if (confirmQuery.data) {
      setIsOpen(false);
      setSelectedUser(null);
      query.refetch();
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
            {userSelected ? "Edición" : "Creación"} de usuario{" "}
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
                <InputLabel htmlFor="email">Correo</InputLabel>
                <Input
                  error={
                    //@ts-expect-error 321
                    (query.error as AxiosError)?.response?.data.error.email
                  }
                  id="email"
                  type="email"
                  name="email"
                  value={user?.email}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
                  //@ts-expect-error 321
                  error={(query.error as AxiosError)?.response?.data.error.name}
                  id="name"
                  name="name"
                  value={user?.name}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="lastName">Apellido</InputLabel>
                <Input
                  error={
                    //@ts-expect-error 321
                    (query.error as AxiosError)?.response?.data.error.lastName
                  }
                  id="lastName"
                  name="lastName"
                  value={user?.lastName}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            {!userSelected && (
              <Grid item>
                <FormControl>
                  <InputLabel htmlFor="password">Contraseña</InputLabel>
                  <Input
                    error={
                      //@ts-expect-error 321
                      (query.error as AxiosError)?.response?.data.error.password
                    }
                    id="password"
                    name="password"
                    value={user?.password}
                    onChange={(e) => handleChange(e)}
                  />
                </FormControl>
              </Grid>
            )}
            <Grid item>
              <FormControl
                sx={{
                  minWidth: "100%",
                }}
              >
                <InputLabel htmlFor="role">Tipo</InputLabel>
                <Select
                  //@ts-expect-error 321
                  error={(query.error as AxiosError)?.response?.data.error.role}
                  labelId="role"
                  label="Tipo de usuario"
                  id="role"
                  name="role"
                  value={user?.role}
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value={UserRole.partner}>Socio</MenuItem>
                  <MenuItem value={UserRole.operator}>Operador</MenuItem>
                  {actualUser!.role !== UserRole.admin && (
                    <MenuItem value={UserRole.admin}>Administrador</MenuItem>
                  )}
                  {actualUser!.role === UserRole.master && (
                    <MenuItem value={UserRole.seller}>Vendedor</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            {user.role === UserRole.operator ||
              (user.role === UserRole.partner && (
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <InputLabel htmlFor="adminId">Administrador</InputLabel>
                    <Select
                      error={
                        //@ts-expect-error 321
                        (query.error as AxiosError)?.response?.data.error
                          .adminId
                      }
                      labelId="adminId"
                      label="Administrador"
                      id="adminId"
                      name="adminId"
                      value={adminId}
                      required
                      children={
                        selectionUsers.size > 0
                          ? Array.from(selectionUsers.values()).map((val) => (
                              <MenuItem
                                LinkComponent={"div"}
                                key={val.id}
                                value={val.id}
                              >
                                {val.fullName}
                              </MenuItem>
                            ))
                          : []
                      }
                      onChange={(e) => setAdminId(e.target.value as number)}
                    />
                  </FormControl>
                </Grid>
              ))}
            {user.id !== -1 && (
              <Grid item>
                <FormControlLabel
                  label="Correo Verificado?"
                  control={
                    <Switch
                      name="emailVerified"
                      checked={user?.emailVerified}
                      disabled={user?.emailVerified}
                      onChange={(e) =>
                        setUser(
                          user.copyWith({
                            emailVerified: e.target.checked,
                          })
                        )
                      }
                    />
                  }
                />
              </Grid>
            )}
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="rut">Rut</InputLabel>
                <Input
                  error={
                    //@ts-expect-error 321
                    (query.error as AxiosError)?.response?.data.error["rut"]
                  }
                  id="rut"
                  name="rut"
                  value={user?.rut}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="phone">Telefono</InputLabel>
                <Input
                  error={
                    //@ts-expect-error 321
                    (query.error as AxiosError)?.response?.data.error.phone
                  }
                  id="phone"
                  name="phone"
                  value={user?.phone}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="address">Direccion</InputLabel>
                <Input
                  error={
                    //@ts-expect-error 321
                    (query.error as AxiosError)?.response?.data.error.address
                  }
                  id="address"
                  name="address"
                  value={user?.address}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            {user.role === UserRole.partner && (
              <>
                <Grid item>
                  <FormControl>
                    <InputLabel htmlFor="measurer">
                      Numero de medidor
                    </InputLabel>
                    <Input
                      error={
                        //@ts-expect-error 321
                        (query.error as AxiosError)?.response?.data.error
                          .measurer
                      }
                      id="measurer"
                      name="partnerAccount.measurer"
                      value={user!.partnerAccount!.measurer}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
                {(user!.id < 0 ||
                  actualUser!.role === UserRole.seller ||
                  actualUser!.role === UserRole.master) &&
                  user!.role === UserRole.partner && (
                    <>
                      <Grid item>
                        <FormControl>
                          <InputLabel htmlFor="totalDebt">
                            Deuda total
                          </InputLabel>
                          <Input
                            error={
                              //@ts-expect-error 321
                              (query.error as AxiosError)?.response?.data.error
                                .totalDebt
                            }
                            id="totalDebt"
                            name="partnerAccount.totalDebt"
                            placeholder="Deuda total"
                            type="number"
                            value={user!.partnerAccount!.totalDebt}
                            onChange={(e) => handleChange(e)}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item>
                        <FormControl>
                          <InputLabel htmlFor="totalConsumed">
                            Consumido
                          </InputLabel>
                          <Input
                            error={
                              //@ts-expect-error 321
                              (query.error as AxiosError)?.response?.data.error
                                .totalConsumed
                            }
                            id="totalConsumed"
                            name="partnerAccount.totalConsumed"
                            type="number"
                            placeholder="Consumido (M3)"
                            value={user!.partnerAccount!.totalConsumed}
                            onChange={(e) => handleChange(e)}
                          />
                        </FormControl>
                      </Grid>
                    </>
                  )}
              </>
            )}

            {user?.role === UserRole.admin && (
              <>
                {actualUser!.role === UserRole.master && (
                  <>
                    {/* <Grid item>
                      <FormControl>
                        <InputLabel htmlFor="billDate">
                          Fecha de Factura
                        </InputLabel>
                        <Input
                          error={
                            (query.error as AxiosError)?.response?.data.error
                              .billDate
                          }
                          id="billDate"
                          name="adminAccount.billDate"
                          type="date"
                          value={user!.adminAccount!.billDate}
                          onChange={(e) => handleChange(e)}
                        />
                      </FormControl>
                    </Grid> */}
                    <Grid item>
                      <FormControl>
                        <InputLabel htmlFor="billPrice">
                          Precio de Factura
                        </InputLabel>
                        <Input
                          error={
                            //@ts-expect-error 321
                            (query.error as AxiosError)?.response?.data.error
                              .billPrice
                          }
                          id="billPrice"
                          name="adminAccount.billPrice"
                          placeholder="Precio de Factura"
                          type="number"
                          value={user!.adminAccount!.billPrice}
                          onChange={(e) => handleChange(e)}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <FormControl>
                        <InputLabel htmlFor="totalDebt">Deuda total</InputLabel>
                        <Input
                          error={
                            //@ts-expect-error 321
                            (query.error as AxiosError)?.response?.data.error
                              .totalDebt
                          }
                          id="totalDebt"
                          name="adminAccount.totalDebt"
                          placeholder="Deuda total"
                          type="number"
                          value={user!.adminAccount!.totalDebt}
                          onChange={(e) => handleChange(e)}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
                <Grid item>
                  <FormControl>
                    <InputLabel htmlFor="fixedPrice">Precio Fijo</InputLabel>
                    <Input
                      error={
                        //@ts-expect-error 321
                        (query.error as AxiosError)?.response?.data.error
                          .fixedPrice
                      }
                      id="fixedPrice"
                      name="adminAccount.fixedPrice"
                      placeholder="Precio Fijo"
                      type="number"
                      value={user!.adminAccount!.fixedPrice}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
                {/* <Grid item>
                  <FormControl>
                    <InputLabel htmlFor="section1Limit">
                      Seccion 1 Limite
                    </InputLabel>
                    <Input
                      error={
                        //@ts-expect-error 321
                        (query.error as AxiosError)?.response?.data.error
                          .section1Limit
                      }
                      id="section1Limit"
                      name="adminAccount.section1Limit"
                      placeholder="Sección 1 Limite"
                      type="number"
                      value={user!.adminAccount!.section1Limit}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid> */}
                <Grid item>
                  <FormControl>
                    <InputLabel htmlFor="section1Price">
                      Seccion 1 Precio
                    </InputLabel>
                    <Input
                      error={
                        //@ts-expect-error 321
                        (query.error as AxiosError)?.response?.data.error
                          .section1Price
                      }
                      id="section1Price"
                      name="adminAccount.section1Price"
                      placeholder="Sección 1 Precio"
                      type="number"
                      value={user!.adminAccount!.section1Price}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel htmlFor="section2Limit">
                      Seccion 2 Limite
                    </InputLabel>
                    <Input
                      error={
                        //@ts-expect-error 321
                        (query.error as AxiosError)?.response?.data.error
                          .section2Limit
                      }
                      id="section2Limit"
                      name="adminAccount.section2Limit"
                      placeholder="Sección 2 Limite"
                      type="number"
                      value={user!.adminAccount!.section2Limit}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel htmlFor="section2Price">
                      Seccion 2 Precio
                    </InputLabel>
                    <Input
                      error={
                        //@ts-expect-error 321
                        (query.error as AxiosError)?.response?.data.error
                          .section2Price
                      }
                      id="section2Price"
                      name="adminAccount.section2Price"
                      placeholder="Sección 2 Precio"
                      type="number"
                      value={user!.adminAccount!.section2Price}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel htmlFor="section3Limit">
                      Seccion 3 Limite
                    </InputLabel>
                    <Input
                      error={
                        //@ts-expect-error 321
                        (query.error as AxiosError)?.response?.data.error
                          .section3Limit
                      }
                      id="section3Limit"
                      name="adminAccount.section3Limit"
                      placeholder="Sección 3 Limite"
                      type="number"
                      value={user!.adminAccount!.section3Limit}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <InputLabel htmlFor="section3Price">
                      Seccion 3 Precio
                    </InputLabel>
                    <Input
                      error={
                        //@ts-expect-error 321
                        (query.error as AxiosError)?.response?.data.error
                          .section3Price
                      }
                      id="section3Price"
                      name="adminAccount.section3Price"
                      placeholder="Sección 3 Precio"
                      type="number"
                      value={user!.adminAccount!.section3Price}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {confirmQuery.error && (
            <Typography color="error">
              {confirmQuery.error instanceof AxiosError && confirmQuery.error.response?.data.error
                ? "Revisa los datos y vuelve a intentarlo"
                : "Error inesperado"}
            </Typography>
          )}
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
              <Label color="success">Usuario creado</Label>
            ) : confirmQuery.isPending ? (
              <CircularProgress color="secondary" />
            ) : userSelected ? (
              "Editar"
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
