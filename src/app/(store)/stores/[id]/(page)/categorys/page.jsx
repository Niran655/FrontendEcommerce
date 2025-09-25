"use client";
import { DataGrid } from "@mui/x-data-grid";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Edit, Package, Plus, Search, Trash2 } from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
import { useAuth } from "../../../../../context/AuthContext";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "../../../../../../../graphql/mutation";
import { GET_CATEGORYS } from "../../../../../../../graphql/queries";

const Category = () => {
  const { data, loading, refetch } = useQuery(GET_CATEGORYS);
  const categorys = data?.categorys || [];
  const { setAlert } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
  const safeId = selectedCategory?.id ?? "";

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required").min(2),
    slug: Yup.string().required("Slug is required"),
    description: Yup.string().required("Description is required").max(500),
    image: Yup.string().url("Must be a valid URL"),
    active: Yup.boolean().required("Active status is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      active: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const input = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        image: values.image,
        active: values.active === "true",
      };

      try {
        if (selectedCategory) {
          console.log("selectedCategory  kd ", selectedCategory.id);
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
  } = formik;

  const handleCreateCategory = () => {
    resetForm();
    setSelectedCategory(null);
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

  const filteredCategories = categorys.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      field: "image",
      headerName: "Image",
      width: 80,
      renderCell: (params) => (
        <Avatar src={params.row.image} sx={{ width: 40, height: 40 }}>
          <Package size={20} />
        </Avatar>
      ),
    },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "slug", headerName: "Slug", width: 200 },
    {
      field: "active",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.active ? "Active" : "Inactive"}
          color={params.row.active ? "success" : "error"}
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditCategory(params.row)}
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteCategory(params.row.id)}
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>
      ),
    },
  ];

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
          Category Management
        </Typography>
        <Button
          variant="contained"
          onClick={handleCreateCategory}
          startIcon={<Plus size={20} />}
        >
          Add Category
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search size={20} style={{ marginRight: 8, color: "#666" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={3}></Grid>
          <Grid item xs={12} md={2}>
            <Chip
              label={`${filteredCategories.length} categorys`}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={filteredCategories}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={25}
          rowsPerPageOptions={[25, 50, 100]}
          disableSelectionOnClick
          loading={loading}
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Box>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {" "}
        <Paper sx={{ p: 3, mb: 4 }}>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              <DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Package size={24} style={{ marginRight: 8 }} />
                  {selectedCategory ? "Edit Category" : "Create New Cateogry"}
                </Box>
              </DialogTitle>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Name"
                    fullWidth
                    {...getFieldProps("name")}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Slug"
                    fullWidth
                    {...getFieldProps("slug")}
                    error={touched.slug && Boolean(errors.slug)}
                    helperText={touched.slug && errors.slug}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Image URL"
                    fullWidth
                    {...getFieldProps("image")}
                    error={touched.image && Boolean(errors.image)}
                    helperText={touched.image && errors.image}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth required>
                    <Select
                      fullWidth
                      select
                      SelectProps={{ native: true }}
                      {...getFieldProps("active")}
                      error={touched.active && Boolean(errors.active)}
                      helperText={touched.active && errors.active}
                    >
                      <MenuItem value="">Select status</MenuItem>
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" spacing={2} justifyContent={"end"}>
                    <Button
                      variant="outlined"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cencel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                    >
                      Save Category
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
