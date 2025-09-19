"use client";
import { useQuery } from "@apollo/client/react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { GET_PROUCT_BY_CATEGORY } from "../../../../graphql/queries"; 
import ProductView from "../ProductView/ProductView";

const DesktopCard = () => {
  const { data, loading, error } = useQuery(GET_PROUCT_BY_CATEGORY, {
    variables: {
      category: "Desktop", 
    },
  });

  const products = data?.productsByCategory || []; 
  
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productViewOpen, setProductViewOpen] = useState(false);

  const handleCloseView = () => setProductViewOpen(false);
  const handleOpenView = (id) => {
    setSelectedProductId(id);
    setProductViewOpen(true);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Grid container spacing={3}>
      {products.map((product) => {
        const price = Number(product.price) || 0;
        const cost = Number(product.cost) || 0;
        const isLowStock = Number(product.stock) < Number(product.minStock);
        const image =
          product.image ||
          "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg";

        return (
          <Grid  size={{xs:12,sm:6,md:4,lg:3}} key={product.id}> 
            <Card
              sx={{
                bgcolor: "#E5E7EB",
                borderRadius: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              elevation={0}
            >
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {product.description}
                </Typography>
                <Box mb={1}>
                  <Chip label={product.category} color="primary" size="small" />
                </Box>

                <Box>
                  <Typography variant="body1">
                    💲 Price: ${price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    🧾 Cost: ${cost.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={isLowStock ? "error" : "text.secondary"}
                  >
                    📦 Stock: {product.stock} {isLowStock && "(Low)"}
                  </Typography>
                  <Typography variant="caption" display="block" mt={1}>
                    SKU: {product.sku}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenView(product.id)}
                >
                  View Details
                </Button>
                <Button size="small" variant="outlined" color="secondary">
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}


      {productViewOpen && selectedProductId && (
        <ProductView
          productId={selectedProductId}
          handleOpenView={productViewOpen}
          handleCloseView={handleCloseView}
        />
      )}
      
    </Grid>
  );
};

export default DesktopCard;