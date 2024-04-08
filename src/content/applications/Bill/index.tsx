import { Box,  Container, Grid } from '@mui/material';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import BillsTable from './components/billsTable';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import BillsApi from '@/api/billsApi';
import { billsContext } from './context';

export default function BillsManagement() {
  const [filters, setFilters] = useState<Parameters<typeof BillsApi.listBills>[0]>({
    page: 0,
    limit: 25,
    order: "desc",
    orderBy: 'name',
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date(),
    rut: '',
    deleted: false,
    enabled: false
  });
  const query = useQuery({queryFn: () => BillsApi.listBills(filters), queryKey: ['bills', filters.enabled && filters]});

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
          <title>Administración de Facturas</title>
        </Helmet>
      }
      <PageTitleWrapper>
        <h1>Administración de Facturas</h1>
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
            <billsContext.Provider
              value={{
                query,
                filters,
                setFilters
              }}
            >
              <BillsTable />
              <Box
                sx={{
                  marginBottom: 2
                }}
              />
            </billsContext.Provider>
          </Grid>
        </Grid>
      </Container>
    </motion.div>
  );
}
