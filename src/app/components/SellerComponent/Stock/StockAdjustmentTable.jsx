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
import {
  Settings,
  Search,
  SquarePlus,
  ListX,
  Package,
  PackagePlus,
} from "lucide-react";
import DoneIcon from "@mui/icons-material/Done";
import FooterPagination from "@/app/include/FooterPagination";
import "../../../../../style/StockStyle.scss";
import CircularIndeterminate from "@/app/function/loading/Loading";
import EmptyData from "@/app/function/EmptyData/EmptyData";
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
  productsLoading,
  t,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", mb: 3 }}
        >
          <Settings color="#F54927" size={24} style={{ marginRight: 8 }} />
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
                  <Search size={20} style={{ marginRight: 8, color: "#666" }} />
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
            {
              productsLoading? (
                <CircularIndeterminate/>
              ):products.length == 0?(
                <EmptyData/>
              ):(
                
              products?.map((product) => (
                   <TableBody>
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
                      color="error"
                      deleteIcon={<DoneIcon />}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight="medium">{product.stock}</Typography>
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
                          onClick={() => {
                            onAdjustStock(product);
                          }}
                        >
                          <PackagePlus className="add-icon" size={25} />
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
                          <ListX size={25} className="sub-icon" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Custom Adjustment">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onAdjustStock(product)}
                        >
                          <Settings className="setting-icon" size={25} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
                 </TableBody>
              ))
           
              )
            }
         
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
