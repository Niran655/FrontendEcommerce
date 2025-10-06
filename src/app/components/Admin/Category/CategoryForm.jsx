"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Stack,
  Box,
  Paper,
} from "@mui/material";
import { Package } from "lucide-react";
import { Form, FormikProvider } from "formik";

const CategoryForm = ({ 
  open, 
  onClose, 
  selectedCategory, 
  formik 
}) => {
  const {
    errors,
    touched,
    getFieldProps,
    isSubmitting,
    handleSubmit,
  } = formik;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Paper sx={{ p: 3 }}>
        <FormikProvider value={formik}>
          <Form onSubmit={handleSubmit}>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Package size={24} style={{ marginRight: 8 }} />
                {selectedCategory ? "Edit Category" : "Create New Category"}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{xs:12,md:6}}>
                  <TextField
                    label="Name English"
                    fullWidth
                    {...getFieldProps("name")}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <TextField
                    label="Name Khmer"
                    fullWidth
                    {...getFieldProps("nameKh")}
                    error={touched.nameKh && Boolean(errors.nameKh)}
                    helperText={touched.nameKh && errors.nameKh}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <TextField
                    label="Slug"
                    fullWidth
                    {...getFieldProps("slug")}
                    error={touched.slug && Boolean(errors.slug)}
                    helperText={touched.slug && errors.slug}
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    {...getFieldProps("description")}
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <TextField
                    label="Image URL"
                    fullWidth
                    {...getFieldProps("image")}
                    error={touched.image && Boolean(errors.image)}
                    helperText={touched.image && errors.image}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <FormControl fullWidth error={touched.active && Boolean(errors.active)}>
                    <Select
                      {...getFieldProps("active")}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select status</em>
                      </MenuItem>
                      <MenuItem value="true">Active</MenuItem>
                      <MenuItem value="false">Inactive</MenuItem>
                    </Select>
                    {touched.active && errors.active && (
                      <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                        {errors.active}
                      </Box>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{xs:12}}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Category"}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
          </Form>
        </FormikProvider>
      </Paper>
    </Dialog>
  );
};

export default CategoryForm;