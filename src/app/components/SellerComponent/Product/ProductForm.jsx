"use client";
import { useMutation } from "@apollo/client/react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Package } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import ImageUploadWithCropModal from "../../ImageUploadWithCropModal";
import { useAuth } from "@/app/context/AuthContext";
import {
  CREATE_PRODUCT_FOR_SHOP,
  UPDATE_PRODUCT_FOR_SHOP,
} from "../../../../../graphql/mutation";

const productSchema = Yup.object().shape({
  name: Yup.string().required("required"),
  description: Yup.string(),
  category: Yup.string(),
  shopCategoryId: Yup.string().required("required"),
  price: Yup.number().min(0, "Price must be positive").required("required"),
  cost: Yup.number().min(0, "Cost must be positive").required("required"),
  sku: Yup.string().required("required"),
  stock: Yup.number()
    .integer("Stock must be an integer")
    .min(0, "Stock must be positive")
    .required("required"),
  minStock: Yup.number()
    .integer("Minimum stock must be an integer")
    .min(0, "Minimum stock must be positive")
    .required("required"),
  image: Yup.string(),
  subImage: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().url("Must be a valid URL"),
      altText: Yup.string(),
      caption: Yup.string(),
    })
  ),
  discount: Yup.array().of(
    Yup.object().shape({
      defaultPrice: Yup.number().min(0, "Price must be positive"),
      description: Yup.string().required("required"),
      discountPrice: Yup.number().min(0, "Price must be positive"),
    })
  ),
  isCombo: Yup.boolean(),
  comboItems: Yup.array(),
});

const initialFormData = {
  name: "",
  description: "",
  category: "",
  shopCategoryId: "",
  price: "",
  cost: "",
  sku: "",
  stock: "",
  minStock: "",
  image: "",
  subImage: [],
  discount: [],
  isCombo: false,
  comboItems: [],
};

const ProductForm = ({
  open,
  onClose,
  editingProduct,
  categories,
  shopCategories,
  shopId,
  refetch,
  t,
}) => {
  const { setAlert } = useAuth();
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageUploadKey, setImageUploadKey] = useState(0);
  const [createProductForShop] = useMutation(CREATE_PRODUCT_FOR_SHOP, {
    onCompleted: ({ createProductForShop }) => {
      if (createProductForShop.isSuccess) {
        setAlert(true, "success", createProductForShop.message);
        onClose();
        formik.resetForm();
        refetch();
      } else {
        setAlert(true, "error", createProductForShop.message);
      }
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [updateProductForShop] = useMutation(UPDATE_PRODUCT_FOR_SHOP, {
    onCompleted: ({ updateProductForShop }) => {
      if (updateProductForShop.isSuccess) {
        setAlert(true, "success", updateProductForShop.message);
        onClose();
        formik.resetForm();
        refetch();
      } else {
        setAlert(true, "error", updateProductForShop.message);
      }
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const formik = useFormik({
    initialValues: initialFormData,
    validationSchema: productSchema,
    onSubmit: async (values) => {
      const finalImageUrl = uploadedImageUrl || values.image;
      const productData = {
        name: values.name,
        description: values.description,
        category: values.category,
        shopCategoryId: values.shopCategoryId,
        price: parseFloat(values.price),
        cost: parseFloat(values.cost),
        sku: values.sku,
        stock: parseInt(values.stock),
        minStock: parseInt(values.minStock),
        image: finalImageUrl,
        subImage: values.subImage,
        discount: values.discount.map((d) => ({
          defaultPrice: parseFloat(d.defaultPrice),
          discountPrice: parseFloat(d.discountPrice),
          description: d.description,
        })),
        isCombo: values.isCombo,
        comboItems: values.comboItems,
      };

      const input = {
        shopId: shopId,
        productData: productData,
      };

      if (editingProduct) {
        await updateProductForShop({
          variables: {
            productId: editingProduct.id,
            input: input,
          },
        });
      } else {
        await createProductForShop({
          variables: { input },
        });
      }
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    handleChange,
    setFieldValue,
    setValues,
    getFieldProps,
    resetForm,
    isSubmitting,
    values,
  } = formik;
  useEffect(() => {
    if (editingProduct) {
      const formValues = {
        name: editingProduct.name || "",
        description: editingProduct.description || "",
        category: editingProduct.category || "",
        shopCategoryId: editingProduct.shopCategory?.id || "",
        price: editingProduct.price?.toString() || "",
        cost: editingProduct.cost?.toString() || "",
        sku: editingProduct.sku || "",
        stock: editingProduct.stock?.toString() || "",
        minStock: editingProduct.minStock?.toString() || "",
        image: editingProduct.image || "",
        subImage:
          editingProduct.subImage?.map((img) => ({
            url: img.url || "",
            altText: img.altText || "",
            caption: img.caption || "",
          })) || [],
        discount:
          editingProduct.discount?.map((dis) => ({
            discountPrice: dis.discountPrice?.toString() || "",
            defaultPrice: dis.defaultPrice?.toString() || "",
            description: dis.description || "",
          })) || [],
        isCombo: editingProduct.isCombo || false,
        comboItems: editingProduct.comboItems || [],
      };

      setValues(formValues);
    }
  }, [editingProduct, setValues]);

  const addSubImage = useCallback(() => {
    setFieldValue("subImage", [
      ...values.subImage,
      { url: "", altText: "", caption: "" },
    ]);
  }, [setFieldValue, values.subImage]);

  const updateSubImage = useCallback(
    (index, field, value) => {
      const next = [...values.subImage];
      if (!next[index]) return;
      next[index][field] = value;
      setFieldValue("subImage", next);
    },
    [setFieldValue, values.subImage]
  );

  const removeSubImage = useCallback(
    (index) => {
      const next = values.subImage.filter((_, i) => i !== index);
      setFieldValue("subImage", next);
    },
    [setFieldValue, values.subImage]
  );

  const addDiscount = useCallback(() => {
    setFieldValue("discount", [
      ...values.discount,
      {
        defaultPrice: parseFloat(values.price),
        description: "",
        discountPrice: 0,
      },
    ]);
  }, [setFieldValue, values.discount]);

  const updateDiscount = useCallback(
    (index, field, value) => {
      const next = [...values.discount];
      if (!next[index]) return;
      next[index][field] = value;
      setFieldValue("discount", next);
    },
    [setFieldValue, values.discount]
  );

  const removeDiscount = useCallback(
    (index) => {
      const next = values.discount.filter((_, i) => i !== index);
      setFieldValue("discount", next);
    },
    [setFieldValue, values.discount]
  );

  const handleImageUploadSuccess = (imageData) => {
    const imageUrl = imageData.imageUrl;
    setUploadedImageUrl(imageUrl);
    setFieldValue("image", imageUrl);
    setAlert(true, "success", "successfully!");
  };
  const handleImageUploadError = (error) => {
    console.error("Image upload error:", error);
    setAlert(true, "error", `Image upload failed: ${error.message || error}`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Package size={24} style={{ marginRight: 8 }} />
            {editingProduct ? "Edit Product" : "Create New Product"}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>{t(`product_name`)}</Typography>
              <TextField
                fullWidth
                name="name"
                placeholder={t(`product_name`)}
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography>{t(`sku`)}</Typography>
              <TextField
                fullWidth
                name="sku"
                placeholder={t(`sku`)}
                value={values.sku}
                onChange={handleChange}
                error={touched.sku && Boolean(errors.sku)}
                helperText={touched.sku && errors.sku}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography>{t(`category`)}</Typography>
              <Autocomplete
                fullWidth
                placeholder={t(`category`)}
                options={categories.map((cat) => cat.name)}
                value={values.category}
                onChange={(event, newValue) => {
                  handleChange({
                    target: {
                      name: "category",
                      value: newValue,
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="category"
                    required
                    error={touched.category && Boolean(errors.category)}
                    helperText={touched.category && errors.category}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography>{t(`shop_category`)}</Typography>
              <FormControl fullWidth>
                <Select
                  name="shopCategoryId"
                  value={values.shopCategoryId}
                  onChange={handleChange}
                  error={
                    touched.shopCategoryId && Boolean(errors.shopCategoryId)
                  }
                >
                  <MenuItem value="">Select a category</MenuItem>
                  {shopCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {touched.shopCategoryId && errors.shopCategoryId && (
                  <Typography variant="caption" color="error">
                    {errors.shopCategoryId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography>{t(`price`)}</Typography>
              <TextField
                fullWidth
                name="price"
                placeholder={t(`price`)}
                type="number"
                value={values.price}
                onChange={handleChange}
                error={touched.price && Boolean(errors.price)}
                helperText={touched.price && errors.price}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography>{t(`cost`)}</Typography>
              <TextField
                fullWidth
                name="cost"
                placeholder={t(`cost`)}
                type="number"
                value={values.cost}
                onChange={handleChange}
                error={touched.cost && Boolean(errors.cost)}
                helperText={touched.cost && errors.cost}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography>{t(`stock`)}</Typography>
              <TextField
                fullWidth
                name="stock"
                placeholder={t(`stock`)}
                type="number"
                value={values.stock}
                onChange={handleChange}
                error={touched.stock && Boolean(errors.stock)}
                helperText={touched.stock && errors.stock}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography>{t(`min_stock`)}</Typography>
              <TextField
                fullWidth
                name="minStock"
                placeholder={t(`min_stock`)}
                type="number"
                value={values.minStock}
                onChange={handleChange}
                error={touched.minStock && Boolean(errors.minStock)}
                helperText={touched.minStock && errors.minStock}
                inputProps={{ min: 0 }}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography>{t(`discription`)}</Typography>
              <TextField
                fullWidth
                name="description"
                placeholder={t(`discription`)}
                multiline
                rows={2}
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>{t(`image`)}</Typography>

              <Stack direction="row" spacing={2}  >
                <ImageUploadWithCropModal
                  key={imageUploadKey}
                  onUploadSuccess={handleImageUploadSuccess}
                  onUploadError={handleImageUploadError}
                  aspectRatio={4 / 3}
                  existingImageUrl={uploadedImageUrl || values.image}
                />

                {(uploadedImageUrl || values.image) && (
                  <Box sx={{ ml: 2 }}>
          
                    <img
                      src={uploadedImageUrl || values.image}
                      alt="Product Preview"
                      style={{
                        width: 180,
                        height: 180,
                        objectFit: "cover",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                      }}
                    />
                  </Box>
                )}
              </Stack>

              {touched.image && errors.image && (
                <Typography variant="caption" color="error">
                  {errors.image}
                </Typography>
              )}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography>{t(`add_image`)}</Typography>
                <IconButton onClick={addSubImage}>
                  <AddIcon />
                </IconButton>
              </Stack>
            </Grid>

            {values.subImage.map((img, index) => (
              <Grid container alignItems="center" spacing={1} key={index}>
                <Grid size={{ xs: 5 }} mt={1}>
                  <TextField
                    fullWidth
                    label={`Image URL ${index + 1}`}
                    value={img.url}
                    onChange={(e) =>
                      updateSubImage(index, "url", e.target.value)
                    }
                    error={
                      touched.subImage &&
                      touched.subImage[index]?.url &&
                      Boolean(errors.subImage?.[index]?.url)
                    }
                    helperText={
                      touched.subImage &&
                      touched.subImage[index]?.url &&
                      errors.subImage?.[index]?.url
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </Grid>

                <Grid size={{ xs: 3 }} mt={1}>
                  <TextField
                    fullWidth
                    label="Alt Text"
                    value={img.altText || ""}
                    onChange={(e) =>
                      updateSubImage(index, "altText", e.target.value)
                    }
                    placeholder="e.g. Laptop front view"
                  />
                </Grid>
                <Grid size={{ xs: 3 }} mt={1}>
                  <TextField
                    fullWidth
                    label="Caption"
                    value={img.caption || ""}
                    onChange={(e) =>
                      updateSubImage(index, "caption", e.target.value)
                    }
                    placeholder="e.g. High-resolution image of product"
                  />
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton onClick={() => removeSubImage(index)}>
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}

            <Grid size={{ xs: 12 }}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography>{t(`discount`)}</Typography>
                <IconButton onClick={addDiscount}>
                  <AddIcon />
                </IconButton>
              </Stack>
            </Grid>
            {values.discount.map((dis, index) => (
              <Grid container alignItems="center" spacing={1} key={index}>
                <Grid size={{ xs: 5 }} mt={1}>
                  <TextField
                    fullWidth
                    label="Discount Price"
                    type="number"
                    value={dis.discountPrice || ""}
                    onChange={(e) =>
                      updateDiscount(index, "discountPrice", e.target.value)
                    }
                    placeholder="Discount Price"
                  />
                </Grid>
                <Grid size={{ xs: 3 }} mt={1}>
                  <TextField
                    fullWidth
                    label="Default Price"
                    disabled
                    type="number"
                    value={dis.defaultPrice || ""}
                    onChange={(e) =>
                      updateDiscount(index, "defaultPrice", e.target.value)
                    }
                    placeholder="defaultPrice Price"
                  />
                </Grid>
                <Grid size={{ xs: 3 }} mt={1}>
                  <TextField
                    fullWidth
                    label="Discription"
                    value={dis.description || ""}
                    onChange={(e) =>
                      updateDiscount(index, "description", e.target.value)
                    }
                    placeholder="Description"
                  />
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <IconButton onClick={() => removeDiscount(index)}>
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose}>{t(`cancel`)}</Button>
          <Button type="submit" variant="contained">
            {editingProduct ? t(`edit_product`) : t(`create_product`)}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
