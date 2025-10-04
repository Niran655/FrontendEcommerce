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
  Stack,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Settings, Search, SquarePlus, ListX, Package } from "lucide-react";
import FooterPagination from "@/app/include/FooterPagination";
const StockAdjustmentTable = ({ 
  products, 
  keyword, 
  onKeywordChange, 
  onAdjustStock, 
  paginator, 
  page, 
  limit, 
  onPageChange, 
  onLimitChange,
  t 
}) => {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", mb: 3 }}
        >
          <Settings size={24} style={{ marginRight: 8 }} />
          {t(`stock_adjust`)}
        </Typography>
        <Stack direction={"row"}>
          <Box>
            <Typography>Search</Typography>
            <TextField
              placeholder="Search products..."
              size="small"
              value={keyword}
              onChange={onKeywordChange}
              InputProps={{
                startAdornment: (
                  <Search
                    size={20}
                    style={{ marginRight: 8, color: "#666" }}
                  />
                ),
              }}
              sx={{ mb: 3 }}
            />
          </Box>
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t(`product`)}</TableCell>
                <TableCell>{t(`sku`)}</TableCell>
                <TableCell>{t(`category`)}</TableCell>
                <TableCell>{t(`current_stock`)}</TableCell>
                <TableCell>{t(`min_stock`)}</TableCell>
                <TableCell>{t(`status`)}</TableCell>
                <TableCell>{t(`action`)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={product.image}
                        sx={{ width: 40, height: 40, mr: 2 }}
                      >
                        <Package size={20} />
                      </Avatar>
                      {product.name}
                    </Box>
                  </TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.category}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {product.stock}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.minStock}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.lowStock ? "Low Stock" : "In Stock"}
                      color={product.lowStock ? "error" : "success"}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Add Stock">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => {
                            onAdjustStock(product);
                          }}
                        >
                          <SquarePlus size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove Stock">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            onAdjustStock(product);
                          }}
                        >
                          <ListX size={20} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Custom Adjustment">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onAdjustStock(product)}
                        >
                          <Settings size={20} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
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
    </Card>
  );
};

export default StockAdjustmentTable;