import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { SentimentDissatisfied as SadIcon } from "@mui/icons-material";

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 200px)",
          textAlign: "center",
          py: 8,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 6,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 500,
            width: "100%",
          }}
        >
          <SadIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            404
          </Typography>

          <Typography variant="h5" gutterBottom>
            페이지를 찾을 수 없습니다
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/"
              size="large"
            >
              홈으로
            </Button>

            <Button
              variant="outlined"
              component={Link}
              to="/dashboard"
              size="large"
            >
              대시보드
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
