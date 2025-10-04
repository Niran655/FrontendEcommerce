"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LogIn } from "lucide-react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { LOGIN_MUTATION } from "../../../../graphql/mutation";
import { useAuth } from "../../context/AuthContext";

const testAccounts = [
  { email: "admin@coffee.com", password: "admin123", role: "Admin" },
  { email: "manager@coffee.com", password: "manager123", role: "Manager" },
  { email: "cashier@coffee.com", password: "cashier123", role: "Cashier" },
  { email: "stock@coffee.com", password: "stock123", role: "StockKeeper" },
  { email: "user@coffee.com", password: "user123", role: "User" },
];

const getRoleColor = (role) => {
  const colors = {
    Admin: "error",
    Manager: "warning",
    Cashier: "info",
    StockKeeper: "success",
  };
  return colors[role] || "default";
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      const token = data?.login?.token;
      const checkUser = data?.login.user.role;

      try {
        if (token) {
          localStorage.setItem("token", token);
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        }
      } catch (e) {
        console.error("Failed to persist session cookie", e);
      }

      login(data.login.user, token);
      router.push(checkUser !== "Seller" ? "/dashboard" : "/storeLogin");
    },
    onError: (err) => {
      const gqlMessage =
        err?.graphQLErrors?.[0]?.message ||
        err?.message ||
        "An error occurred while signing in";
      setError(gqlMessage);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    await loginMutation({ variables: { email, password } });
  };

  const handleQuickLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    loginMutation({ variables: { email: account.email, password: account.password } });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
                width: 64,
                height: 64,
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Ecommerce
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={<LogIn size={20} />}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;

