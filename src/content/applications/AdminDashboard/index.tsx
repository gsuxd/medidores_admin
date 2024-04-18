import { Box, Container, Fab, Grid } from "@mui/material";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import AdminDuesTable from "./components/dueTable";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { adminDuesContext } from "./context";
import { useParams } from "react-router-dom";
import UserHeader from "./components/Header";
import { Edit } from "@mui/icons-material";
import AssignModal from "./components/UserModal";
import DueApi from "@/api/dueApi";
import UsersApi from "@/api/usersApi";

export default function UserDashboard() {
  const {userId} = useParams<{userId: string}>();
  const [filters, setFilters] = useState<
    Parameters<typeof DueApi.getDues>[0]
  >({
    page: 0,
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
    adminId: parseInt(userId!),
    order: "desc",
    orderBy: "createdAt",
    status: "all",
    enabled: false,
  });

  const query = useQuery({
    queryFn: () =>
    DueApi.getDues(filters),
    queryKey: ["adminDues", filters.adminId, filters.enabled && filters],
  });

  const userQuery = useQuery({
    queryFn: () => UsersApi.getUser(parseInt(userId!)),
    queryKey: ["user", parseInt(userId!)],
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
          <title>Administración de Deudas</title>
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
      <adminDuesContext.Provider
        value={{
          query,
          filters,
          setFilters,
        }}
      >
        <UserHeader />
        <Container maxWidth="lg">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <AdminDuesTable />
              <Box
                sx={{
                  marginBottom: 2,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </adminDuesContext.Provider>
    </motion.div>
  );
}
