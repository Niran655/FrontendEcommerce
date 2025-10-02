import { Box, ListItemIcon, ListItemText, MenuItem } from "@mui/material";
import { User } from "lucide-react";

export default function NotificationPage({ orders = [] }) {
  return (
    <Box>
      {orders.length > 0 ? (
        orders.map((order) => (
          <MenuItem key={order.id}>
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
  );
}
