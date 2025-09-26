import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Stack, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import * as React from "react";

export default function CircularIndeterminate() {
  return (
    <TableBody bgcolor="white"  sx={{ height: "300px", borderRadius: "20px",borderRadius: "20px",boxShadow:"rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" }}>
      <TableRow>
        <TableCell colSpan={10} align="center">
          <Box bgcolor="white">
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
                  <CircularProgress />
                </Box>
                <Typography>កំពុងដំណើរការ</Typography>
              </Stack>
            </Stack>
          </Box>
        </TableCell>
      </TableRow>
    </TableBody>
  );
}
