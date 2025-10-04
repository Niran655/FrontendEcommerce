import { MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import React from "react";

export default function FooterPagination({
  totalPages,
  totalDocs,
  limit,
  page,
  setPage,
  handleLimit,
  Type,
}) {
  const handlePageNum = (event, pageNum) => {
    setPage(parseInt(pageNum));
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      sx={{
        px: 2,
        py: 1,

        borderRadius: 2,
        color: "black",
        flexWrap: "wrap",
      }}
    >
      <Typography variant="body2" sx={{ color: "black" }}>
        Showing page {page} of {totalPages} ({totalDocs} items)
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        <Pagination
          page={page}
          count={totalPages}
          color="primary"
          variant="outlined"
          shape="rounded"
          onChange={handlePageNum}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              color: "black",
              borderColor: "black",
            },
          }}
        />

        <Select
          size="small"
          value={limit}
          onChange={handleLimit}
          sx={{
            color: "black",
            borderColor: "black",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "black",
            },
            "& .MuiSvgIcon-root": {
              color: "black",
            },
          }}
        >
          <MenuItem value={5}>5 / Page</MenuItem>
          <MenuItem value={8}>8 / Page</MenuItem>
          <MenuItem value={10}>10 / Page</MenuItem>
          <MenuItem value={totalDocs}>All</MenuItem>
        </Select>
      </Stack>
    </Stack>
  );
}
