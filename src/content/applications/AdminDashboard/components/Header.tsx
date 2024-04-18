import UsersApi from "@/api/usersApi";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

export default function UserHeader() {
  const params = useParams<{ userId: string }>();
  const query = useQuery({
    queryFn: () => UsersApi.getUser(parseInt(params.userId!)),
    queryKey: ["user"],
  });

  return (
    <PageTitleWrapper>
      {query.isLoading && <p>Loading...</p>}
      {query.data && (
        <>
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}>
            <Box >
              <h1>{query.data.user.fullName}</h1>
              <p>{query.data.user.email}</p>
            </Box>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "end",
            }}>
                <Typography fontSize={20} fontWeight={700}>Deuda: {query.data.user.adminAccount!.totalDebt}$</Typography>
            </Box>
          </Box>
        </>
      )}
    </PageTitleWrapper>
  );
}
