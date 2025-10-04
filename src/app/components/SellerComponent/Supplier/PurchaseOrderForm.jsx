"use client";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  TextField,
  Autocomplete,
  Paper,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import { FileText, Plus, Trash2 } from "lucide-react";
import * as yup from "yup";

import { CREATE_PURCHASE_ORDER_FOR_SHOP } from "../../../../../graphql/mutation";

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

const initialPOForm = {
  supplier: "",
  items: [],
  notes: "",
};

const PurchaseOrderForm = ({ 
  open, 
  onClose, 
  suppliers, 
  products, 
  shopId, 
  refetchPOs,
  t
}) => {
  const [createPurchaseOrderForShop] = useMutation(
    CREATE_PURCHASE_ORDER_FOR_SHOP,
    {
      onCompleted: () => {
        onClose();
        poFormik.resetForm();
        refetchPOs();
      },
      onError: (error) => alert(`Error: ${error.message}`),
    }
  );

  const poFormik = useFormik({
    initialValues: initialPOForm,
    validationSchema: poValidationSchema,
    onSubmit: (values) => {
      const subtotal = values.items.reduce(
        (sum, item) => sum + (item.total || 0),
        0
      );
      const tax = subtotal * 0.1;
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

      createPurchaseOrderForShop({ 
        variables: { 
          shopId: shopId,
          input 
        } 
      });
    },
  });

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
        items[index].total =
          (parseFloat(items[index].quantity) || 0) * product.cost;
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={poFormik.handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FileText size={24} style={{ marginRight: 8 }} />
            {t(`create_purchase`)}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Typography>{t(`supplier`)}</Typography>
            <Grid size={{ xs: 12 }}>
              <FormControl
                fullWidth
                required
                placeholder={t(`supplier`)}
                error={
                  poFormik.touched.supplier &&
                  Boolean(poFormik.errors.supplier)
                }
              >
                <Select
                  name="supplier"
                  placeholder={t(`supplier`)}
                  value={poFormik.values.supplier}
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

            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">{t(`product`)}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAddPOItem}
                  startIcon={<Plus size={16} />}
                >
                  {t(`add_product`)}
                </Button>
              </Box>

              {poFormik.values.items.map((item, index) => (
                <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ pb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid size={{ xs: 12, md: 4 }}>
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
                              label={t(`product`)}
                              variant="outlined"
                              error={
                                poFormik.touched.items &&
                                poFormik.touched.items[index]?.product &&
                                Boolean(
                                  poFormik.errors.items?.[index]?.product
                                )
                              }
                              helperText={
                                poFormik.touched.items &&
                                poFormik.touched.items[index]?.product &&
                                poFormik.errors.items?.[index]?.product
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
                        <TextField
                          fullWidth
                          label={t(`qty`)}
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
                          error={
                            poFormik.touched.items &&
                            poFormik.touched.items[index]?.quantity &&
                            Boolean(poFormik.errors.items?.[index]?.quantity)
                          }
                          helperText={
                            poFormik.touched.items &&
                            poFormik.touched.items[index]?.quantity &&
                            poFormik.errors.items?.[index]?.quantity
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
                        <TextField
                          fullWidth
                          label={t(`cost`)}
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
                          error={
                            poFormik.touched.items &&
                            poFormik.touched.items[index]?.unitCost &&
                            Boolean(poFormik.errors.items?.[index]?.unitCost)
                          }
                          helperText={
                            poFormik.touched.items &&
                            poFormik.touched.items[index]?.unitCost &&
                            poFormik.errors.items?.[index]?.unitCost
                          }
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
                        <TextField
                          fullWidth
                          label={t(`total`)}
                          value={(item.total || 0).toFixed(2)}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid size={{ xs: 6, md: 2 }}>
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
              {poFormik.touched.items &&
                poFormik.errors.items &&
                typeof poFormik.errors.items === "string" && (
                  <Typography variant="caption" color="error">
                    {poFormik.errors.items}
                  </Typography>
                )}
            </Grid>

            {poFormik.values.items.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Typography variant="h6" gutterBottom>
                    {t(`order_summery`)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>{t(`sub_total`)}</Typography>
                    <Typography>
                      $
                      {poFormik.values.items
                        .reduce((sum, item) => sum + (item.total || 0), 0)
                        .toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>{t(`tax`)} (10%):</Typography>
                    <Typography>
                      $
                      {(
                        poFormik.values.items.reduce(
                          (sum, item) => sum + (item.total || 0),
                          0
                        ) * 0.1
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h6">{t(`total`)}:</Typography>
                    <Typography variant="h6" color="primary">
                      $
                      {(
                        poFormik.values.items.reduce(
                          (sum, item) => sum + (item.total || 0),
                          0
                        ) * 1.1
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <Typography>{t(`remark`)}</Typography>
              <TextField
                fullWidth
         
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
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              !poFormik.values.supplier || poFormik.values.items.length === 0
            }
          >
            Create Purchase Order
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PurchaseOrderForm;