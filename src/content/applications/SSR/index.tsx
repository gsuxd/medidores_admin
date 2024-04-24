import { Box,  Container, Grid } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import UsersTable from './components/usersTable';
import { motion } from 'framer-motion';
import { ssrContext } from './context';
import { useQuery } from '@tanstack/react-query';
import UsersApi from '@/api/usersApi';

export default function SSRManagement() {
  const [filters, setFilters] = useState<Parameters<typeof UsersApi.listUsers>[0]>({
    page: 0,
    limit: 25,
    name: '',
    order: "desc",
    orderBy: 'name',
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
          <title>Administración de SSR</title>
        </Helmet>
      }
      <PageTitleWrapper>
        <h1>Administración de SSR</h1>
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
            <ssrContext.Provider
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
            </ssrContext.Provider>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}
