"use client";
import { useMutation } from "@apollo/client/react";
import {
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Box,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { CheckCircle, AlertCircle, Clock, FileText } from "lucide-react";

import {
  RECEIVE_PURCHASE_ORDER_FOR_SHOP,
  UPDATE_PURCHASE_ORDER_STATUS,
} from "../../../../../graphql/mutation";
import { useAuth } from "@/app/context/AuthContext";
import FooterPagination from "@/app/include/FooterPagination";
import CircularIndeterminate from "@/app/function/loading/Loading";
import EmptyData from "@/app/function/EmptyData/EmptyData";

const PurchaseOrderTable = ({
  purchaseOrders,
  refetchPOs,
  t,
  id,
  paginator,
  page,
  limit,
  poLoading,
  onPageChange,
  onLimitChange,
}) => {
  const { setAlert } = useAuth();
  const [receivePurchaseOrderForShop] = useMutation(
    RECEIVE_PURCHASE_ORDER_FOR_SHOP,
    {
      onCompleted: () => {
        refetchPOs();
        alert("Purchase order received successfully!");
      },
      onError: (error) => alert(`Error: ${error.message}`),
    }
  );

  const [updatePurchaseOrderStatus] = useMutation(UPDATE_PURCHASE_ORDER_STATUS);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updatePurchaseOrderStatus({
        variables: {
          updatePurchaseOrderStatusId: id,
          status: status,
        },
      });
      refetchPOs();
      alert(t(`purchase_success`));
    } catch (err) {
      console.error("Update failed:", err);

      alert(t(`something_wrong`));
    }
  };

  const handleReceivePO = async (poId) => {
    if (window.confirm(`${t(`make_purchas_order_received`)}`)) {
      await receivePurchaseOrderForShop({
        variables: { receivePurchaseOrderForShopId: poId, shopId: id },
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "ordered":
        return "info";
      case "received":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "ordered":
        return <FileText size={16} />;
      case "received":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <Card>
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t(`po_number`)}</TableCell>
                <TableCell>{t(`supplier`)}</TableCell>
                <TableCell>{t(`order_date`)}</TableCell>
                <TableCell>{t(`items`)}</TableCell>
                <TableCell>{t(`total`)}</TableCell>
                <TableCell>{t(`status`)}</TableCell>
                <TableCell>{t(`action`)}</TableCell>
              </TableRow>
            </TableHead>
            {
              poLoading?(
                <CircularIndeterminate/>
              ): purchaseOrders?.length == 0 ?
              (
                <EmptyData/>
              ):(
               
              purchaseOrders.map((po) => (
                 <TableBody>
                <TableRow key={po.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {po.poNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>{po.supplier?.name}</TableCell>
                  <TableCell>
                    {new Date(po.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {po.items.length} items
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      ${po.total.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(po.status)}
                      label={po.status.toUpperCase()}
                      color={getStatusColor(po.status)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction={"row"} spacing={2}>
                      {po.status === "ordered" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleReceivePO(po.id)}
                          startIcon={<CheckCircle size={16} />}
                        >
                          Receive
                        </Button>
                      )}
                      {po.status !== "ordered" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          disabled
                          onClick={() => handleReceivePO(po.id)}
                          startIcon={<CheckCircle size={16} />}
                        >
                          Receive
                        </Button>
                      )}
                      <Box key={po.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">{po.name}</Typography>
                        <FormControl size="small" fullWidth>
                          <InputLabel id={`status-label-${po.id}`}>
                            Status
                          </InputLabel>
                          <Select
                            value={po.status}
                            label="Status"
                            labelId={`status-label-${po.id}`}
                            onChange={(e) =>
                              handleStatusUpdate(po.id, e.target.value)
                            }
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="ordered">Ordered</MenuItem>
                            <MenuItem disabled value="received">
                              Received
                            </MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Stack>
                  </TableCell>
                </TableRow>
                  </TableBody>
              ))
          
              )
            }
            
          </Table>

          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ padding: 2 }}
          >
            <FooterPagination
              page={page}
              limit={limit}
              setPage={onPageChange}
              handleLimit={onLimitChange}
              totalDocs={paginator?.totalDocs}
              totalPages={paginator?.totalPages}
            />
          </Stack>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderTable;
