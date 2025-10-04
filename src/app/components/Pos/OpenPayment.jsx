import { useMutation } from "@apollo/client/react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { CreditCard, DollarSign, Mail, Phone, QrCode, Receipt, UserCheck } from "lucide-react";
import { useState } from "react";

import { UPDATE_ORDER_STATUS } from "../../../../graphql/mutation";
import { useAuth } from "@/app/context/AuthContext";
import { translateLauguage } from "@/app/function/translate";

const PaymentDialog = ({
  open,
  onClose,
  total,
  currentCustomer,
  currentLocation,
  cart,
  orderId,
  paymentMethod,
  setPaymentMethod,
  amountPaid,
  setAmountPaid,
  onProcessSale,
  getPaymentMethodIcon,
}) => {
  const [status, setStatus] = useState("COMPLETED");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
    const { language } = useAuth();
    const { t } = translateLauguage(language);
  const { setAlert } = useAuth();
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: ({ updateOrderStatus }) => {
      if (updateOrderStatus?.isSuccess) {
        setAlert(true, "success", updateOrderStatus?.message);
      } else {
        setAlert(true, "error", updateOrderStatus?.message);
      }
    },
    onError: (error) => {
      console.log("Error", error);
    },
  });

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await updateOrderStatus({ variables: { orderId, status: newStatus } });
      setStatus(newStatus);
    } catch (err) {
      console.error("Update failed:", err);
      alert("មានបញ្ហា! សូមពិនិត្យម្តងទៀត។");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Receipt size={24} style={{ marginRight: 8 }} />
          {t(`complete_payment`)}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography
            variant="h5"
            align="center"
            color="primary"
            fontWeight="bold"
          >
            {t(`total`)}: ${total.toFixed(2)}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          {currentCustomer && (
            <Box sx={{ p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {t(`customer`)}
              </Typography>
              <Typography variant="body2">
                <UserCheck size={15} /> {currentCustomer.firstName}{" "}
                {currentCustomer.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <Mail size={15} /> {currentCustomer.email}
              </Typography>
              {currentCustomer.phone && (
                <Typography variant="body2" color="text.secondary">
                  <Phone size={15} /> {currentCustomer.phone}
                </Typography>
              )}
            </Box>
          )}

          {currentLocation && (
            <Box sx={{ p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {t(`loacation`)}
              </Typography>
              <Typography mt={2} variant="body2">
                {currentLocation.formatted}
              </Typography>
            </Box>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2, p: 2, bgcolor: "white", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t(`invoice_preview`)}
          </Typography>
          {cart.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}
            >
              <Typography variant="body2">
                {item.name} (×{item.quantity})
              </Typography>
              <Typography variant="body2">
                ${(item.quantity * item.price).toFixed(2)}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}
          >
            <Typography variant="body1">Total:</Typography>
            <Typography variant="body1">${total.toFixed(2)}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography>{t(`payment_method`)}</Typography>
          <Select
            value={paymentMethod}
            
            size="small"
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="cash">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DollarSign size={20} style={{ marginRight: 8 }} />
                {t(`cash`)}
              </Box>
            </MenuItem>
            <MenuItem value="card">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CreditCard size={20} style={{ marginRight: 8 }} />
                {t(`card`)}
              </Box>
            </MenuItem>
            <MenuItem value="qr">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <QrCode size={20} style={{ marginRight: 8 }} />
                {t(`qr_code`)}
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {currentLocation && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              {t(`update_order_status`)}
            </Typography>
            <FormControl size="small" fullWidth>
              <Select
                value={status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="PENDING">{t(`pending`)}</MenuItem>
                <MenuItem value="COMPLETED">{t(`complete`)}</MenuItem>
                <MenuItem value="DELIVERED">{t(`delivered`)}</MenuItem>
                <MenuItem value="CANCELLED">{t(`cancel`)}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Cash Payment Input */}
        {paymentMethod === "cash" && (
          <TextField
            fullWidth
            label="Amount Paid"
            type="number"
            size="small"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 2 }}
          />
        )}

        {paymentMethod === "cash" && amountPaid && (
          <Alert
            severity={parseFloat(amountPaid) >= total ? "success" : "warning"}
            sx={{ mb: 2 }}
          >
            {parseFloat(amountPaid) >= total
              ? `Change: $${(parseFloat(amountPaid) - total).toFixed(2)}`
              : `Need $${(total - parseFloat(amountPaid)).toFixed(2)} more`}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>{t(`cancel`)}</Button>
        <Button
          variant="contained"
          onClick={onProcessSale}
          disabled={
            paymentMethod === "cash" &&
            (!amountPaid || parseFloat(amountPaid) < total)
          }
          startIcon={getPaymentMethodIcon(paymentMethod)}
        >
          {t(`complete_sale`)}
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="successfully!"
      />
    </Dialog>
  );
};

export default PaymentDialog;
