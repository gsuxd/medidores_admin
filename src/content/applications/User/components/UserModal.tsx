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
  Autocomplete,
  ListItem,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@mui/icons-material";
import { usersContext } from "../context";
import { DesktopDatePicker } from "@mui/x-date-pickers";
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
  const [password, setPassword] = useState("");
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
      ...user,
      type_action: "update",
      user_id: `${user.id}`,
    };
    const { data } = await axios({
      method: user.id ? "put" : "post",
      url: import.meta.env.VITE_SERVER + "/api/v01/users-backoffice/",
      headers: {
        Authorization: `Token ${
          JSON.parse(localStorage.getItem("token")!)
        }`,
      },
      data: sendData,
    });
    setSelectedUser(null);
    setIsOpen(false);
    return data;
  };

  const confirmQuery = useMutation({mutationFn: () => confirm()});

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
                <InputLabel htmlFor="nickname">Nickname</InputLabel>
                <Input
                  id="nickname"
                  name="nickname"
                  value={user?.nickname}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>

            <Grid item>
              <FormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  name="password"
                  value={user?.password}
                  onChange={(e) => handleChange(e)}
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
              <FormControl
                sx={{
                  minWidth: "100%",
                }}
              >
                <InputLabel htmlFor="country">País</InputLabel>
                <Select
                  labelId="country"
                  label="País"
                  id="country"
                  name="country"
                  value={user?.country}
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value={""}>Seleccione</MenuItem>
                  {queryCountrys !== undefined &&
                    queryCountrys.data !== undefined &&
                    queryCountrys.data.map((pais) => {
                      return (
                        <MenuItem key={pais.code} value={pais.code}>
                          {pais.name}
                        </MenuItem>
                      );
                    })}
                </Select>
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
                    <InputLabel htmlFor="user_type">Tipo</InputLabel>
                    <Select
                      labelId="user_type"
                      label="Tipo"
                      id="user_type"
                      name="user_type"
                      value={user?.user_type}
                      onChange={(e) => handleChange(e)}
                    >
                      <MenuItem value={""}>Seleccione</MenuItem>
                      <MenuItem value={"Gamer"}>Gamer</MenuItem>
                      <MenuItem value={"Staff"}>Staff</MenuItem>
                      <MenuItem value={"Admin"}>Admin</MenuItem>
                      <MenuItem value={"Mentor"}>Mentor</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <InputLabel htmlFor="user_status">Estado</InputLabel>
                    <Select
                      labelId="user_status"
                      label="Estado"
                      id="user_status"
                      name="status"
                      value={user?.status}
                      onChange={(e) => handleChange(e)}
                    >
                      <MenuItem value={""}>Seleccione</MenuItem>
                      <MenuItem value={"Active"}>Activo</MenuItem>
                      <MenuItem value={"Inactive"}>Inactivo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <InputLabel htmlFor="label_user">Label</InputLabel>
                    <Select
                      labelId="label_user"
                      label="Tipo de usuario"
                      id="label_user"
                      name="label_user"
                      value={user?.data ? user.data.profile.label_user : ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          data: {
                            ...user.data,
                            profile: {
                              ...user.data.profile,
                              label_user: e.target.value,
                            },
                          },
                        })
                      }
                    >
                      {["Profesional", "Hardcore Gamer"].map((label) => {
                        return (
                          <MenuItem key={label} value={label}>
                            {label}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <InputLabel htmlFor="description">Descripción</InputLabel>
                    <Input
                      id="description"
                      name="description"
                      value={user?.data ? user?.data.profile.description : ""}
                      onChange={(e) => handleChange(e)}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    label="Microfono"
                    control={
                      <Switch
                        name="Microfono"
                        checked={
                          user?.data
                            ? user?.data.profile.used_microphone
                            : false
                        }
                        onChange={(e) =>
                          setUser({
                            ...user,
                            data: {
                              ...user.data,
                              profile: {
                                ...user.data.profile,
                                used_microphone: e.target.checked,
                              },
                            },
                          })
                        }
                      />
                    }
                  />
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <Autocomplete
                      multiple={true}
                      disablePortal
                      value={user?.data ? user?.data.profile.gaming_time : []}
                      onChange={(event, newValue) => {
                        setUser({
                          ...user,
                          data: {
                            ...user.data,
                            profile: {
                              ...user.data.profile,
                              gaming_time: newValue as any[],
                            },
                          },
                        });
                      }}
                      renderOption={(props, option) => (
                        <ListItem {...props}>{option.name}</ListItem>
                      )}
                      isOptionEqualToValue={(option: any, value) =>
                        option.id === value.id
                      }
                      disableClearable
                      options={gaming_times ? gaming_times : []}
                      getOptionLabel={(option: any) => option.name}
                      renderInput={(params) => (
                        <TextField {...params} label="Horas de Juego" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <Autocomplete
                      multiple={true}
                      disablePortal
                      value={user?.data ? user?.data.profile.language : []}
                      onChange={(event, newValue) => {
                        setUser({
                          ...user,
                          data: {
                            ...user.data,
                            profile: {
                              ...user.data.profile,
                              language: newValue as any[],
                            },
                          },
                        });
                      }}
                      renderOption={(props, option) => (
                        <ListItem {...props}>{option.name}</ListItem>
                      )}
                      isOptionEqualToValue={(option: any, value) =>
                        option.id === value.id
                      }
                      disableClearable
                      options={languages ? languages : []}
                      getOptionLabel={(option: any) => option.name}
                      renderInput={(params) => (
                        <TextField {...params} label="Idiomas" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <Autocomplete
                      multiple={true}
                      disablePortal
                      freeSolo
                      value={user?.data ? user?.data.profile.games : []}
                      onChange={(event, newValue) => {
                        setUser({
                          ...user,
                          data: {
                            ...user.data,
                            profile: {
                              ...user.data.profile,
                              games: newValue as PlayerUser.Game[],
                            },
                          },
                        });
                      }}
                      renderOption={(props, option) => (
                        <ListItem {...props}>{option.name}</ListItem>
                      )}
                      isOptionEqualToValue={(option: PlayerUser.Game, value) =>
                        option.name === value.name
                      }
                      disableClearable
                      options={games ? games : []}
                      getOptionLabel={(option: PlayerUser.Game) => option.name}
                      renderInput={(params) => (
                        <TextField {...params} label="Juegos" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <Autocomplete
                      multiple={true}
                      disablePortal
                      freeSolo
                      value={user?.data ? user?.data.profile.phrases : []}
                      onChange={(event, newValue) => {
                        setUser({
                          ...user,
                          data: {
                            ...user.data,
                            profile: {
                              ...user.data.profile,
                              phrases: newValue as string[],
                            },
                          },
                        });
                      }}
                      renderOption={(props, option) => (
                        <ListItem {...props}>{option}</ListItem>
                      )}
                      isOptionEqualToValue={(option: string, value) =>
                        option === value
                      }
                      disableClearable
                      options={user?.data ? user.data.profile.phrases : []}
                      getOptionLabel={(option: string) => option}
                      renderInput={(params) => (
                        <TextField {...params} label="Frases" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <Autocomplete
                      multiple={true}
                      disablePortal
                      value={user?.data ? user?.data.profile.platforms : []}
                      onChange={(event, newValue) => {
                        setUser({
                          ...user,
                          data: {
                            ...user.data,
                            profile: {
                              ...user.data.profile,
                              platforms: newValue as PlayerUser.Platform[],
                            },
                          },
                        });
                      }}
                      renderOption={(props, option) => (
                        <ListItem {...props}>{option.name}</ListItem>
                      )}
                      isOptionEqualToValue={(
                        option: PlayerUser.Platform,
                        value
                      ) => option.name === value.name}
                      disableClearable
                      options={platforms ? platforms : []}
                      getOptionLabel={(option: PlayerUser.Platform) =>
                        option.name
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Plataformas" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl>
                    <DesktopDatePicker
                      label="Nacimiento"
                      inputFormat="yyyy-MM-dd"
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
                </Grid>
                <Grid item>
                  <FormControl
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <Autocomplete
                      multiple={true}
                      disablePortal
                      freeSolo
                      value={
                        user?.data ? user?.data.profile.regions_interest : []
                      }
                      onChange={(event, newValue) => {
                        setUser({
                          ...user,
                          data: {
                            ...user.data,
                            profile: {
                              ...user.data.profile,
                              regions_interest: newValue as string[],
                            },
                          },
                        });
                      }}
                      renderOption={(props, option) => (
                        <ListItem {...props}>{option}</ListItem>
                      )}
                      isOptionEqualToValue={(option: string, value) =>
                        option === value
                      }
                      disableClearable
                      options={user.data.profile.regions_interest}
                      getOptionLabel={(option: string) => option}
                      renderInput={(params) => (
                        <TextField {...params} label="Regiones de interés" />
                      )}
                    />
                  </FormControl>
                </Grid>
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
            ) : confirmQuery.isLoading ? (
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
