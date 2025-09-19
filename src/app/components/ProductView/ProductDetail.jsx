import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Chip, Grid, IconButton, Modal, Stack, Typography } from "@mui/material";
import React, { useState } from "react";

const product = {
  name: "SAMSUNG Galaxy S22 Ultra, 8K Camera & Video, Brightest Display Screen, S Pen Pro",
  price: 2856.3,
  oldPrice: 3225.6,
  rating: 4.8,
  reviews: 65,
  description: [
    "8k super steady video",
    "Nightography plus portrait mode",
    "50Mp photo resolution plus bright display",
    "Adaptive color contrast",
    "Premium design & craftmanship",
    "Long lasting battery plus fast charging",
  ],
  images: [
    "https://m.media-amazon.com/images/I/71QE00iB9IL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71jWkDVBpRL._AC_SL1500_.jpg",
    "https://m.media-amazon.com/images/I/71bqQxkNb9L._AC_SL1500_.jpg",
  ],
};

export default function ProductDetail() {
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(product.images[0]);

  return (
    <Box p={4}>
      <Grid container spacing={4}>
        {/* Left side - Image */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={selectedImg}
            alt={product.name}
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: 3,
              cursor: "pointer",
            }}
            onClick={() => setOpen(true)}
          />
          <Stack direction="row" spacing={2} mt={2}>
            {product.images.map((img) => (
              <Box
                key={img}
                component="img"
                src={img}
                alt="thumb"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  border: selectedImg === img ? "2px solid #1976d2" : "1px solid #ddd",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedImg(img)}
              />
            ))}
          </Stack>
        </Grid>

        {/* Right side - Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {product.name}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Typography variant="h6" color="primary">
              ${product.price}
            </Typography>
            <Typography
              variant="body1"
              sx={{ textDecoration: "line-through", color: "text.secondary" }}
            >
              ${product.oldPrice}
            </Typography>
            <Chip label={`${product.rating} ★ (${product.reviews} reviews)`} />
          </Stack>

          <Box mb={2}>
            {product.description.map((d, i) => (
              <Typography key={i} variant="body2" sx={{ mb: 0.5 }}>
                • {d}
              </Typography>
            ))}
          </Box>

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

      {/* Zoom Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 2,
            borderRadius: 2,
            boxShadow: 24,
            outline: "none",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={selectedImg}
            alt="zoom"
            sx={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: 2 }}
          />
        </Box>
      </Modal>
    </Box>
  );
}
