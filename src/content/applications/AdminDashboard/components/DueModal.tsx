import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Grid,
  DialogActions,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@mui/icons-material";
import { adminDuesContext } from "../context";
import { format } from "date-fns";
import Due from "@/models/due";
import { BillStatus } from "@/models/bill";

interface IProps {
  isOpen: boolean;
  due: Due;
  onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
  setIsOpen: (open: boolean) => void;
  setSelectedDue: React.Dispatch<React.SetStateAction<Due | null>>;
}

const AssignModal: React.FC<IProps> = ({
  isOpen,
  due: dueSelected,
  onClose,
  setIsOpen,
  setSelectedDue,
}) => {
  const [due, setDue] = useState<Due>(dueSelected);
  const { query } = useContext(adminDuesContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setDue(due.copyWith({ [name]: value }));
  };

  const confirm = async () => {
    //format(user.data.profile.date_birth, "yyyy-MM-dd");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendData: any = {
      ...due.toJson(),
    };
    for (const key of Object.keys(due)) {
      //@ts-expect-error 40392
      const val = userData[key];
      if (dueSelected.toJson()[key] === val) {
        delete sendData[key];
      }
    }

    const { data } = await axios({
      method: "put",
      url: import.meta.env.VITE_SERVER_URL + "/api/admin/dues/" + due.id,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")!}`,
      },
      data: sendData,
    });
    setSelectedDue(null);
    setIsOpen(false);
    return data;
  };

  const confirmQuery = useMutation({ mutationFn: () => confirm() });

  const handleConfirm = async () => {
    await confirmQuery.mutateAsync();
    if (confirmQuery.data) {
      setIsOpen(false);
      setSelectedDue(null);
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
            Edición de Deuda
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
                  //@ts-expect-error 321
                  error={(query.error as AxiosError)?.response?.data.error.dues}
                  id="dues"
                  name="dues"
                  label="Total"
                  value={due.dues}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  id="createdAt"
                  name="createdAt"
                  label="Fecha de Creación"
                  disabled
                  value={format(due.createdAt, "dd-MM-yyyy h:mm a")}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  id="updatedAt"
                  name="updatedAt"
                  label="Fecha de Actualización"
                  disabled
                  value={format(due.updatedAt, "dd-MM-yyyy h:mm a")}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl
                sx={{
                  minWidth: "100%",
                }}
              >
                <Select
                  error={
                    //@ts-expect-error 321
                    (query.error as AxiosError)?.response?.data.error.status
                  }
                  labelId="status"
                  label="Estado"
                  id="status"
                  name="status"
                  value={due.status}
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value={BillStatus.emited}>Emitida</MenuItem>
                  <MenuItem value={BillStatus.paid}>Pagada</MenuItem>
                  <MenuItem value={BillStatus.overdue}>Vencida</MenuItem>
                </Select>
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
              <Label color="success">Editado</Label>
            ) : confirmQuery.isPending ? (
              <CircularProgress color="secondary" />
            ) : (
              "Editar"
            )}{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignModal;
