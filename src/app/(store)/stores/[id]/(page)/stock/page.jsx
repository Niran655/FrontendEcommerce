"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useParams } from "next/navigation";

import { useAuth } from "@/app/context/AuthContext";
import { translateLauguage } from "@/app/function/translate";
import FooterPagination from "@/app/include/FooterPagination";
import {
  GET_STOCK_MOVEMENTS_FOR_SHOP,
  GET_LOW_STOCK_PRODUCTS_FOR_SHOP,
  GET_PRODUCT_FOR_SHOP_WITH_PAGNATION,
} from "../../../../../../../graphql/queries";

import { ADJUST_STOCK } from "../../../../../../../graphql/mutation";
import StockMovementTable from "../../../../../components/SellerComponent/Stock/StockMovementTable";
import LowStockAlerts from "../../../../../components/SellerComponent/Stock/LowStockAlerts";
import StockAdjustmentTable from "../../../../../components/SellerComponent/Stock/StockAdjustmentTable";
import StockAdjustmentDialog from "../../../../../components/SellerComponent/Stock/StockAdjustmentDialog";

const StockManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const { id } = useParams();

  const {
    data: stockData,
    loading: stockLoading,
    refetch: refetchStock,
  } = useQuery(GET_STOCK_MOVEMENTS_FOR_SHOP, {
    variables: { shopId: id },
  });

  const {
    data: lowStockData,
    loading: lowStockLoading,
    refetch: refetchLowStock,
  } = useQuery(GET_LOW_STOCK_PRODUCTS_FOR_SHOP, {
    variables: { shopId: id },
  });

  const { data: productsData, loading: productsLoading } = useQuery(
    GET_PRODUCT_FOR_SHOP_WITH_PAGNATION,
    {
      variables: {
        page: page,
        limit: limit,
        pagination: true,
        keyword: keyword,
        shopId: id,
      },
    }
  );

  const [adjustStock] = useMutation(ADJUST_STOCK, {
    onCompleted: () => {
      setAdjustDialogOpen(false);
      setSelectedProduct(null);
      refetchStock();
      refetchLowStock();
    },
    onError: (error) => alert(`Error: ${error.message}`),
  });

  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    setAdjustDialogOpen(true);
  };

  const handleSubmitAdjustment = async (adjustmentData) => {
    try {
      await adjustStock({
        variables: adjustmentData,
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleLimit = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCloseDialog = () => {
    setAdjustDialogOpen(false);
    setSelectedProduct(null);
  };

  const paginator = productsData?.getProductForShopWithPagination?.paginator;
  const products = productsData?.getProductForShopWithPagination?.data ?? [];
  const lowStockProducts = lowStockData?.getLowStockProductByShop || [];
  const stockMovements = stockData?.getStockMovementsByShop || [];

  if (stockLoading || lowStockLoading || productsLoading) {
    return <Typography>Loading stock data...</Typography>;
  }

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: 600 }}
      >
        {t(`stock_management`)}
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab
          label={t(`stock_momvements`)}
          sx={{ textTransform: "capitalize" }}
        />
        <Tab label={t(`low_stock`)} sx={{ textTransform: "capitalize" }} />
        <Tab label={t(`stock_adjust`)} sx={{ textTransform: "capitalize" }} />
      </Tabs>

      {activeTab === 0 && (
        <StockMovementTable 
          stockMovements={stockMovements} 
          t={t} 
        />
      )}

      {activeTab === 1 && (
        <LowStockAlerts 
          lowStockProducts={lowStockProducts}
          onAdjustStock={handleAdjustStock}
          t={t}
        />
      )}

      {activeTab === 2 && (
        <StockAdjustmentTable
          products={products}
          keyword={keyword}
          onKeywordChange={handleKeywordChange}
          onAdjustStock={handleAdjustStock}
          paginator={paginator}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimit}
          t={t}
        />
      )}

      <StockAdjustmentDialog
        open={adjustDialogOpen}
        onClose={handleCloseDialog}
        t={t}
        selectedProduct={selectedProduct}
        onAdjustStock={handleSubmitAdjustment}
      />
    </Box>
  );
};

export default StockManagement;