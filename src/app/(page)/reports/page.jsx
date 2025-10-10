"use client";

import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import dayjs from "dayjs";


import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";


import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";


import {
  AlertTriangle,
  BarChart3,
  Calendar,
  DollarSign,
  Download,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";


import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";


import {
  GET_LOW_STOCK_PRODUCTS,
  GET_SALES,
  GET_SALES_REPORT,
} from "../../../../graphql/queries";
import { useAuth } from "@/app/context/AuthContext";
import { translateLauguage } from "@/app/function/translate";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const Reports = () => {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState(dayjs());
  const {language} = useAuth()
  const {t} = translateLauguage(language)
  const {
    data: reportData,
    loading: reportLoading,
    refetch: refetchReport,
  } = useQuery(GET_SALES_REPORT, {
    variables: {
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    },
  });

  const { data: salesData, loading: salesLoading } = useQuery(GET_SALES, {
    variables: { limit: 50 },
  });

  const { data: lowStockData, loading: lowStockLoading } =
    useQuery(GET_LOW_STOCK_PRODUCTS);

  const handleDateRangeChange = () => {
    refetchReport({
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
    });
  };

  const exportReport = () => {
    alert("Report export functionality would be implemented here");
  };

  // ---------------------- SALES REPORT ------------------------
  const renderSalesReport = () => {
    if (reportLoading)
      return <Typography>Loading sales report...</Typography>;
    if (!reportData?.salesReport)
      return <Alert severity="info">No data available for selected period</Alert>;

    const report = reportData.salesReport;
    const sortedCategories = [...report.salesByCategory].sort(
      (a, b) => b.sales - a.sales
    );

    return (
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid size={{xs:12,sm:4}} >
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    {t(`total_sale`)}
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    ${report.totalSales.toFixed(2)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.main" }}> 
                  <DollarSign size={24} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,sm:4}}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Transactions
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {report.totalTransactions}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <BarChart3 size={24} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,sm:4}}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Average Order Value
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    ${report.averageOrderValue.toFixed(2)}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <TrendingUp size={24} />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Sales Chart */}
        <Grid size={{xs:12,lg:8}} >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Sales Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={report.salesByDay}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, "Sales"]} />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#2196F3"
                      strokeWidth={3}
                      dot={{ fill: "#2196F3" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Sales Pie Chart */}
        <Grid size={{xs:12,lg:4}} >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales by Category
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={report.salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) =>
                        `${category} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="sales"
                    >
                      {report.salesByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Table */}
        <Grid size={{xs:12}} >
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Performance
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Total Sales</TableCell>
                      <TableCell>Items Sold</TableCell>
                      <TableCell>Average per Item</TableCell>
                      <TableCell>% of Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedCategories.map((category) => {
                      const percentage = ((category.sales / report.totalSales) * 100).toFixed(1);
                      const avg = category.quantity > 0 ? (category.sales / category.quantity).toFixed(2) : 0;
                      return (
                        <TableRow key={category.category}>
                          <TableCell>
                            <Chip label={category.category} color="primary" variant="outlined" />
                          </TableCell>
                          <TableCell>${category.sales.toFixed(2)}</TableCell>
                          <TableCell>{category.quantity}</TableCell>
                          <TableCell>${avg}</TableCell>
                          <TableCell>
                            <Chip label={`${percentage}%`} size="small" color="success" variant="outlined" />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // ---------------------- STAFF REPORT ------------------------
  const renderStaffReport = () => {
    if (salesLoading) return <Typography>Loading staff report...</Typography>;

    const sales = salesData?.sales || [];
    const staffPerformance = sales.reduce((acc, sale) => {
      const cashierId = sale.cashier.id;
      if (!acc[cashierId]) {
        acc[cashierId] = { name: sale.cashier.name, totalSales: 0, totalTransactions: 0, averageOrder: 0 };
      }
      acc[cashierId].totalSales += sale.total;
      acc[cashierId].totalTransactions += 1;
      return acc;
    }, {});

    Object.values(staffPerformance).forEach((staff) => {
      staff.averageOrder =
        staff.totalTransactions > 0 ? staff.totalSales / staff.totalTransactions : 0;
    });

    const staffArray = [...Object.values(staffPerformance)].sort(
      (a, b) => b.totalSales - a.totalSales
    );

    return (
      <Grid container spacing={3}>
        <Grid size={{xs:12}}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Users size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6">Staff Performance Report</Typography>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Staff Member</TableCell>
                      <TableCell>Total Sales</TableCell>
                      <TableCell>Transactions</TableCell>
                      <TableCell>Average Order</TableCell>
                      <TableCell>Performance</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {staffArray.map((staff, index) => (
                      <TableRow key={staff.name}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ mr: 2, bgcolor: index === 0 ? "gold" : "primary.main" }}>
                              {staff.name[0]}
                            </Avatar>
                            <Box>
                              <Typography fontWeight="medium">{staff.name}</Typography>
                              {index === 0 && (
                                <Chip label="Top Performer" size="small" color="warning" />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>${staff.totalSales.toFixed(2)}</TableCell>
                        <TableCell>{staff.totalTransactions}</TableCell>
                        <TableCell>${staff.averageOrder.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={index === 0 ? "Excellent" : index < 3 ? "Good" : "Average"}
                            color={index === 0 ? "success" : index < 3 ? "primary" : "default"}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sales by Staff Member
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffArray.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
                    <Bar dataKey="totalSales" fill="#2196F3" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,md:6}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Count by Staff
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={staffArray.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalTransactions" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  // ---------------------- INVENTORY REPORT ------------------------
  const renderInventoryReport = () => {
    if (lowStockLoading) return <Typography>Loading inventory report...</Typography>;
    const lowStockItems = lowStockData?.lowStockProducts || [];

    return (
      <Grid container spacing={3}>
        <Grid size={{xs:12}}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AlertTriangle size={24} style={{ marginRight: 8, color: "#ff9800" }} />
                  <Typography variant="h6">Low Stock Report</Typography>
                </Box>
                <Chip
                  label={`${lowStockItems.length} items need attention`}
                  color="warning"
                  icon={<AlertTriangle size={16} />}
                />
              </Box>

              {lowStockItems.length === 0 ? (
                <Alert severity="success">
                  All inventory levels are healthy! No items below minimum stock levels.
                </Alert>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Current Stock</TableCell>
                        <TableCell>Minimum Stock</TableCell>
                        <TableCell>Shortage</TableCell>
                        <TableCell>Priority</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lowStockItems.map((item) => {
                        const shortage = item.minStock - item.stock;
                        const priority =  
                          shortage > item.minStock
                            ? "Critical"
                            : shortage > item.minStock * 0.5
                            ? "High"
                            : "Medium";
                        const priorityColor =
                          priority === "Critical"
                            ? "error"
                            : priority === "High"
                            ? "warning"
                            : "info";
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar sx={{ mr: 2, bgcolor: "warning.main" }}>
                                  <Package size={20} />
                                </Avatar>
                                {item.name}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip label={item.category} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell color="error.main">{item.stock}</TableCell>
                            <TableCell>{item.minStock}</TableCell>
                            <TableCell>{shortage}</TableCell>
                            <TableCell>
                              <Chip label={priority} color={priorityColor} variant="outlined" size="small" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            {t(`reports_analytics`)}
          </Typography>
          <Button variant="outlined" startIcon={<Download size={20} />} onClick={exportReport}>
            Export Report
          </Button>
        </Box>

        {/* Report Controls */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{xs:12,md:3}} >
              <FormControl fullWidth  >
                <InputLabel>Report Type</InputLabel>
                <Select value={reportType} label="Report Type" onChange={(e) => setReportType(e.target.value)}>
                  <MenuItem value="sales">Sales Report</MenuItem>
                  <MenuItem value="staff">Staff Performance</MenuItem>
                  <MenuItem value="inventory">Inventory Report</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {reportType === "sales" && (
              <>
                <Grid size={{xs:12,md:3}} >
                  <DatePicker
                    label="Start Date"
    
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid size={{xs:12,md:3}} >
                  <DatePicker
                    label="End Date"
                    
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid size={{xs:12,md:3}} >
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleDateRangeChange}
                    startIcon={<Calendar size={20} />}
                  >
                    Update Report
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>

        {/* Report Content */}
        {reportType === "sales" && renderSalesReport()}
        {reportType === "staff" && renderStaffReport()}
        {reportType === "inventory" && renderInventoryReport()}
      </Box>
    </LocalizationProvider>
  );
};

export default Reports;
