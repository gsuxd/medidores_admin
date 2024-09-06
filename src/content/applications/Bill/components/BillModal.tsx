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
import { useContext, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Label } from "@mui/icons-material";
import Bill, { BillStatus } from "@/models/bill";
import { billsContext } from "../context";
import { format } from "date-fns";
import { Document, Page } from "react-pdf";
import blobToURL from "@/helpers/blobToUrl";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

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
  const { query } = useContext(billsContext);

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
    delete sendData.createdAt;
    delete sendData.updatedAt;
    delete sendData.total;
    delete sendData.partialAmount;
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

  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const confirmQuery = useMutation({ mutationFn: () => confirm() });

  const handleConfirm = async () => {
    await confirmQuery.mutateAsync();
    if (confirmQuery.data) {
      setIsOpen(false);
      setSelectedBill(null);
      query.refetch();
    }
  };

  return (
    <>
    <WarningModal 
    isOpen={isWarningOpen}
    onClose={() => setIsWarningOpen(!isWarningOpen)}
    bill={bill}
    />
      <Dialog fullWidth open={isOpen} onClose={onClose}>
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
                <TextField
                  label="Consumo"
                  error={isNaN(parseInt(`${bill.consumed}`)) || bill.consumed < 0}
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
                <TextField
                  label="Total"
                  error={isNaN(bill.total) || bill.total < 0}
                  id="total"
                  name="total"
                  disabled
                  type="number"
                  value={bill.total}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  label="Abonado"
                  //@ts-expect-error 321
                  error={isNaN(parseInt(`${bill.partialAmount}`)) || bill.partialAmount < 0}
                  id="partialAmount"
                  name="partialAmount"
                  disabled
                  value={bill.partialAmount}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  label="Fecha de Emisión"
                  id="createdAt"
                  name="createdAt"
                  type="datetime-local"
                  disabled
                  value={format(bill.createdAt, "dd-MM-yyyy h:mm a")}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl>
                <TextField
                  label="Fecha de Actualización"
                  id="updatedAt"
                  name="updatedAt"
                  type="datetime-local"
                  disabled
                  value={format(bill.updatedAt, "dd-MM-yyyy h:mm a")}
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
                  error={bill.status === ""}
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
        <Button onClick={() => setIsWarningOpen(true)}>Ver Aviso</Button>
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

function WarningModal({
  bill,
  isOpen,
  onClose,
}: {
  bill: Bill;
  isOpen: boolean;
  onClose: () => void;
}) {
  const query = useQuery({
    queryKey: ["warningModal", bill.id],
    queryFn: async () => {
      // const req = await axios.get(, {headers: {
      //
      // }});
      const req = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/media/bills/aviso_cobranza-${
          bill.id
        }.pdf`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await blobToURL(await req.blob());
      return data;
    },
  });

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Visualización de Aviso de cobranza</DialogTitle>
      <DialogContent sx={{
        paddingBottom: query.data ? 0 : "1rem",
        paddingLeft: query.data ? 0 : "1rem",
      }}>
        {query.isLoading && <CircularProgress />}
        {query.data && (
              <Document renderMode="canvas" file={query.data}>
              <Page pageNumber={1} /> 
              </Document>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AssignModal;
