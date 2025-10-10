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
  ListChecks,
  Package,
  ShoppingCart,
  Layers,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { GET_DASHBOARD_STATS_FOR_ADMIN } from "../../../../graphql/queries";
import "../../../../style/Dashboard.css";
import { useAuth } from "@/app/context/AuthContext";
import { translateLauguage } from "@/app/function/translate";

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
          <Typography class="text-title" gutterBottom variant="h6">
            {title}
          </Typography>
          <Typography variant="h4" component="div" color="#FAFAF9">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box class="icon-style" sx={{ width: 56, height: 56 }}>
          <Icon size={30} class="icon" />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data, loading, error } = useQuery(GET_DASHBOARD_STATS_FOR_ADMIN, {
    pollInterval: 30000,
  });

  const {language} = useAuth()
  const {t} = translateLauguage(language)

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

  const stats = data?.dashboardStatsForAdmin || {};

  const hourlySalesData = Array.from({ length: 24 }, (_, i) => {
    const hourData = stats?.hourlySales?.find((h) => h.hour === i);
    return {
      hour: i,
      sales: hourData?.sales || 0,
      transactions: hourData?.transactions || 0,
      label: `${i}:00`,
    };
  });

  const validTopProducts = stats?.topProducts || [];

  const topCategoriesData = (stats?.topCategories || []).map((cat) => ({
    name: cat.product?.category || "Unknown",
    totalProduct: cat.totalProduct,
    totalRevenue: cat.totalRevenue,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }));

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

      {/* Statistic Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t(`total_products`)}
            value={stats?.totalProduct}
            icon={Layers}
            color="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t`new_user`}
            value={stats?.totalNewUser || 0}
            icon={Users}
            color="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t(`new_order`)}
            value={stats?.totalNewOrder}
            icon={ShoppingCart}
            color="primary"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title={t(`total_sold`)}
            value={stats?.totalSold || 0}
            icon={ListChecks}
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
         
            <CardContent className="hour-sale">
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Clock size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" component="h2">
                  {t(`today's_hourly_sales`)}
                </Typography>
              </Box>
              <Box sx={{ height: 360 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlySalesData}>
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
                    <Bar
                      dataKey="sales"
                      fill="#2196F3"
                      barSize={30}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
        
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
    
            <CardContent className="top-categories">
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Layers size={24} style={{ marginRight: 8 }} />
                <Typography variant="h6" component="h2">
                  {t(`top_categories`)}
                </Typography>
              </Box>

              {topCategoriesData.length > 0 ? (
                <>
                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        innerRadius="30%"
                        outerRadius="100%"
                        data={topCategoriesData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <RadialBar
                          minAngle={15}
                          label={{
                            position: "insideStart",
                            fill: "#fff",
                            fontSize: 12,
                          }}
                          background
                          dataKey="totalProduct"
                        />
                        {/* <Legend
                          iconSize={10}
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                        /> */}
                        <Tooltip />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </Box>

                  <List dense sx={{ mt: 2, maxHeight: 150, overflowY: "hidden" }}>
                    {topCategoriesData.map((cat, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{ bgcolor: cat.fill, width: 24, height: 24 }}
                          >
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText secondary={ cat.name} />
                        <ListItemText
                          primary={cat.product}
                          secondary={`Total Products: ${cat.totalProduct}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 2 }}
                >
                  No category data available
                </Typography>
              )}
            </CardContent>
   
        </Grid>

        <Grid size={{ xs: 12 }}>
     
            <CardContent className="top-product" >
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
                      <Box
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                        className="top-product-card"
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
                          #{index + 1}
                        </Typography>
                      </Box>
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
      
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
