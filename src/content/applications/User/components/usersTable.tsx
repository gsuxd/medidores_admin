import {
  Add,
  DeleteForeverOutlined,
  RequestQuote,
} from "@mui/icons-material";
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
import { usersContext } from "../context";
//import UserModal from './UserModal';
import { useEffect } from "react";
import { useNavigate } from "react-router";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteModal from "./DeleteModal";
import User, { UserRole } from "@/models/user/user";
import { format } from "date-fns";

const UsersTable: React.FC = () => {
  const { query, filters, setFilters } = useContext(usersContext);

  const [isOpen, setIsOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isOpen) {
      query.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const usersList = useMemo(
    () =>
      query.data &&
      query.data.users.map((user) => {
        return (
          <TableRow hover key={user.id.toString()}>
            <UserRow
            user={user}
            setSelectedUser={setSelectedUser}
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
          setSelectedUser(null);
          setIsOpen(true);
        }}
      >
        <Add />
      </Fab>
      {isDeleteOpen && (
        <DeleteModal
          user={selectedUser}
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedUser(null);
            query.refetch();
          }}
        />
      )}
      {/* {isOpen && (
          <UserModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setSelectedUser={setSelectedUser}
            user={selectedUser}
            onClose={() => {
              setIsOpen(false);
              setSelectedUser(null);
            }}
          />
        )} */}
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
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de creación</TableCell>
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
            ) : query.data && query.data.users.length ? (
              usersList
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
          Page {filters.page} of {query.data?.pages}
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
              disabled={filters.page === (query.data ? query.data.pages : 1)}
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

function UserRow({
  user,
  setSelectedUser,
  setIsOpen,
  setIsDeleteOpen,
}: {
  user: User;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {user.fullName}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {user.email}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {user.roleLabel}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {user.emailVerified ? "Verificado" : "No verificado"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          gutterBottom
          noWrap
        >
          {format(user.createdAt, "dd/MM/yyyy")}
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
              setSelectedUser(user);
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
              setSelectedUser(user);
              setIsDeleteOpen(true);
            }}
          >
            <DeleteForeverOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        {user.role === UserRole.partner && (
          <Tooltip title="Ver Facturas" arrow>
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
                navigate("/admin/bills/" + user.id + "/");
              }}
            >
              <RequestQuote fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </>
  );
}

export default UsersTable;
