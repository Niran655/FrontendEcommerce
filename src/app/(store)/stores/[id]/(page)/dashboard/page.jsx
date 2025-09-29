"use client";

import { useQuery } from "@apollo/client/react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Trophy } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { GET_DASHBOARD_STATS_FOR_SHOP } from "../../../../../../../graphql/queries";
import { useAuth } from "@/app/context/AuthContext";
import { translateLauguage } from "@/app/function/translate";
import "../../../../../../../style/Dashboard.css"
const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "primary",
  subtitle,
}) => (
  <Card class={`box-content-${color}`} sx={{ height: "100%" }}>
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography   class="text-title" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4"  component="div" color="#FAFAF9">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box class='icon-style' sx={{ width: 56, height: 56 }}>
          <Icon size={30} class="icon" />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { id } = useParams();

  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS_FOR_SHOP, {
    variables: {
      shopId: id,
    },
    pollInterval: 30000, // refresh every 30s
  });

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">Error loading dashboard: {error.message}</Alert>
    );
  }

  const stats = data?.dashboardStatsForShop || {};

  // Format hourly sales data
  const hourlySalesData = Array.from({ length: 24 }, (_, i) => {
    const hourData = stats?.hourlySales?.find((h) => h.hour === i);
    return {
      hour: i,
      sales: hourData?.sales || 0,
      transactions: hourData?.transactions || 0,
      label: `${i}:00`,
    };
  });

  const validTopProducts = (stats?.topProducts || []).filter(
    (item) => item?.product != null
  );
  console.log("validTopProducts",validTopProducts)
  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: 600 }}
      >
        {t(`dashboard`)}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t(`today's_sales`)}
            value={`$${(stats?.todaySales || 0).toFixed(2)}`}
            icon={DollarSign}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t(`transactions`)}
            value={stats?.totalTransactions || 0}
            icon={ShoppingCart}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t(`average_order`)}
            value={`$${(stats?.averageOrderValue || 0).toFixed(2)}`}
            icon={TrendingUp}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t(`low_stock_items`)}
            value={stats?.lowStockItems?.length || 0}
            icon={AlertTriangle}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Hourly Sales Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Clock size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" component="h2">
                  {t(`today's_hourly_sales`)}
                </Typography>
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "sales"
                          ? `$${Number(value).toFixed(2)}`
                          : value,
                        name === "sales" ? "Sales" : "Transactions",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#2196F3"
                      strokeWidth={3}
                      dot={{ fill: "#2196F3", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Alert */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <AlertTriangle size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" component="h2">
                  {t(`low_stock_alert`)}
                </Typography>
              </Box>
              {stats?.lowStockItems?.length > 0 ? (
                <List dense>
                  {stats.lowStockItems.slice(0, 6).map((item) => (
                    <ListItem key={item.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: "warning.main" }}>
                          <Package size={20} />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.name}
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body2">
                              {item.category}
                            </Typography>
                            <Chip
                              label={`${item.stock}/${item.minStock}`}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  {t(`all_products_are_adequately_stocked`)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <TrendingUp size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" component="h2">
                  {t(`top_selling_products`)}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {validTopProducts.length > 0 ? (
                  validTopProducts.slice(0, 6).map((item, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.product.id}>
                      <Paper
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar
                          src={item.product.image}
                          sx={{ width: 48, height: 48 }}
                        >
                          <Package size={24} />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" noWrap>
                            {item.product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.product.category}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                            <Chip
                              label={`${item.quantitySold} sold`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={`$${(item.revenue || 0).toFixed(2)}`}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: "bold" }}
                        >
                          <Trophy size={15}/> {index + 1}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 4 }}
                    >
                      No top products data available
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
