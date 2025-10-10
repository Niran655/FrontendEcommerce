import { Box, Stack, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

import emptybox from "../../../../public/image/empty-box.png";
const EmptyData = () => {
  return (

      <TableBody bgcolor="white" sx={{ height: "300px", borderRadius: "20px"}}>
        <TableRow>
          <TableCell colSpan={10} align="center">
            <Box  bgcolor="white">
              <Stack
                direction="row"
                justifyContent="center"
                sx={{ width: "100%" }}
              >
                <Stack
                  direction="column"
                  textAlign="center"
                  sx={{ width: "100%" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                      height: "100px",
                      width: "100%",
                    }}
                  >
                    <Image className="box-image" style={{width:'100px',height:"100px"}} src={emptybox} alt={emptybox} />
                  </Box>
                  <Typography>ទិន្នន័យមិនមានទេ</Typography>
                </Stack>
              </Stack>
            </Box>
          </TableCell>
        </TableRow>
      </TableBody>

  );
};

export default EmptyData;
