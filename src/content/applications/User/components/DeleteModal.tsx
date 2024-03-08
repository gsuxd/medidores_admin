import User from '@/models/user/user';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
  } from '@mui/material';
  import { useMutation } from '@tanstack/react-query';
  import axios, { AxiosError } from 'axios';
  
  interface IProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
  }
  
  const DeleteModal: React.FC<IProps> = ({
    isOpen,
    onClose,
    user
  }): JSX.Element => {
    const { data, isPending, isError, error, mutate } = useMutation({mutationFn: handleDelete});
  
    async function handleDelete() {
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER + '/api/v01/delete-user-backoffice/',
        {
          user_id: user.id
        },
        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem('token')!).token
            }`
          }
        }
      );
      return data;
    }
  
    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>{'Eliminar Usuario'}</DialogTitle>
        <DialogContent>
          {isPending && <p>Cargando...</p>}
          {isError && (
            <p>
              {(error as AxiosError).response
                ?
                //@ts-expect-error common error
                  (error as AxiosError).response!.data!.error!
                : (error as AxiosError).message}
            </p>
          )}
          {data && <p>Usuario Eliminado</p>}
          {!(isPending || isError || data) && (
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
            {data ? 'Continuar' : error ? 'Reintentar' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default DeleteModal;
  