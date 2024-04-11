import { Box, Card, Divider, Stack, Typography, useTheme } from "@mui/material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useContext, useMemo } from "react";
import { userBillsContext } from "../context";
import { format } from "date-fns";

export default function UserCharts() {
  const theme = useTheme();
  const { query } = useContext(userBillsContext);
  const labels = useMemo(
    () =>
      query.data
        ? Array.from(query.data?.bills.values()).map((bill) =>
            format(bill.createdAt, "dd-MM-yyyy")
          )
        : [],
    [query.data]
  );
  const data = useMemo(
    () =>
      query.data
        ? Array.from(query.data?.bills.values()).map((bill) => bill.consumed)
        : [],
    [query.data]
  );
  const chartOptions: ApexOptions = {
    chart: {
      background: "transparent",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      zoom: {
        enabled: false,
      },
    },
    fill: {
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [0, 100],
      },
    },
    colors: [theme.colors.primary.main],
    dataLabels: {
      enabled: false,
    },
    theme: {
      mode: theme.palette.mode,
    },
    stroke: {
      show: true,
      colors: [theme.colors.primary.main],
      width: 3,
    },
    legend: {
      show: false,
    },
    labels,
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      tickAmount: 5,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        title: {
          formatter: function () {
            return "Consumo: m3";
          },
        },
      },
      marker: {
        show: false,
      },
    },
  };

  const dataPrices = useMemo(
    () =>
      query.data
        ? Array.from(query.data?.bills.values()).map((bill) => bill.total)
        : [],
    [query.data]
  );

  return (
    <Card
      sx={{
        marginLeft: 2,
        marginRight: 2,
        marginBottom: 2,
      }}
    >
      {query.isLoading && <p>Loading...</p>}
      {query.data && (
        <Stack
          direction="row"
          alignItems="stretch"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={0}
          justifyContent="space-evenly"
        >
          <Box p={3}>
            <Typography variant="h2">Consumo</Typography>
            <Box
              sx={{
                p: 2,
                width: "100%",
              }}
            >
              <Chart
                options={chartOptions}
                series={[{ name: "Consumo", data }]}
                type="area"
                height={200}
              />
            </Box>
          </Box>
          <Box
            sx={{
              p: 3,
            }}
          >
            <Typography variant="h2">Precio</Typography>
            <Box p={2} width="100%">
              <Chart
                options={{
                  ...chartOptions,
                  colors: [theme.colors.secondary.main],
                  tooltip: {
                    ...chartOptions.tooltip,
                    y: {
                      ...chartOptions.tooltip!.y,
                      title: {
                        formatter: function () {
                          return "Precio: $";
                        },
                      },
                    },
                  },
                }}
                series={[{ name: "Total", data: dataPrices }]}
                type="area"
                height={200}
              />
            </Box>
          </Box>
        </Stack>
      )}
    </Card>
  );
}
