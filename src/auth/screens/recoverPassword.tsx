import {
    Box,
    Card,
    Typography,
    Container,
    Button,
    CircularProgress,
    TextField,
  } from '@mui/material';
  import { Helmet } from 'react-helmet-async';
  
  import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
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
    const {token} = useParams<{token: string}>()
    const mutation = useMutation({
        mutationKey: ['recover', token],
        mutationFn: AuthApi.recoverPassword,
    })
    return (
      <>
        <Helmet>
          <title>Recuperar Contraseña</title>
        </Helmet>
        <MainContent>
          <Container maxWidth="md">
            <Box textAlign="center">
              <Typography variant="h2" sx={{ my: 2 }}>
             {
                    mutation.isPending && 'Cargando...'
             }
              </Typography>
              <TextField
              name='newPassword'
              label='Nueva Contraseña'
              type='password'
              variant='outlined'
              fullWidth
              margin='normal'
              required
              />
              <TextField
              name='confirmNewPassword'
              label='Confirmar Nueva Contraseña'
              type='password'
              variant='outlined'
              fullWidth
              margin='normal'
              required
              />
            </Box>
            <Container maxWidth="sm">
              <Card sx={{ textAlign: 'center', mt: 3, p: 4 }}>
                <Button disabled={mutation.isPending} href="/" variant="outlined">
                  {mutation.isPending ? <CircularProgress size={24} /> : mutation.isSuccess ? 'Ir a la página principal' : 'Enviar'}
                </Button>
              </Card>
            </Container>
          </Container>
        </MainContent>
      </>
    );
  }
  
  export default VerifyCode;
  