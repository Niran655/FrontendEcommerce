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
  Rating,
  IconButton,
} from "@mui/material";
import { FavoriteBorder, Visibility, ShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { GET_PRODUCTS } from "../../../../graphql/queries";
import ProductView from "../ProductView/ProductView";

const ProductCard = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const products = data?.products || [];
  const router = useRouter();

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productViewOpen, setProductViewOpen] = useState(false);

  const handleCloseView = () => setProductViewOpen(false);
  const handleOpenView = (id) => {
    setSelectedProductId(id);
    setProductViewOpen(true);
  };

  const handleAddToCart = (product) => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.image ||
        "https://images.pexels.com/photos/159681/glasses-eyewear-optical-eyes-159681.jpeg",
      stock: product.stock,
      category: product.category,
    };
    localStorage.setItem("productToAdd", JSON.stringify(productData));
    router.push("/pos");
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Grid container spacing={3}>
      {products.map((product) => {
        const price = Number(product.price) || 0;
        const image =
          product.image ||
          "https://images.pexels.com/photos/159681/glasses-eyewear-optical-eyes-159681.jpeg";

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <Card
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
                position: "relative",
              }}
            >
              {/* Discount Badge */}
              <Chip
                label="-17%"
                color="error"
                size="small"
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  bgcolor: "#FF6B6B",
                  color: "white",
                  fontWeight: "bold",
                }}
              />

              {/* Product Image */}
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  alt={product.name}
                  sx={{ objectFit: "cover", width: "100%" }}
                />

                {/* Quick Actions on Hover */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    opacity: 0,
                    transition: "opacity 0.3s",
                    "&:hover": { opacity: 1 },
                    pointerEvents: "auto",
                  }}
                >
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleOpenView(product.id)}
                    sx={{ bgcolor: "white", boxShadow: 1 }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    size="small"
                    onClick={() => handleAddToCart(product)}
                    sx={{ bgcolor: "white", boxShadow: 1 }}
                  >
                    <ShoppingCart fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    sx={{ bgcolor: "white", boxShadow: 1 }}
                  >
                    <FavoriteBorder fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Product Info */}
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                >
                  {product.brand || "Eye Shop"}
                </Typography>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {product.name}
                </Typography>

                <Rating
                  value={4.5}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="caption" display="block" gutterBottom>
                  (65 reviews)
                </Typography>

                {/* Price */}
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                >
                  ${price.toFixed(2)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through", color: "gray" }}
                >
                  ${(price * 1.2).toFixed(2)}
                </Typography>
              </CardContent>

              {/* Add to Cart Button */}
              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => handleAddToCart(product)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                  startIcon={<ShoppingCart />}
                >
                  Add To Cart
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

export default ProductCard;
