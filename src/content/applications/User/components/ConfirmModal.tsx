import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";


const ConfirmModal = ({ isOpen, onClose, onConfirm,  mentor, query}): JSX.Element => {
    return (
        <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>{"Confirmar asignación"}</DialogTitle>
        <DialogContent>
            {
                query.isLoading && <p>Cargando...</p>
            }
            {
                query.isError && <p>{query.error.response ? query.error.response.data.error : query.error.message}</p>
            }
            {
                query.data && <p>Asignación confirmada</p>
            }
            {
                !(query.isLoading || query.isError || query.data) && <DialogContentText>Está seguro de asignar al usuario {mentor.profile.nickname} a esta solicitud?</DialogContentText>
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button onClick={() => {
                if ((!(query.isLoading) || query.error) && !(query.data)) {
                    onConfirm()
                } else if (query.data) {
                    onClose()
                }
            }}>{query.data ? 'Continuar': query.error ? "Reintentar": "Confirmar"}</Button>
        </DialogActions>
        </Dialog>
    );
}

export default ConfirmModal;