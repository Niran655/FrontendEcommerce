import { Box, Button, Card, Grid, Stack, Typography } from "@mui/material";

import ShopCard from "@/app/components/resturants/ShopCard/ShopCards";
import CategorySlider from "@/app/components/resturants/CategorySlider";
import CardGallery from "@/app/components/resturants/CardGallery";
import HeroSlider from "@/app/components/Home/HeroSlider";
import "../../../../style/Home.css";

const Home = () => {
  return (
    <Box>
      <Box sx={{ width: "100%" }}>
        <HeroSlider />
      </Box>
            <Stack mt={3}>
        <Typography class="text-container">ប្រភេទអាហារ</Typography>
        <Box>
          <CategorySlider />
        </Box>
      </Stack>
      <Stack mt={3}>
        <Typography class="text-container">ហាងអ្នកចូលចិត្តថ្មីៗ​ចុះរហូតដល់​​ 30%</Typography>
        <Box>
          <CardGallery />
        </Box>
      </Stack>
      <Stack mt={4}>
        <Typography class="text-container">ភោជនីយដ្ឋានទាំងអស់</Typography>
        <Typography>
          Choose your necessary products from this feature categories.
        </Typography>
        <Box mt={2}>
          <ShopCard />
        </Box>
      </Stack>
    </Box>  
  );
};
export default Home;
