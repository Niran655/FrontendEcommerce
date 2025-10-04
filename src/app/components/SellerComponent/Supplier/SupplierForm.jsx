"use client";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Truck } from "lucide-react";
import * as yup from "yup";

import { useAuth } from "@/app/context/AuthContext";
import {
  CREATE_SUPPLIER_FOR_SHOP,
  UPDATE_SUPPLIER_FOR_SHOP,
} from "../../../../../graphql/mutation";
import { useEffect } from "react";

const supplierValidationSchema = yup.object({
  name: yup.string().required("Supplier name is required"),
  contactPerson: yup.string().required("Contact person is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

const initialSupplierForm = {
  name: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
};

const SupplierForm = ({ 
  open, 
  onClose, 
  editingSupplier, 
  shopId, 
  refetchSuppliers,
  t 
}) => {
  const { setAlert } = useAuth();

  const [createSupplierForShop] = useMutation(CREATE_SUPPLIER_FOR_SHOP, {
    onCompleted: ({ createSupplierForShop }) => {
      if (createSupplierForShop.isSuccess) {
        onClose();
        setAlert(true, "success", createSupplierForShop?.message);
        supplierFormik.resetForm();
        refetchSuppliers();
      } else {
        setAlert(true, "error", createSupplierForShop?.message);
      }
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [updateSupplierForShop] = useMutation(UPDATE_SUPPLIER_FOR_SHOP, {
    onCompleted: ({ updateSupplierForShop }) => {
      if (updateSupplierForShop?.isSuccess) {
        onClose();
        setAlert(true, "success", updateSupplierForShop?.message);
        supplierFormik.resetForm();
        refetchSuppliers();
      } else {
        setAlert(true, "error", updateSupplierForShop?.message);
      }
    },
    onError: (err) => {
      console.log("error", err);
    },
  });

  const supplierFormik = useFormik({
    initialValues: initialSupplierForm,
    validationSchema: supplierValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (editingSupplier) {
        updateSupplierForShop({
          variables: {
            supplierId: editingSupplier.id,
            shopId: shopId,
            input: values,
          },
        });
      } else {
        createSupplierForShop({
          variables: {
            shopId: shopId,
            input: values,
          },
        });
      }
    },
  });


  useEffect(() => {
    if (editingSupplier) {
      supplierFormik.setValues({
        name: editingSupplier.name || "",
        contactPerson: editingSupplier.contactPerson || "",
        email: editingSupplier.email || "",
        phone: editingSupplier.phone || "",
        address: editingSupplier.address || "",
      });
    } else {
      supplierFormik.resetForm();
    }
  }, [editingSupplier]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={supplierFormik.handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Truck size={24} style={{ marginRight: 8 }} />
            {editingSupplier ? t(`update_supplier`) : "Add New Supplier"}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
          
            <Grid size={{ xs: 12,md:6 }}>
                  <Typography>{t(`supplier_name`)}</Typography>
              <TextField
                fullWidth
                name="name"
                value={supplierFormik.values.name}
                onChange={supplierFormik.handleChange}
                onBlur={supplierFormik.handleBlur}
                error={
                  supplierFormik.touched.name &&
                  Boolean(supplierFormik.errors.name)
                }
                helperText={
                  supplierFormik.touched.name && supplierFormik.errors.name
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12,md:6 }}>
            <Typography>{t(`contact_person`)}</Typography>
              <TextField
                fullWidth
                name="contactPerson"
                value={supplierFormik.values.contactPerson}
                onChange={supplierFormik.handleChange}
                onBlur={supplierFormik.handleBlur}
                error={
                  supplierFormik.touched.contactPerson &&
                  Boolean(supplierFormik.errors.contactPerson)
                }
                helperText={
                  supplierFormik.touched.contactPerson &&
                  supplierFormik.errors.contactPerson
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md:6 }}>
                <Typography>{t(`email`)}</Typography>
              <TextField
                fullWidth
                
                type="email"
                name="email"
                value={supplierFormik.values.email}
                onChange={supplierFormik.handleChange}
                onBlur={supplierFormik.handleBlur}
                error={
                  supplierFormik.touched.email &&
                  Boolean(supplierFormik.errors.email)
                }
                helperText={
                  supplierFormik.touched.email && supplierFormik.errors.email
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12,md:6 }} >
                  <Typography>{t(`phone_number`)}</Typography>
              <TextField
                fullWidth
             
                name="phone"
                value={supplierFormik.values.phone}
                onChange={supplierFormik.handleChange}
                onBlur={supplierFormik.handleBlur}
                error={
                  supplierFormik.touched.phone &&
                  Boolean(supplierFormik.errors.phone)
                }
                helperText={
                  supplierFormik.touched.phone && supplierFormik.errors.phone
                }
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
                  <Typography>{t(`address`)}</Typography>
              <TextField
                fullWidth
             
                multiline
                rows={2}
                name="address"
                value={supplierFormik.values.address}
                onChange={supplierFormik.handleChange}
                onBlur={supplierFormik.handleBlur}
                error={
                  supplierFormik.touched.address &&
                  Boolean(supplierFormik.errors.address)
                }
                helperText={
                  supplierFormik.touched.address &&
                  supplierFormik.errors.address
                }
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editingSupplier ? "Update Supplier" : "Add Supplier"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SupplierForm;