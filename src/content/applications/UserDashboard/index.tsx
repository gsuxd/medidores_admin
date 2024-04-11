import { Box, Container, Fab, Grid } from "@mui/material";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import UserBillsTable from "./components/billsTable";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import BillsApi from "@/api/billsApi";
import { userBillsContext } from "./context";
import { useParams } from "react-router-dom";
import UserHeader from "./components/Header";
import UserCharts from "./components/Charts";
import { Edit } from "@mui/icons-material";
import AssignModal from "./components/UserModal";
import UsersApi from "@/api/usersApi";

export default function UserDashboard() {
  const [filters, setFilters] = useState<
    Parameters<typeof BillsApi.listBills>[0]
  >({
    page: 0,
    limit: 10,
    order: "desc",
    orderBy: "name",
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
    rut: "",
    deleted: false,
    enabled: false,
  });

  const params = useParams<{ userId: string }>();

  const query = useQuery({
    queryFn: () =>
      BillsApi.listBills({ ...filters, userId: parseInt(params.userId!) }),
    queryKey: ["billsUser", filters.userId, filters.enabled && filters],
  });

  const userQuery = useQuery({
    queryFn: () => UsersApi.getUser(parseInt(params.userId!)),
    queryKey: ["user", parseInt(params.userId!)],
  })

  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{
        y: window.innerHeight * 0.5,
      }}
      animate={{
        y: 0,
      }}
      exit={{
        y: parseInt("-" + window.innerHeight.toString()),
      }}
    >
      {
        <Helmet>
          <title>Administración de Facturas</title>
        </Helmet>
      }
      {
        userQuery.data && <AssignModal 
        isOpen={isOpen}
        ssrId={userQuery.data.ssrId}
        user={userQuery.data.user}
        onClose={() => {
          setIsOpen(false);
        }}
        setIsOpen={setIsOpen}
        />
      }
      <Fab
        color="primary"
        aria-label="edit"
        style={{ position: "fixed", bottom: "10px", right: "10px" }}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Edit />
      </Fab>
      <userBillsContext.Provider
        value={{
          query,
          filters,
          setFilters,
        }}
      >
        <UserHeader />
        <UserCharts />
        <Container maxWidth="lg">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <UserBillsTable />
              <Box
                sx={{
                  marginBottom: 2,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </userBillsContext.Provider>
    </motion.div>
  );
}
