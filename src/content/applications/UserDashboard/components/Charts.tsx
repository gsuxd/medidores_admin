import { Box, Card, Divider, Stack } from "@mui/material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useContext, useMemo } from "react";
import { userBillsContext } from "../context";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function UserCharts() {
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
      // background: "transparent",
      toolbar: {
        show: false,
      },
      // sparkline: {
      //   enabled: true,
      // },
      // zoom: {
      //   enabled: false,
      // },
    },
    colors: ["#15bee8", "#46eb34"],
    // fill: {
    //   type: "solid",
    //   colors: ["#15bee8", "#46eb34"],
    // },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
    },
    //labels: labels.map((label) => format(label, "dd-MM-yyyy")),
    xaxis: {
      categories: labels.map((label) =>
        format(label, "LLLL", { locale: es }),
      ),
    },
    tooltip: {
      x: {
        show: false,
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
            <Box
              sx={{
                pt: 2,
                width: "100%",
              }}
            >
              <Chart
                options={chartOptions}
                series={[
                  { name: "Consumo", data },
                  { name: "Total", data: dataPrices },
                ]}
                type="bar"
                height={260}
              />
            </Box>
          </Box>
          <Box p={3}>
            <Box
              sx={{
                pt: 2,
                width: "100%",
              }}
            >
              <Chart
                options={{
                  labels,
                  chart: {
                    toolbar: {
                      show: false,
                    },
                    zoom: {
                      enabled: false
                    }
                  },
                  colors: ["#15bee8", "#46eb34"],
                  dataLabels: {
                    enabled: false,
                  },
                  markers: {
                    size: 4,
                  },
                  legend: {
                    show: true,
                    position: "top",
                    horizontalAlign: "center",
                  },
                  xaxis: {
                    categories: labels.map((label) =>
                      format(label, "LLLL", { locale: es })
                    ),
                  }
                }}
                series={[
                  { name: "Consumo", data },
                  { name: "Total", data: dataPrices },
                ]}
                type="line"
                height={260}
              />
            </Box>
          </Box>
        </Stack>
      )}
    </Card>
  );
}
