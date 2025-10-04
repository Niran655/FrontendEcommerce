import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClearIcon from "@mui/icons-material/Clear";
import SendIcon from "@mui/icons-material/Send";
import { useQuery } from "@apollo/client/react";
import { useParams, useRouter } from "next/navigation";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Grid, IconButton, InputAdornment, ListItemIcon, ListItemText, MenuItem, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { User } from "lucide-react";
import PropTypes from "prop-types";
import * as React from "react";

import "../../../../../../style/Notification.scss";
import { GET_ORDER_COMPLETED } from "../../../../../../graphql/queries";
import { useAuth } from "@/app/context/AuthContext";
import { translateLauguage } from "@/app/function/translate";
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function NotificationAccordions({ orders = [] }) {
  const router = useRouter();
  const [expanded, setExpanded] = React.useState(false);
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const { id } = useParams();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleAddToCart = (
    productItemsWithTotal,
    customer,
    deliveryAddress,
    orderId
  ) => {
    const existingData = JSON.parse(localStorage.getItem("productsToAdd")) || {
      products: [],
    };

    const productDataArray = productItemsWithTotal.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.price,
      discount: item.product.discount || [],
      image:
        item.product.image ||
        "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
      stock: item.product.stock,
      category: item.product.category,
      quantity: item.quantity,
      total: item.total,
    }));

    const orderData = {
      products: [...(existingData.products || []), ...productDataArray],
      customer: customer,
      deliveryAddress: deliveryAddress,
      orderId: orderId,
      timestamp: new Date().toISOString(),
    };

    console.log("Saving to localStorage:", orderData);

    localStorage.setItem("productsToAdd", JSON.stringify(orderData));

    if (window.location.pathname === `/stores/${id}/pos`) {
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } else {
      router.push(`/stores/${id}/pos`);
    }
  };

  return (
    <Box padding={0}>
      {orders.length > 0 ? (
        orders.map((order, index) => {
          const panelId = `panel${index}`;

          const productItemsWithTotal = order.items.map((item) => ({
            ...item,
          }));
          const orderId = order.id;

          return (
            <Accordion
              key={order.id}
              expanded={expanded === panelId}
              onChange={handleChange(panelId)}
              sx={{ boxShadow: "none" }}
            >
              <Box className="customer-box" mb={1}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`${panelId}-content`}
                  id={`${panelId}-header`}
                >
                  <Grid container>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{flexShrink: 0 }}>
                        {order.customer.firstName} {order.customer.lastName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Typography sx={{ color: "text.secondary" }}>
                        {order.customer.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>
              </Box>

              <AccordionDetails>
                <Box className="product-box">
                  <Grid container mb={1}>
                    <Grid item size={{ xs: 4 }}>
                      {t(`product`)}
                    </Grid>
                    <Grid item size={{ xs: 2 }}>
                      {t(`qty`)}
                    </Grid>
                    <Grid item size={{ xs: 3 }}>
                      {t(`price`)}
                    </Grid>
                    <Grid size={{ xs: 3 }}>{t(`total`)}</Grid>
                  </Grid>
                  <Divider />

                  {productItemsWithTotal.map((items, i) => (
                    <Grid container mt={1} key={i}>
                      <Grid item size={{ xs: 4 }}>
                        {items.product.name}
                      </Grid>
                      <Grid size={{ xs: 2 }}>{items.quantity}</Grid>
                      <Grid size={{ xs: 3 }}>{items.price}</Grid>
                      <Grid size={{ xs: 3 }}>{items.total}</Grid>
                    </Grid>
                  ))}
                </Box>
                <Grid className="activities" container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Stack>
                      <TextField
                        size="small"
                        placeholder="Search..."
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton edge="end">
                                <SendIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Stack direction="row" spacing={2}>
                      <Button variant="outlined" size="small" color="error">
                        Reject
                      </Button>
                      <Button
                        onClick={() =>
                          handleAddToCart(
                            productItemsWithTotal,
                            order.customer,
                            order.deliveryAddress,
                            orderId
                          )
                        }
                        variant="outlined"
                        size="small"
                      >
                        Accept
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })
      ) : (
        <Typography>No new notifications</Typography>
      )}
    </Box>
  );
}

export default function NotificationDashboard({ orders = [], onClose }) {
  const [value, setValue] = React.useState(0);
  const { language } = useAuth();
  const { t } = translateLauguage(language);
  const { id } = useParams();
  const { data, refetch, loading, error } = useQuery(GET_ORDER_COMPLETED, {
    variables: {
      shopId: id,
      status: "COMPLETED" || [],
    },
  });
  const orderCompleted = data?.getOrderComplete || [];
  console.log("orderCompleted", orderCompleted);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="notification tabs"
        >
          <Tab label={`${t(`new_notification`)}`} {...a11yProps(0)} />
          <Tab label={`${t(`complete`)}`} {...a11yProps(1)} />
        </Tabs>
        <IconButton color="error" onClick={onClose}>
          <ClearIcon />
        </IconButton>
      </Box>

      <CustomTabPanel value={value} index={1}>
        <Box>
          {orderCompleted.length > 0 ? (
            orderCompleted.map((order) => (
              <MenuItem className="notification-menu" key={order.id}>
                <ListItemIcon>
                  <User size={18} />
                </ListItemIcon>
                <ListItemText
                  primary={`${order.customer.firstName} ${order.customer.lastName}`}
                  secondary={order.customer.email}
                />
              </MenuItem>
            ))
          ) : (
            <MenuItem>
              <ListItemIcon>
                <User size={18} />
              </ListItemIcon>
              <ListItemText primary="No new notifications" />
            </MenuItem>
          )}
        </Box>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={0}>
        <NotificationAccordions orders={orders} />
      </CustomTabPanel>
    </Box>
  );
}
