"use client"
import { Avatar, Badge, Box, Button, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { Minus, Package, Plus, Search, ShoppingCart, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const ProductSelection = ({
  open,
  onClose,
  onProductsSelected,
  existingSelections = [],
  title = "Select Products",
  maxSelections = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(existingSelections);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - replace with your actual data source
  useEffect(() => {
    // This would typically come from your API
    const mockProducts = [
      { id: 1, name: 'Wireless Headphones', price: 99.99, stock: 25, category: 'electronics', image: '' },
      { id: 2, name: 'Running Shoes', price: 129.99, stock: 40, category: 'clothing', image: '' },
      { id: 3, name: 'Coffee Maker', price: 79.99, stock: 15, category: 'home', image: '' },
      { id: 4, name: 'Smart Watch', price: 199.99, stock: 30, category: 'electronics', image: '' },
      { id: 5, name: 'Desk Lamp', price: 39.99, stock: 50, category: 'home', image: '' },
      { id: 6, name: 'Yoga Mat', price: 29.99, stock: 60, category: 'sports', image: '' },
    ];
    
    const uniqueCategories = [...new Set(mockProducts.map(product => product.category))];
    setCategories(['all', ...uniqueCategories]);
    setProducts(mockProducts);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 0) return;
    
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) return;
    
    setSelectedProducts(prev => {
      // If product already exists in selection, update quantity
      if (prev.some(item => item.id === productId)) {
        return prev.map(item => 
          item.id === productId ? { ...item, quantity: newQuantity } : item
        ).filter(item => item.quantity > 0); // Remove if quantity is 0
      }
      
      // If new product, add to selection with quantity 1
      if (newQuantity > 0) {
        const productToAdd = products.find(p => p.id === productId);
        return [...prev, { ...productToAdd, quantity: newQuantity }];
      }
      
      return prev;
    });
  };

  const handleAddToSelection = (product) => {
    handleQuantityChange(product.id, 1);
  };

  const handleConfirmSelection = () => {
    onProductsSelected(selectedProducts);
    onClose();
  };

  const getTotalItems = () => {
    return selectedProducts.reduce((total, product) => total + product.quantity, 0);
  };

  const getTotalPrice = () => {
    return selectedProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  return (
    <Box 
      // open={open} 
      // onClose={onClose} 
      // maxWidth="lg" 
      fullWidth
      PaperProps={{ sx: { height: '90vh' } }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="600">
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <X size={24} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Search and Filter Section */}
        <Paper sx={{ p: 2, borderRadius: 0 }}>
          <TextField
            fullWidth
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {categories.map(category => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Product Grid */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <Grid container spacing={2}>
              {filteredProducts.map(product => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={product.image} sx={{ width: 48, height: 48, mr: 2 }}>
                          <Package size={24} />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {product.category}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" color="primary">
                          ${product.price}
                        </Typography>
                        <Chip 
                          label={`${product.stock} in stock`} 
                          size="small" 
                          color={product.stock > 10 ? 'success' : 'warning'} 
                          variant="outlined" 
                        />
                      </Box>
                      
                      {selectedProducts.some(item => item.id === product.id) ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(product.id, 
                              selectedProducts.find(p => p.id === product.id).quantity - 1)}
                          >
                            <Minus size={16} />
                          </IconButton>
                          <Typography sx={{ mx: 2 }}>
                            {selectedProducts.find(p => p.id === product.id).quantity}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(product.id, 
                              selectedProducts.find(p => p.id === product.id).quantity + 1)}
                            disabled={selectedProducts.find(p => p.id === product.id).quantity >= product.stock}
                          >
                            <Plus size={16} />
                          </IconButton>
                        </Box>
                      ) : (
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => handleAddToSelection(product)}
                          disabled={product.stock === 0}
                          startIcon={<Plus size={16} />}
                        >
                          Add to Selection
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Selection Sidebar */}
          <Paper sx={{ width: 320, p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCart size={20} style={{ marginRight: 8 }} />
              Selected Products
              <Badge 
                badgeContent={getTotalItems()} 
                color="primary" 
                sx={{ ml: 1 }} 
              />
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {selectedProducts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No products selected yet
                </Typography>
              ) : (
                selectedProducts.map(product => (
                  <Box key={product.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={product.image} sx={{ width: 40, height: 40, mr: 2 }}>
                      <Package size={16} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ${product.price} × {product.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      ${(product.price * product.quantity).toFixed(2)}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(product.id, 0)}
                      sx={{ ml: 1 }}
                    >
                      <X size={16} />
                    </IconButton>
                  </Box>
                ))
              )}
            </Box>
            
            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${getTotalPrice().toFixed(2)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={handleConfirmSelection}
                disabled={selectedProducts.length === 0}
              >
                Confirm Selection
              </Button>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
    </Box>
  );
};

export default ProductSelection;