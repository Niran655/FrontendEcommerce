import { Box, Card, CardContent, Typography } from "@mui/material";

export default function ErrorMessage({ message, image }) {
  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        my: 4,
        textAlign: "center",
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
        bgcolor: "error.light",
        color: "error.contrastText",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <img
          src={image}
          alt="Error"
          style={{ width: 120, height: "auto", margin: "0 auto" }}
        />
      </Box>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Permission Denied
        </Typography>
        <Typography variant="body2">{message}</Typography>
      </CardContent>
    </Card>
  );
}
