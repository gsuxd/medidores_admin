import {
  MenuItem,
  FormControl,
  InputLabel,
  Input,
  Select,
  Grid,
  Button,
} from "@mui/material";
import { CSSProperties, useContext, useMemo } from "react";
import { usersContext } from "../context";
import { UserRole } from "@/models/user/user";
import { AdminContext } from "@/contexts/AdminContext";
import SSRApi from "@/api/ssrAPI";
import { useQuery } from "@tanstack/react-query";

const Filtros: React.FC = (): JSX.Element => {
  const {
    auth: { user },
  } = useContext(AdminContext);
  const { filters, setFilters, query } = useContext(usersContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFilters((val) => {
      if (val.enabled) query.refetch();
      return { ...val, [name]: value };
    });
  };

  const ssrQuery = useQuery({
    queryFn: async () => await SSRApi.list(undefined),
    queryKey: ["ssrList"],
  });

  const ssrList = useMemo(
    () =>
      ssrQuery.data &&
      Array.from(ssrQuery.data.ssr.values()).map((ssr) => (
        <MenuItem key={ssr.id} value={ssr.id}>
          {ssr.name}
        </MenuItem>
      )),
    [ssrQuery.data]
  );

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      gap={2}
      alignItems="center"
      spacing={3}
    >
      <FormItem>
        <InputLabel htmlFor="name">Nombre</InputLabel>
        <Input
          id="name"
          placeholder="Nombre"
          name="name"
          value={filters.name}
          onChange={(e) => handleChange(e)}
        />
      </FormItem>
      <FormItem>
        <InputLabel htmlFor="lastName">Apellido</InputLabel>
        <Input
          id="lastName"
          placeholder="Apellido"
          name="lastName"
          value={filters.lastName}
          onChange={(e) => handleChange(e)}
        />
      </FormItem>
      <FormItem>
        <InputLabel htmlFor="rut">Rut</InputLabel>
        <Input
          id="rut"
          placeholder="Numero de RUT"
          name="rut"
          value={filters.rut}
          onChange={(e) => handleChange(e)}
        />
      </FormItem>
      <FormItem>
        <InputLabel htmlFor="email">Correo</InputLabel>
        <Input
          id="email"
          placeholder="Correo electrónico"
          name="email"
          value={filters.email}
          onChange={(e) => handleChange(e)}
        />
      </FormItem>
      <FormItem>
        <InputLabel htmlFor="phone">Numero de telefono</InputLabel>
        <Input
          id="phone"
          placeholder="Numero de telefono"
          name="phone"
          value={filters.phone}
          onChange={(e) => handleChange(e)}
        />
      </FormItem>
      {user!.role !== UserRole.admin && (
        <FormItem
          style={{
            minWidth: "20%",
          }}
        >
          <Select
            id="ssrId"
            placeholder="SSR"
            name="ssrId"
            value={filters.ssrId}
            onChange={(e) => handleChange(e)}
          >
            {ssrList}
          </Select>
        </FormItem>
      )}
      <FormItem
        style={{
          minWidth: "10%",
        }}
      >
        <InputLabel htmlFor="role">Rol</InputLabel>
        <Select
          labelId="role"
          label="Rol"
          id="role"
          name="role"
          value={filters.role}
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value={"all"}>Todos</MenuItem>
          <MenuItem value={"partner"}>Socio</MenuItem>
          <MenuItem value={"operator"}>Operador</MenuItem>
          {(user!.role === UserRole.seller ||
            user!.role === UserRole.master) && (
            <MenuItem value={"admin"}>Administrador</MenuItem>
          )}
          {user!.role === UserRole.master && (
            <MenuItem value={"seller"}>Vendedor</MenuItem>
          )}
        </Select>
      </FormItem>
      <FormItem>
        <InputLabel htmlFor="order">Orden</InputLabel>
        <Select
          labelId="order"
          label="Orden"
          id="order"
          name="order"
          value={filters.order}
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value={"asc"}>Ascendiente</MenuItem>
          <MenuItem value={"desc"}>Descendiente</MenuItem>
        </Select>
      </FormItem>
      <FormItem>
        <Button
          variant={filters.enabled ? "outlined" : "contained"}
          onClick={() => {
            setFilters({
              ...filters,
              enabled: !filters.enabled,
            });
            query.refetch();
          }}
        >
          {filters.enabled ? "Quitar filtro" : "Filtrar"}
        </Button>
      </FormItem>
    </Grid>
  );
};

const FormItem: React.FC<{
  children: JSX.Element | JSX.Element[];
  style?: CSSProperties;
}> = ({ children, style = {} }): JSX.Element => (
  <Grid item style={style}>
    <FormControl fullWidth>{children}</FormControl>
  </Grid>
);

export default Filtros;
