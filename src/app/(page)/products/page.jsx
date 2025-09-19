"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import AddIcon from "@mui/icons-material/Add";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import { DataGrid } from "@mui/x-data-grid";

import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import {
  AlertTriangle,
  Edit,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useState } from "react";
import * as Yup from "yup";

import {
  CREATE_BANNER,
  CREATE_PRODUCT,
  DELETE_BANNER,
  DELETE_PRODUCT,
  UPDATE_BANNER,
  UPDATE_PRODUCT,
} from "../../../../graphql/mutation";
import {
  GET_BANNERS,
  GET_CATEGORYS,
  GET_PRODUCTS,
} from "../../../../graphql/queries";
import { useAuth } from "@/app/context/AuthContext";
const categories = ["Laptop", "Desktop", "Phone"];

// Validation schema
const productSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string(),
  category: Yup.string().required("Category is required"),
  price: Yup.number()
    .min(0, "Price must be positive")
    .required("Price is required"),
  cost: Yup.number()
    .min(0, "Cost must be positive")
    .required("Cost is required"),
  sku: Yup.string().required("SKU is required"),
  stock: Yup.number()
    .integer("Stock must be an integer")
    .min(0, "Stock must be positive")
    .required("Stock is required"),
  minStock: Yup.number()
    .integer("Minimum stock must be an integer")
    .min(0, "Minimum stock must be positive")
    .required("Minimum stock is required"),
  image: Yup.string().url("Must be a valid URL"),
  subImage: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().url("Must be a valid URL"),
      altText: Yup.string(),
      caption: Yup.string(),
    })
  ),
  discount: Yup.array().of(
    Yup.object().shape({
      defaultPrice: Yup.number().min(0, "Price must be positive"),
      description: Yup.string().required("required"),
      discountPrice: Yup.number().min(0, "Price must be positive"),
    })
  ),
  isCombo: Yup.boolean(),
  comboItems: Yup.array(),
});

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

const initialFormData = {
  name: "",
  description: "",
  category: "",
  price: "",
  cost: "",
  sku: "",
  stock: "",
  minStock: "",
  image: "",
  subImage: [],
  discount: [],
  isCombo: false,
  comboItems: [],
};

const initialBannerData = {
  category: "",
  image: "",
  title: "",
  subtitle: "",
  link: "",
  active: true,
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { setAlert } = useAuth();
  const [editBanner, setEditBanner] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [openAddBanner, setOpenAddBanner] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS);
  const { data: categoryData } = useQuery(GET_CATEGORYS);
  const {
    data: bannerData,
    loading: bannerLoading,
    refetch: refetchBanners,
  } = useQuery(GET_BANNERS);

  const categorys = categoryData?.categorys || [];
  const categoryNames = categorys.map((cat) => cat.name);
  const banners = bannerData?.banners || [];

  const [createProduct] = useMutation(CREATE_PRODUCT, {
    onCompleted: ({ createProduct }) => {
      if (createProduct.isSuccess) {
        setAlert(true, "success", createProduct.message);
        setDialogOpen(false);
        formik.resetForm();
        setEditingProduct(null);
        refetch();
      } else {
        setAlert(true, "error", createProduct.message);
      }
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: ({ updateProduct }) => {
      if (updateProduct.isSuccess) {
        setAlert(true, "success", updateProduct.message);
        setDialogOpen(false);
        formik.resetForm();
        setEditingProduct(null);
        refetch();
      } else {
        setAlert(true, "error", createProduct.message);
      }
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: ({ deleteProduct }) => {
      if (deleteProduct.isSuccess) {
        setAlert(true, "success", deleteProduct.message);
        refetch();
      } else {
        setAlert(true, "error", deleteProduct.message);
      }
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [createBanner] = useMutation(CREATE_BANNER, {
    onCompleted: () => {
      setOpenAddBanner(false);
      bannerFormik.resetForm();
      setEditBanner(null);
      refetchBanners();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [updateBanner] = useMutation(UPDATE_BANNER, {
    onCompleted: () => {
      setOpenAddBanner(false);
      bannerFormik.resetForm();
      setEditBanner(null);
      refetchBanners();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [deleteBanner] = useMutation(DELETE_BANNER, {
    onCompleted: () => refetchBanners(),
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const products = data?.products || [];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateProduct = () => {
    setEditingProduct(null);
    formik.resetForm();
    setDialogOpen(true);
  };

  const handleCreateBanner = () => {
    setEditBanner(null);
    bannerFormik.resetForm();
    setOpenAddBanner(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    formik.setValues({
      name: product.name,
      description: product.description || "",
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      sku: product.sku,
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      image: product.image || "",
      subImage:
        product.subImage && Array.isArray(product.subImage)
          ? product.subImage.map((img) => ({
              url: img.url || "",
              altText: img.altText || "",
              caption: img.caption || "",
            }))
          : [],
      discount:
        product.discount?.map((dis) => ({
          discountPrice: dis.discountPrice.toString() || "",
          defaultPrice: dis.defaultPrice.toString() || "",
          description: dis.description || "",
        })) || [],
      hasDiscount:
        Array.isArray(product.discount) && product.discount.length > 0,
      isCombo: product.isCombo,
      comboItems: product.comboItems || [],
    });
    setDialogOpen(true);
  };

  const handleEditBanner = (banner) => {
    setEditBanner(banner);
    bannerFormik.setValues({
      category: banner.category,
      image: banner.image || "",
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      link: banner.link || "",
      active: banner.active !== undefined ? banner.active : true,
    });
    setOpenAddBanner(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct({ variables: { deleteProductId: productId } });
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      await deleteBanner({ variables: { deleteBannerId: bannerId } });
    }
  };

  const formik = useFormik({
    initialValues: initialFormData,
    validationSchema: productSchema,
    onSubmit: async (values) => {
      const input = {
        name: values.name,
        description: values.description,
        category: values.category,
        price: parseFloat(values.price),
        cost: parseFloat(values.cost),
        sku: values.sku,
        stock: parseInt(values.stock),
        minStock: parseInt(values.minStock),
        image: values.image,
        subImage: values.subImage,
        discount: values.discount.map((d) => ({
          defaultPrice: parseFloat(d.defaultPrice),
          discountPrice: parseFloat(d.discountPrice),
          description: d.description,
        })),

        isCombo: values.isCombo,
        comboItems: values.comboItems,
      };

      if (editingProduct) {
        await updateProduct({
          variables: { updateProductId: editingProduct.id, input },
        });
      } else {
        await createProduct({ variables: { input } });
      }
    },
  });

  const bannerFormik = useFormik({
    initialValues: initialBannerData,
    validationSchema: bannerSchema,
    onSubmit: async (values) => {
      // Check if category already has a banner (only when creating new banner)
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

  const { values, errors, touched, handleChange, setFieldValue } = formik;
  const {
    values: bannerValues,
    errors: bannerErrors,
    touched: bannerTouched,
    handleChange: handleBannerChange,
    setFieldValue: setBannerFieldValue,
  } = bannerFormik;

  //===========================PRODUCT SUB IMAGE ====================
  const addSubImage = useCallback(() => {
    setFieldValue("subImage", [
      ...values.subImage,
      { url: "", altText: "", caption: "" },
    ]);
  }, [setFieldValue, values.subImage]);

  const updateSubImage = useCallback(
    (index, field, value) => {
      const next = [...values.subImage];
      if (!next[index]) return;
      next[index][field] = value;
      setFieldValue("subImage", next);
    },
    [setFieldValue, values.subImage]
  );

  const removeSubImage = useCallback(
    (index) => {
      const next = values.subImage.filter((_, i) => i !== index);
      setFieldValue("subImage", next);
    },
    [setFieldValue, values.subImage]
  );

  //==========================PRODUCT DISCOUND=========================
  const addDiscount = useCallback(() => {
    setFieldValue("discount", [
      ...values.discount,
      {
        defaultPrice: parseFloat(values.price),
        description: "",
        discountPrice: 0,
      },
    ]);
  }, [setFieldValue, values.discount]);

  const updateDiscount = useCallback(
    (index, field, value) => {
      const next = [...values.discount];
      if (!next[index]) return;
      next[index][field] = value;
      setFieldValue("discount", next);
    },
    [setFieldValue, values.discount]
  );

  const removeDiscount = useCallback(
    (index) => {
      const next = values.discount.filter((_, i) => i !== index);
      setFieldValue("discount", next);
    },
    [setFieldValue, values.discount]
  );

  if (loading || bannerLoading) return <Typography>Loading...</Typography>;
  if (error)
    return (
      <Alert severity="error">Error loading products: {error.message}</Alert>
    );

  // DataGrid columns
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
    { field: "sku", headerName: "SKU", width: 120 },
    { field: "category", headerName: "Category", width: 120 },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      renderCell: (params) => `$${params.row.price.toFixed(2)}`,
    },
    {
      field: "cost",
      headerName: "Cost",
      width: 100,
      renderCell: (params) => `$${params.row.cost.toFixed(2)}`,
    },
    {
      field: "stock",
      headerName: "Stock",
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.row.stock}
          color={params.row.lowStock ? "error" : "success"}
          variant="outlined"
          size="small"
        />
      ),
    },
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
            onClick={() => handleEditProduct(params.row)}
            color="primary"
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteProduct(params.row.id)}
            color="error"
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Banner Grid columns
  const bannerColumns = [
    {
      field: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <Avatar
          src={params.row.image}
          sx={{ width: 60, height: 60 }}
          variant="square"
        />
      ),
    },
    { field: "category", headerName: "Category", width: 150 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "subtitle", headerName: "Subtitle", width: 200 },
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
            onClick={() => handleEditBanner(params.row)}
            color="primary"
          >
            <Edit size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteBanner(params.row.id)}
            color="error"
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
          Product Management
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleCreateProduct}
          >
            Add Product
          </Button>
        </Stack>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
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
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                size="small"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="All">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant={viewMode === "grid" ? "contained" : "outlined"}
                onClick={() => setViewMode("grid")}
                size="small"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "table" ? "contained" : "outlined"}
                onClick={() => setViewMode("table")}
                size="small"
              >
                Table
              </Button>
              <Button
                variant={viewMode === "banner" ? "contained" : "outlined"}
                onClick={() => setViewMode("banner")}
                size="small"
              >
                Banner
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <Chip
              label={
                viewMode === "banner"
                  ? `${banners.length} banners`
                  : `${filteredProducts.length} products`
              }
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Products Display */}
      {viewMode === "grid" ? (
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={product.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={product.image}
                    variant="square"
                    sx={{ width: "100%", height: 120, borderRadius: 0 }}
                  ></Avatar>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    {product.lowStock && (
                      <Chip
                        label="Low Stock"
                        color="warning"
                        size="small"
                        icon={<AlertTriangle size={16} />}
                      />
                    )}
                    {!product.active && (
                      <Chip label="Inactive" color="error" size="small" />
                    )}
                  </Box>
                  {Array.isArray(product.discount) &&
                    product.discount.length > 0 &&
                    product.price > 0 && (
                      <Chip
                        label={`-${(
                          ((product.price -
                            Number(product.discount[0].discountPrice)) /
                            product.price) *
                          100
                        ).toFixed(0)}%`}
                        color="error"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 8,
                          left: 8,
                          fontWeight: "bold",
                          backgroundColor: "#f44336",
                          color: "#fff",
                        }}
                      />
                    )}
                </Box>

                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography variant="h6" component="h3" gutterBottom noWrap>
                    {product.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {product.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      SKU: {product.sku}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    {product.discount.length > 0 && (
                      <Stack direction={"row"} spacing={2}>
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="bold"
                        >
                          $
                          {parseFloat(
                            product.discount[0].discountPrice
                          ).toFixed(2)}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="bold"
                          sx={{ textDecoration: "line-through", color: "gray" }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                      </Stack>
                    )}

                    {product.discount.length === 0 && (
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        ${product.price.toFixed(2)}
                      </Typography>
                    )}

                    <Chip
                      label={`Stock: ${product.stock}`}
                      color={product.lowStock ? "error" : "success"}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditProduct(product)}
                      color="primary"
                    >
                      <Edit size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteProduct(product.id)}
                      color="error"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                    <IconButton>
                      <MoreVertOutlinedIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : viewMode == "table" ? (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pageSize={25}
            rowsPerPageOptions={[25, 50, 100]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </Box>
      ) : (
        <Box>
          <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
            <Typography variant="h5">Banner Management</Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={handleCreateBanner}
            >
              Add Banner
            </Button>
          </Stack>

          {banners.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No banners found
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Create your first banner to display on the website
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={handleCreateBanner}
              >
                Create Banner
              </Button>
            </Paper>
          ) : (
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={banners}
                columns={bannerColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                sx={{
                  "& .MuiDataGrid-cell:focus": {
                    outline: "none",
                  },
                }}
              />
            </Box>
          )}
        </Box>
      )}

      {/* ===============================Product Dialog==================================== */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Package size={24} style={{ marginRight: 8 }} />
              {editingProduct ? "Edit Product" : "Create New Product"}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Product Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="SKU"
                  name="sku"
                  value={values.sku}
                  onChange={handleChange}
                  error={touched.sku && Boolean(errors.sku)}
                  helperText={touched.sku && errors.sku}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={2}
                  value={values.description}
                  onChange={handleChange}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Autocomplete
                  fullWidth
                  options={categorys.map((cat) => cat.name)} // use name instead of id
                  value={values.category}
                  onChange={(event, newValue) => {
                    handleChange({
                      target: {
                        name: "category",
                        value: newValue,
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      name="category"
                      label="Category"
                      required
                      error={touched.category && Boolean(errors.category)}
                      helperText={touched.category && errors.category}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={values.price}
                  onChange={handleChange}
                  error={touched.price && Boolean(errors.price)}
                  helperText={touched.price && errors.price}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Cost"
                  name="cost"
                  type="number"
                  value={values.cost}
                  onChange={handleChange}
                  error={touched.cost && Boolean(errors.cost)}
                  helperText={touched.cost && errors.cost}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  name="stock"
                  type="number"
                  value={values.stock}
                  onChange={handleChange}
                  error={touched.stock && Boolean(errors.stock)}
                  helperText={touched.stock && errors.stock}
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Minimum Stock"
                  name="minStock"
                  type="number"
                  value={values.minStock}
                  onChange={handleChange}
                  error={touched.minStock && Boolean(errors.minStock)}
                  helperText={touched.minStock && errors.minStock}
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Image URL"
                  name="image"
                  value={values.image}
                  onChange={handleChange}
                  error={touched.image && Boolean(errors.image)}
                  helperText={touched.image && errors.image}
                  placeholder="https://example.com/image.jpg"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography>Additional Images</Typography>
                  <IconButton onClick={addSubImage}>
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Grid>

              {values.subImage.map((img, index) => (
                <Grid container alignItems="center" spacing={1} key={index}>
                  <Grid size={{ xs: 5 }} mt={1}>
                    <TextField
                      fullWidth
                      label={`Image URL ${index + 1}`}
                      value={img.url}
                      onChange={(e) =>
                        updateSubImage(index, "url", e.target.value)
                      }
                      error={
                        touched.subImage &&
                        touched.subImage[index]?.url &&
                        Boolean(errors.subImage?.[index]?.url)
                      }
                      helperText={
                        touched.subImage &&
                        touched.subImage[index]?.url &&
                        errors.subImage?.[index]?.url
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </Grid>

                  <Grid size={{ xs: 3 }} mt={1}>
                    <TextField
                      fullWidth
                      label="Alt Text"
                      value={img.altText || ""}
                      onChange={(e) =>
                        updateSubImage(index, "altText", e.target.value)
                      }
                      placeholder="e.g. Laptop front view"
                    />
                  </Grid>
                  <Grid size={{ xs: 3 }} mt={1}>
                    <TextField
                      fullWidth
                      label="Caption"
                      value={img.caption || ""}
                      onChange={(e) =>
                        updateSubImage(index, "caption", e.target.value)
                      }
                      placeholder="e.g. High-resolution image of product"
                    />
                  </Grid>
                  <Grid size={{ xs: 1 }}>
                    <IconButton onClick={() => removeSubImage(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              {/* ========================ADD TO Discount ============================= */}
              <Grid size={{ xs: 12 }}>
                <Stack direction={"row"} justifyContent={"space-between"}>
                  <Typography>Discount</Typography>
                  <IconButton onClick={addDiscount}>
                    <AddIcon />
                  </IconButton>
                </Stack>
              </Grid>
              {values.discount.map((dis, index) => (
                <Grid container alignItems="center" spacing={1} key={index}>
                  <Grid size={{ xs: 5 }} mt={1}>
                    <TextField
                      fullWidth
                      label="Discount Price"
                      type="number"
                      value={dis.discountPrice || ""}
                      onChange={(e) =>
                        updateDiscount(index, "discountPrice", e.target.value)
                      }
                      placeholder="Discount Price"
                    />
                  </Grid>
                  <Grid size={{ xs: 3 }} mt={1}>
                    <TextField
                      fullWidth
                      label="Default Price"
                      disabled
                      type="number"
                      value={dis.defaultPrice || ""}
                      onChange={(e) =>
                        updateDiscount(index, "defaultPrice", e.target.value)
                      }
                      placeholder="defaultPrice Price"
                    />
                  </Grid>
                  <Grid size={{ xs: 3 }} mt={1}>
                    <TextField
                      fullWidth
                      label="Discription"
                      value={dis.description || ""}
                      onChange={(e) =>
                        updateDiscount(index, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                  </Grid>
                  <Grid size={{ xs: 1 }}>
                    <IconButton onClick={() => removeDiscount(index)}>
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ===============================Banner Dialog==================================== */}
      <Dialog
        open={openAddBanner}
        onClose={() => setOpenAddBanner(false)}
        maxWidth="md"
        fullWidth
      >
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
                    disabled={!!editBanner} // Disable category selection when editing
                    error={
                      bannerTouched.category && Boolean(bannerErrors.category)
                    }
                  >
                    {categoryNames.map((category) => {
                      // Check if category already has a banner (only show available categories for new banners)
                      const hasBanner = banners.some(
                        (b) =>
                          b.category === category &&
                          (!editBanner || b.id !== editBanner.id)
                      );
                      return (
                        <MenuItem
                          key={category}
                          value={category}
                          disabled={!editBanner && hasBanner} // Disable if category already has a banner
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
            <Button onClick={() => setOpenAddBanner(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editBanner ? "Update Banner" : "Create Banner"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Products;
