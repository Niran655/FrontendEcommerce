"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Warehouse,
  TrendingUp,
  TrendingDown,
  Settings,
  AlertTriangle,
  Package,
  Plus,
  Minus,
  Search,
  FileText,
} from "lucide-react";
import {
  GET_STOCK_MOVEMENTS,
  GET_LOW_STOCK_PRODUCTS_FOR_SHOP,
  GET_PRODUCT_FOR_SHOP,
} from "../../../../../../../graphql/queries";
import { ADJUST_STOCK } from "../../../../../../../graphql/mutation";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { translateLauguage } from "@/app/function/translate";

// Validation Schema using Yup :cite[5]:cite[10]
const adjustmentSchema = Yup.object().shape({
  quantity: Yup.number()
    .required("Quantity is required")
    .integer("Quantity must be a whole number")
    .notOneOf([0], "Quantity cannot be zero")
    .test(
      "max-adjustment",
      "Adjustment too large (max ±1000)",
      (value) => value === undefined || Math.abs(value) <= 1000
    ),
  reason: Yup.string()
    .required("Reason is required")
    .min(5, "Reason must be at least 5 characters")
    .max(200, "Reason must be less than 200 characters"),
});

const StockManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();
  const {
    data: stockData,
    loading: stockLoading,
    refetch: refetchStock,
  } = useQuery(GET_STOCK_MOVEMENTS);

  const {
    data: lowStockData,
    loading: lowStockLoading,
    refetch: refetchLowStock,
  } = useQuery(GET_LOW_STOCK_PRODUCTS_FOR_SHOP, {
    variables: {
      shopId: id,
    },
  });
  const { data: productsData, loading: productsLoading } = useQuery(
    GET_PRODUCT_FOR_SHOP,
    {
      variables: {
        shopId: id,
      },
    }
  );

  const [adjustStock] = useMutation(ADJUST_STOCK, {
    onCompleted: () => {
      setAdjustDialogOpen(false);
      setSelectedProduct(null);
      refetchStock();
      refetchLowStock();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    setAdjustDialogOpen(true);
  };

  const handleSubmitAdjustment = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    try {
      await adjustStock({
        variables: {
          productId: selectedProduct.id,
          quantity: parseInt(values.quantity),
          reason: values.reason,
        },
      });
      resetForm();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getMovementTypeIcon = (type) => {
    switch (type) {
      case "in":
        return <TrendingUp size={20} color="#4caf50" />;
      case "out":
        return <TrendingDown size={20} color="#f44336" />;
      case "adjustment":
        return <Settings size={20} color="#ff9800" />;
      default:
        return <Package size={20} />;
    }
  };

  const getMovementTypeColor = (type) => {
    switch (type) {
      case "in":
        return "success";
      case "out":
        return "error";
      case "adjustment":
        return "warning";
      default:
        return "default";
    }
  };

  const filteredProducts =
    productsData?.getProductsForShop?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const lowStockProducts = lowStockData?.getLowStockProductByShop || [];
  const stockMovements = stockData?.stockMovements || [];

  if (stockLoading || lowStockLoading || productsLoading) {
    return <Typography>Loading stock data...</Typography>;
  }

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: 600 }}
      >
        {t(`stock_management`)}
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab
          label={t(`stock_momvements`)}
          sx={{ textTransform: "capitalize" }}
        />
        <Tab label={t(`low_stock`)} sx={{ textTransform: "capitalize" }} />
        <Tab label={t(`stock_adjust`)} sx={{ textTransform: "capitalize" }} />
      </Tabs>

      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 3 }}
            >
              <FileText size={24} style={{ marginRight: 8 }} />
              {t(`recent_stock`)}
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date/Time</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Stock Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockMovements.slice(0, 20).map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {new Date(movement.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                            <Package size={16} />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {movement.product.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {movement.product.sku}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getMovementTypeIcon(movement.type)}
                          label={movement.type.toUpperCase()}
                          color={getMovementTypeColor(movement.type)}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {movement.type === "out" ? "-" : "+"}
                          {movement.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>{movement.reason}</TableCell>
                      <TableCell>
                        {movement.reference && (
                          <Chip
                            label={movement.reference}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>{movement.user.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {movement.previousStock} → {movement.newStock}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {activeTab === 1 && (
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
                          onClick={() => handleAdjustStock(product)}
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
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", mb: 3 }}
            >
              <Settings size={24} style={{ marginRight: 8 }} />
              {t(`stock_adjust`)}
            </Typography>
            <Stack direction={"row"}>
              <Box>
                <Typography>Search</Typography>
                <TextField
                  placeholder="Search products..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Search
                        size={20}
                        style={{ marginRight: 8, color: "#666" }}
                      />
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </Box>
              <Box></Box>
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Current Stock</TableCell>
                    <TableCell>Min Stock</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.slice(0, 20).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={product.image}
                            sx={{ width: 40, height: 40, mr: 2 }}
                          >
                            <Package size={20} />
                          </Avatar>
                          {product.name}
                        </Box>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <Chip
                          label={product.category}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {product.stock}
                        </Typography>
                      </TableCell>
                      <TableCell>{product.minStock}</TableCell>
                      <TableCell>
                        <Chip
                          label={product.lowStock ? "Low Stock" : "In Stock"}
                          color={product.lowStock ? "error" : "success"}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Add Stock">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => {
                                setSelectedProduct(product);
                                setAdjustDialogOpen(true);
                              }}
                            >
                              <Plus size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove Stock">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setSelectedProduct(product);
                                setAdjustDialogOpen(true);
                              }}
                            >
                              <Minus size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Custom Adjustment">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleAdjustStock(product)}
                            >
                              <Settings size={16} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Stock Adjustment Dialog with Formik */}
      <Dialog
        open={adjustDialogOpen}
        onClose={() => setAdjustDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Formik
          initialValues={{
            quantity: "",
            reason: "",
          }}
          validationSchema={adjustmentSchema}
          onSubmit={handleSubmitAdjustment}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Settings size={24} style={{ marginRight: 8 }} />
                  Adjust Stock - {selectedProduct?.name}
                </Box>
              </DialogTitle>
              <DialogContent>
                {selectedProduct && (
                  <Box
                    sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Current Stock: <strong>{selectedProduct.stock}</strong>{" "}
                      units
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Minimum Stock: <strong>{selectedProduct.minStock}</strong>{" "}
                      units
                    </Typography>
                  </Box>
                )}

                <Field name="quantity">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Adjustment Quantity"
                      type="number"
                      placeholder="Enter positive number to add, negative to remove"
                      sx={{ mb: 3 }}
                      helperText={
                        meta.touched && meta.error
                          ? meta.error
                          : "Use positive numbers to increase stock, negative numbers to decrease"
                      }
                      error={meta.touched && Boolean(meta.error)}
                    />
                  )}
                </Field>

                <Field name="reason">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Reason for Adjustment"
                      placeholder="e.g., Stock count correction, Damaged goods, etc."
                      multiline
                      rows={3}
                      helperText={
                        meta.touched && meta.error
                          ? meta.error
                          : "Please provide a detailed reason for this adjustment"
                      }
                      error={meta.touched && Boolean(meta.error)}
                    />
                  )}
                </Field>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setAdjustDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Apply Adjustment"}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default StockManagement;
