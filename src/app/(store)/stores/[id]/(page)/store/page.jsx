"use client";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@apollo/client/react";
import {
  AppBar,
  Button,
  Dialog,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Slide,
  Stack,
  Box,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import { GET_MY_SHOPS } from "../../../../../../../graphql/queries";
import {
  CREATE_STORE,
  DELETE_STORE,
  UPDATE_STORE,
} from "../../../../../../../graphql/mutation";
import AddIcon from "@mui/icons-material/Add";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function StorePage({ open, onClose }) {
  const { data, refetch, loading } = useQuery(GET_MY_SHOPS, {
    variables: {
      getShopsByOwnerIdId: "",
    },
  });

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            Store
          </Typography>
          <Button autoFocus color="inherit" onClick={onClose}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <Box style={{ padding: "20px" }}>
        <Stack mt={4} direction={"row"} justifyContent={"space-between"}>
          <Typography variant="body1" fontSize={25}>
            Store & Stock
          </Typography>

          <Button variant="contained">
            <AddIcon />
            Create Stock
          </Button>
        </Stack>
        <Box mt={2}>
          <Grid container spacing={2} sx={{ p: 2 }}>
            {loading ? (
              <Typography sx={{ m: 2 }}>កំពុងផ្ទុកហាង...</Typography>
            ) : (
              data?.getShopsByOwnerId?.map((shop) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={shop.id}>
                  <Card sx={{ width: "100%" }}>
                    <Stack
                      direction={"row"}
                      spacing={2}
                      justifyContent={"space-between"}
                    >
                      <img
                        style={{ width: "100px", height: "100px" }}
                        src="https://static.vecteezy.com/system/resources/previews/020/662/330/non_2x/store-icon-logo-illustration-vector.jpg"
                        alt=""
                      />
                      <CardContent>
                        <Typography>{shop.shopName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shop.description || "មិនមានពិពណ៌នា"}
                        </Typography>
                      </CardContent>
                    </Stack>
                    {/* <CardHeader
            title={shop.name}
            subheader={shop.owner?.email || "មិនមានអ៊ីមែល"}
          /> */}

                    <CardActions>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => console.log("Logout", shop.id)}
                      >
                        ចេញ
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => console.log("Login", shop.id)}
                      >
                        ចូល
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
}
