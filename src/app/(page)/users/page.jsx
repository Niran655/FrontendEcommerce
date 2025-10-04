"use client";
import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Box, Alert, Typography } from "@mui/material";
import { useAuth } from "@/app/context/AuthContext";
import { translateLauguage } from "@/app/function/translate";
import CircularIndeterminate from "@/app/function/loading/Loading";

import {
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
  CREATE_SHOP,
} from "../../../../graphql/mutation";
import { GET_USERS, GET_SHOPS } from "../../../../graphql/queries";

import UserStatistics from "../../components/Admin/User/UserStatistics";
import SearchAndFilter from "../../components/Admin/User/SearchAndFilter";
import UserTable from "../../components/Admin/User/UserTable";
import UserFormDialog from "../../components/Admin/User/UserFormDialog";
import ShopFormDialog from "../../components/Admin/User/ShopFormDialog";

const roles = ["Admin", "Manager", "Cashier", "StockKeeper","Seller", "User", "Shop"];

const UserManagement = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shopDialogOpen, setShopDialogOpen] = useState(false);
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

  const [createShop] = useMutation(CREATE_SHOP, {
    onCompleted: () => {
      setShopDialogOpen(false);
      shopFormik.resetForm();
    },
    onError: (error) => alert(`Error creating shop: ${error.message}`),
  });

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

  // User Formik
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

  // Shop Validation Schema
  const shopValidationSchema = Yup.object().shape({
    shopName: Yup.string()
      .required("Shop name is required")
      .min(2, "Shop name must be at least 2 characters"),
    enName: Yup.string()
      .required("English name is required")
      .min(2, "English name must be at least 2 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    image: Yup.string()
      .url("Must be a valid URL")
      .required("Image URL is required"),
    typeId: Yup.string().required("Shop type is required"),
    owner: Yup.string().required("Owner is required"),
  });

  // Shop Formik
  const shopFormik = useFormik({
    initialValues: {
      shopName: "",
      enName: "",
      description: "",
      image: "",
      typeId: "",
      owner: "",
      slug: null,
      code: null,
    },
    validationSchema: shopValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createShop({
          variables: {
            input: {
              shopName: values.shopName,
              enName: values.enName,
              description: values.description,
              image: values.image,
              typeId: values.typeId,
              owner: values.owner,
              slug: values.slug,
              code: values.code,
            },
          },
        });
      } catch (error) {
        console.error("Error creating shop:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const users = data?.users || [];
  const shops = shopData?.getShops || [];
  const shopLength = shops?.length;

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Event handlers
  const handleCreateUser = () => {
    setEditingUser(null);
    formik.resetForm();
    formik.setFieldValue("isEditing", false);
    formik.setFieldValue("role", "Cashier");
    formik.setFieldValue("active", true);
    setDialogOpen(true);
  };

  const handleCreateShop = () => {
    shopFormik.resetForm();
    setShopDialogOpen(true);
  };

  const handleCreateShopForUser = (user) => {
    setEditingUser(user);
    shopFormik.setFieldValue("owner", user.id);
    setShopDialogOpen(true);
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

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleRoleFilterChange = (e) => setRoleFilter(e.target.value);
  const handleTogglePassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleCloseUserDialog = () => {
    setDialogOpen(false);
    formik.resetForm();
  };

  const handleCloseShopDialog = () => {
    setShopDialogOpen(false);
    shopFormik.resetForm();
  };

  if (error) {
    return <Alert severity="error">Error loading users: {error.message}</Alert>;
  }

  return (
    <Box>
      <UserStatistics users={users} shopLength={shopLength} />

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilterChange}
        filteredUsersCount={filteredUsers.length}
        onCreateShop={handleCreateShop}
        onCreateUser={handleCreateUser}
        t={t}
      />

      <UserTable
        users={filteredUsers}
        loading={loading}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onCreateShopForUser={handleCreateShopForUser}
        t={t}
      />

      <UserFormDialog
        open={dialogOpen}
        onClose={handleCloseUserDialog}
        editingUser={editingUser}
        formik={formik}
        showPassword={showPassword}
        onTogglePassword={handleTogglePassword}
        onMouseDownPassword={handleMouseDownPassword}
        t={t}
      />

      <ShopFormDialog
        open={shopDialogOpen}
        onClose={handleCloseShopDialog}
        shopFormik={shopFormik}
        users={users}
        t={t}
      />
    </Box>
  );
};

export default UserManagement;