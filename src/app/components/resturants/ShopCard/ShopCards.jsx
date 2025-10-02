"use client";

import { useQuery } from "@apollo/client/react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

import { GET_ALL_SHOPS } from "../../../../../graphql/queries";
import Link from "next/link";

const ShopCard = () => {
  const { data, loading, error } = useQuery(GET_ALL_SHOPS);
  const shops = data?.getShops || [];

  if (loading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Grid container spacing={3}>
      {shops.map((shop) => {
        const image =
          shop.image ||
          "https://img.freepik.com/free-psd/roasted-chicken-dinner-platter-delicious-feast_632498-25445.jpg?semt=ais_hybrid&w=740&q=80";

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={shop.id}>
            <Link href={`restaurants/${shop.code}/${shop.id}`} passHref>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 3,
                  position: "relative",
                  height: "400px",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": {
                    // transform: "translateY(-6px)",
                    boxShadow: 6,
                    "& .shop-image": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                <Chip
                  label="New"
                  color="primary"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    bgcolor: "#1976d2",
                    color: "white",
                    fontWeight: "bold",
                    zIndex: 2,
                  }}
                />

                {/* Shop Image */}
                <Box sx={{ overflow: "hidden" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={image}
                    alt={shop.shopName}
                    className="shop-image"
                    sx={{
                      objectFit: "cover",
                      width: "100%",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  />
                </Box>

                {/* Shop Info */}
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {shop.shopName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {shop.description}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(shop.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ShopCard;
