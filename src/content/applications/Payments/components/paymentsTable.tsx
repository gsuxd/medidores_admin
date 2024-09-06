import { Add, DeleteForeverOutlined } from "@mui/icons-material";
import {
  useTheme,
  Card,
  Divider,
  TableContainer,
  Accordion,
  Typography,
  AccordionDetails,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  Box,
  Fab,
  Button,
} from "@mui/material";
import Filtros from "./filters";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import { useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteModal from "./DeleteModal";
import { format } from "date-fns";
import PaymentModal from "./PaymentModal";
import { paymentsContext } from "../context";
import Payment from "@/models/payment";
import { Link } from "react-router-dom";

const PaymentsTable: React.FC = () => {
  const { query, filters, setFilters } = useContext(paymentsContext);

  const [isOpen, setIsOpen] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    if (!isOpen) {
      query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const paymentsList = useMemo(
    () =>
      query.data &&
      Array.from(query.data.payments.values()).map((payment) => {
        return (
          <TableRow hover key={payment.id.toString()}>
            <PaymentRow
              payment={payment}
              setSelectedPayment={setSelectedPayment}
              setIsOpen={setIsOpen}
              setIsDeleteOpen={setIsDeleteOpen}
            />
          </TableRow>
        );
      }),
    [query.data]
  );

  return (
    <Card>
      <Fab
        color="primary"
        aria-label="add"
        style={{ position: "fixed", bottom: "10px", right: "10px" }}
        onClick={() => {
          // alert('A')
          setSelectedPayment(null);
          setIsOpen(true);
        }}
      >
        <Add />
      </Fab>
      {isDeleteOpen && (
        <DeleteModal
          payment={selectedPayment!}
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedPayment(null);
            query.refetch();
          }}
        />
      )}
      {isOpen && (
        <PaymentModal
          isOpen={isOpen}
          setSelectedPayment={setSelectedPayment}
          payment={selectedPayment!}
          onClose={() => {
            setIsOpen(false);
            setSelectedPayment(null);
          }}
        />
      )}
      <Divider />
      <TableContainer>
        <Accordion expanded={true}>
          <AccordionDetails>
            <Filtros />
          </AccordionDetails>
        </Accordion>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Socio</TableCell>
              <TableCell align="center">Fecha de creación</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Método</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {query.isLoading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="h6">Cargando...</Typography>
                </TableCell>
              </TableRow>
            ) : query.data && query.data.payments.size ? (
              paymentsList
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="h6">
                    No se encontraron resultados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TableCell
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          Page {(filters.page ?? 0) + 1} of{" "}
          {(query.data?.count
            ? query.data.count < 10
              ? filters.page
              : Math.floor(query.data.count / 10)
            : 0) + 1}
          <Box>
            <Button
              disabled={filters.page === 0}
              onClick={() =>
                setFilters({ ...filters, page: filters.page! - 1 })
              }
            >
              <ArrowBackIosIcon />
            </Button>
            <Button
              disabled={query.data ? query.data.payments.size < 10 : true}
              onClick={() => {
                setFilters({
                  ...filters,
                  page: filters.page! + 1,
                });
              }}
            >
              <ArrowForwardIosIcon />
            </Button>
          </Box>
        </TableCell>
      </Box>
    </Card>
  );
};

function PaymentRow({
  payment,
  setSelectedPayment,
  setIsOpen,
  setIsDeleteOpen,
}: {
  payment: Payment;
  setSelectedPayment: React.Dispatch<React.SetStateAction<Payment | null>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  return (
    <>
      <TableCell align="center">
        <Tooltip
        title="Ir al usuario"
        >
          <Link to={`/admin/user/${payment.userId}/`}>
            <Typography
              variant="body1"
              fontWeight="bold"
              color="text.primary"
              gutterBottom
              noWrap
            >
              {payment.fullName}
            </Typography>
          </Link>
        </Tooltip>
      </TableCell>
      <TableCell align="center">
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {format(payment.createdAt, "dd/MM/yyyy hh:mm a")}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          $ {payment.amount}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {payment.metodo}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {payment.estado}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Tooltip title="Editar" arrow>
          <IconButton
            sx={{
              "&:hover": {
                background: theme.colors.primary.lighter,
              },
              color: theme.palette.primary.main,
            }}
            color="inherit"
            size="small"
            onClick={() => {
              setSelectedPayment(payment);
              setIsOpen(true);
            }}
          >
            <EditTwoToneIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar" arrow>
          <IconButton
            sx={{
              "&:hover": {
                background: theme.colors.error.lighter,
              },
              color: theme.palette.error.main,
            }}
            color="inherit"
            size="small"
            onClick={() => {
              setSelectedPayment(payment);
              setIsDeleteOpen(true);
            }}
          >
            <DeleteForeverOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </>
  );
}

export default PaymentsTable;
