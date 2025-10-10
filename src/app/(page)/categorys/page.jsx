"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Box, Typography, Button } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { Plus } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  CREATE_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
} from "../../../../graphql/mutation";
import { GET_ADMIN_CATEGORY } from "../../../../graphql/queries";
import CategoryTable from "../../components/Admin/Category/CategoryTable";
import CategoryForm from "../../components/Admin/Category/CategoryForm";
import { translateLauguage } from "@/app/function/translate";

const Category = () => {
  const { data, loading, refetch } = useQuery(GET_ADMIN_CATEGORY);
  const categorys = data?.getParentCategoryForAdmin || [];
  const { setAlert } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const {language}  = useAuth()
  const {t} = translateLauguage(language)

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: ({ createCategory }) => {
      if (createCategory.isSuccess) {
        setAlert(true, "success", createCategory.message);
        handleCloseDialog();
        refetch();
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
        handleCloseDialog();
        refetch();
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
    name: Yup.string().required("Name is required").min(2),
    nameKh: Yup.string(),
    slug: Yup.string().required("Slug is required"),
    description: Yup.string().required("Description is required").max(500),
    image: Yup.string().url("Must be a valid URL"),
    active: Yup.boolean().required("Active status is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      nameKh: "",
      slug: "",
      description: "",
      image: "",
      active: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const input = {
        name: values.name,
        nameKh: values.nameKh,
        slug: values.slug,
        description: values.description,
        image: values.image,
        active: values.active === "true",
      };

      try {
        if (selectedCategory) {
          await updateCategory({
            variables: {
              updateCategoryId: selectedCategory.id,
              input,
            },
          });
        } else {
          await createCategory({ variables: { input } });
        }
      } catch (err) {
        console.error("Mutation error:", err);
      }
    },
    enableReinitialize: true,
  });

  // Event Handlers
  const handleCreateCategory = () => {
    setSelectedCategory(null);
    formik.resetForm();
    setDialogOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    formik.setValues({
      name: category.name || "",
      nameKh: category.nameKh || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
      active: category.active ? "true" : "false",
    });
    setDialogOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory({ variables: { deleteCategoryId: id } });
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedCategory(null);
    formik.resetForm();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const CategoryHeader = () => (
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
        sx={{
          bgcolor: "primary.main",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        Add Category
      </Button>
    </Box>
  );

  return (
    <Box>
      <CategoryHeader />

      <CategoryTable
        categories={categorys}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        t={t}
      />

      <CategoryForm
        open={dialogOpen}
        onClose={handleCloseDialog}
        selectedCategory={selectedCategory}
        formik={formik}
      />
    </Box>
  );
};

export default Category;
