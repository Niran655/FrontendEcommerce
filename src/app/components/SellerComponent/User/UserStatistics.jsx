"use client";
import { Grid, Card, CardContent, Box, Typography } from "@mui/material";
import {
  Shield,
  UserCog,
  UserStar,
  UserRoundPen,
  User,
  Store,
  Users,
} from "lucide-react";
import "../../../../../style/User.css";
const roles = ["Admin", "Manager", "Cashier", "StockKeeper", "User", "Shop"];

const UserStatistics = ({ users, shopLength }) => {
  const getRoleColor = (role) => {
    const colors = {
      Admin: "error",
      Manager: "warning",
      Cashier: "info",
      StockKeeper: "success",
      User: "primary",
      Shop: "secondary",
    };
    return colors[role] || "default";
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Shield size={36} color="white" />;
      case "Manager":
        return <UserCog size={36} color="white" />;
      case "Cashier":
        return <UserStar size={36} color="white" />;
      case "StockKeeper":
        return <UserRoundPen size={36} color="white" />;
      case "User":
        return <User size={36} color="white" />;
      case "Shop":
        return <Store size={36} color="white" />;
      default:
        return <Users size={36} color="white" />;
    }
  };

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {roles.map((role) => {
        const count = users.filter((user) => user.role === role).length;
        return (
          <Grid size={{ xs: 6, md: 3 }} key={role}>
            <Card class={`box-content-${role}`}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      class={`text-dashboard-card-${role}`}
                      color="text.secondary"
                      gutterBottom
                    >
                      {role}
                    </Typography>
                    <Typography
                      variant="h4"
                      color={`${getRoleColor(role)}.main`}
                    >
                      {role === "Shop" ? shopLength : count}
                    </Typography>
                  </Box>
                  <Box class={`box-icon-${role}`}>{getRoleIcon(role)}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default UserStatistics;
