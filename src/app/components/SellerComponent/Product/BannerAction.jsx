"use client";
import { useMutation } from "@apollo/client/react";
import { IconButton, Box } from "@mui/material";
import { Edit, Trash2 } from "lucide-react";

import { DELETE_BANNER } from "../../../../../graphql/mutation";

const BannerActions = ({ banner, onEdit, refetchBanners }) => {
  const [deleteBanner] = useMutation(DELETE_BANNER, {
    onCompleted: () => refetchBanners(),
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const handleDelete = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      await deleteBanner({ variables: { deleteBannerId: bannerId } });
    }
  };

  return (
    <Box>
      <IconButton
        size="small"
        onClick={() => onEdit(banner)}
        color="primary"
        sx={{ mr: 1 }}
      >
        <Edit size={16} />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => handleDelete(banner.id)}
        color="error"
      >
        <Trash2 size={16} />
      </IconButton>
    </Box>
  );
};

export default BannerActions;