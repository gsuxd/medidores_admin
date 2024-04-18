import {  DeleteForeverOutlined } from "@mui/icons-material";
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
import DueModal from "./DueModal";
import { adminDuesContext } from "../context";
import Due from "@/models/due";

const DueTable: React.FC = () => {
  const { query, filters, setFilters } = useContext(adminDuesContext);

  const [isOpen, setIsOpen] = useState(false);

  const [selectedDue, setSelectedDue] = useState<Due | null>(null);

  useEffect(() => {
    if (!isOpen) {
      query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const duesList = useMemo(
    () =>
      query.data &&
      Array.from(query.data.dues.values()).map((due) => {
        return (
          <TableRow hover key={due.id.toString()}>
            <DueRow
              due={due}
              setSelectedDue={setSelectedDue}
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
      {isDeleteOpen && (
        <DeleteModal
          due={selectedDue!}
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedDue(null);
            query.refetch();
          }}
        />
      )}
      {isOpen && (
        <DueModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setSelectedDue={setSelectedDue}
          due={selectedDue!}
          onClose={() => {
            setIsOpen(false);
            setSelectedDue(null);
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
              <TableCell align="center">Fecha de creación</TableCell>
              <TableCell align="center">Total</TableCell>
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
            ) : query.data && query.data.dues.size > 0 ? (
              duesList
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
          Pagina {filters.page ?? 0} de {query.data?.pages}
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
              disabled={filters.page === (query.data ? query.data.pages : 0)}
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

function DueRow({
  due,
  setSelectedDue,
  setIsOpen,
  setIsDeleteOpen,
}: {
  due: Due;
  setSelectedDue: React.Dispatch<React.SetStateAction<Due | null>>;
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
          {format(due.createdAt, "dd/MM/yyyy hh:mm a")}
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
          {due.dues}$
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
          {due.estado}
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
              setSelectedDue(due);
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
              setSelectedDue(due);
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

export default DueTable;
