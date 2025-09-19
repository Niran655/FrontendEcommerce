"use client"
import { Alert, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, InputLabel, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Paper, Select, Switch, TextField, Typography } from '@mui/material';
import { AlertTriangle, Bell, CheckCircle, Database, DollarSign, Palette, Percent, Printer, Receipt, Save, Settings as SettingsIcon, Shield, TestTube, Wifi } from 'lucide-react';
import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
 
    businessName: 'My Coffee Shop',
    businessAddress: '123 Coffee Street, Bean City, BC 12345',
    businessPhone: '+1 (555) 123-4567',
    businessEmail: 'info@mycoffeeshop.com',
    

    taxRate: 10,
    taxName: 'VAT',
    enableTax: true,
    

    receiptHeader: 'Thank you for your visit!',
    receiptFooter: 'Visit us again soon!',
    printReceipt: true,
    emailReceipt: false,
    
 
    printerType: 'thermal',
    printerName: 'Star TSP100',
    paperWidth: 80, // mm
    
  
    lowStockThreshold: 10,
    enableLowStockAlerts: true,
    autoUpdateStock: true,
    

    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    theme: 'light',
    
 
    emailNotifications: true,
    stockAlerts: true,
    salesReports: true,
    systemUpdates: false
  });

  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testType, setTestType] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real implementation, this would save to the backend
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleTestPrinter = () => {
    setTestType('printer');
    setTestDialogOpen(true);
  };

  const handleTestReceipt = () => {
    setTestType('receipt');
    setTestDialogOpen(true);
  };

  const executeTest = () => {
    // Simulate test execution
    setTimeout(() => {
      setTestDialogOpen(false);
      alert(`${testType === 'printer' ? 'Printer' : 'Receipt'} test completed successfully!`);
    }, 2000);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          System Settings
        </Typography>
        <Button
          variant="contained"
          startIcon={<Save size={20} />}
          onClick={handleSaveSettings}
          color={saveStatus === 'success' ? 'success' : 'primary'}
        >
          {saveStatus === 'success' ? 'Saved!' : 'Save Settings'}
        </Button>
      </Box>

      {saveStatus === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Business Information */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon size={20} style={{ marginRight: 8 }} />
                Business Information
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    value={settings.businessName}
                    onChange={(e) => handleSettingChange('businessName', e.target.value)}
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={settings.businessAddress}
                    onChange={(e) => handleSettingChange('businessAddress', e.target.value)}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <TextField
                    fullWidth
                    label="Phone"
                    value={settings.businessPhone}
                    onChange={(e) => handleSettingChange('businessPhone', e.target.value)}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => handleSettingChange('businessEmail', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tax Settings */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Percent size={20} style={{ marginRight: 8 }} />
                Tax Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs:12}}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableTax}
                        onChange={(e) => handleSettingChange('enableTax', e.target.checked)}
                      />
                    }
                    label="Enable Tax Calculation"
                  />
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <TextField
                    fullWidth
                    label="Tax Name"
                    value={settings.taxName}
                    onChange={(e) => handleSettingChange('taxName', e.target.value)}
                    disabled={!settings.enableTax}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <TextField
                    fullWidth
                    label="Tax Rate (%)"
                    type="number"
                    value={settings.taxRate}
                    onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                    disabled={!settings.enableTax}
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Printer Settings */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Printer size={20} style={{ marginRight: 8 }} />
                Printer Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs:12}}>
                  <FormControl fullWidth>
                    <InputLabel>Printer Type</InputLabel>
                    <Select
                      value={settings.printerType}
                      label="Printer Type"
                      onChange={(e) => handleSettingChange('printerType', e.target.value)}
                    >
                      <MenuItem value="thermal">Thermal Receipt Printer</MenuItem>
                      <MenuItem value="inkjet">Inkjet Printer</MenuItem>
                      <MenuItem value="laser">Laser Printer</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Printer Name"
                    value={settings.printerName}
                    onChange={(e) => handleSettingChange('printerName', e.target.value)}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <TextField
                    fullWidth
                    label="Paper Width (mm)"
                    type="number"
                    value={settings.paperWidth}
                    onChange={(e) => handleSettingChange('paperWidth', parseInt(e.target.value))}
                    inputProps={{ min: 58, max: 80 }}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleTestPrinter}
                    startIcon={<TestTube size={16} />}
                  >
                    Test Printer
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Receipt Settings */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Receipt size={20} style={{ marginRight: 8 }} />
                Receipt Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Receipt Header"
                    value={settings.receiptHeader}
                    onChange={(e) => handleSettingChange('receiptHeader', e.target.value)}
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Receipt Footer"
                    value={settings.receiptFooter}
                    onChange={(e) => handleSettingChange('receiptFooter', e.target.value)}
                  />
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.printReceipt}
                        onChange={(e) => handleSettingChange('printReceipt', e.target.checked)}
                      />
                    }
                    label="Print Receipt"
                  />
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailReceipt}
                        onChange={(e) => handleSettingChange('emailReceipt', e.target.checked)}
                      />
                    }
                    label="Email Receipt"
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleTestReceipt}
                    startIcon={<TestTube size={16} />}
                  >
                    Test Receipt
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Preferences */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Palette size={20} style={{ marginRight: 8 }} />
                System Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs:12,md:6}} >
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={settings.currency}
                      label="Currency"
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                    >
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                      <MenuItem value="GBP">GBP (£)</MenuItem>
                      <MenuItem value="CAD">CAD ($)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <FormControl fullWidth>
                    <InputLabel>Date Format</InputLabel>
                    <Select
                      value={settings.dateFormat}
                      label="Date Format"
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    >
                      <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                      <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                      <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <FormControl fullWidth>
                    <InputLabel>Time Format</InputLabel>
                    <Select
                      value={settings.timeFormat}
                      label="Time Format"
                      onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                    >
                      <MenuItem value="12">12 Hour</MenuItem>
                      <MenuItem value="24">24 Hour</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{xs:12,md:6}} >
                  <FormControl fullWidth>
                    <InputLabel>Theme</InputLabel>
                    <Select
                      value={settings.theme}
                      label="Theme"
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                    >
                      <MenuItem value="light">Light</MenuItem>
                      <MenuItem value="dark">Dark</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Settings */}
        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Database size={20} style={{ marginRight: 8 }} />
                Inventory Settings
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{xs:12}}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableLowStockAlerts}
                        onChange={(e) => handleSettingChange('enableLowStockAlerts', e.target.checked)}
                      />
                    }
                    label="Enable Low Stock Alerts"
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label="Default Low Stock Threshold"
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) => handleSettingChange('lowStockThreshold', parseInt(e.target.value))}
                    inputProps={{ min: 1 }}
                    disabled={!settings.enableLowStockAlerts}
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoUpdateStock}
                        onChange={(e) => handleSettingChange('autoUpdateStock', e.target.checked)}
                      />
                    }
                    label="Auto Update Stock on Sales"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid size={{xs:12}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Bell size={20} style={{ marginRight: 8 }} />
                Notification Preferences
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Bell size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive system notifications via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <AlertTriangle size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Stock Alerts"
                    secondary="Get notified when items are running low"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.stockAlerts}
                      onChange={(e) => handleSettingChange('stockAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <DollarSign size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Daily Sales Reports"
                    secondary="Receive daily sales summary reports"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.salesReports}
                      onChange={(e) => handleSettingChange('salesReports', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <Shield size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary="System Updates"
                    secondary="Get notified about system updates and maintenance"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.systemUpdates}
                      onChange={(e) => handleSettingChange('systemUpdates', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Test Dialog */}
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {testType === 'printer' ? 'Test Printer' : 'Test Receipt'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            {testType === 'printer' ? (
              <Box>
                <Printer size={48} style={{ marginBottom: 16, color: '#666' }} />
                <Typography variant="body1" gutterBottom>
                  This will send a test page to your configured printer.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Make sure your printer is connected and ready.
                </Typography>
              </Box>
            ) : (
              <Box>
                <Receipt size={48} style={{ marginBottom: 16, color: '#666' }} />
                <Typography variant="body1" gutterBottom>
                  This will generate a sample receipt with your current settings.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You can preview how receipts will look to customers.
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={executeTest}>
            Run Test
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;