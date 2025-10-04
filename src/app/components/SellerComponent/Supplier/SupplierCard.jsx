"use client";
import {
  Card,
  CardContent,
  Avatar,
  Box,
  Typography,
  Chip,
  IconButton,
} from "@mui/material";
import { Edit, Trash2, Truck } from "lucide-react";
import { MailCheck,Phone,MapPinned  } from 'lucide-react';
const SupplierCard = ({ supplier, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
            <Truck size={24} />
          </Avatar>
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(supplier)}
              color="primary"
            >
              <Edit size={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(supplier.id)}
            >
              <Trash2 color="red" size={17} />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>
          {supplier.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          Contact: {supplier.contactPerson}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          <MailCheck/> {supplier.email}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
        >
          <Phone/> {supplier.phone}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          <MapPinned/> {supplier.address}
        </Typography>

        <Chip
          label={supplier.active ? "Active" : "Inactive"}
          color={supplier.active ? "success" : "error"}
          variant="outlined"
          size="small"
        />
      </CardContent>
    </Card>
  );
};

export default SupplierCard;