import User, { UserRole } from "@/models/user/user";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useContext, useMemo, useState } from "react";
import { usersContext } from "../context";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const DeleteModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  user,
}): JSX.Element => {
  const { data, isPending, isError, error, mutate } = useMutation({
    mutationFn: handleDelete,
  });
  const { query } = useContext(usersContext);

  const selectionUsers = useMemo<Map<number, User>>(() => {
    const users = new Map();
    const filtered =
      Array.from(query.data?.users.values() ?? []).filter((val) => {
        if (val.id === user.id ) return false;
        switch (user.role) {
          case UserRole.admin:
            return val.role === UserRole.admin;
          case UserRole.seller:
            return val.role === UserRole.seller;
          default:
            return false;
        }
      }) ?? [];
    for (const user of filtered!) {
      users.set(user.id, user);
    }
    return users;
  }, [query.data?.users, user?.role]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [adminId, setAdminId] = useState<number>((user.role === UserRole.admin || user.role === UserRole.seller) ? Array.from(selectionUsers.keys())[0] : 0);

  async function handleDelete() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendData: any = {
      id: user.id,
    };
    switch (user.role) {
      case UserRole.admin:
        sendData["adminId"] = selectionUsers.get(adminId)?.adminAccount!.id;
        break;
      case UserRole.seller:
        sendData["sellerId"] = selectionUsers.get(adminId)?.sellerAccount!.id;
        break;
    }
    const { data } = await axios.delete(
      import.meta.env.VITE_SERVER_URL + "/api/admin/user/" + user.id,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: sendData,
      }
    );
    return data;
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{"Eliminar Usuario"}</DialogTitle>
      <DialogContent>
        {isPending && <p>Cargando...</p>}
        {isError && (
          <p>
            {(error as AxiosError).response
              ? //@ts-expect-error common error
                (error as AxiosError).response!.data!.error!
              : (error as AxiosError).message}
          </p>
        )}
        {data && <p>Usuario Eliminado</p>}
        {!(isPending || isError || data) && user.role !== UserRole.operator && user.role !== UserRole.partner ? (
          <DialogContentText sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Typography>Seleccione un usuario para transferir los usuarios dependientes</Typography>
            <Select
            label={user.role === UserRole.admin ? "Administrador" : "Vendedor"}
            name="adminId"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value as number)}
            >
              {selectionUsers.size > 0 && Array.from(selectionUsers.values()).map((val) => (
                <MenuItem key={val.id} value={val.id}>
                {val.fullName}
                </MenuItem>
              ))}
            </Select>
          </DialogContentText>
        ) : (
          <DialogContentText>
            Está seguro de eliminar al usuario {user.fullName}?
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={isPending} onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={() => {
            if ((!isPending || error) && !data) {
              mutate();
            } else if (data) {
              onClose();
            }
          }}
        >
          {data ? "Continuar" : error ? "Reintentar" : "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
