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
import BillModal from "./BillModal";
import { billsContext } from "../context";
import Bill from "@/models/bill";

const BillsTable: React.FC = () => {
  const { query, filters, setFilters } = useContext(billsContext);

  const [isOpen, setIsOpen] = useState(false);

  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  useEffect(() => {
    if (!isOpen) {
      query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const billsList = useMemo(
    () =>
      query.data &&
      Array.from(query.data.bills.values()).map((bill) => {
        return (
          <TableRow hover key={bill.id.toString()}>
            <BillRow
              bill={bill}
              setSelectedBill={setSelectedBill}
              setIsOpen={setIsOpen}
              setIsDeleteOpen={setIsDeleteOpen}
            />
          </TableRow>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
          setSelectedBill(null);
          setIsOpen(true);
        }}
      >
        <Add />
      </Fab>
      {isDeleteOpen && (
        <DeleteModal
          bill={selectedBill!}
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedBill(null);
            query.refetch();
          }}
        />
      )}
      {isOpen && (
        <BillModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setSelectedBill={setSelectedBill}
          bill={selectedBill!}
          onClose={() => {
            setIsOpen(false);
            setSelectedBill(null);
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
              <TableCell align="center">Consumo</TableCell>
              <TableCell align="center">Total</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Fecha de creación</TableCell>
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
            ) : query.data && query.data.bills.size ? (
              billsList
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
          Page {filters.page ?? 0} of {query.data?.count
            ? query.data.count < 10
              ? filters.page
              : Math.floor(query.data.count / 10)
            : 0}
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
              disabled={query.data ? query.data.bills.size < 10 : true}
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

function BillRow({
  bill,
  setSelectedBill,
  setIsOpen,
  setIsDeleteOpen,
}: {
  bill: Bill;
  setSelectedBill: React.Dispatch<React.SetStateAction<Bill | null>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  return (
    <>
      <TableCell
      align="center"
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {bill.user!.name + ' ' + bill.user!.lastName}
        </Typography>
      </TableCell>
      <TableCell
      align="center"
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {bill.consumed} M3
        </Typography>
      </TableCell>
      <TableCell
      align="center"
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {bill.total}$
        </Typography>
      </TableCell>
      <TableCell
      align="center"
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {bill.estado}
        </Typography>
      </TableCell>
      <TableCell
      align="center"
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {format(bill.createdAt, "dd/MM/yyyy hh:mm a")}
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
              setSelectedBill(bill);
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
              setSelectedBill(bill);
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

export default BillsTable;
