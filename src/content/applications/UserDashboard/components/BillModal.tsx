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
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@mui/icons-material";
import Bill, { BillStatus } from "@/models/bill";
import { userBillsContext } from "../context";
import { format } from "date-fns";
import CustomSnackbar from "@/components/Snackbar";

interface IProps {
  isOpen: boolean;
  bill: Bill;
  onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
  setIsOpen: (open: boolean) => void;
  setSelectedBill: React.Dispatch<React.SetStateAction<Bill | null>>;
}

const AssignModal: React.FC<IProps> = ({
  isOpen,
  bill: billSelected,
  onClose,
  setIsOpen,
  setSelectedBill,
}) => {
  const [bill, setBill] = useState<Bill>(billSelected);
  const { query } = useContext(userBillsContext);

  const queryPdf = useQuery({
    queryKey: ["queryPdf", billSelected.id],
    queryFn: async () => {
      // const req = await axios.get(, {headers: {
      //
      // }});
      const req = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/media/${billSelected.file}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return req.data.url;
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setBill(bill.copyWith({ [name]: value }));
  };

  const confirm = async () => {
    //format(user.data.profile.date_birth, "yyyy-MM-dd");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sendData: any = {
      ...bill.toJson(),
    };
    for (const key of Object.keys(bill)) {
      if (key === "id") continue;
      //@ts-expect-error 40392
      const val = userData[key];
      //@ts-expect-error 40392
      if (billSelected.toJson()[key] === val) {
        delete sendData[key];
      }
    }

    const { data } = await axios({
      method: "put",
      url: import.meta.env.VITE_SERVER_URL + "/api/admin/bill/",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")!}`,
      },
      data: sendData,
    });
    setSelectedBill(null);
    setIsOpen(false);
    return data;
  };

  const confirmQuery = useMutation({ mutationFn: () => confirm() });

  const handleConfirm = async () => {
    try {await confirmQuery.mutateAsync();
    if (confirmQuery.data) {
      setIsOpen(false);
      setSelectedBill(null);
      query.refetch();
      setSnack({ open: true, message: "Factura editada con éxito", severity: "success" });
    }} catch (e) {
      setSnack({ open: true, message: "Hubo un error al editar la factura", severity: "error" });
    }
  };

  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  return (
    <>
      <Dialog fullWidth open={isOpen} onClose={onClose}>
      <CustomSnackbar snackState={snack} onClose={() => setSnack({ ...snack, open: false })}/>
      <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Edición de factura
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
                <InputLabel htmlFor="consumed">Consumido</InputLabel>
                <Input
                  error={
                    //@ts-expect-error 321
                    (query.error as AxiosError)?.response?.data.error.consumed
                  }
                  id="consumed"
                  type="number"
                  name="consumed"
                  value={bill.consumed}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="total">Total</InputLabel>
                <Input
                  //@ts-expect-error 321
                  error={(query.error as AxiosError)?.response?.data.error.name}
                  id="total"
                  name="total"
                  disabled
                  value={bill.total}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="createdAt">Fecha de Emisión</InputLabel>
                <Input
                  id="createdAt"
                  name="createdAt"
                  disabled
                  value={format(bill.createdAt, "dd-MM-yyyy h:mm a")}
                  onChange={(e) => handleChange(e)}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel htmlFor="updatedAt">Fecha de Actualización</InputLabel>
                <Input
                  id="updatedAt"
                  name="updatedAt"
                  disabled
                  value={format(bill.updatedAt, "dd-MM-yyyy h:mm a")}
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
                <InputLabel htmlFor="status">Estado</InputLabel>
                <Select
                  //@ts-expect-error 321
                  error={(query.error as AxiosError)?.response?.data.error.role}
                  labelId="status"
                  label="Estado"
                  id="status"
                  name="status"
                  value={bill.status}
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
        <DialogActions sx={{
          display: "flex",
          justifyContent: "space-between"
        }}>
        <Button disabled={!queryPdf.data} href={queryPdf.data} target="_blank">Ver Aviso</Button>
        {
          confirmQuery.error && <Label color="error">Revisa los datos y vuelve a intentarlo</Label>
        }
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
