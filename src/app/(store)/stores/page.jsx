"use client";
import { useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GET_MY_SHOPS } from "../../../../graphql/queries";
import { useRouter } from "next/navigation";
export default function StorePage() {
  const { data, loading } = useQuery(GET_MY_SHOPS, {
    variables: {
      getShopsByOwnerIdId: "",
    },
  });
  const router = useRouter()
  return (
    <Box sx={{ padding: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5">Store & Stock</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Stock
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {loading ? (
          <Typography sx={{ m: 2 }}>កំពុងផ្ទុកហាង...</Typography>
        ) : (
          data?.getShopsByOwnerId?.map((shop) => (
            <Grid  size={{xs:12,sm:6,md:4}} key={shop.id}>
              <Card>
                <Stack direction="row" spacing={2} justifyContent="space-between" p={2}>
                  <img
                    style={{ width: "100px", height: "100px" }}
                    src="https://static.vecteezy.com/system/resources/previews/020/662/330/non_2x/store-icon-logo-illustration-vector.jpg"
                    alt="store"
                  />
                  <CardContent>
                    <Typography>{shop.shopName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {shop.description || "មិនមានពិពណ៌នា"}
                    </Typography>
                  </CardContent>
                </Stack>
                <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => console.log("Logout", shop.id)}
                  >
                    បញ្ចប់
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    // onClick={() => console.log("Login", shop.id)}
                      onClick={() => router.push(`/dashboard`)}
                  >
                    ចូលក្នុងហាង
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}