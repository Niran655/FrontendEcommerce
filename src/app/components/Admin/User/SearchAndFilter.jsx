"use client";
import {
  Paper,
  Grid,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Chip,
} from "@mui/material";
import { Search, Building, DiamondPlus } from "lucide-react";

const roles = ["Admin", "Manager", "Cashier", "StockKeeper", "User", "Shop"];

const SearchAndFilter = ({ 
  searchTerm, 
  onSearchChange, 
  roleFilter, 
  onRoleFilterChange, 
  filteredUsersCount, 
  onCreateShop, 
  onCreateUser, 
  t 
}) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={3}>
          <Typography>{t(`search`)}</Typography>
          <TextField
            fullWidth
            placeholder={t(`search`)}
            value={searchTerm}
            size="small"
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <Search size={20} style={{ marginRight: 8, color: "#666" }} />
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography>{t(`filter_by_role`)}</Typography>
          <FormControl fullWidth>
            <Select
              value={roleFilter}
              size="small"
              onChange={onRoleFilterChange}
            >
              <MenuItem value="All">{t(`all_role`)}</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item sx={{ ml: "auto", display: "flex", gap: 2 }}>
          <Chip
            label={`${filteredUsersCount} ${t("user")}`}
            color="primary"
            variant="outlined"
          />
          <Button
            variant="outlined"
            startIcon={<Building size={20} />}
            onClick={onCreateShop}
          >
            Create Shop
          </Button>
          <Button
            variant="contained"
            startIcon={<DiamondPlus size={20} />}
            onClick={onCreateUser}
          >
            {t(`create`)}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchAndFilter;