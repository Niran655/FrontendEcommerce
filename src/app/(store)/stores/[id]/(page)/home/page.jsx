import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";

import ProductCard from "../../../../../components/Home/ProductCard";
import "../../../../../../../style/Home.css";
import HeroSlider from "@/app/components/Home/HeroSlider";

const Home = () => {
  return (
    <Box>
      <Stack>
        <Grid container spacing={2}>
          <Grid size={{xs:12,md:8}}>
            <HeroSlider/>
          </Grid>
          <Grid size={{xs:12,md:4}} >
            <Stack direction="column" spacing={2}>
              <Box className="box-card">
                <Typography fontSize={17} color={"white"}>
                  10% Sale Off
                </Typography>
                <Typography
                  className="text-container"
                  fontSize={20}
                  color={"white"}
                  fontWeight="bold"
                >
                  Apple Watch Series 7
                </Typography>
                <Typography fontSize={20} color={"white"} fontWeight="bold">
                  Don't miss the last <br /> opportunity.
                </Typography>
                <Box mt={2}>
                  <Button variant="contained">Buy Now</Button>
                </Box>
              </Box>

              <Box className="box-card">
                <Typography fontSize={17} color={"white"}>
                  10% Sale Off
                </Typography>
                <Typography
                  className="text-container"
                  fontSize={20}
                  color={"white"}
                  fontWeight="bold"
                >
                  Apple Watch Series 7
                </Typography>
                <Typography fontSize={20} color={"white"} fontWeight="bold">
                  Don't miss the last <br /> opportunity.
                </Typography>
                <Box mt={2}>
                  <Button variant="contained">Buy Now</Button>
                </Box>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      <Stack mt={4}>
        <Typography className="text-container">Featured Categories</Typography>
        <Typography>
          Choose your necessary products from this feature categories.
        </Typography>
        <Box mt={2}>
          <ProductCard />
        </Box>
      </Stack>
    </Box>
  );
};

export default Home;