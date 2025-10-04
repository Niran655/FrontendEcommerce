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
  onAdjustStock 
}) => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await onAdjustStock({
        productId: selectedProduct.id,
        quantity: parseInt(values.quantity),
        reason: values.reason,
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
              <Button onClick={onClose}>
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
  );
};

export default StockAdjustmentDialog;