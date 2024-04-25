import {
    Box,
    Card,
    Typography,
    Container,
    Button,
  } from '@mui/material';
  import { Helmet } from 'react-helmet-async';
  
  import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import AuthApi from '@/api/authApi';
  
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
  
  function VerifyCode() {
    const {code} = useParams<{code: string}>()
    const mutation = useMutation({
        mutationKey: ['verify', code],
        mutationFn: AuthApi.verify,
    })
    useEffect(() => {
        mutation.mutate(code!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
      <>
        <Helmet>
          <title>Verificar Email</title>
        </Helmet>
        <MainContent>
          <Container maxWidth="md">
            <Box textAlign="center">
              <Typography variant="h2" sx={{ my: 2 }}>
             {
                    mutation.isPending ? 'Verificando...' : 'Verificación completada'
             }
              </Typography>
            </Box>
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                <Button disabled={mutation.isPending} href="/" variant="outlined">
                  Ir a la página principal
                </Button>
              </Card>
            </Container>
          </Container>
        </MainContent>
      </>
    );
  }
  
  export default VerifyCode;
  