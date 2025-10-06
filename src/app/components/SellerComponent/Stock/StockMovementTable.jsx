"use client";
import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Avatar,
  Chip,
} from "@mui/material";

import {
  TrendingUp,
  TrendingDown,
  Settings,
  Package,
  FileText,
  PackageOpen 
} from 'lucide-react';
const StockMovementTable = ({ stockMovements, t }) => {
  const getMovementTypeIcon = (type) => {
    switch (type) {
      case "in":
        return <TrendingUp size={20} color="#4caf50" />;
      case "out":
        return <TrendingDown size={20} color="#f44336" />;
      case "adjustment":
        return <Settings size={20} color="#ff9800" />;
      default:
        return <Package size={20} />;
    }
  };

  const getMovementTypeColor = (type) => {
    switch (type) {
      case "in":
        return "success";
      case "out":
        return "error";
      case "adjustment":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", mb: 3 }}
        >
          <PackageOpen size={24} style={{ marginRight: 8,color:'#2984D1' }} />
          {t(`recent_stock`)}
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t(`date_time`)}</TableCell>
                <TableCell>{t(`product`)}</TableCell>
                <TableCell>{t(`type`)}</TableCell>
                <TableCell>{t(`qty`)}</TableCell>
                <TableCell>{t(`reason`)}</TableCell>
                <TableCell>{t(`reference`)}</TableCell>
                <TableCell>{t(`user`)}</TableCell>
                <TableCell>{t(`stock_change`)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockMovements.slice(0, 20).map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    {new Date(movement.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                        <Package size={16} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
              
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                       
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getMovementTypeIcon(movement.type)}
                      label={movement.type.toUpperCase()}
                      color={getMovementTypeColor(movement.type)}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {movement.type === "out" ? "-" : "+"}
                      {movement.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>{movement.reason}</TableCell>
                  <TableCell>
                    {movement.reference && (
                      <Chip
                        label={movement.reference}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>{movement.user.name}</TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {movement.previousStock} → {movement.newStock}
                    </Typography>
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

export default StockMovementTable;