"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import {
  Edit,
  Package,
  Plus,
  Search,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "../../../../../../../graphql/mutation";
import {
  GET_CATEGORY_FOR_SHOP,
  GET_CATEGORYS,
} from "../../../../../../../graphql/queries";
import ImageUploadWithCropModal from "@/app/components/ImageUploadWithCropModal";
import CloseIcon from "@mui/icons-material/Close";
import { translateLauguage } from "@/app/function/translate";

const Category = () => {
  const { id } = useParams();
  const { data: MainCategory, loading: mainCategoryLoading } =
    useQuery(GET_CATEGORYS);
  const { data, loading, refetch } = useQuery(GET_CATEGORY_FOR_SHOP, {
    variables: { shopId: id },
  });

  const categories = data?.getCategoriesForShop || [];
  const mainCategories = MainCategory?.categorys || [];
  const { setAlert } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  const [imageUploadKey, setImageUploadKey] = useState(0); // Key to reset image uploader
  const { language } = useAuth();
  const { t } = translateLauguage(language);

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

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: ({ deleteCategory }) => {
      if (deleteCategory.isSuccess) {
        setAlert(true, "success", deleteCategory.message);
        refetch();
      } else {
        setAlert(true, "error", deleteCategory.message);
      }
    },
    onError: (err) => {
      console.error("Delete category error:", err);
      setAlert(true, "error", "Failed to delete category");
    },
  });

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

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      active: "",
      shopId: id,
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
    if (dialogOpen && selectedCategory && mainCategories.length > 0) {
      // Set form values for editing
      setFieldValue("name", selectedCategory.name || "");
      setFieldValue("slug", selectedCategory.slug || "");
      setFieldValue("description", selectedCategory.description || "");
      setFieldValue("image", selectedCategory.image || "");
      setFieldValue("active", selectedCategory.active ? "true" : "false");

      // Handle parent category
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

      // Set uploaded image
      if (selectedCategory.image) {
        setUploadedImageUrl(selectedCategory.image);
      }
    }
  }, [dialogOpen, selectedCategory, mainCategories, setFieldValue]);

  const handleCreateCategory = () => {
    resetForm();
    setSelectedCategory(null);
    setSelectedParentCategory(null);
    setUploadedImageUrl("");
    setImageUploadKey((prev) => prev + 1); // Reset image uploader
    setDialogOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setUploadedImageUrl(category.image || "");
    setImageUploadKey((prev) => prev + 1); // Reset image uploader
    setDialogOpen(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory({
          variables: { deleteCategoryId: categoryId },
        });
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleParentChange = (event, newValue) => {
    setSelectedParentCategory(newValue);
    setFieldValue("parent", newValue?.id || "");
  };

  const handleImageUrlChange = (event) => {
    const value = event.target.value;
    setFieldValue("image", value);
    // If user manually enters an image URL, clear the uploaded image
    if (value && value !== uploadedImageUrl) {
      setUploadedImageUrl("");
    }
  };

  const handleClose = () => {
    resetForm();
    setDialogOpen(false);
    setSelectedCategory(null);
    setSelectedParentCategory(null);
    setUploadedImageUrl("");
    setImageUploadKey((prev) => prev + 1); // Reset image uploader on close
  };

  const clearImage = () => {
    setUploadedImageUrl("");
    setFieldValue("image", "");
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {t(`category_management`)}
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreateCategory}
          startIcon={<Plus size={20} />}
          sx={{ bgcolor: "#1D293D" }}
        >
          {t("add_new_category")}
        </Button>
      </Box>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search size={20} style={{ marginRight: 8, color: "#666" }} />
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: "right" }}>
            <Chip
              label={`${filteredCategories.length} categories`}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Categories Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="categories table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              <TableCell sx={{ fontWeight: "bold", width: 80 }}>
                Image
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Parent Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Slug</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 100 }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 150 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography>Loading categories...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography>
                    {searchTerm
                      ? "No categories found matching your search"
                      : "No categories found"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow
                  key={category.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <TableCell>
                    <Avatar
                      src={category.image}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: category.image ? "transparent" : "grey.300",
                      }}
                    >
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <ImageIcon size={20} />
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {category.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {category.parent?.name || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {category.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{category.slug}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={category.active ? "Active" : "Inactive"}
                      color={category.active ? "success" : "error"}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditCategory(category)}
                        sx={{ mr: 1 }}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Category Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <Paper sx={{ p: 3 }}>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              {/* Dialog Header */}
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
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Form Fields */}
              <Grid container spacing={2}>
                {/* Name Field */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Category Name *"
                    fullWidth
                    {...getFieldProps("name")}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                {/* Parent Category Field */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    options={mainCategories}
                    getOptionLabel={(option) => option.name || ""}
                    value={selectedParentCategory}
                    onChange={handleParentChange}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value?.id
                    }
                    loading={mainCategoryLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Main Category (Optional)"
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

                {/* Status Field */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <Select
                      {...getFieldProps("active")}
                      displayEmpty
                      error={touched.active && Boolean(errors.active)}
                    >
                      <MenuItem value="">
                        <em>Select status *</em>
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

                {/* Slug Field */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Slug"
                    fullWidth
                    {...getFieldProps("slug")}
                    error={touched.slug && Boolean(errors.slug)}
                    helperText={touched.slug && errors.slug}
                    placeholder="Auto-generated from name"
                  />
                </Grid>

                {/* Description Field */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Description *"
                    fullWidth
                    multiline
                    rows={3}
                    {...getFieldProps("description")}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>

                {/* Image Upload Section */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Category Image
                  </Typography>

                  {/* Image Preview */}
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

                  {/* Image URL Input */}
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

                  {/* Image Upload Component */}
                  <Stack direction="row" spacing={2}>
                    <ImageUploadWithCropModal
                      key={imageUploadKey} // Reset component when key changes
                      onUploadSuccess={handleImageUploadSuccess}
                      onUploadError={handleImageUploadError}
                      aspectRatio={4 / 3}
                      existingImageUrl={uploadedImageUrl}
                    />
                  </Stack>
                </Grid>

                {/* Action Buttons */}
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
    </Box>
  );
};

export default Category;
