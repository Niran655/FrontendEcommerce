import { MenuItem, Pagination, Select, Stack, Typography } from "@mui/material";
import React from "react";

import { useAuth } from "../context/AuthContext";
import { translateLauguage } from "../function/translate";

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
  const {language} = useAuth()
  const {t} = translateLauguage(language)

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
        {t(`showing_page`)} {page} {t(`of`)} {totalPages} ({totalDocs} {t(`items`)})
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        <Pagination
          page={page}
          count={totalPages}
          color="info"
          // variant="outlined"
          shape="rounded"
          onChange={handlePageNum}
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              color: "black",
              borderColor: "gray",
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
          <MenuItem value={6}>6 / {t(`page`)}</MenuItem>
          <MenuItem value={8}>8 / {t(`page`)}</MenuItem>
          <MenuItem value={10}>10 / {t(`page`)}</MenuItem>
          <MenuItem value={totalDocs}>{t(`All`)}</MenuItem>
        </Select>
      </Stack>
    </Stack>
  );
}
