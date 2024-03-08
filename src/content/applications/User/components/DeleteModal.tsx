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
    user: PlayerUser.User;
  }
  
  const DeleteModal: React.FC<IProps> = ({
    isOpen,
    onClose,
    user
  }): JSX.Element => {
    const { data, isLoading, isError, error, mutate } = useMutation(handleDelete);
  
    async function handleDelete() {
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER + '/api/v01/delete-user-backoffice/',
        {
          user_id: user.id
        },
        {
          headers: {
            Authorization: `Token ${
              JSON.parse(localStorage.getItem('auth')).token
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
          {isLoading && <p>Cargando...</p>}
          {isError && (
            <p>
              {(error as AxiosError).response
                ?
                  (error as AxiosError).response.data.error
                : (error as AxiosError).message}
            </p>
          )}
          {data && <p>Usuario Eliminado</p>}
          {!(isLoading || isError || data) && (
            <DialogContentText>
              Está seguro de eliminar al usuario {user.nickname}?
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if ((!isLoading || error) && !data) {
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
  