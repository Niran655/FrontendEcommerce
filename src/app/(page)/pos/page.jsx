"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  Stack,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  CreditCard,
  DollarSign,
  Minus,
  Plus,
  QrCode,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { CREATE_SALE } from "../../../../graphql/mutation";
import { GET_PRODUCTS } from "../../../../graphql/queries";

const POS = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [discount, setDiscount] = useState(0);
  console.log("card", cart);
  // Product details dialog state
  const [openProductView, setOpenProductView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const router = useRouter();
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  const [createSale] = useMutation(CREATE_SALE, {
    onCompleted: (data) => {
      setCart([]);
      setPaymentDialogOpen(false);
      setAmountPaid("");
      setDiscount(0);
      alert(`Sale completed! Receipt: ${data.createSale.saleNumber}`);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Check for product to add from localStorage
  useEffect(() => {
    const productToAdd = localStorage.getItem("productToAdd");
    if (productToAdd) {
      try {
        const productData = JSON.parse(productToAdd);
        addToCart(productData);
        localStorage.removeItem("productToAdd");
      } catch (error) {
        console.error("Error parsing product data:", error);
      }
    }
  }, []);

  const products = data?.products || [];
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.active;
  });

  const subtotal = cart.reduce((sum, item) => {
    const hasDiscount =
      item.discount?.length > 0 && item.discount[0]?.discountPrice;
    const effectivePrice = hasDiscount
      ? item.discount[0].discountPrice
      : item.price;
    return sum + effectivePrice * item.quantity;
  }, 0);

  const defaultSubtotal = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const taxRate = 0.1;
  const tax = defaultSubtotal * taxRate;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal + tax - discountAmount;

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert("Product out of stock!");
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("Not enough stock available!");
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (newQuantity > product.stock) {
      alert("Not enough stock available!");
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }
    setPaymentDialogOpen(true);
  };

  const processSale = () => {
    const paidAmount = parseFloat(amountPaid) || 0;

    if (paymentMethod === "cash" && paidAmount < total) {
      alert("Insufficient payment amount!");
      return;
    }

    const saleInput = {
      items: cart.map((item) => ({
        product: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
      amountPaid: paymentMethod === "cash" ? paidAmount : total,
      change: paymentMethod === "cash" ? Math.max(0, paidAmount - total) : 0,
    };

    createSale({ variables: { input: saleInput } });
  };

  // Product details dialog handlers
  const handleOpenProductView = (product) => {
    setSelectedProduct(product);
    setOpenProductView(true);
  };

  const handleCloseProductView = () => {
    setOpenProductView(false);
    setSelectedProduct(null);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "cash":
        return <DollarSign size={20} />;
      case "card":
        return <CreditCard size={20} />;
      case "qr":
        return <QrCode size={20} />;
      default:
        return <DollarSign size={20} />;
    }
  };

  if (loading) return <Typography>Loading products...</Typography>;
  if (error)
    return (
      <Alert severity="error">Error loading products: {error.message}</Alert>
    );

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: 600 }}
      >
        Point of Sale System
      </Typography>

      <Grid container spacing={3}>
        {/* Products Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Search and Filter */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <Search
                        size={20}
                        style={{ marginRight: 8, color: "#666" }}
                      />
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    size="small"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Chip
                  label={`${filteredProducts.length} items`}
                  color="primary"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Products Grid */}
          <Grid container spacing={2}>
            {filteredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={product.id}>
                <Card
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleOpenProductView(product)}
                >
                  <CardMedia
                    component="img"
                    height={120}
                    image={
                      product.image ||
                      `https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg`
                    }
                    alt={product.name}
                    sx={{ objectFit: "cover", height: "150px" }}
                  />

                  <CardContent sx={{ pb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        noWrap
                        sx={{ flexGrow: 1, mr: 1 }}
                      >
                        {product.name}
                      </Typography>
                      {Array.isArray(product.discount) &&
                        product.discount.length > 0 &&
                        product.price > 0 && (
                          <Chip
                            label={`-${(
                              ((product.price -
                                Number(product.discount[0].discountPrice)) /
                                product.price) *
                              100
                            ).toFixed(0)}%`}
                            color="error"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              fontWeight: "bold",
                              backgroundColor: "#f44336",
                              color: "#fff",
                            }}
                          />
                        )}

                      {product.discount.length > 0 && (
                        <Stack direction={"row"} spacing={2}>
                          <Typography
                            variant="h6"
                            color="primary"
                            fontWeight="bold"
                          >
                            $
                            {parseFloat(
                              product.discount[0].discountPrice
                            ).toFixed(2)}
                          </Typography>
                          <Typography
                            variant="h6"
                            color="primary"
                            fontWeight="bold"
                            sx={{
                              textDecoration: "line-through",
                              color: "gray",
                            }}
                          >
                            ${product.price.toFixed(2)}
                          </Typography>
                        </Stack>
                      )}

                      {product.discount.length === 0 && (
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="bold"
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {product.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Chip
                        label={product.category}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`Stock: ${product.stock}`}
                        size="small"
                        color={product.stock < 5 ? "error" : "success"}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Cart Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ position: "sticky", top: 24 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Badge badgeContent={cart.length} color="primary">
                  <ShoppingCart size={24} />
                </Badge>
                <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
                  Current Order
                </Typography>
                {cart.length > 0 && (
                  <IconButton onClick={clearCart} color="error">
                    <Trash2 size={20} />
                  </IconButton>
                )}
              </Box>
              <Divider sx={{ mb: 2 }} />

              {cart.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 4 }}
                >
                  Cart is empty. Select products to add.
                </Typography>
              ) : (
                <>
                  <List dense sx={{ mb: 2 }}>
                    {cart.map((item) => (
                      <ListItem key={item.id} sx={{ px: 0 }}>
                        <Avatar src={item.image} sx={{ mr: 2 }}>
                          {item.name[0]}
                        </Avatar>
                        <ListItemText
                          primary={item.name}
                          secondary={`$${
                            item.discount[0]?.discountPrice || ""
                          } $${item.price.toFixed(2)} each `}
                        />
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus size={16} />
                          </IconButton>
                          <Typography
                            variant="body2"
                            sx={{ minWidth: 20, textAlign: "center" }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ mb: 2 }} />
                  {/* Discount */}
                  <TextField
                    fullWidth
                    label="Discount %"
                    type="number"
                    value={discount}
                    onChange={(e) =>
                      setDiscount(
                        Math.max(
                          0,
                          Math.min(100, parseFloat(e.target.value) || 0)
                        )
                      )
                    }
                    sx={{ mb: 2 }}
                    inputProps={{ min: 0, max: 100 }}
                  />
                  {/* Order Summary */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Subtotal:</Typography>
                      <Typography variant="body2">
                        ${subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                    {discount > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="success.main">
                          Discount ({discount}%):
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          -${discountAmount.toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Tax (10%):</Typography>
                      <Typography variant="body2">${tax.toFixed(2)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6" fontWeight="bold">
                        Total:
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="primary"
                      >
                        ${total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<Receipt />}
                    onClick={handleCheckout}
                    sx={{ py: 1.5 }}
                  >
                    Checkout
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Product Details Dialog */}
      <Dialog
        open={openProductView}
        onClose={handleCloseProductView}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedProduct?.name}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <CardMedia
              component="img"
              image={
                selectedProduct?.image ||
                "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg"
              }
              alt={selectedProduct?.name}
              sx={{
                width: 160,
                height: 160,
                objectFit: "cover",
                borderRadius: 1,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary">
                ${selectedProduct?.price?.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {selectedProduct?.description}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                <Chip
                  label={selectedProduct?.category}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Stock: ${selectedProduct?.stock ?? 0}`}
                  size="small"
                  color={selectedProduct?.stock < 5 ? "error" : "success"}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductView}>Close</Button>
          <Button
            variant="contained"
            startIcon={<ShoppingCart size={16} />}
            onClick={() => {
              if (selectedProduct) {
                addToCart(selectedProduct);
              }
              handleCloseProductView();
            }}
            disabled={!selectedProduct || (selectedProduct?.stock ?? 0) <= 0}
          >
            Add to cart
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Receipt size={24} style={{ marginRight: 8 }} />
            Complete Payment
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography
              variant="h5"
              align="center"
              color="primary"
              fontWeight="bold"
            >
              Total: ${total.toFixed(2)}
            </Typography>
          </Box>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              label="Payment Method"
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="cash">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <DollarSign size={20} style={{ marginRight: 8 }} />
                  Cash
                </Box>
              </MenuItem>
              <MenuItem value="card">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CreditCard size={20} style={{ marginRight: 8 }} />
                  Card
                </Box>
              </MenuItem>
              <MenuItem value="qr">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <QrCode size={20} style={{ marginRight: 8 }} />
                  QR Code
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {paymentMethod === "cash" && (
            <TextField
              fullWidth
              label="Amount Paid"
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ mb: 2 }}
            />
          )}

          {paymentMethod === "cash" && amountPaid && (
            <Alert
              severity={parseFloat(amountPaid) >= total ? "success" : "warning"}
              sx={{ mb: 2 }}
            >
              {parseFloat(amountPaid) >= total
                ? `Change: $${(parseFloat(amountPaid) - total).toFixed(2)}`
                : `Need $${(total - parseFloat(amountPaid)).toFixed(2)} more`}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={processSale}
            disabled={
              paymentMethod === "cash" &&
              (!amountPaid || parseFloat(amountPaid) < total)
            }
            startIcon={getPaymentMethodIcon(paymentMethod)}
          >
            Complete Sale
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default POS;
