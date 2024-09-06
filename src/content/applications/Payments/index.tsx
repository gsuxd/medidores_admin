import { Box,  Container, Grid } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PaymentsTable from './components/paymentsTable';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import PaymentsApi from '@/api/paymentsApi';
import { paymentsContext } from './context';

export default function PaymentsManagement() {
  const [filters, setFilters] = useState<Parameters<typeof PaymentsApi.list>[0]>({
    page: 0,
    limit: 25,
    order: "desc",
    orderBy: 'name',
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
    rut: '',
    enabled: false
  });
  const query = useQuery({queryFn: () => PaymentsApi.list(filters), queryKey: ['payments', filters.enabled && filters]});

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
          <title>Administración de Pagos</title>
        </Helmet>
      }
      <PageTitleWrapper>
        <h1>Administración de Pagos</h1>
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
            <paymentsContext.Provider
              value={{
                query,
                filters,
                setFilters
              }}
            >
              <PaymentsTable />
              <Box
                sx={{
                  marginBottom: 2
                }}
              />
            </paymentsContext.Provider>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}
