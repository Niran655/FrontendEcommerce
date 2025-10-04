"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useMutation } from "@apollo/client/react";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Slide,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { CREATE_ORDER_BY_CUSTOMER } from "../../../../../graphql/mutation";
import AddressPicker from "../../../include/LocationSelcet";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const validationSchema = Yup.object({
  customer: Yup.object({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("First name is required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  }),
  deliveryAddress: Yup.object({
    formatted: Yup.string().required("Delivery address is required"),
  }),
  remark: Yup.string().max(500, "Note must be less than 500 characters"),
});

export default function Checkout({ open, onClose, cartItems = [], shop, shopId }) {

  const { setAlert } = useAuth();

  const [createCustomerOrderProduct, { loading }] = useMutation(
    CREATE_ORDER_BY_CUSTOMER,
    {
      onCompleted: ({ createCustomerOrderProduct }) => {
        if (createCustomerOrderProduct?.isSuccess) {
          setAlert(true, "Success", createCustomerOrderProduct?.message);
        }
      },
    }
  );



  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxAmount = subtotal * 0.1;
    const deliveryFee = 2.5;
    const discount = 0;
    const grandTotal = subtotal + deliveryFee + taxAmount - discount;

    return { subtotal, taxAmount, deliveryFee, discount, grandTotal };
  };

  const { subtotal, taxAmount, deliveryFee, discount, grandTotal } = calculateTotals();

  const formik = useFormik({
    initialValues: {
      customer: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
      },
      shopId: shopId,
      deliveryAddress: {
        formatted: "",
        latitude: null,
        longitude: null,
      },
      remark: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const orderData = {
          customer: values.customer,
          shopId: shopId,
          deliveryAddress: values.deliveryAddress,
          items: cartItems.map((item) => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
          deliveryFee,
          tax: taxAmount,
          discount,
          totalPrice: subtotal,
          grandTotal,
          paymentMethod: "cash",
          remark: values.remark,
          status: "PENDING",
        };

        await createCustomerOrderProduct({
          variables: { input: orderData },
        });
      } catch (error) {
        console.error("Order creation error:", error);
      }
    },
  });


  const handleLocationSelect = (locationData) => {
    formik.setFieldValue("deliveryAddress", locationData);
  };



  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar
        sx={{
          position: "relative",
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" fontWeight={600}>
            Checkout
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "#F3F4F6",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box sx={{ padding: 4, maxWidth: "1000px", width: "100%" }}>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Review and place your order
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{xs:12,md:7}}>
                <Card sx={{ p: 3, mb: 3, borderRadius: 3, boxShadow: 3 }}>
                  <Typography variant="h6" mb={2}>
                    Delivery Address
                  </Typography>
                  <Box mb={2}>
                    <AddressPicker onLocationSelect={handleLocationSelect} />  {/* ✅ Live update */}
                    {formik.touched.deliveryAddress?.formatted &&
                    formik.errors.deliveryAddress?.formatted ? (
                      <Typography color="error" variant="caption">
                        {formik.errors.deliveryAddress.formatted}
                      </Typography>
                    ) : null}
                  </Box>

                  <TextField
                    label="Street / House Number"
                    name="deliveryAddress.formatted"
                    value={formik.values.deliveryAddress.formatted}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.deliveryAddress?.formatted &&
                      Boolean(formik.errors.deliveryAddress?.formatted)
                    }
                    helperText={
                      formik.touched.deliveryAddress?.formatted &&
                      formik.errors.deliveryAddress?.formatted
                    }
                    fullWidth
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    label="Note to Rider"
                    name="remark"
                    value={formik.values.remark}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.remark && Boolean(formik.errors.remark)}
                    helperText={formik.touched.remark && formik.errors.remark}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                  />
                </Card>

                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                  <Typography variant="h6" mb={2}>
                    Personal Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{xs:12}}>
                      <TextField
                        label="Email"
                        name="customer.email"
                        type="email"
                        value={formik.values.customer.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.customer?.email &&
                          Boolean(formik.errors.customer?.email)
                        }
                        helperText={
                          formik.touched.customer?.email &&
                          formik.errors.customer?.email
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{xs:12,md:6}}>
                      <TextField
                        label="First Name"
                        name="customer.firstName"
                        value={formik.values.customer.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.customer?.firstName &&
                          Boolean(formik.errors.customer?.firstName)
                        }
                        helperText={
                          formik.touched.customer?.firstName &&
                          formik.errors.customer?.firstName
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{xs:12,md:6}}>
                      <TextField
                        label="Last Name"
                        name="customer.lastName"
                        value={formik.values.customer.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.customer?.lastName &&
                          Boolean(formik.errors.customer?.lastName)
                        }
                        helperText={
                          formik.touched.customer?.lastName &&
                          formik.errors.customer?.lastName
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid size={{xs:12}}>
                      <TextField
                        label="Phone Number"
                        name="customer.phone"
                        value={formik.values.customer.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.customer?.phone &&
                          Boolean(formik.errors.customer?.phone)
                        }
                        helperText={
                          formik.touched.customer?.phone &&
                          formik.errors.customer?.phone
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Card>

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading || !formik.isValid}
                  sx={{ mt: 3, py: 1.5, fontWeight: 600, fontSize: 16 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Place Order"}
                </Button>
              </Grid>

              {/* Right Column - Order Summary */}
              <Grid size={{xs:12,md:5}}>
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                  <Typography variant="h6">Your order from</Typography>
                  <Typography mb={2} color="primary" fontWeight={600}>
                    {shop?.name || "Shop Name"}
                  </Typography>

                  {cartItems.map((item, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2">
                        {item.name} x {item.quantity}
                      </Typography>
                      <Typography variant="body2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Subtotal</Typography>
                    <Typography>${subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Standard delivery</Typography>
                    <Typography>${deliveryFee.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Tax</Typography>
                    <Typography>${taxAmount.toFixed(2)}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between" fontWeight={600}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">${grandTotal.toFixed(2)}</Typography>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>

     
    </Dialog>
  );
}
