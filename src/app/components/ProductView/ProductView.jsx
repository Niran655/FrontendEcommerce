"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Modal,
  Stack,
  Typography,
  Divider,
  Rating,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactImageMagnify from "react-image-magnify";
import { GET_PRODUCT } from "../../../../graphql/queries";

// 🧱 Modal styling
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const ProductView = ({ handleOpenView, handleCloseView, productId }) => {
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { productId },
  });

  const productData = data?.product;
  const subImages = productData?.subImage || [];

  const [selectedImg, setSelectedImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Pink Gold");
  const [selectedStyle, setSelectedStyle] = useState("S22 Ultra");
  const [selectedSize, setSelectedSize] = useState("512GB");

  useEffect(() => {
    if (productData?.image) {
      setSelectedImg(productData.image);
    }
  }, [productData]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  if (!productData) return <Typography>No product found</Typography>;

  return (
    <Modal open={handleOpenView} onClose={handleCloseView}>
      <Box sx={style}>
        {/* ❌ Close Button */}
        <IconButton
          onClick={handleCloseView}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Grid container spacing={4}>
          {/* 🖼️ Image Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ width: "100%", maxWidth: 500 }}>
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: productData.name,
                    isFluidWidth: true,
                    src: selectedImg,
                  },
                  largeImage: {
                    src: selectedImg,
                    width: 1200,
                    height: 1800,
                  },
                  enlargedImageContainerDimensions: {
                    width: "100%",
                    height: "100%",
                  },
                  enlargedImageContainerStyle: {
                    overflow: "hidden",
                    borderRadius: "12px",
                    zIndex: 10,
                  },
                  isHintEnabled: true,
                  shouldUsePositiveSpaceLens: true,
                  enlargedImagePosition: "over",
                }}
              />
            </Box>

            {/* 🖼️ Sub Images */}
            <Stack direction="row" spacing={2} mt={2} flexWrap="wrap" gap={1}>
              <Box
                component="img"
                src={productData.image}
                alt="Main"
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  border:
                    selectedImg === productData.image
                      ? "3px solid #1976d2"
                      : "2px solid #e0e0e0",
                  cursor: "pointer",
                  objectFit: "cover",
                }}
                onClick={() => setSelectedImg(productData.image)}
              />

              {subImages.map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={img.url}
                  alt={img.altText || `SubImage ${i + 1}`}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    border:
                      selectedImg === img.url
                        ? "3px solid #1976d2"
                        : "2px solid #e0e0e0",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() => setSelectedImg(img.url)}
                />
              ))}
            </Stack>
          </Grid>

          {/* 📦 Product Info Section */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Vendor and Rating */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                by Ecom Tech
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Rating value={4.5} precision={0.5} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">
                  (65 reviews)
                </Typography>
              </Stack>
            </Stack>

            {/* Product Title */}
            <Typography variant="h4" fontWeight="bold" mb={2}>
              {productData.name}
            </Typography>

            {/* Price Section */}
            <Stack direction="row" alignItems="center" spacing={2} mb={3}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                ${productData.price}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                ${(productData.price * 1.13).toFixed(2)}
              </Typography>
              <Chip label="11% OFF" color="error" size="small" />
            </Stack>

            {/* Features List */}
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Key Features:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">• 8K super steady video</Typography>
                <Typography variant="body2">• Nightography plus portalt mode</Typography>
                <Typography variant="body2">• 50mp photo resolution plus bright display</Typography>
                <Typography variant="body2">• Adaptive color contrast</Typography>
                <Typography variant="body2">• Premium design & craftsmanship</Typography>
                <Typography variant="body2">• Long lasting battery plus fast charging</Typography>
              </Stack>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Color Selection */}
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Color: <span style={{ fontWeight: "normal" }}>{selectedColor}</span>
              </Typography>
              <Stack direction="row" spacing={1}>
                {["Pink Gold", "Phantom Black", "Burgundy", "Green"].map((color) => (
                  <Chip
                    key={color}
                    label={color}
                    variant={selectedColor === color ? "filled" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedColor(color)}
                    sx={{ 
                      fontWeight: selectedColor === color ? "bold" : "normal",
                      borderWidth: 2
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Style Selection */}
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Style:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {["S22 Ultra", "S22", "S22 + Standing Cover"].map((style) => (
                  <Chip
                    key={style}
                    label={style}
                    variant={selectedStyle === style ? "filled" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedStyle(style)}
                    sx={{ 
                      fontWeight: selectedStyle === style ? "bold" : "normal",
                      borderWidth: 2
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Size Selection */}
            <Box mb={4}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Size:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {["1GB", "512GB", "256GB", "128GB", "64GB"].map((size) => (
                  <Chip
                    key={size}
                    label={size}
                    variant={selectedSize === size ? "filled" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedSize(size)}
                    sx={{ 
                      fontWeight: selectedSize === size ? "bold" : "normal",
                      borderWidth: 2
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* Quantity and Actions */}
            <Stack direction="row" alignItems="center" spacing={3} mb={4}>
              <Box>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Quantity
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={() => handleQuantityChange(-1)}
                    sx={{ minWidth: 40, height: 40 }}
                  >
                    -
                  </Button>
                  <Typography variant="h6" sx={{ minWidth: 40, textAlign: "center" }}>
                    {quantity}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => handleQuantityChange(1)}
                    sx={{ minWidth: 40, height: 40 }}
                  >
                    +
                  </Button>
                </Stack>
              </Box>
            </Stack>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2}>
              <Button 
                variant="outlined" 
                size="large"
                sx={{ 
                  flex: 1, 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  borderWidth: 2
                }}
              >
                Add to Cart
              </Button>
              <Button 
                variant="contained" 
                size="large"
                sx={{ 
                  flex: 1, 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold"
                }}
              >
                Buy Now
              </Button>
            </Stack>

            {/* Stock Status */}
            <Box mt={2}>
              <Chip 
                label={`Stock: ${productData.stock}`} 
                color={productData.stock > 10 ? "success" : "warning"}
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProductView;