"use client";
import { useQuery } from "@apollo/client/react";
import "../../../../../../../style/Product.css";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Package,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";

import { useAuth } from "@/app/context/AuthContext";
import { useParams } from "next/navigation";
import {
  GET_ADMIN_CATEGORY,
  GET_BANNERS,
  GET_CATEGORY_FOR_SHOP,
  GET_PRODUCT_FOR_SHOP,
} from "../../../../../../../graphql/queries";
import { translateLauguage } from "@/app/function/translate";
import ProductForm from "../../../../../components/SellerComponent/Product/ProductForm";
import BannerForm from "../../../../../components/SellerComponent/Product/BannerForm";
import ProductActions from "../../../../../components/SellerComponent/Product/ProductAction";
import BannerActions from "../../../../../components/SellerComponent/Product/BannerAction";
import ProductCard from "../../../../../components/SellerComponent/Product//ProductCard";

const Products = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCategoryForShop, setSelectCategoryForShop] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { setAlert } = useAuth();
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const [editBanner, setEditBanner] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [openAddBanner, setOpenAddBanner] = useState(false);
  
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT_FOR_SHOP, {
    variables: { shopId: id },
  });
  const { data: categoryData } = useQuery(GET_ADMIN_CATEGORY);
  const { data: categoryForShop } = useQuery(GET_CATEGORY_FOR_SHOP, {
    variables: { shopId: id },
  });
  const {
    data: bannerData,
    loading: bannerLoading,
    refetch: refetchBanners,
  } = useQuery(GET_BANNERS);

  const categorys = categoryData?.getParentCategoryForAdmin || [];
  const categorysForShop = categoryForShop?.getCategoriesForShop || [];
  const banners = bannerData?.banners || [];
  const products = data?.getProductsForShop || [];

  const categoryNames = categorys.map((cat) => cat.name);
  const categoryNamesForShop = categorysForShop.map((cat) => cat.name);

  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const sku = product.sku?.toLowerCase() || "";
    const category = product.category || "";
    const shopCategory = product.shopCategoryId || "";
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      sku.includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory;
    const matchesShopCategory =
      selectedCategoryForShop == "All" ||
      shopCategory == selectedCategoryForShop;
    return matchesSearch && matchesCategory && matchesShopCategory;
  });

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleCreateBanner = () => {
    setEditBanner(null);
    setOpenAddBanner(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleEditBanner = (banner) => {
    setEditBanner(banner);
    setOpenAddBanner(true);
  };

  const handleCloseProductDialog = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleCloseBannerDialog = () => {
    setOpenAddBanner(false);
    setEditBanner(null);
  };

  const getShopCategoryName = (product) => {
    return product.shopCategory?.name || "—";
  };

  if (loading || bannerLoading) return <Typography>Loading...</Typography>;
  if (error)
    return (
      <Alert severity="error">Error loading products: {error.message}</Alert>
    );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {t(`product_management`)}
        </Typography>
        <Stack direction={"row"} spacing={2}>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleCreateProduct}
            sx={{ bgcolor: "#1D293D" }}
          >
            {t(`create_product`)}
          </Button>
        </Stack>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 3 }}>
            <label>{t(`search`)}</label>
            <TextField
              fullWidth
              size="small"
              placeholder={t(`search`)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search size={20} style={{ marginRight: 8, color: "#666" }} />
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <label>{t(`main_category`)}</label>
            <Autocomplete
              size="small"
              options={["All", ...categoryNames]}
              value={selectedCategory}
              onChange={(event, newValue) => setSelectedCategory(newValue || "All")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select category"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 2 }}>
            <label>{t(`shop_category`)}</label>
            <Autocomplete
              size="small"
              options={["All", ...categoryNamesForShop]}
              value={selectedCategoryForShop}
              onChange={(event, newValue) => setSelectCategoryForShop(newValue || "All")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select shop category"
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 3 }} mt={2.5}>
            <Stack direction="row" spacing={1}>
              <Button
                variant={viewMode === "grid" ? "contained" : "outlined"}
                onClick={() => setViewMode("grid")}
                sx={{
                  backgroundColor: viewMode === "grid" ? "black" : "transparent",
                  color: viewMode === "grid" ? "white" : "#1D293D",
                  borderColor: "#1D293D",
                }}
              >
                {t(`card`)}
              </Button>
              <Button
                variant={viewMode === "table" ? "contained" : "outlined"}
                onClick={() => setViewMode("table")}
                sx={{
                  backgroundColor: viewMode === "table" ? "#1D293D" : "transparent",
                  color: viewMode === "table" ? "white" : "#1D293D",
                  borderColor: "#1D293D",
                }}
              >
                {t(`table`)}
              </Button>
              <Button
                variant={viewMode === "banner" ? "contained" : "outlined"}
                onClick={() => setViewMode("banner")}
                sx={{
                  backgroundColor: viewMode === "banner" ? "#1D293D" : "transparent",
                  color: viewMode === "banner" ? "white" : "#1D293D",
                  borderColor: "#1D293D",
                }}
              >
                Banner
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 2 }} mt={3}>
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
            <Grid size={{ xs: 12, sx: 6, md: 6, lg: 3 }} key={product.id}>
              <ProductCard 
                product={product} 
                onEdit={handleEditProduct}
                getShopCategoryName={getShopCategoryName}
              />
            </Grid>
          ))}
        </Grid>
      ) : viewMode == "table" ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="products table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell sx={{ fontWeight: "bold", width: 80 }}>{t(`image`)}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t(`name`)}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t(`sku`)}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t(`category`)}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t(`shop_category`)}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t(`price`)}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t(`cost`)}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t(`stock`)}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{t(`status`)}</TableCell>
                <TableCell sx={{ fontWeight: "bold", width: 150 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography>Loading products...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                    <Typography>No products found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  >
                    <TableCell>
                      <Avatar src={product.image} sx={{ width: 40, height: 40 }}>
                        <Package size={20} />
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{product.sku}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{product.category}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getShopCategoryName(product)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        ${product.price.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        ${product.cost.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.stock}
                        color={product.lowStock ? "error" : "success"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.active ? "Active" : "Inactive"}
                        color={product.active ? "success" : "error"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <ProductActions 
                        product={product} 
                        onEdit={handleEditProduct} 
                        refetch={refetch}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>
          <Stack direction={"row"} justifyContent={"space-between"} mb={2}>
            <Typography variant="h5">{t(`benner_management`)}</Typography>
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={handleCreateBanner}
              sx={{
                backgroundColor: "#1D293D",
                color: "white",
                "&:hover": { backgroundColor: "#16202f" },
              }}
            >
              {t(`add_banner`)}
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
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="banners table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "action.hover" }}>
                    <TableCell sx={{ fontWeight: "bold", width: 100 }}>{t(`image`)}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t(`category`)}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t(`title`)}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t(`discription`)}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{t(`status`)}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 150 }}>{t(`action`)}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow
                      key={banner.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                    >
                      <TableCell>
                        <Avatar
                          src={banner.image}
                          sx={{ width: 60, height: 60 }}
                          variant="square"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {banner.category}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {banner.title || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {banner.subtitle || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={banner.active ? "Active" : "Inactive"}
                          color={banner.active ? "success" : "error"}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <BannerActions 
                          banner={banner} 
                          onEdit={handleEditBanner} 
                          refetchBanners={refetchBanners}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}

      {/* Forms */}
      <ProductForm
        open={dialogOpen}
        onClose={handleCloseProductDialog}
        editingProduct={editingProduct}
        categories={categorys}
        shopCategories={categorysForShop}
        shopId={id}
        refetch={refetch}
        t={t}
      />

      <BannerForm
        open={openAddBanner}
        onClose={handleCloseBannerDialog}
        editBanner={editBanner}
        categories={categoryNames}
        banners={banners}
        refetchBanners={refetchBanners}
      />
    </Box>
  );
};

export default Products;