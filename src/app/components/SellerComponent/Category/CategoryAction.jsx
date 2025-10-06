"use client";
import { IconButton, Box } from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { useAuth } from "../../../context/AuthContext";
import { DELETE_CATEGORY } from "../../../../../graphql/mutation";
import "../../../../../style/CategoryStyle.scss"
const CategoryActions = ({ category, refetch, onEdit, t }) => {
  const { setAlert } = useAuth();

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

  const handleDelete = async (categoryId) => {
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

  return (
    <Box>
      <IconButton
        size="small"
        color="primary"
        
        onClick={() => onEdit(category)}
        sx={{ mr: 1 }}
      >
        <Edit className="edit-icon" size={25} />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => handleDelete(category.id)}
      >
        <Trash2 className="delete-icon" size={25} />
      </IconButton>
    </Box>
  );
};

export default CategoryActions;