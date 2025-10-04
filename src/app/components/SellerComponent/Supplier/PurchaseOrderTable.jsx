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
import {
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
} from "lucide-react";

import {
  RECEIVE_PURCHASE_ORDER,
  UPDATE_PURCHASE_ORDER_STATUS,
} from "../../../../../graphql/mutation";

const PurchaseOrderTable = ({ purchaseOrders, refetchPOs,t }) => {
  const [receivePurchaseOrder] = useMutation(RECEIVE_PURCHASE_ORDER, {
    onCompleted: () => {
      refetchPOs();
      alert("Purchase order received successfully!");
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

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
      alert("Purchase order updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Something went wrong.");
    }
  };

  const handleReceivePO = async (poId) => {
    if (
      window.confirm(
        "Mark this purchase order as received? This will update stock levels."
      )
    ) {
      await receivePurchaseOrder({ variables: { id: poId } });
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
            <TableBody>
              {purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {po.poNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>{po.supplier.name}</TableCell>
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
                        <Typography variant="subtitle1">
                          {po.name}
                        </Typography>
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
                            <MenuItem value="received">Received</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderTable;