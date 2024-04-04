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
import { useState } from 'react';
  
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
    const [adminId, setAdminId] = useState()
    const [sellerId, setSellerId] = useState()
  
    async function handleDelete() {
      const { data } = await axios.delete(
        import.meta.env.VITE_SERVER_URL + '/api/admin/user/' + user.id,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          data: {
            id: user.id,
            adminId: adminId,
            sellerId: sellerId,
          }
        },
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
  