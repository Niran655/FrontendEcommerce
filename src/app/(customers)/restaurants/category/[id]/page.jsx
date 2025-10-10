"use client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";

import { GET_SHOP_BY_TYPE_ID } from "../../../../../../graphql/queries";
import "../../../../../../style/Home.css";
import Link from "next/link";

const ShopByType = () => {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_SHOP_BY_TYPE_ID, {
    variables: { typeId:id },
  });
const shopCount = data?.getShopsByTypeId || [];
const number = shopCount.length;
  if (loading) return <Typography>កំពុងផ្ទុក...</Typography>;
  if (error)
    return <Typography color="error">មានបញ្ហា: {error.message}</Typography>;

  return (
    <Box p={2}>
      <Stack spacing={2}>
        <Typography className="text-container" variant="h5">
          {number} Restaurants found
        </Typography>
        <Typography>ជ្រើសរើសផលិតផលដែលអ្នកត្រូវការពីប្រភេទនេះ។</Typography>
        <Grid container spacing={3}>
          {data?.getShopsByTypeId?.map((shop) => (
            <Grid item xs={12} sm={6} md={4} key={shop.id}>
              <Link href={`/restaurants/${shop.code}/${shop.id}`} passHref>
                <Card
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={
                      shop.image ||
                      "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg"
                    }
                    alt={shop.shopName}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {shop.shopName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🇬🇧 {shop.enName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🏷️ ប្រភេទ៖ {shop.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🔗 Slug: {shop.slug}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      🆔 Code: {shop.code}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default ShopByType;
