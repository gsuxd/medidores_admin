import { Alert, AlertProps, Snackbar, SnackbarProps } from "@mui/material";

interface IProps {
    snackState: {
        open: boolean;
        message: string;
        severity: string;
    };
    onClose: () => void;
    snackProps?: SnackbarProps;
    alertProps?: AlertProps;
}

const CustomSnackbar = ({snackState, onClose, snackProps, alertProps}: IProps) => {
    return (
        <Snackbar
          open={snackState.open}
          autoHideDuration={5000}
          onClose={onClose}
          {...snackProps}
        >
          <Alert
            onClose={onClose}
            severity={snackState.severity as never}
            variant="filled"
            {...alertProps}
            sx={{ width: "100%" }}
          >
            {snackState.message}
          </Alert>
        </Snackbar>
    );
}

export default CustomSnackbar;