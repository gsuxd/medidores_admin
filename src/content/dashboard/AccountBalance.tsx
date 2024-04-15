import {
  Card,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import AuthApi from '@/api/authApi';

function AccountBalance() {
  const query = useQuery({
    queryKey: ['dashboardInfo'],
    queryFn: AuthApi.getDashboardInfo,
  })
  return (
    <Card>
      <Grid spacing={0} container>
        <Grid item xs={12} md={6}>
          <Box p={4}>
            <Typography
              sx={{
                pb: 3
              }}
              variant="h4"
            >
              Deudas totales
            </Typography>
            <Box>
              <Typography variant="h1" gutterBottom>
                {query.data && `${query.data.totalDebt}$`}
              </Typography>
              <Typography
                variant="h4"
                fontWeight="normal"
                color="text.secondary"
              >
                {(query.data && query.data.totalConsumed) && `${query.data.totalConsumed} m3`}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AccountBalance;
