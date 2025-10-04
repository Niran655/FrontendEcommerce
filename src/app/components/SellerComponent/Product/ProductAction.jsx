"use client";
import { useMutation } from "@apollo/client/react";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { IconButton, Box } from "@mui/material";
import { Edit, Trash2 } from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";
import { DELETE_PRODUCT_FOR_SHOP } from "../../../../../graphql/mutation";

const ProductActions = ({ product, onEdit, refetch }) => {
  const { setAlert } = useAuth();

  const [deleteProductForShop] = useMutation(DELETE_PRODUCT_FOR_SHOP, {
    onCompleted: ({ deleteProductForShop }) => {
      if (deleteProductForShop.isSuccess) {
        setAlert(true, "success", deleteProductForShop.message);
        refetch();
      } else {
        setAlert(true, "error", deleteProductForShop.message);
      }
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProductForShop({ variables: { productId: productId } });
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton
        size="small"
        onClick={() => onEdit(product)}
        color="primary"
      >
        <Edit size={16} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleDelete(product.id)}
        color="error"
      >
        <Trash2 size={16} />
      </IconButton>
      <IconButton size="small">
        <MoreVertOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default ProductActions;