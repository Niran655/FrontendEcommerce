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
import { Edit, Package, Plus, Search, Trash2 } from "lucide-react";
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
  const { data: MainCategory, loading: mainCategoryLoading } = useQuery(GET_CATEGORYS);
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
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const handleImageUploadSuccess = (imageData) => {
    const imageUrl = imageData.imageUrl;
    setUploadedImageUrl(imageUrl);
    setFieldValue("image", imageUrl);
    setAlert(true, "success", "successfully!");
  };

  const handleImageUploadError = (error) => {
    setAlert(true, "error", `Image upload failed: ${error}`);
  };

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: ({ createCategory }) => {
      if (createCategory.isSuccess) {
        setAlert(true, "success", createCategory.message);
      } else {
        setAlert(true, "error", createCategory.message);
      }
    },
    onError: (err) => {
      console.log("Error", err);
    },
  });

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: ({ updateCategory }) => {
      if (updateCategory.isSuccess) {
        setAlert(true, "success", updateCategory.message);
      } else {
        setAlert(false, "error", updateCategory.message);
      }
    },
    onError: (err) => {
      console.log("Error", err);
    },
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: ({ deleteCategory }) => {
      if (deleteCategory.isSuccess) {
        setAlert(true, "success", deleteCategory.message);
      } else {
        setAlert(false, "error", deleteCategory.message);
      }
    },
    onError: (err) => {
      console.log("Error", err);
    },
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").min(2),
    slug: Yup.string(),
    description: Yup.string().required("Description is required").max(500),
    image: Yup.string().url("Must be a valid URL"),
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
    onSubmit: async (values) => {
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
      try {
        if (selectedCategory) {
          await updateCategory({
            variables: { updateCategoryId: selectedCategory.id, input },
          });
        } else {
          await createCategory({ variables: { input } });
        }
        refetch();
        setDialogOpen(false);
        resetForm();
        setSelectedCategory(null);
        setSelectedParentCategory(null);
      } catch (err) {
        console.error("Mutation error:", err);
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
      if (selectedCategory.parent && typeof selectedCategory.parent === "object") {
        const parentCat = mainCategories.find(
          (cat) => cat.id === selectedCategory.parent.id
        );
        setSelectedParentCategory(parentCat || null);
        setFieldValue("parent", parentCat?.id || "");
      } else {
        setSelectedParentCategory(null);
        setFieldValue("parent", "");
      }
    }
  }, [dialogOpen, selectedCategory, mainCategories, setFieldValue]);

  const handleCreateCategory = () => {
    resetForm();
    setSelectedCategory(null);
    setSelectedParentCategory(null);
    setDialogOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
    setFieldValue("name", category.name);
    setFieldValue("slug", category.slug);
    setFieldValue("description", category.description);
    setFieldValue("image", category.image || "");
    setFieldValue("active", category.active ? "true" : "false");
    
    if (category.parent && typeof category.parent === "object") {
      const parentCat = mainCategories.find(
        (cat) => cat.id === category.parent.id
      );
      setSelectedParentCategory(parentCat || null);
      setFieldValue("parent", parentCat?.id || "");
    } else {
      setSelectedParentCategory(null);
      setFieldValue("parent", "");
    }
    
    if (category.image) {
      setUploadedImageUrl(category.image);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory({ variables: { deleteCategoryId: id } });
        refetch();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleParentChange = (event, newValue) => {
    setSelectedParentCategory(newValue);
    setFieldValue("parent", newValue?.id || "");
  };

  const handleClose = () => {
    resetForm();
    setDialogOpen(false);
    setSelectedCategory(null);
    setSelectedParentCategory(null);
    setUploadedImageUrl("");
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
        >
          {t("add_new_category")}
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{xs:12,md:6}}>
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
          <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
            <Chip
              label={`${filteredCategories.length} categories`}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="categories table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 'bold', width: 80 }}>Image</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Parent Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Slug</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 100 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 150 }}>Actions</TableCell>
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
                  <Typography>No categories found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow 
                  key={category.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <TableCell>
                    <Avatar src={category.image} sx={{ width: 40, height: 40 }}>
                      <Package size={20} />
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
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
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

      {/* Dialog remains the same */}
      <Dialog open={dialogOpen} maxWidth="md" fullWidth>
        <Paper sx={{ p: 3 }}>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              <Box
                style={{ display: "flex", justifyContent: "space-between" }}
                mb={2}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Package size={24} style={{ marginRight: 8 }} />
                  {selectedCategory
                    ? t("update_category")
                    : t("add_new_category")}
                </Box>

                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{xs:12,md:6}}>
                  <TextField
                    label="Name"
                    fullWidth
                    {...getFieldProps("name")}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}}>
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
                <Grid size={{xs:12,md:6}}>
                  <FormControl fullWidth>
                    <Select
                      {...getFieldProps("active")}
                      error={touched.active && Boolean(errors.active)}
                    >
                      <MenuItem value="">Select status</MenuItem>
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <TextField
                    label="Slug"
                    fullWidth
                    {...getFieldProps("slug")}
                    error={touched.slug && Boolean(errors.slug)}
                    helperText={touched.slug && errors.slug}
                    disabled
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    {...getFieldProps("description")}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    label="Image URL (Optional)"
                    fullWidth
                    {...getFieldProps("image")}
                    error={touched.image && Boolean(errors.image)}
                    helperText="Or use the upload option below"
                    sx={{ mb: 2 }}
                  />
                  <Stack direction={"row"} spacing={2}>
                    <ImageUploadWithCropModal
                      onUploadSuccess={handleImageUploadSuccess}
                      onUploadError={handleImageUploadError}
                      aspectRatio={4 / 3}
                      existingImageUrl={uploadedImageUrl}
                    />
                  </Stack>
                </Grid>

                <Grid size={{xs:12}}>
                  <Stack direction="row" spacing={2} justifyContent={"end"}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setDialogOpen(false);
                        setSelectedCategory(null);
                        setSelectedParentCategory(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                    >
                      {selectedCategory ? "Update Category" : "Save Category"}
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