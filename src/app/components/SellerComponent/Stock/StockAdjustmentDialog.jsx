"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { Settings } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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

const StockAdjustmentDialog = ({
  open,
  onClose,
  selectedProduct,
  onAdjustStock,
  t,
  id
}) => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await onAdjustStock({
        productId: selectedProduct.id,
        quantity: parseInt(values.quantity),
        reason: values.reason,
        shopId:id
      });
      resetForm();
      onClose();
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Formik
        initialValues={{
          quantity: "",
          reason: "",
        }}
        validationSchema={adjustmentSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Settings size={24} style={{ marginRight: 8 }} />
                {t(`adjust_stock`)} - {selectedProduct?.name}
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedProduct && (
                <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t(`current_stock`)}:{" "}
                    <strong>{selectedProduct.stock}</strong> {t(`unit`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(`min_stock`)}:{" "}
                    <strong>{selectedProduct.minStock}</strong> {t(`unit`)}
                  </Typography>
                </Box>
              )}
              <Typography>{t(`adjust_qty`)}</Typography>
              <Field name="quantity">
                {({ field, meta }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    placeholder={t(`enter_positive_number`)}
                    sx={{ mb: 3 }}
                    helperText={
                      meta.touched && meta.error
                        ? meta.error
                        : t(`use_positive_number`)
                    }
                    error={meta.touched && Boolean(meta.error)}
                  />
                )}
              </Field>
              <Typography>{t(`reason_for_adjustment`)}</Typography>
              <Field name="reason">
                {({ field, meta }) => (
                  <TextField
                    {...field}
                    fullWidth
                    placeholder={t(`example_stock_count`)}
                    multiline
                    rows={3}
                    helperText={
                      meta.touched && meta.error
                        ? meta.error
                        : t(`please_provide`)
                    }
                    error={meta.touched && Boolean(meta.error)}
                  />
                )}
              </Field>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Apply Adjustment"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default StockAdjustmentDialog;
