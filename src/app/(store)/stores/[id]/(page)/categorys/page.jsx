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
  Stack,
} from "@mui/material";
import { Plus, Search, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../../../../../context/AuthContext";
import {
  GET_CATEGORY_FOR_SHOP_WITH_PAGINATION,
  GET_CATEGORYS,
} from "../../../../../../../graphql/queries";
import { translateLauguage } from "@/app/function/translate";
import CategoryForm from "../../../../../components/SellerComponent/Category/CategoryForm";
import CategoryActions from "../../../../../components/SellerComponent/Category/CategoryAction";
import FooterPagination from "@/app/include/FooterPagination";
import CircularIndeterminate from "@/app/function/loading/Loading";
import EmptyData from "@/app/function/EmptyData/EmptyData";

const Category = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [keyword, setKeyword] = useState("");
  const { data: MainCategory, loading: mainCategoryLoading } =
    useQuery(GET_CATEGORYS);
  const { data, loading, refetch } = useQuery(
    GET_CATEGORY_FOR_SHOP_WITH_PAGINATION,
    {
      variables: {
        shopId: id,
        page,
        limit,
        pagination: true,
        keyword,
      },
    }
  );

  const categories = data?.getCategoriesForShopWithPagination?.data || [];
  const paginator = data?.getCategoriesForShopWithPagination?.paginator || [];
  const mainCategories = MainCategory?.categorys || [];
  const { language } = useAuth();
  const { t } = translateLauguage(language);

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // const filteredCategories = categories.filter((category) =>
  //   category.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
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
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search size={20} style={{ marginRight: 8, color: "#666" }} />
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: "right" }}>
            <Chip
              label={`${categories.length} categories`}
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
         
            {loading ? (
          
                 <CircularIndeterminate/>
            ) : categories.length === 0 ? (
             <EmptyData/>
            ) : (
              categories.map((category) => (
                 <TableBody>
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
              </TableBody>
              ))
            )}
     
        </Table>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ padding: 2 }}
        >
          <FooterPagination
            page={page}
            limit={limit}
            setPage={handlePageChange}
            handleLimit={handleLimit}
            totalDocs={paginator?.totalDocs}
            totalPages={paginator?.totalPages}
          />
        </Stack>
      </TableContainer>

      <CategoryForm
        open={dialogOpen}
        language={language}
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
