"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import {
  GET_PROUCT_BY_CATEGORY,
  GET_BANNER_BY_CATEGORY,
} from "../../../../../../graphql/queries";
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
import ProductView from "../../../../components/ProductView/ProductView";
import Image from "next/image";

export default function ProductByCategoryPage() {
  const { name } = useParams();
  
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_PROUCT_BY_CATEGORY, {
    variables: { category: name },
  });

  const { data: BannerData } = useQuery(GET_BANNER_BY_CATEGORY, {
    variables: { category: name },
  });

  const products = data?.productsByCategory || [];
  const banners = BannerData?.bannerByCategory || [];

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productViewOpen, setProductViewOpen] = useState(false);

  const handleAddToCart = (product) => {
    const productData = {
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.image ||
        "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
      stock: product.stock,
      category: product.category,
    };

    localStorage.setItem("productToAdd", JSON.stringify(productData));
    router.push("/pos");
  };

  const handleCloseView = () => setProductViewOpen(false);
  const handleOpenView = (id) => {
    setSelectedProductId(id);
    setProductViewOpen(true);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box>
      {banners.map((b, index) => (
        <Box
          key={index}
          mb={3}
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 200, sm: 250, md: 300 },
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <img
            src={b.image}
            alt={`Banner ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      ))}
      <Grid container spacing={3}>
        {products.map((product) => {
          const price = Number(product.price) || 0;
          const discount =
            Array.isArray(product.discount) && product.discount.length > 0
              ? Number(product.discount[0].discountPrice)
              : null;
          const discountPercent =
  discount && price
    ? (((price - discount) / price) * 100).toFixed(0)
    : null;

          const isLowStock = Number(product.stock) < Number(product.minStock);
          const image =
            product.image ||
            "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg";

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
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
                <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="200"
                image={image}
                alt={product.name}
              />

              {discount && price && (
                <Chip
                  label={`-${(((price - discount) / price) * 100).toFixed(0)}%`}
                  color="error"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    fontWeight: "bold",
                    backgroundColor: "#f44336",
                    color: "#fff",
                  }}
                />
              )}
            </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" noWrap>
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1.5 }}
                  >
                    {product.description}
                  </Typography>
                  <Box mb={1}>
                    <Chip
                      label={product.category}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <Box>
                    {discount ? (
                      <Box display="flex" gap={1} alignItems="center">
                        <Typography
                          variant="body1"
                          color="error"
                          fontWeight="bold"
                        >
                          💲 ${discount.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          ${price.toFixed(2)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body1">
                        💲 ${price.toFixed(2)} 
                      </Typography>
                    )}
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
                  <Button
                    size="small"
                    onClick={() => handleAddToCart(product)}
                    variant="outlined"
                    color="secondary"
                  >
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
    </Box>
  );
}
