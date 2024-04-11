import SSRApi from "@/api/ssrAPI";
import {
    Box,
    Card,
    List,
    ListItem,
    Typography,
  } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectSSR() {
    const query = useQuery({
        queryKey: ['ssrList'],
        queryFn: SSRApi.list,
    })

    const [ssrId, setSSRId] = useState<number | null>(null)

    const navigate = useNavigate();

        const mutation = useMutation({
            mutationFn: async () => {
                if (!ssrId) return;
                await SSRApi.login(ssrId);
                localStorage.setItem('ssr',JSON.stringify(query.data!.ssr.get(ssrId)?.toJson()))
                navigate("/admin/dashboard")
            }
        })

    const ssrList = useMemo(() => query.data && Array.from(query.data.ssr.values()).map(ssr => (
        <ListItem onClick={() => {
            if (mutation.isPending) return
            setSSRId(ssr.id)
            mutation.mutate()
        }} key={ssr.id}>
            <Typography>{ssr.name}</Typography>
        </ListItem>
    )), [query.data, mutation])

    return (
        <Box
        display="flex"
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            placeItems: "center",
            gap: "2rem",
            padding: "4rem 0",
          }}
        >
          <Typography mb="1rem" variant="h2">
            Selecciona el SSR
          </Typography>
        
          <List>
            {ssrList}
          </List>
        </Card>
      </Box>
    )
}