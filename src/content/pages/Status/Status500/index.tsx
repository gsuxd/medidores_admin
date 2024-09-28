import {
  Box,
  Typography,
  Container,
  Button,
  Grid
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import RefreshTwoToneIcon from '@mui/icons-material/RefreshTwoTone';
import Status500Image from '@/assets/status500.svg';

import { styled } from '@mui/material/styles';

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

function Status500() {

  return (
    <>
      <Helmet>
        <title>Status - 500</title>
      </Helmet>
      <MainContent>
        <Grid
          container
          sx={{ height: '100%' }}
          alignItems="center"
          justifyContent="center"
          spacing={0}
        >
          <Grid
            xs={12}
            md={6}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container maxWidth="sm">
              <Box textAlign="center">
                <img
                  alt="500"
                  height={260}
                  src={Status500Image}
                />
                <Typography variant="h2" sx={{ my: 2 }}>
                  Ocurrió un error, porfavor intenta nuevamente
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                  El servidor ha encontrado una situación inesperada que no puede manejar.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshTwoToneIcon />}
                  href="/admin/dashboard"
                >
                  Intentar de nuevo
                </Button>
                <Button href="/" variant="contained" sx={{ ml: 1 }}>
                  Volver al inicio
                </Button>
              </Box>
            </Container>
          </Grid>
        </Grid>
        <Box>
          <a href=""></a>
        </Box>
      </MainContent>
    </>
  );
}

export default Status500;
