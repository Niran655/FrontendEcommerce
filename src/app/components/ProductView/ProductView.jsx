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
  width: 800,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
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

  useEffect(() => {
    if (productData?.image) {
      setSelectedImg(productData.image);
    }
  }, [productData]);

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
          {/* 🖼️ Zoomed Image Section */}
          <Grid  size={{xs:12,md:6}}>
            <Box sx={{ width: "100%", maxWidth: 400 }}>
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
                    borderRadius: "8px",
                    zIndex: 10,
                  },
                  isHintEnabled: true,
                  shouldUsePositiveSpaceLens: true,
                  enlargedImagePosition: "over",
                }}
              />
            </Box>

            {/* 🖼️ Sub Images */}
            <Stack direction="row" spacing={2} mt={2}>
              <Box
                component="img"
                src={productData.image}
                alt="Main"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  border:
                    selectedImg === productData.image
                      ? "2px solid #1976d2"
                      : "1px solid #ddd",
                  cursor: "pointer",
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
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    border:
                      selectedImg === img.url
                        ? "2px solid #1976d2"
                        : "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedImg(img.url)}
                />
              ))}
            </Stack>
          </Grid>

          {/* 📦 Product Info Section */}
          <Grid  size={{xs:12,md:6}}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              {productData.name}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Typography variant="h6" color="primary">
                ${productData.price}
              </Typography>
              <Chip label={`Stock: ${productData.stock}`} color="primary" />
            </Stack>

            <Typography variant="body2" mb={2}>
              {productData.description}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" size="large">
                Add to Cart
              </Button>
              <Button variant="contained" size="large">
                Buy Now
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ProductView;