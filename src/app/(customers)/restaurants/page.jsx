import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";

import ShopCard from "@/app/components/resturants/ShopCard/ShopCards";
import HeroSlider from "@/app/components/Home/HeroSlider";
import "../../../../style/Home.css";

const Home = () => {
  return (
    <Box>
      <Box sx={{ width: '100%' }}>
        <HeroSlider />
      </Box>
      
      <Stack mt={4}>
        <Typography className="text-container">ភោជនីយដ្ឋានទាំងអស់</Typography>
        <Typography>
          Choose your necessary products from this feature categories.
        </Typography>

        <Box mt={2}>
          <ShopCard/>
        </Box>
      </Stack>
    </Box>
  );
};
export default Home;