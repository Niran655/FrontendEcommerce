"use client";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Button,
  Alert,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

const LowStockAlerts = ({ lowStockProducts, onAdjustStock, t }) => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <AlertTriangle
              size={24}
              style={{ marginRight: 8, color: "#ff9800" }}
            />
            {t(`low_stock_alert`)} ({lowStockProducts.length} items)
          </Typography>
        </Box>

        {lowStockProducts.length === 0 ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            {t(`all_products_are_adequately_stocked`)}
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {lowStockProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                <Card
                  variant="outlined"
                  sx={{ border: "2px solid", borderColor: "warning.main" }}
                >
                  <CardContent>
                    <Box
                      sx={{ display: "flex", alignItems: "center", mb: 2 }}
                    >
                      <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                        <AlertTriangle size={20} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.category}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2">
                        Current Stock:{" "}
                        <strong style={{ color: "#f44336" }}>
                          {product.stock}
                        </strong>
                      </Typography>
                      <Typography variant="body2">
                        Min Stock: <strong>{product.minStock}</strong>
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      fullWidth
                      onClick={() => onAdjustStock(product)}
                    >
                      Restock Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockAlerts;