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

const ShopFormDialog = ({ open, onClose, shopFormik, users, t }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <FormikProvider value={shopFormik}>
        <Form onSubmit={shopFormik.handleSubmit}>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Building size={24} style={{ marginRight: 8 }} />
              {t(`create_new_shop`)}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`shop_name_local`)}</Typography>
                <TextField
                  fullWidth
                  name="shopName"
                  value={shopFormik.values.shopName}
                  onChange={shopFormik.handleChange}
                  onBlur={shopFormik.handleBlur}
                  error={
                    shopFormik.touched.shopName &&
                    Boolean(shopFormik.errors.shopName)
                  }
                  helperText={
                    shopFormik.touched.shopName && shopFormik.errors.shopName
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`shop_name_english`)}</Typography>
                <TextField
                  fullWidth
                  name="enName"
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
              <Grid size={{ xs: 12 }}>
                <Typography>{t(`discription`)}</Typography>
                <TextField
                  fullWidth
                  name="description"
                  multiline
                  rows={3}
                  value={shopFormik.values.description}
                  onChange={shopFormik.handleChange}
                  onBlur={shopFormik.handleBlur}
                  error={
                    shopFormik.touched.description &&
                    Boolean(shopFormik.errors.description)
                  }
                  helperText={
                    shopFormik.touched.description &&
                    shopFormik.errors.description
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography>{t(`image`)}</Typography>
                <TextField
                  fullWidth
                  name="image"
                  value={shopFormik.values.image}
                  onChange={shopFormik.handleChange}
                  onBlur={shopFormik.handleBlur}
                  error={
                    shopFormik.touched.image && Boolean(shopFormik.errors.image)
                  }
                  helperText={
                    shopFormik.touched.image && shopFormik.errors.image
                  }
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`shop_type`)}</Typography>
                <FormControl
                  fullWidth
                  required
                  error={
                    shopFormik.touched.typeId &&
                    Boolean(shopFormik.errors.typeId)
                  }
                >
                  <Select
                    name="typeId"
                    value={shopFormik.values.typeId}
                    onChange={shopFormik.handleChange}
                    onBlur={shopFormik.handleBlur}
                  >
                    <MenuItem value="68dccb157cb2b26b129eef06">
                      Restaurant
                    </MenuItem>
                    <MenuItem value="68dccb157cb2b26b129eef07">Cafe</MenuItem>
                    <MenuItem value="68dccb157cb2b26b129eef08">Retail</MenuItem>
                  </Select>
                  {shopFormik.touched.typeId && shopFormik.errors.typeId && (
                    <FormHelperText>{shopFormik.errors.typeId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`owner`)}</Typography>
                <FormControl
                  fullWidth
                  required
                  error={
                    shopFormik.touched.owner && Boolean(shopFormik.errors.owner)
                  }
                >
                  <Select
                    name="owner"
                    value={shopFormik.values.owner}
                    onChange={shopFormik.handleChange}
                    onBlur={shopFormik.handleBlur}
                  >
                    {users
                      .filter(
                        (user) =>
                          user.role === "Admin" || user.role === "Manager"
                      )
                      .map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </MenuItem>
                      ))}
                  </Select>
                  {shopFormik.touched.owner && shopFormik.errors.owner && (
                    <FormHelperText>{shopFormik.errors.owner}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`slug`)}</Typography>
                <TextField
                  fullWidth
                  name="slug"
                  value={shopFormik.values.slug || ""}
                  onChange={shopFormik.handleChange}
                  onBlur={shopFormik.handleBlur}
                  helperText="Leave empty for auto-generation"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`code`)}</Typography>
                <TextField
                  fullWidth
                  name="code"
                  value={shopFormik.values.code || ""}
                  onChange={shopFormik.handleChange}
                  onBlur={shopFormik.handleBlur}
                />
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
              disabled={shopFormik.isSubmitting || !shopFormik.isValid}
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
