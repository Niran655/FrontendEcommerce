import { Box } from "@mui/material";
import React from "react";

import PhoneSlider from "@/app/components/Home/PhoneSlider";
import PhoneCard from "@/app/components/Home/PhoneCard";
const Phone = () => {
  return (
    <Box>
      <PhoneSlider />
      <Box mt={2}>
        <PhoneCard />
      </Box>
    </Box>
  );
};

export default Phone;
