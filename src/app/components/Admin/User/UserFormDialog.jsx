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
  FormControlLabel,
  Switch,
  Button,
  Box,
  InputAdornment,
  IconButton,
  FormHelperText,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
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
import { Users } from "lucide-react";
const UserFormDialog = ({
  open,
  onClose,
  editingUser,
  formik,
  showPassword,
  onTogglePassword,
  onMouseDownPassword,
  t,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Users size={24} style={{ marginRight: 8 }} />
              {editingUser ? t("update_user") : t(`create_user`)}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <Typography>{t(`full_name`)}</Typography>
                <TextField
                  fullWidth
                  name="name"
                  placeholder={t(`full_name`)}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography>{t(`email`)}</Typography>
                <TextField
                  fullWidth
                  type="email"
                  name="email"
                  placeholder={t(`email`)}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl
                  fullWidth
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                >
                  <Typography>
                    {editingUser
                      ? t("new_password")
                      : t("password")}
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={t(`new_password`)}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={onTogglePassword}
                            onMouseDown={onMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    required={!editingUser}
                    // helperText={editingUser ? t("password_change_helper") : ""}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <FormHelperText>{formik.errors.password}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t("role")}</Typography>
                <FormControl
                  fullWidth
                  required
                  error={formik.touched.role && Boolean(formik.errors.role)}
                >
                  <Select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography sx={{ ml: 1 }}>{role}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.role && formik.errors.role && (
                    <FormHelperText>{formik.errors.role}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      name="active"
                      checked={formik.values.active}
                      onChange={formik.handleChange}
                      color="primary"
                    />
                  }
                  label={t(`active`)}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose} disabled={formik.isSubmitting}>
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting || !formik.isValid}
            >
              {formik.isSubmitting
                ? t("loading")
                : editingUser
                ? t("update_user")
                : t("create_user")}
            </Button>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default UserFormDialog;