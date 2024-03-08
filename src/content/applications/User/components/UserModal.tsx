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
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@mui/icons-material";
import { usersContext } from "../context";
// import { DesktopDatePicker } from "@mui/x-date-pickers";
import User, { UserRole } from "@/models/user/user";

interface IProps {
  isOpen: boolean;
  user?: User | null;
  onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
  setIsOpen: (open: boolean) => void;
  setSelectedUser: (user?: User | null) => void;
}

const AssignModal: React.FC<IProps> = ({
  isOpen,
  user: userSelected,
  onClose,
  setIsOpen,
  setSelectedUser,
}) => {
  const [user, setUser] = useState<User>(
    new User({
      address: "",
      createdAt: new Date(),
      emailVerified: true,
      id: -1,
      lastName: "",
      name: "",
      phone: "",
      role: UserRole.partner,
      rut: "",
      updatedAt: new Date(),
      email: "",
    })
  );

  const { query } = useContext(usersContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setUser(user.copyWith({ [name]: value }));
  };

  const confirm = async () => {
    //format(user.data.profile.date_birth, "yyyy-MM-dd");
    const sendData = {
      ...user.toJson(),
    };
    const { data } = await axios({
      method: user.id > 0 ? "put" : "post",
      url: import.meta.env.VITE_SERVER + "/api/admin/user/",
      headers: {
        Authorization: `Token ${JSON.parse(localStorage.getItem("token")!)}`,
      },
      data: sendData,
    });
    setSelectedUser(null);
    setIsOpen(false);
    return data;
  };

  const confirmQuery = useMutation({ mutationFn: () => confirm() });

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
            {userSelected ? "" : "Staff"}
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
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  id="email"
                  name="email"
                  value={user?.email}
                  onChange={handleChange}
                  readOnly={userSelected !== null}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="name">Nombre</InputLabel>
                <Input
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
                  id="lastName"
                  name="lastName"
                  value={user?.lastName}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="email">Correo</InputLabel>
                <Input
                  id="email"
                  name="email"
                  value={user?.email}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            {userSelected !== null && (
              <>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <InputLabel htmlFor="role">Tipo</InputLabel>
                    <Select
                      labelId="role"
                      label="Tipo de usuario"
                      id="role"
                      name="role"
                      value={user?.role}
                      onChange={(e) => handleChange(e)}
                    >
                      <MenuItem value={UserRole.partner}>Socio</MenuItem>
                      <MenuItem value={UserRole.operator}>Operador</MenuItem>
                      <MenuItem value={UserRole.admin}>Administrador</MenuItem>
                      <MenuItem value={UserRole.seller}>Vendedor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <InputLabel htmlFor="emailVerified">Estado</InputLabel>
                    <Input
                      id="emailVerified"
                      name="emailVerified"
                      value={user?.emailVerified}
                      type="switch"
                      onChange={(e) => handleChange(e)}
                    >
                    </Input>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label="Correo Verificado?"
                    control={
                      <Switch
                        name="emailVerified"
                        checked={
                          user?.emailVerified
                        }
                        onChange={(e) =>
                          setUser(user.copyWith({
                            emailVerified: e.target.checked,
                          }))
                        }
                      />
                    }
                  />
                </Grid>
                {/* <Grid item>
                  <FormControl>
                    <DesktopDatePicker
                      label="Nacimiento"
                      inputFormat="dd-MM-yyyy"
                      value={
                        user?.data ? user?.data.profile.date_birth : new Date()
                      }
                      onChange={(e) =>
                        setUser({
                          ...user,
                          data: {
                            ...user.data,
                            profile: {
                              ...user.data.profile,
                              date_birth: e,
                            },
                          },
                        })
                      }
                      renderInput={(params) => (
                        <TextField {...params} sx={{ width: 160 }} />
                      )}
                    />
                  </FormControl>
                </Grid> */}
              </>
            )}
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
