"use client";
import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  TextField,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Search, Edit, Trash2, Package } from "lucide-react";

const CategoryTable = ({
  categories,
  loading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}) => {
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.nameKh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  return (
    <Box>
      {/* Search and Count Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={onSearchChange}
              InputProps={{
                startAdornment: (
                  <Search size={20} style={{ marginRight: 8, color: "#666" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
            <Chip
              label={`${filteredCategories.length} categories`}
              color="primary"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Simple Table */}
      <Paper>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Name Khmer</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2">Loading...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2">No categories found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Avatar
                        src={category.image}
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: category.image ? "transparent" : "grey.300",
                        }}
                      >
                        {!category.image && <Package size={20} />}
                      </Avatar>
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.nameKh}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 250,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={category.description}
                    >
                      {category.description}
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                      <Chip
                        label={category.active ? "Active" : "Inactive"}
                        color={category.active ? "success" : "error"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(category)}
                        sx={{ mr: 1 }}
                      >
                        <Edit size={16} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(category.id)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CategoryTable;
