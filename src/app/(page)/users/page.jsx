"use client";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Edit,
  Key,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCheck,
  Users,
  UserRoundPen,
  Store,
  UserX,
  User,
  UserCog,
  UserStar,
} from "lucide-react";
import React, { useState } from "react";
import "../../../../style/User.css";
import {
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
} from "../../../../graphql/mutation";
import { GET_USERS } from "../../../../graphql/queries";
import CircularIndeterminate from "@/app/components/loading/Loading";

const roles = ["Admin", "Manager", "Cashier", "StockKeeper", "User", "Shop"];

const initialUserForm = {
  name: "",
  email: "",
  password: "",
  role: "Cashier",
  active: true,
};

const UserManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState(initialUserForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const { data, loading, error, refetch } = useQuery(GET_USERS);

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setDialogOpen(false);
      setUserForm(initialUserForm);
      setEditingUser(null);
      refetch();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setDialogOpen(false);
      setUserForm(initialUserForm);
      setEditingUser(null);
      refetch();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => refetch(),
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const users = data?.users || [];

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = () => {
    setEditingUser(null);
    setUserForm(initialUserForm);
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "", // Don't pre-fill password for security
      role: user.role,
      active: user.active,
    });
    setDialogOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      await deleteUser({ variables: { id: userId } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const input = {
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      active: userForm.active,
      ...(userForm.password && { password: userForm.password }),
    };

    if (editingUser) {
      await updateUser({ variables: { id: editingUser.id, input } });
    } else {
      if (!userForm.password) {
        alert("Password is required for new users");
        return;
      }
      input.password = userForm.password;
      await createUser({ variables: { input } });
    }
  };

  const handleInputChange = (field, value) => {
    setUserForm((prev) => ({ ...prev, [field]: value }));
  };

  const getRoleColor = (role) => {
    const colors = {
      Admin: "error",
      Manager: "warning",
      Cashier: "info",
      StockKeeper: "success",
      User: "blue",
      Shop: "red",
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

  // if (loading) return <Typography>Loading users...</Typography>;
  if (error)
    return <Alert severity="error">Error loading users: {error.message}</Alert>;

  return (
    <Box>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={handleCreateUser}
        >
          Add User
        </Button>
      </Box> */}

      {/* User Statistics */}
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
                        {count}
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

      {/* Search and Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchTerm}
              size="small"
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search size={20} style={{ marginRight: 8, color: "#666" }} />
                ),
              }}
            />
          </Grid>

          {/* Filter */}
          <Grid xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                size="small"
                label="Filter by Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="All">All Roles</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Spacer pushes next items right */}
          <Grid item sx={{ ml: "auto", display: "flex", gap: 2 }}>
            <Chip
              label={`${filteredUsers.length} users`}
              color="primary"
              variant="outlined"
            />
            <Button
              variant="contained"
              startIcon={<Plus size={20} />}
              onClick={handleCreateUser}
            >
              Add User
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              {
                loading?(
                  <CircularIndeterminate/>
                ):(
 <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            mr: 2,
                            bgcolor: `${getRoleColor(user.role)}.main`,
                          }}
                        >
                          {user.name[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {user.name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        // icon={getRoleIcon(user.role)}
                        label={user.role}
                        color={getRoleColor(user.role)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          user.active ? (
                            <UserCheck size={16} />
                          ) : (
                            <UserX size={16} />
                          )
                        }
                        label={user.active ? "Active" : "Inactive"}
                        color={user.active ? "success" : "error"}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString()
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit User">
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                            color="primary"
                          >
                            <Edit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user.id)}
                            color="error"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
                )
              }
             
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Users size={24} style={{ marginRight: 8 }} />
              {editingUser ? "Edit User" : "Create New User"}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={userForm.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={
                    editingUser
                      ? "New Password (leave blank to keep current)"
                      : "Password"
                  }
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required={!editingUser}
                  helperText={
                    editingUser
                      ? "Only enter if you want to change the password"
                      : ""
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={userForm.role}
                    label="Role"
                    onChange={(e) => handleInputChange("role", e.target.value)}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {getRoleIcon(role)}
                          <Typography sx={{ ml: 1 }}>{role}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userForm.active}
                      onChange={(e) =>
                        handleInputChange("active", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Active User"
                />
              </Grid>
            </Grid>

            {/* Role Permissions Info */}
            <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Role Permissions:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Admin:</strong> Full system access including user
                management
                <br />
                <strong>Manager:</strong> All operations except user management
                <br />
                <strong>Cashier:</strong> POS operations and basic reporting
                <br />
                <strong>StockKeeper:</strong> Inventory and supplier management
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingUser ? "Update User" : "Create User"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
