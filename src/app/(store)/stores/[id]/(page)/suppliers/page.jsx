"use client";
import { useQuery,useMutation } from "@apollo/client/react";
import {
  Box,
  Button,
  Stack,
  Typography,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import { Plus, Truck } from "lucide-react";
import React, { useState } from "react";

import { useAuth } from "@/app/context/AuthContext";
import { useParams } from "next/navigation";
import {
  GET_PRODUCT_FOR_SHOP,
  GET_PURCHASE_ORDERS_FOR_SHOP,
  GET_SUPPLIERS_FOR_SHOP,
} from "../../../../../../../graphql/queries";
import { DELETE_SUPPLIER_FOR_SHOP } from "../../../../../../../graphql/mutation";
import SupplierForm from "../../../../../components/SellerComponent/Supplier/SupplierForm";
import PurchaseOrderForm from "../../../../../components/SellerComponent/Supplier/PurchaseOrderForm";
import SupplierCard from "../../../../../components/SellerComponent/Supplier/SupplierCard";
import PurchaseOrderTable from "../../../../../components/SellerComponent/Supplier/PurchaseOrderTable";
import { translateLauguage } from "@/app/function/translate";

const Suppliers = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [poDialogOpen, setPODialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const { setAlert } = useAuth();
  const { id } = useParams();
  const {language} = useAuth()
  const {t} = translateLauguage(language)
  const {
    data: suppliersData,
    loading: suppliersLoading,
    refetch: refetchSuppliers,
  } = useQuery(GET_SUPPLIERS_FOR_SHOP, {
    variables: { shopId: id },
  });

  const {
    data: poData,
    loading: poLoading,
    refetch: refetchPOs,
  } = useQuery(GET_PURCHASE_ORDERS_FOR_SHOP,{
    variables:{
      shopId:id
    }
  });

  const { data: productsData, loading: productsLoading } =
    useQuery(GET_PRODUCT_FOR_SHOP,{
      variables:{
        shopId:id
      }
    });

  const [deleteSupplierForShop] = useMutation(DELETE_SUPPLIER_FOR_SHOP, {
    onCompleted: ({ deleteSupplierForShop }) => {
      if (deleteSupplierForShop?.isSuccess) {
        setAlert(true, "success", deleteSupplierForShop?.message);
        refetchSuppliers();
      } else {
        setAlert(true, "error", deleteSupplierForShop?.message);
      }
    },
    onError: (err) => {
      console.log("error", err);
    },
  });

  const suppliers = suppliersData?.getSuppliersForShop || [];
  const purchaseOrders = poData?.getPurchaseOrderForShop || [];
  const products = productsData?.getProductsForShop || [];

  const handleCreateSupplier = () => {
    setEditingSupplier(null);
    setSupplierDialogOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setSupplierDialogOpen(true);
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      try {
        await deleteSupplierForShop({ 
          variables: { deleteSupplierForShopId: supplierId } 
        });
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleCreatePO = () => {
    setPODialogOpen(true);
  };

  const handleCloseSupplierDialog = () => {
    setSupplierDialogOpen(false);
    setEditingSupplier(null);
  };

  const handleClosePODialog = () => {
    setPODialogOpen(false);
  };

  if (suppliersLoading || poLoading || productsLoading) {
    return <Typography>Loading suppliers data...</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          {t(`supplier_&_purchase`)}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Truck size={20} />}
            onClick={handleCreateSupplier}
          >
            {t(`create_supplier`)}
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={handleCreatePO}
          >
            {t(`create_purchase`)}
          </Button>
        </Stack>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={`${t(`supplier`)} (${suppliers.length})`} />
        <Tab label={`${t(`purchase_order`)} (${purchaseOrders.length})`} />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {suppliers.map((supplier) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={supplier.id}>
              <SupplierCard 
                supplier={supplier}
                onEdit={handleEditSupplier}
                onDelete={handleDeleteSupplier}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <PurchaseOrderTable 
          purchaseOrders={purchaseOrders}
          refetchPOs={refetchPOs}
          t={t}
          id={id}
        />
      )}

      {/* Forms */}
      <SupplierForm
        open={supplierDialogOpen}
        onClose={handleCloseSupplierDialog}
        editingSupplier={editingSupplier}
        shopId={id}
        t={t}
        refetchSuppliers={refetchSuppliers}
      />

      <PurchaseOrderForm
        open={poDialogOpen}
        onClose={handleClosePODialog}
        suppliers={suppliers}
        products={products}
        shopId={id}
        t={t}
        refetchPOs={refetchPOs}
      />
    </Box>
  );
};

export default Suppliers;