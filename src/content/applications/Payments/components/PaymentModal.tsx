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
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { paymentsContext } from "../context";
import { format } from "date-fns";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import Payment, { PaymentMethod, PaymentStatus } from "@/models/payment";
import UsersApi from "@/api/usersApi";
import CustomSnackbar from "@/components/Snackbar";

interface IProps {
  isOpen: boolean;
  payment?: Payment | null;
  onClose: (event: object, reason: "backdropClick" | "escapeKeyDown") => void;
  setSelectedPayment: React.Dispatch<React.SetStateAction<Payment | null>>;
}

const AssignModal: React.FC<IProps> = ({
  isOpen,
  payment: paymentSelected,
  onClose,
  setSelectedPayment,
}) => {
  const [payment, setPayment] = useState<Payment>(
    paymentSelected ??
      new Payment({
        amount: 0,
        reference_id: "",
        status: PaymentStatus.confirmed,
        method: PaymentMethod.cash,
        createdAt: new Date(),
        updatedAt: new Date(),
        confirmedAt: new Date(),
        id: 0,
        redirect_url: "",
        partnerId: 0,
        deletedAt: new Date(),
      })
  );
  const { query } = useContext(paymentsContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    if (name === "amount") {
      if (isNaN(parseFloat(value)) || parseFloat(value) < 0) return;
      setPayment(payment.copyWith({ [name]: parseFloat(value) }));
    }
    if (name === "reference_id") {
      if (value.length > 9) return;
    }
    if (name === "method" && value === PaymentMethod.cash) {
      setPayment(
        payment.copyWith({
          reference_id: "",
          status: PaymentStatus.confirmed,
          method: value,
        })
      );
      return;
    }

    if (name === "partnerId") {
      const partnerAccount = users.data!.users.get(value)!.partnerAccount!;
      if (payment.amount > partnerAccount.totalDebt) {
        setPayment(
          payment.copyWith({ amount: partnerAccount.totalDebt, [name]: value })
        );
        return;
      }
    }

    setPayment(payment.copyWith({ [name]: value }));
  };

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const confirm = async () => {
    try {
      //format(user.data.profile.date_birth, "yyyy-MM-dd");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sendData: any = payment.toJson();
      delete sendData.createdAt;
      delete sendData.updatedAt;
      if (sendData.method === PaymentMethod.card) {
        delete sendData.reference_id;
        delete sendData.redirect_url;
        delete sendData.amount;
      }

      if (paymentSelected) {
        const json = paymentSelected?.toJson();
        for (const key of Object.keys(payment)) {
          if (key === "id") continue;
          const val = sendData[key];
          //@ts-expect-error 40392
          if (json[key] === val) {
            delete sendData[key];
          }
        }
        delete sendData.partnerId;
      } else {
        sendData.userId = sendData.partnerId;
        delete sendData.partnerId;
      }

      if (sendData.amount) {
        if (sendData.amount.includes(".")) {
          sendData.amount = parseFloat(sendData.amount);
        } else {
          sendData.amount = parseInt(sendData.amount);
        }
      }
      const { data } = await axios({
        method: paymentSelected ? "put" : "post",
        url:
          import.meta.env.VITE_SERVER_URL +
          "/api/admin/payments/" +
          (paymentSelected ? paymentSelected.id : ""),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")!}`,
        },
        data: sendData,
      });
      setSelectedPayment(null);
      setSnack((snack) => ({...snack, open: true, message: "Pago creado exitosamente", severity: "success"}))
      return data;
    } catch {
      setSnack((snack) => ({...snack, open: true, message: "Ocurrió un error, intenta nuevamente", severity: "error"}))
    }
  };

  const users = useQuery({
    queryKey: ["users"],
    queryFn: async () =>
      UsersApi.listUsers({ enabled: true, role: "partner", limit: 1000 }),
  });

  const usersList = useMemo(
    () =>
      users.data
        ? Array.from(users.data.users.values()).map((user) => (
            <MenuItem value={user.id} key={user.id}>
              {user.fullName}
            </MenuItem>
          ))
        : [<MenuItem value={undefined}>"Sin Datos"</MenuItem>],
    [users.data]
  );

  const confirmQuery = useMutation({ mutationFn: () => confirm() });

  const handleConfirm = async () => {
    await confirmQuery.mutateAsync();
    if (confirmQuery.data) {
      query.refetch();
    }
  };

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
            {paymentSelected ? "Edición" : "Creación"} de Pago
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
                  label="Monto"
                  error={
                    isNaN(parseFloat(`${payment.amount}`)) || payment.amount < 0
                  }
                  id="amount"
                  type="number"
                  name="amount"
                  value={payment.amount}
                  disabled={payment.method === PaymentMethod.card}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            {payment.method === PaymentMethod.transfer && (
              <Grid item>
                <FormControl>
                  <TextField
                    label="Referencia Bancaria"
                    error={
                      isNaN(parseInt(`${payment.reference_id}`)) ||
                      payment.reference_id.length < 9
                    }
                    maxRows={1}
                    id="reference_id"
                    type="number"
                    name="reference_id"
                    value={payment.reference_id}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
            )}
            {!paymentSelected && (
              <Grid item>
                <FormControl
                  sx={{
                    minWidth: "100%",
                  }}
                >
                  <InputLabel htmlFor="partnerId">Socio</InputLabel>
                  <Select
                    labelId="partnerId"
                    label="Socio"
                    id="partnerId"
                    name="partnerId"
                    value={payment.partnerId}
                    onChange={(e) => handleChange(e)}
                  >
                    {usersList}
                  </Select>
                </FormControl>
              </Grid>
            )}
            <Grid item>
              <FormControl>
                <TextField
                  label="Fecha de Creación"
                  id="createdAt"
                  name="createdAt"
                  disabled
                  value={format(payment.createdAt, "dd-MM-yyyy h:mm a")}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  label="Fecha de Actualización"
                  id="updatedAt"
                  name="updatedAt"
                  disabled
                  value={format(payment.updatedAt, "dd-MM-yyyy h:mm a")}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  label="Fecha de confirmación"
                  id="confirmedAt"
                  name="confirmedAt"
                  disabled
                  value={format(payment.confirmedAt, "dd-MM-yyyy h:mm a")}
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
                  error={payment.status === ""}
                  labelId="status"
                  label="Estado"
                  id="status"
                  disabled={
                    payment.method === PaymentMethod.card ||
                    payment.method === PaymentMethod.cash
                  }
                  name="status"
                  value={payment.status}
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value={PaymentStatus.pending}>Pendiente</MenuItem>
                  <MenuItem value={PaymentStatus.confirmed}>
                    Confirmado
                  </MenuItem>
                  <MenuItem value={PaymentStatus.rejected}>Rechazado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl
                sx={{
                  minWidth: "100%",
                }}
              >
                <InputLabel htmlFor="method">Método</InputLabel>
                <Select
                  labelId="method"
                  label="Método"
                  id="method"
                  disabled={payment.method === PaymentMethod.card}
                  name="method"
                  value={payment.method}
                  onChange={(e) => handleChange(e)}
                >
                  {payment.method === PaymentMethod.card && (
                    <MenuItem value={PaymentMethod.card}>Tarjeta</MenuItem>
                  )}
                  <MenuItem value={PaymentMethod.transfer}>
                    Transferencia
                  </MenuItem>
                  <MenuItem value={PaymentMethod.cash}>Efectivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
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
             paymentSelected ? "Editado" : "Creado"
            ) : confirmQuery.isPending ? (
              <CircularProgress color="secondary" />
            ) : (
              paymentSelected ?
              "Editar" : "Crear"
            )}{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default AssignModal;
