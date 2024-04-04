import { Box,  Container, Grid } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import UsersTable from './components/usersTable';
import { motion } from 'framer-motion';
import { usersContext } from './context';
import { useQuery } from '@tanstack/react-query';
import UsersApi from '@/api/usersApi';

export default function UsersManagement() {
  const [filters, setFilters] = useState<Parameters<typeof UsersApi.listUsers>[0]>({
    role: 'partner',
    page: 0,
    limit: 25,
    name: '',
    lastName: '',
    email: '',
    phone: '',
    rut: '',
    order: "desc",
    orderBy: 'name',
    sellerId: undefined,
    adminId: undefined,
    enabled: false
  });
  const query = useQuery({queryFn: () => UsersApi.listUsers(filters), queryKey: ['users', filters]});

  return (
    <motion.div
      initial={{
        y: window.innerHeight * 0.5
      }}
      animate={{
        y: 0
      }}
      exit={{
        y: parseInt('-' + window.innerHeight.toString())
      }}
    >
      {
        <Helmet>
          <title>Administración de Usuarios</title>
        </Helmet>
      }
      <PageTitleWrapper>
        <h1>Administración de Usuarios</h1>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <usersContext.Provider
              value={{
                query,
                filters,
                setFilters
              }}
            >
              <UsersTable />
              <Box
                sx={{
                  marginBottom: 2
                }}
              />
            </usersContext.Provider>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}
