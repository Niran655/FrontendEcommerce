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
  InputAdornment,
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
  FormHelperText,
} from "@mui/material";
import {
  Edit,
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
import { GET_USERS, GET_SHOPS } from "../../../../graphql/queries";
import CircularIndeterminate from "@/app/function/loading/Loading";
import { useAuth } from "@/app/context/AuthContext";
import { translateLauguage } from "@/app/function/translate";
import { DiamondPlus } from "lucide-react";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const roles = ["Admin", "Manager", "Cashier", "StockKeeper", "User", "Shop"];

const UserManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showPassword, setShowPassword] = useState(false);

  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const { data: shopData, loading: shopLoading } = useQuery(GET_SHOPS);

  const [createUser] = useMutation(CREATE_USER, {
    onCompleted: () => {
      setDialogOpen(false);
      formik.resetForm();
      setEditingUser(null);
      refetch();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setDialogOpen(false);
      formik.resetForm();
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
  const shops = shopData?.getShops || [];
  const shopLength = shops?.length;

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required(`${t("required")}`)
      .min(2, "Name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required(`${t("required")}`),
    password: Yup.string().when("isEditing", {
      is: false,
      then: (schema) =>
        schema
          .required(`${t("required")}`)
          .min(8, "Password must be at least 8 characters")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
          ),
      otherwise: (schema) =>
        schema
          .notRequired()
          .min(8, "Password must be at least 8 characters")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
          ),
    }),
    role: Yup.string().required(`${t("required")}`),
    active: Yup.boolean(),
  });

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "Cashier",
      active: true,
      isEditing: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const input = {
          name: values.name,
          email: values.email,
          role: values.role,
          active: values.active,
          ...(values.password && { password: values.password }),
        };

        if (editingUser) {
          await updateUser({ variables: { id: editingUser.id, input } });
        } else {
          await createUser({ variables: { input } });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setSubmitting(false);
      }
    },
    enableReinitialize: true,
  });

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
    formik.resetForm();
    formik.setFieldValue("isEditing", false);
    formik.setFieldValue("role", "Cashier");
    formik.setFieldValue("active", true);
    setDialogOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    formik.setValues({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      active: user.active,
      isEditing: true,
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

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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

  if (error)
    return <Alert severity="error">Error loading users: {error.message}</Alert>;

  return (
    <Box>
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
                        {count || shopLength}
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
          <Grid item xs={12} md={3}>
            <Typography>{t(`search`)}</Typography>
            <TextField
              fullWidth
              placeholder={t(`search`)}
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
          <Grid item xs={12} md={3}>
            <Typography>{t(`filter_by_role`)}</Typography>
            <FormControl fullWidth>
              <Select
                value={roleFilter}
                size="small"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="All">{t(`all_role`)}</MenuItem>
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
              label={`${filteredUsers.length} ${t("user")}`}
              color="primary"
              variant="outlined"
            />
            <Button
              variant="contained"
              startIcon={<DiamondPlus size={20} />}
              onClick={handleCreateUser}
            >
              {t(`create`)}
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
                  <TableCell className="siemreap-regular">
                    {t(`user`)}
                  </TableCell>
                  <TableCell>{t(`email`)}</TableCell>
                  <TableCell>{t(`role`)}</TableCell>
                  <TableCell>{t(`status`)}</TableCell>
                  <TableCell>{t(`last_login`)}</TableCell>
                  <TableCell>{t(`create`)}</TableCell>
                  <TableCell>{t(`action`)}</TableCell>
                </TableRow>
              </TableHead>
              {loading ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7}>
                      <CircularIndeterminate />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
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
                          label={user.active ? t("active") : t("inactive")}
                          color={user.active ? "success" : "error"}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : t("never")}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title={t("edit_user")}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditUser(user)}
                              color="primary"
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t("delete_user")}>
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
              )}
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          formik.resetForm();
        }}
        maxWidth="sm"
        fullWidth
      >
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Users size={24} style={{ marginRight: 8 }} />
                {editingUser ? t("edit_user") : t("create_new_user")}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label={t("full_name")}
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    required
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <TextField
                    fullWidth
                    label={t("email")}
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    required
                  />
                </Grid>
                <Grid size={{xs:12}}>
                  <FormControl
                    fullWidth
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                  >
                    <TextField
                      fullWidth
                      label={
                        editingUser
                          ? t("new_password_placeholder")
                          : t("password")
                      }
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      required={!editingUser}
                      helperText={
                        editingUser ? t("password_change_helper") : ""
                      }
                    />
                    {formik.touched.password && formik.errors.password && (
                      <FormHelperText>{formik.errors.password}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <FormControl
                    fullWidth
                    required
                    error={formik.touched.role && Boolean(formik.errors.role)}
                  >
                    <InputLabel>{t("role")}</InputLabel>
                    <Select
                      name="role"
                      value={formik.values.role}
                      label={t("role")}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role} value={role}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography sx={{ ml: 1 }}>{role}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.role && formik.errors.role && (
                      <FormHelperText>{formik.errors.role}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{xs:12,md:6}}>
                  <FormControlLabel
                    control={
                      <Switch
                        name="active"
                        checked={formik.values.active}
                        onChange={formik.handleChange}
                        color="primary"
                      />
                    }
                    label={t("active_user")}
                  />
                </Grid>
              </Grid>


              
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => {
                  setDialogOpen(false);
                  formik.resetForm();
                }}
                disabled={formik.isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {formik.isSubmitting
                  ? t("loading")
                  : editingUser
                  ? t("update_user")
                  : t("create_user")}
              </Button>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
