import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { CSSProperties, useContext } from "react";
import { billsContext } from "../context";
import { format } from "date-fns";

const Filtros: React.FC = (): JSX.Element => {
  const { filters, setFilters, query } = useContext(billsContext);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (event: any) => {
    // eslint-disable-next-line prefer-const
    let { name, value } = event.target;
    if (name === "start" || name === "end") {
      value = new Date(value);
    }
    if (name === "deleted") {
      value = event.target.checked;
    }
    setFilters((val) => {
      if (val.enabled) query.refetch();
      return { ...val, [name]: value };
    });
  };
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
        <TextField
          label="RUT del socio"
          id="rut"
          name="rut"
          value={filters.rut}
          onChange={(e) => handleChange(e)}
        />
      </FormItem>
      <FormItem>
        <TextField
          label="Inicio"
          id="start"
          name="start"
          value={format(filters.start, "yyyy-MM-dd")}
          onChange={(e) => handleChange(e)}
          type="date"
        />
      </FormItem>
      <FormItem>
        <TextField
          label="Fin"
          id="end"
          name="end"
          value={format(filters.end, "yyyy-MM-dd")}
          onChange={(e) => handleChange(e)}
          type="date"
        />
      </FormItem>
      <FormItem>
        <FormControlLabel
          control={
            <Switch
              id="deleted"
              name="deleted"
              checked={filters.deleted}
              onChange={(e) => handleChange(e)}
            />
          }
          label="Eliminados?"
        />
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
