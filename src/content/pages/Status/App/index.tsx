import {
  Box,
  Card,
  Typography,
  Container,
  Button,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

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

function App() {
  return (
    <>
      <Helmet>
        <title>App</title>
      </Helmet>
      <MainContent>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="404" height={180} src="/static/images/status/404.svg" />
            <Typography variant="h2" sx={{ my: 2 }}>
              Instala la app móvil para acceder.
            </Typography>
          </Box>
          <Container maxWidth="sm">
            <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
              <Button href="/" variant="outlined">
                Ir a la tienda
              </Button>
            </Card>
          </Container>
        </Container>
      </MainContent>
    </>
  );
}

export default App;
