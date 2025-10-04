"use client";
import { useQuery } from "@apollo/client/react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Plus, Search, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import {
  GET_CATEGORY_FOR_SHOP,
  GET_CATEGORYS,
} from "../../../../../../../graphql/queries";
import { translateLauguage } from "@/app/function/translate";
import CategoryForm from "../../../../../components/SellerComponent/Category/CategoryForm";
import CategoryActions from "../../../../../components/SellerComponent/Category/CategoryAction";

const Category = () => {
  const { id } = useParams();
  const { data: MainCategory, loading: mainCategoryLoading } =
    useQuery(GET_CATEGORYS);
  const { data, loading, refetch } = useQuery(GET_CATEGORY_FOR_SHOP, {
    variables: { shopId: id },
  });

  const categories = data?.getCategoriesForShop || [];
  const mainCategories = MainCategory?.categorys || [];
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
  };

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

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="categories table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              <TableCell sx={{ fontWeight: "bold", width: 80 }}>
                {t(`image`)}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t(`name`)}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                {t(`main_category`)}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                {t(`discription`)}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{t(`slug`)}</TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 100 }}>
                {t(`status`)}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: 150 }}>
                {t(`action`)}
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
                    <CategoryActions
                      category={category}
                      refetch={refetch}
                      onEdit={handleEditCategory}
                      t={t}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        selectedCategory={selectedCategory}
        mainCategories={mainCategories}
        shopId={id}
        refetch={refetch}
        t={t}
      />
    </Box>
  );
};

export default Category;
