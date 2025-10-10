"use client";
import {
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Avatar,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Edit,
  Trash2,
  UserCheck,
  UserX,
  MoreVertical,
  Store,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import CircularIndeterminate from "@/app/function/loading/Loading";
import { GET_MY_SHOPS } from "../../../../../graphql/queries";
import { useQuery } from "@apollo/client/react";
import EmptyData from "@/app/function/EmptyData/EmptyData";

const UserTable = ({
  users,
  loading,
  onEditUser,
  onDeleteUser,
  onCreateShopForUser,
  onDeleteShop,
  t,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openRow, setOpenRow] = useState(null);
  const [getUserId, setGetUserId] = useState([]);
  const {
    data,
    refetch,
    loading: shopLoading,
  } = useQuery(GET_MY_SHOPS, {
    variables: {
      getShopsByOwnerIdId: getUserId,
    },
  });

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

  const shopData = data?.getShopsByOwnerId || [];
  console.log("shopData", shopData);

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleCreateShop = () => {
    if (selectedUser) {
      onCreateShopForUser(selectedUser);
      handleMenuClose();
    }
  };

  const toggleRow = (userId) => {
    setOpenRow(openRow === userId ? null : userId);
    setGetUserId(userId);
  };

  return (
    <Card>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="siemreap-regular">{t("user")}</TableCell>
                <TableCell>{t("email")}</TableCell>
                <TableCell>{t("role")}</TableCell>
                <TableCell>{t("status")}</TableCell>
                <TableCell>{t("last_login")}</TableCell>
                <TableCell>{t("create")}</TableCell>
                <TableCell>{t("action")}</TableCell>
              </TableRow>
            </TableHead>

            {loading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularIndeterminate />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {users.map((user) => (
                  <>
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
                              onClick={() => onEditUser(user)}
                              color="primary"
                            >
                              <Edit size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t("delete_user")}>
                            <IconButton
                              size="small"
                              onClick={() => onDeleteUser(user.id)}
                              color="error"
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="More actions">
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, user)}
                              color="default"
                            >
                              <MoreVertical size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Show Shops">
                            <IconButton
                              size="small"
                              onClick={() => toggleRow(user.id)}
                              color="secondary"
                            >
                              {openRow === user.id ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={7}
                      >
                        <Collapse
                          in={openRow === user.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ margin: 1 }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>{t("shop_name")}</TableCell>
                                  <TableCell>{t("location")}</TableCell>
                                  <TableCell>{t("created_at")}</TableCell>
                                  <TableCell>{t(`action`)}</TableCell>
                                </TableRow>
                              </TableHead>
                              {shopLoading ? (
                                <CircularIndeterminate />
                              ) : shopData?.length == 0 ? (
                                <EmptyData />
                              ) : (
                                shopData.map((shop) => (
                                  <TableBody>
                                    <TableRow key={shop.id}>
                                      <TableCell>{shop.shopName}</TableCell>
                                      <TableCell>
                                        {shop.location || "-"}
                                      </TableCell>
                                      <TableCell>
                                        {new Date(
                                          shop.createdAt
                                        ).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell>
                                        <Tooltip title={t("delete_shop")}>
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              onDeleteShop(shop.id)
                                            }
                                            color="error"
                                          >
                                            <Trash2 size={16} />
                                          </IconButton>
                                        </Tooltip>
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                ))
                              )}
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleCreateShop}>
            <Store size={16} style={{ marginRight: 8 }} />
            {t("create_shop")} {selectedUser?.name}
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <MapPin size={16} style={{ marginRight: 8 }} />
            {t("view_shops")}
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default UserTable;
