import Bill from "@/models/bill";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill;
}

const DeleteModal: React.FC<IProps> = ({
  isOpen,
  onClose,
  bill,
}): JSX.Element => {
  const { data, isPending, isError, error, mutate } = useMutation({
    mutationFn: handleDelete,
  });
  async function handleDelete() {
    const { data } = await axios.delete(
      import.meta.env.VITE_SERVER_URL + "/api/admin/bill/" + bill.id,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return data;
  }

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Eliminar Factura</DialogTitle>
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
        {data && <p>Factura Eliminada</p>}
        {!(isPending || isError || data) && (
          <DialogContentText>
            Está seguro de eliminar esta factura?
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
