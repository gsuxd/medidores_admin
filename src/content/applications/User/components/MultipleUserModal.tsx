import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  Grid,
  DialogActions,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@mui/icons-material";
import User, { UserRole } from "@/models/user/user";
import { AdminContext } from "@/contexts/AdminContext";
import UsersApi from "@/api/usersApi";

interface IProps {
  isOpen: boolean;
  ssrId: number;
  onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
  setIsOpen: (open: boolean) => void;
}

const MultipleUserModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  ssrId,
}) => {
  const {
    auth: { user: actualUser },
  } = useContext(AdminContext);
  const [file, setFile] = useState<File | null>(null);
  
  const query = useQuery({
    queryFn: () => UsersApi.listUsers({ role: "admin", ssrId: ssrId }),
    queryKey: ["usersModal"],
  });

  const selectionUsers = useMemo<Map<number, User>>(() => {
    const users = new Map();
    const filtered =
      Array.from(query.data?.users.values() ?? []).filter((val) => {
        return val.role === UserRole.admin;
      }) ?? [];
    for (const user of filtered!) {
      users.set(user.id, user);
    }
    return users;
  }, [query.data?.users]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [adminId, setAdminId] = useState<number>(
        (actualUser?.role === UserRole.admin)
      ? actualUser!.id
      : selectionUsers.size > 0
      ? selectionUsers.entries().next().value[0]
      : ""
  );

  useEffect(() => {
    //@ts-expect-error 3212
    if (adminId === "") {
      setAdminId(
        (actualUser?.role === UserRole.admin)
          ? actualUser!.id
          : selectionUsers.size > 0
          ? selectionUsers.entries().next().value[0]
          : ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  const confirm = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("xlsx", file);
    formData.append("adminId", selectionUsers.get(adminId)!.adminAccount!.id.toString());
    const { data } = await axios.post(import.meta.env.VITE_SERVER_URL + "/api/admin/user/bulk",formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")!}`,
            ContentType: "multipart/form-data", 
          },
    });
    return data;
  };

  const confirmQuery = useMutation({ mutationFn: () => confirm() });

  const handleConfirm = async () => {
    if (!file) return;
    await confirmQuery.mutateAsync();
    if (confirmQuery.data) {
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
             Creación de múltiples socios
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
            <Grid>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files![0])}
                  required
                  accept=".xlsx, .xls"
                />
            </Grid>
            {actualUser!.role === UserRole.seller ||
            actualUser!.role === UserRole.master ? (
              <Grid
                sx={{
                  minWidth: "100%",
                }}
                item
              >
                <Select
                  error={
                    //@ts-expect-error 321
                    (query.error as AxiosError)?.response?.data.error.adminId
                  }
                  label={"Administrador"}
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
              </Grid>
            ) : null}
          </Grid>
          <Typography color={'error'} p={5}>
            {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((confirmQuery.error as AxiosError)?.response?.data as any).error}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
          disabled={confirmQuery.isPending || confirmQuery.data}
            onClick={handleConfirm}
          >
            {" "}
            {confirmQuery.data ? (
              <Label color="success">Usuarios creado</Label>
            ) : confirmQuery.isPending ? (
              <CircularProgress color="secondary" />
            ) : (
              "Crear"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MultipleUserModal;
