"use client";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";
import ProductActions from "./ProductAction";
const ProductCard = ({ product, onEdit, onDelete, getShopCategoryName }) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={product.image}
          variant="square"
          sx={{ width: "100%", height: "100%", borderRadius: 0 }}
        ></Avatar>
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 1,
          }}
        >
          {product.lowStock && (
            <Chip
              label="Low Stock"
              color="warning"
              size="small"
              icon={<AlertTriangle size={16} />}
            />
          )}
          {!product.active && (
            <Chip label="Inactive" color="error" size="small" />
          )}
        </Box>
        {Array.isArray(product.discount) &&
          product.discount.length > 0 &&
          product.price > 0 && (
            <Chip
              label={`-${(
                ((product.price - Number(product.discount[0].discountPrice)) /
                  product.price) *
                100
              ).toFixed(0)}%`}
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

      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, flexGrow: 1 }}
        >
          {product.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip label={product.category} size="small" sx={{ mb: 1, mr: 1 }} />
          <Chip
            label={getShopCategoryName(product)}
            size="small"
            color="secondary"
            sx={{ mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            SKU: {product.sku}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          {product.discount.length > 0 && (
            <Stack direction={"row"} spacing={2}>
              <Typography variant="h6" color="primary" fontWeight="bold">
                ${parseFloat(product.discount[0].discountPrice).toFixed(2)}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                fontWeight="bold"
                sx={{ textDecoration: "line-through", color: "gray" }}
              >
                ${product.price.toFixed(2)}
              </Typography>
            </Stack>
          )}

          {product.discount.length === 0 && (
            <Typography variant="h6" color="primary" fontWeight="bold">
              ${product.price.toFixed(2) || "0.00"}
            </Typography>
          )}

          <Chip
            label={`Stock: ${product.stock}`}
            color={product.lowStock ? "error" : "success"}
            size="small"
            variant="outlined"
          />
        </Box>

        <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
      </CardContent>
    </Card>
  );
};

export default ProductCard;
