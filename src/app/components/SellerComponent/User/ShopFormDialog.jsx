"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Building } from "lucide-react";
import { Form, FormikProvider } from "formik";
const roles = [
  "Admin",
  "Manager",
  "Cashier",
  "StockKeeper",
  "Seller",
  "User",
  "Shop",
];
const ShopFormDialog = ({ open, onClose, shopFormik, users, t }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <FormikProvider value={shopFormik}>
        <Form onSubmit={shopFormik.handleSubmit}>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Building size={24} style={{ marginRight: 8 }} />
              {t(`assign_staff`)}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`khmer_name`)}</Typography>
                <TextField
                  fullWidth
                  name="nameKh"
                  placeholder={t(`khmer_name`)}
                  value={shopFormik.values.nameKh}
                  onChange={shopFormik.handleChange}
                  onBlur={shopFormik.handleBlur}
                  error={
                    shopFormik.touched.nameKh &&
                    Boolean(shopFormik.errors.nameKh)
                  }
                  helperText={
                    shopFormik.touched.nameKh && shopFormik.errors.name
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`latin_name`)}</Typography>
                <TextField
                  fullWidth
                  name="enName"
                  placeholder={t(`latin_name`)}
                  value={shopFormik.values.enName}
                  onChange={shopFormik.handleChange}
                  onBlur={shopFormik.handleBlur}
                  error={
                    shopFormik.touched.enName &&
                    Boolean(shopFormik.errors.enName)
                  }
                  helperText={
                    shopFormik.touched.enName && shopFormik.errors.enName
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`email`)}</Typography>
                <TextField
                  fullWidth
                  name="email"
                  placeholder={t(`email`)}
                  value={shopFormik.values.email}
                  onChange={shopFormik.handleChange}
                  onBlur={shopFormik.handleBlur}
                  error={
                    shopFormik.touched.email && Boolean(shopFormik.errors.email)
                  }
                  helperText={
                    shopFormik.touched.email && shopFormik.errors.email
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`password`)}</Typography>
                <TextField
                  fullWidth
                  name="password"
                  placeholder={t(`password`)}
                  value={shopFormik.values.password}
                  onChange={shopFormik.handleChange}
                  onBlur={shopFormik.handleBlur}
                  error={
                    shopFormik.touched.password &&
                    Boolean(shopFormik.errors.password)
                  }
                  helperText={
                    shopFormik.touched.password && shopFormik.errors.password
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("role")}</Typography>
                <FormControl
                  fullWidth
                  required
                  error={shopFormik.touched.role && Boolean(shopFormik.errors.role)}
                >
                  <Select
                    name="role"
                    value={shopFormik.values.role}
                    onChange={shopFormik.handleChange}
                    onBlur={shopFormik.handleBlur}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ ml: 1 }}>{role}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {shopFormik.touched.role && shopFormik.errors.role && (
                    <FormHelperText>{shopFormik.errors.role}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} disabled={shopFormik.isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
            >
              {shopFormik.isSubmitting ? "Creating..." : "Create Shop"}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default ShopFormDialog;
