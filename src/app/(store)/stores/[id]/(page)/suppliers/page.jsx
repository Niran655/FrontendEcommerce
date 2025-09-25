"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  FileText,
  Package,
  Plus,
  Search,
  Trash2,
  Truck,
} from "lucide-react";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import {
  CREATE_PURCHASE_ORDER,
  CREATE_SUPPLIER,
  RECEIVE_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER_STATUS,
  UPDATE_SUPPLIER,
} from "../../../../../../../graphql/mutation";
import {
  GET_PRODUCTS,
  GET_PURCHASE_ORDERS,
  GET_SUPPLIERS,
} from "../../../../../../../graphql/queries";

// Validation schemas
const supplierValidationSchema = yup.object({
  name: yup.string().required("Supplier name is required"),
  contactPerson: yup.string().required("Contact person is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

const poValidationSchema = yup.object({
  supplier: yup.string().required("Supplier is required"),
  items: yup
    .array()
    .min(1, "At least one item is required")
    .of(
      yup.object().shape({
        product: yup.string().required("Product is required"),
        quantity: yup
          .number()
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
        unitCost: yup
          .number()
          .min(0, "Unit cost cannot be negative")
          .required("Unit cost is required"),
      })
    ),
  notes: yup.string(),
});

const initialSupplierForm = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
};

const initialPOForm = {
  supplier: "",
  items: [],
  notes: "",
};

const Suppliers = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [poDialogOpen, setPODialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: suppliersData,
    loading: suppliersLoading,
    refetch: refetchSuppliers,
  } = useQuery(GET_SUPPLIERS);
  const {
    data: poData,
    loading: poLoading,
    refetch: refetchPOs,
  } = useQuery(GET_PURCHASE_ORDERS);
  
  const { data: productsData, loading: productsLoading } =
    useQuery(GET_PRODUCTS);

  const [createSupplier] = useMutation(CREATE_SUPPLIER, {
    onCompleted: () => {
      setSupplierDialogOpen(false);
      supplierFormik.resetForm();
      setEditingSupplier(null);
      refetchSuppliers();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [updateSupplier] = useMutation(UPDATE_SUPPLIER, {
    onCompleted: () => {
      setSupplierDialogOpen(false);
      supplierFormik.resetForm();
      setEditingSupplier(null);
      refetchSuppliers();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [createPurchaseOrder] = useMutation(CREATE_PURCHASE_ORDER, {
    onCompleted: () => {
      setPODialogOpen(false);
      poFormik.resetForm();
      refetchPOs();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [receivePurchaseOrder] = useMutation(RECEIVE_PURCHASE_ORDER, {
    onCompleted: () => {
      refetchPOs();
      alert("Purchase order received successfully!");
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });
  
  const [updatePurchaseOrderStatus] = useMutation(UPDATE_PURCHASE_ORDER_STATUS);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updatePurchaseOrderStatus({
        variables: {
          updatePurchaseOrderStatusId: id,
          status: status,
        },
      });
      refetchPOs();
      alert("Purchase order updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Something went wrong.");
    }
  };

  const suppliers = suppliersData?.suppliers || [];
  const purchaseOrders = poData?.purchaseOrders || [];
  const products = productsData?.products || [];

  // Formik for supplier form
  const supplierFormik = useFormik({
    initialValues: initialSupplierForm,
    validationSchema: supplierValidationSchema,
    onSubmit: (values) => {
      if (editingSupplier) {
        updateSupplier({
          variables: {
            id: editingSupplier.id,
            input: values,
          },
        });
      } else {
        createSupplier({
          variables: {
            input: values,
          },
        });
      }
    },
  });

  // Formik for purchase order form
  const poFormik = useFormik({
    initialValues: initialPOForm,
    validationSchema: poValidationSchema,
    onSubmit: (values) => {
      const subtotal = values.items.reduce((sum, item) => sum + (item.total || 0), 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;

      const input = {
        supplier: values.supplier,
        items: values.items.map((item) => ({
          product: item.product,
          name: item.name,
          quantity: parseInt(item.quantity),
          unitCost: parseFloat(item.unitCost),
          total: parseFloat(item.total),
        })),
        subtotal,
        tax,
        total,
        notes: values.notes,
      };

      createPurchaseOrder({ variables: { input } });
    },
  });

  const handleCreateSupplier = () => {
    setEditingSupplier(null);
    supplierFormik.resetForm();
    setSupplierDialogOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    supplierFormik.setValues({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    });
    setSupplierDialogOpen(true);
  };

  const handleCreatePO = () => {
    poFormik.resetForm();
    setPODialogOpen(true);
  };

  const handleAddPOItem = () => {
    const newItems = [...poFormik.values.items];
    newItems.push({
      product: "",
      quantity: "",
      unitCost: "",
      total: 0,
    });
    poFormik.setFieldValue("items", newItems);
  };

  const handlePOItemChange = (index, field, value) => {
    const items = [...poFormik.values.items];
    
    if (field === "product") {
      const product = products.find((p) => p.id === value);
      if (product) {
        items[index].name = product.name;
        items[index].unitCost = product.cost;
        items[index].total = (parseFloat(items[index].quantity) || 0) * product.cost;
      }
    } else {
      items[index][field] = value;
      
      if (field === "quantity" || field === "unitCost") {
        items[index].total =
          (parseFloat(items[index].quantity) || 0) *
          (parseFloat(items[index].unitCost) || 0);
      }
    }
    
    poFormik.setFieldValue("items", items);
  };

  const handleRemovePOItem = (index) => {
    const items = [...poFormik.values.items];
    items.splice(index, 1);
    poFormik.setFieldValue("items", items);
  };

  const handleReceivePO = async (poId) => {
    if (
      window.confirm(
        "Mark this purchase order as received? This will update stock levels."
      )
    ) {
      await receivePurchaseOrder({ variables: { id: poId } });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "ordered":
        return "info";
      case "received":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "ordered":
        return <FileText size={16} />;
      case "received":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (suppliersLoading || poLoading || productsLoading) {
    return <Typography>Loading suppliers data...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Suppliers & Purchase Orders
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Truck size={20} />}
            onClick={handleCreateSupplier}
          >
            Add Supplier
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleCreatePO}
          >
            Create PO
          </Button>
        </Stack>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={`Suppliers (${suppliers.length})`} />
        <Tab label={`Purchase Orders (${purchaseOrders.length})`} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {suppliers.map((supplier) => (
            <Grid size={{xs:12}} md={6} lg={4} key={supplier.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      <Truck size={24} />
                    </Avatar>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditSupplier(supplier)}
                        color="primary"
                      >
                        <Edit size={16} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    {supplier.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Contact: {supplier.contactPerson}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    📧 {supplier.email}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    📞 {supplier.phone}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    📍 {supplier.address}
                  </Typography>

                  <Chip
                    label={supplier.active ? "Active" : "Inactive"}
                    color={supplier.active ? "success" : "error"}
                    variant="outlined"
                    size="small"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>PO Number</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {po.poNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{po.supplier.name}</TableCell>
                      <TableCell>
                        {new Date(po.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {po.items.length} items
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          ${po.total.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(po.status)}
                          label={po.status.toUpperCase()}
                          color={getStatusColor(po.status)}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction={"row"} spacing={2}>
                          {po.status === "ordered" && (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleReceivePO(po.id)}
                              startIcon={<CheckCircle size={16} />}
                            >
                              Receive
                            </Button>
                          )}
                          {po.status !== "ordered" && (
                             <Button
                              size="small"
                              variant="contained"
                              color="success"
                              disabled
                              onClick={() => handleReceivePO(po.id)}
                              startIcon={<CheckCircle size={16} />}
                            >
                              Receive
                            </Button>
                          )}
                          <Box key={po.id} sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">
                              {po.name}
                            </Typography>
                            <FormControl size="small" fullWidth>
                              <InputLabel id={`status-label-${po.id}`}>Status</InputLabel>
                              <Select
                                value={po.status}
                                label="Status"
                                labelId={`status-label-${po.id}`}
                                onChange={(e) =>
                                  handleStatusUpdate(po.id, e.target.value)
                                }
                              >
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="ordered">Ordered</MenuItem>
                                <MenuItem value="received">Received</MenuItem>
                                <MenuItem value="cancelled">Cancelled</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
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

      {/* Supplier Dialog */}
      <Dialog
        open={supplierDialogOpen}
        onClose={() => setSupplierDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={supplierFormik.handleSubmit}>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Truck size={24} style={{ marginRight: 8 }} />
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Supplier Name"
                  name="name"
                  value={supplierFormik.values.name}
                  onChange={supplierFormik.handleChange}
                  onBlur={supplierFormik.handleBlur}
                  error={supplierFormik.touched.name && Boolean(supplierFormik.errors.name)}
                  helperText={supplierFormik.touched.name && supplierFormik.errors.name}
                  required
                />
              </Grid>
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Contact Person"
                  name="contactPerson"
                  value={supplierFormik.values.contactPerson}
                  onChange={supplierFormik.handleChange}
                  onBlur={supplierFormik.handleBlur}
                  error={supplierFormik.touched.contactPerson && Boolean(supplierFormik.errors.contactPerson)}
                  helperText={supplierFormik.touched.contactPerson && supplierFormik.errors.contactPerson}
                  required
                />
              </Grid>
              <Grid size={{xs:12}} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={supplierFormik.values.email}
                  onChange={supplierFormik.handleChange}
                  onBlur={supplierFormik.handleBlur}
                  error={supplierFormik.touched.email && Boolean(supplierFormik.errors.email)}
                  helperText={supplierFormik.touched.email && supplierFormik.errors.email}
                  required
                />
              </Grid>
              <Grid size={{xs:12}} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={supplierFormik.values.phone}
                  onChange={supplierFormik.handleChange}
                  onBlur={supplierFormik.handleBlur}
                  error={supplierFormik.touched.phone && Boolean(supplierFormik.errors.phone)}
                  helperText={supplierFormik.touched.phone && supplierFormik.errors.phone}
                  required
                />
              </Grid>
              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  name="address"
                  value={supplierFormik.values.address}
                  onChange={supplierFormik.handleChange}
                  onBlur={supplierFormik.handleBlur}
                  error={supplierFormik.touched.address && Boolean(supplierFormik.errors.address)}
                  helperText={supplierFormik.touched.address && supplierFormik.errors.address}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setSupplierDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingSupplier ? "Update Supplier" : "Add Supplier"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Purchase Order Dialog */}
      <Dialog
        open={poDialogOpen}
        onClose={() => setPODialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={poFormik.handleSubmit}>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FileText size={24} style={{ marginRight: 8 }} />
              Create Purchase Order
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{xs:12}} >
                <FormControl fullWidth required error={poFormik.touched.supplier && Boolean(poFormik.errors.supplier)}>
                  <InputLabel>Supplier</InputLabel>
                  <Select
                    name="supplier"
                    value={poFormik.values.supplier}
                    label="Supplier"
                    onChange={poFormik.handleChange}
                    onBlur={poFormik.handleBlur}
                  >
                    {suppliers.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {poFormik.touched.supplier && poFormik.errors.supplier && (
                    <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                      {poFormik.errors.supplier}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{xs:12}}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Items</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleAddPOItem}
                    startIcon={<Plus size={16} />}
                  >
                    Add Item
                  </Button>
                </Box>

                {poFormik.values.items.map((item, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent sx={{ pb: 2 }}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{xs:12,md:4}} >
                          <Autocomplete
                            fullWidth
                            options={products}
                            getOptionLabel={(option) =>
                              `${option.name} - ${option.sku}`
                            }
                            value={
                              products.find((p) => p.id === item.product) ||
                              null
                            }
                            onChange={(event, value) => {
                              handlePOItemChange(
                                index,
                                "product",
                                value?.id || ""
                              );
                            }}
                            isOptionEqualToValue={(option, value) =>
                              option.id === value?.id
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Product"
                                variant="outlined"
                                error={poFormik.touched.items && 
                                  poFormik.touched.items[index]?.product && 
                                  Boolean(poFormik.errors.items?.[index]?.product)}
                                helperText={poFormik.touched.items && 
                                  poFormik.touched.items[index]?.product && 
                                  poFormik.errors.items?.[index]?.product}
                              />
                            )}
                          />
                        </Grid>
                        <Grid size={{xs:6,md:2}} >
                          <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handlePOItemChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            inputProps={{ min: 1 }}
                            error={poFormik.touched.items && 
                              poFormik.touched.items[index]?.quantity && 
                              Boolean(poFormik.errors.items?.[index]?.quantity)}
                            helperText={poFormik.touched.items && 
                              poFormik.touched.items[index]?.quantity && 
                              poFormik.errors.items?.[index]?.quantity}
                          />
                        </Grid>
                        <Grid size={{xs:6,md:2}} >
                          <TextField
                            fullWidth
                            label="Unit Cost"
                            type="number"
                            value={item.unitCost}
                            onChange={(e) =>
                              handlePOItemChange(
                                index,
                                "unitCost",
                                e.target.value
                              )
                            }
                            inputProps={{ min: 0, step: 0.01 }}
                            error={poFormik.touched.items && 
                              poFormik.touched.items[index]?.unitCost && 
                              Boolean(poFormik.errors.items?.[index]?.unitCost)}
                            helperText={poFormik.touched.items && 
                              poFormik.touched.items[index]?.unitCost && 
                              poFormik.errors.items?.[index]?.unitCost}
                          />
                        </Grid>
                        <Grid size={{xs:6,md:2}}>
                          <TextField
                            fullWidth
                            label="Total"
                            value={(item.total || 0).toFixed(2)}
                            InputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid size={{xs:6,md:2}}>
                          <IconButton
                            color="error"
                            onClick={() => handleRemovePOItem(index)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
                {poFormik.touched.items && poFormik.errors.items && typeof poFormik.errors.items === 'string' && (
                  <Typography variant="caption" color="error">
                    {poFormik.errors.items}
                  </Typography>
                )}
              </Grid>

              {poFormik.values.items.length > 0 && (
                <Grid size={{xs:12}}>
                  <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                    <Typography variant="h6" gutterBottom>
                      Order Summary
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>Subtotal:</Typography>
                      <Typography>
                        ${poFormik.values.items.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>Tax (10%):</Typography>
                      <Typography>
                        ${(poFormik.values.items.reduce((sum, item) => sum + (item.total || 0), 0) * 0.1).toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6" color="primary">
                        ${(poFormik.values.items.reduce((sum, item) => sum + (item.total || 0), 0) * 1.1).toFixed(2)}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}

              <Grid size={{xs:12}}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  name="notes"
                  value={poFormik.values.notes}
                  onChange={poFormik.handleChange}
                  onBlur={poFormik.handleBlur}
                  placeholder="Additional notes or special instructions..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setPODialogOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!poFormik.values.supplier || poFormik.values.items.length === 0}
            >
              Create Purchase Order
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Suppliers;