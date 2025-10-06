"use client";
import { useMutation } from "@apollo/client/react";
import {
  Dialog,
  Paper,
  Box,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Button,
  Stack,
  Autocomplete,
  Avatar
} from "@mui/material";
import { ImageIcon, Package, X } from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useAuth } from "../../../context/AuthContext";
import {
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
} from "../../../../../graphql/mutation";

import ImageUploadWithCropModal from "@/app/components/ImageUploadWithCropModal";
const CategoryForm = ({
  open,
  onClose,
  selectedCategory,
  mainCategories,
  shopId,
  refetch,
  t,
}) => {
  const { setAlert } = useAuth();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const [imageUploadKey, setImageUploadKey] = useState(0);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    slug: Yup.string(),
    description: Yup.string()
      .required("Description is required")
      .max(500, "Description must be less than 500 characters"),
    image: Yup.string(),
    active: Yup.boolean().required("Active status is required"),
    parent: Yup.string().nullable(),
  });

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: ({ createCategory }) => {
      if (createCategory.isSuccess) {
        setAlert(true, "success", createCategory.message);
        refetch();
        handleClose();
      } else {
        setAlert(true, "error", createCategory.message);
      }
    },
    onError: (err) => {
      console.error("Create category error:", err);
      setAlert(true, "error", "Failed to create category");
    },
  });

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: ({ updateCategory }) => {
      if (updateCategory.isSuccess) {
        setAlert(true, "success", updateCategory.message);
        refetch();
        handleClose();
      } else {
        setAlert(true, "error", updateCategory.message);
      }
    },
    onError: (err) => {
      console.error("Update category error:", err);
      setAlert(true, "error", "Failed to update category");
    },
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      active: "",
      shopId: shopId,
      parent: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const finalImageUrl = uploadedImageUrl || values.image;
        const input = {
          name: values.name,
          slug: values.slug,
          description: values.description,
          image: finalImageUrl,
          active: values.active === "true",
          shopId: values.shopId || null,
          parent: values.parent || null,
        };

        if (selectedCategory) {

          await updateCategory({
            variables: {
              updateCategoryId: selectedCategory.id,
              input,
            },
          });
        } else {
          await createCategory({
            variables: { input },
          });
        }
      } catch (err) {
        console.error("Mutation error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    setFieldValue,
    getFieldProps,
    resetForm,
    isSubmitting,
    values,
  } = formik;

  useEffect(() => {
    if (open && selectedCategory && mainCategories.length > 0) {
      setFieldValue("name", selectedCategory.name || "");
      setFieldValue("slug", selectedCategory.slug || "");
      setFieldValue("description", selectedCategory.description || "");
      setFieldValue("image", selectedCategory.image || "");
      setFieldValue("active", selectedCategory.active ? "true" : "false");

      if (
        selectedCategory.parent &&
        typeof selectedCategory.parent === "object"
      ) {
        const parentCat = mainCategories.find(
          (cat) => cat.id === selectedCategory.parent.id
        );
        setSelectedParentCategory(parentCat || null);
        setFieldValue("parent", parentCat?.id || "");
      } else {
        setSelectedParentCategory(null);
        setFieldValue("parent", "");
      }

      if (selectedCategory.image) {
        setUploadedImageUrl(selectedCategory.image);
      }
    }
  }, [open, selectedCategory, mainCategories, setFieldValue]);

  const handleImageUploadSuccess = (imageData) => {
    const imageUrl = imageData.imageUrl;
    setUploadedImageUrl(imageUrl);
    setFieldValue("image", imageUrl);
    setAlert(true, "success", "Image uploaded successfully!");
  };

  const handleImageUploadError = (error) => {
    console.error("Image upload error:", error);
    setAlert(true, "error", `Image upload failed: ${error.message || error}`);
  };

  // const handleParentChange = (event, newValue) => {
  //   setSelectedParentCategory(newValue);
  //   setFieldValue("parent", newValue?.id || "");
  // };
  const handleParentChange = (event, newValue) => {
  setSelectedParentCategory(newValue);
  setFieldValue("parent", newValue ? newValue.id : "");
};

  const handleImageUrlChange = (event) => {
    const value = event.target.value;
    setFieldValue("image", value);
    if (value && value !== uploadedImageUrl) {
      setUploadedImageUrl("");
    }
  };

  const clearImage = () => {
    setUploadedImageUrl("");
    setFieldValue("image", "");
  };

  const handleClose = () => {
    resetForm();
    setUploadedImageUrl("");
    setSelectedParentCategory(null);
    setImageUploadKey((prev) => prev + 1);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Paper sx={{ p: 3 }}>
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Package size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6">
                  {selectedCategory
                    ? t("update_category")
                    : t("add_new_category")}
                </Typography>
              </Box>
              <IconButton onClick={handleClose} size="small">
                <X/>
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`category_name`)}</Typography>
                <TextField
                  fullWidth
                  {...getFieldProps("name")}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`main_category`)}</Typography>
                <Autocomplete
                  options={mainCategories}
                  getOptionLabel={(option) => option.name || ""}
                  value={selectedParentCategory}
                  onChange={handleParentChange}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
           
                      placeholder="Select a parent category"
                      error={touched.parent && Boolean(errors.parent)}
                      helperText={touched.parent && errors.parent}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.name}
                    </li>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`select_status`)}</Typography>
                <FormControl fullWidth>
                  <Select
                    {...getFieldProps("active")}
                    displayEmpty
                    error={touched.active && Boolean(errors.active)}
                  >
                    <MenuItem value="">
                      <em>{t(`select_status`)}</em>
                    </MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                  {touched.active && errors.active && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {errors.active}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Typography>{t(`slug`)}</Typography>
                <TextField
                  fullWidth
                  {...getFieldProps("slug")}
                  error={touched.slug && Boolean(errors.slug)}
                  helperText={touched.slug && errors.slug}
                  placeholder="Auto-generated from name"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography>{t(`discription`)}</Typography>
                <TextField
                  
                  fullWidth
                  multiline
                  rows={3}
                  {...getFieldProps("description")}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {t(`image`)}
                </Typography>

                {(uploadedImageUrl || values.image) && (
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={uploadedImageUrl || values.image}
                      sx={{ width: 80, height: 80 }}
                      variant="rounded"
                    >
                      <ImageIcon size={24} />
                    </Avatar>
                    <Button color="error" size="small" onClick={clearImage}>
                      Remove Image
                    </Button>
                  </Box>
                )}

                <TextField
                  label="Image URL (Optional)"
                  fullWidth
                  value={values.image}
                  onChange={handleImageUrlChange}
                  error={touched.image && Boolean(errors.image)}
                  helperText={
                    (touched.image && errors.image) ||
                    "Enter image URL or use upload option below"
                  }
                  sx={{ mb: 2 }}
                />

                <Stack direction="row" spacing={2}>
                  <ImageUploadWithCropModal
                    key={imageUploadKey}
                    onUploadSuccess={handleImageUploadSuccess}
                    onUploadError={handleImageUploadError}
                    aspectRatio={4 / 3}
                    existingImageUrl={uploadedImageUrl}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{ bgcolor: "#1D293D" }}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : selectedCategory
                      ? "Update Category"
                      : "Save Category"}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Paper>
    </Dialog>
  );
};

export default CategoryForm;
