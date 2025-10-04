"use client";
import { useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Package } from "lucide-react";
import * as Yup from "yup";

import {
  CREATE_BANNER,
  UPDATE_BANNER,
} from "../../../../../graphql/mutation";

const bannerSchema = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  image: Yup.string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
  title: Yup.string(),
  subtitle: Yup.string(),
  link: Yup.string(),
  active: Yup.boolean(),
});

const initialBannerData = {
  category: "",
  image: "",
  title: "",
  subtitle: "",
  link: "",
  active: true,
};

const BannerForm = ({ 
  open, 
  onClose, 
  editBanner, 
  categories, 
  banners, 
  refetchBanners 
}) => {
  const [createBanner] = useMutation(CREATE_BANNER, {
    onCompleted: () => {
      onClose();
      bannerFormik.resetForm();
      refetchBanners();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [updateBanner] = useMutation(UPDATE_BANNER, {
    onCompleted: () => {
      onClose();
      bannerFormik.resetForm();
      refetchBanners();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const bannerFormik = useFormik({
    initialValues: initialBannerData,
    validationSchema: bannerSchema,
    onSubmit: async (values) => {
      if (!editBanner) {
        const existingBanner = banners.find(
          (banner) => banner.category === values.category
        );
        if (existingBanner) {
          alert(
            "This category already has a banner. Please choose another category."
          );
          return;
        }
      }

      const input = {
        category: values.category,
        image: values.image,
        title: values.title,
        subtitle: values.subtitle,
        link: values.link,
        active: values.active,
      };

      if (editBanner) {
        await updateBanner({
          variables: { updateBannerId: editBanner.id, input },
        });
      } else {
        await createBanner({ variables: { input } });
      }
    },
  });

  const {
    values: bannerValues,
    errors: bannerErrors,
    touched: bannerTouched,
    handleChange: handleBannerChange,
    setFieldValue: setBannerFieldValue,
  } = bannerFormik;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={bannerFormik.handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Package size={24} style={{ marginRight: 8 }} />
            {editBanner ? "Edit Banner" : "Create New Banner"}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Category *</InputLabel>
                <Select
                  name="category"
                  value={bannerValues.category}
                  label="Category *"
                  onChange={handleBannerChange}
                  disabled={!!editBanner}
                  error={bannerTouched.category && Boolean(bannerErrors.category)}
                >
                  {categories.map((category) => {
                    const hasBanner = banners.some(
                      (b) =>
                        b.category === category &&
                        (!editBanner || b.id !== editBanner.id)
                    );
                    return (
                      <MenuItem
                        key={category}
                        value={category}
                        disabled={!editBanner && hasBanner}
                      >
                        {category}{" "}
                        {!editBanner && hasBanner
                          ? " (Already has a banner)"
                          : ""}
                      </MenuItem>
                    );
                  })}
                </Select>
                {bannerTouched.category && bannerErrors.category && (
                  <Typography variant="caption" color="error">
                    {bannerErrors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Image URL *"
                name="image"
                value={bannerValues.image}
                onChange={handleBannerChange}
                error={bannerTouched.image && Boolean(bannerErrors.image)}
                helperText={bannerTouched.image && bannerErrors.image}
                placeholder="https://example.com/banner.jpg"
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={bannerValues.title}
                onChange={handleBannerChange}
                placeholder="Banner title"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Subtitle"
                name="subtitle"
                value={bannerValues.subtitle}
                onChange={handleBannerChange}
                placeholder="Banner subtitle"
                multiline
                rows={2}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Link"
                name="link"
                value={bannerValues.link}
                onChange={handleBannerChange}
                placeholder="https://example.com"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={bannerValues.active}
                    onChange={(e) =>
                      setBannerFieldValue("active", e.target.checked)
                    }
                    name="active"
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {editBanner ? "Update Banner" : "Create Banner"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BannerForm;