import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
  Avatar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CheckCircleOutline as CheckIcon,
  TrendingUp as TrendingUpIcon,
  Handshake as HandshakeIcon,
  Analytics as AnalyticsIcon,
  Payment as PaymentIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const features = [
    {
      title: "크리에이터 검색",
      description:
        "다양한 분야의 크리에이터를 검색하고 필터링하여 브랜드에 맞는 인플루언서를 찾아보세요.",
      icon: <TrendingUpIcon fontSize="large" color="primary" />,
    },
    {
      title: "협업 관리",
      description:
        "계약부터 콘텐츠 제작까지 모든 협업 과정을 한 곳에서 관리하세요.",
      icon: <HandshakeIcon fontSize="large" color="primary" />,
    },
    {
      title: "성과 분석",
      description:
        "협업 성과를 실시간으로 분석하고 인사이트를 얻어 마케팅 전략을 개선하세요.",
      icon: <AnalyticsIcon fontSize="large" color="primary" />,
    },
    {
      title: "안전한 결제",
      description:
        "안전하고 투명한 결제 시스템으로 크리에이터와 브랜드 모두 신뢰할 수 있는 거래를 경험하세요.",
      icon: <PaymentIcon fontSize="large" color="primary" />,
    },
    {
      title: "일정 관리",
      description:
        "캠페인 일정을 효율적으로 관리하고 중요한 마일스톤을 놓치지 마세요.",
      icon: <CalendarIcon fontSize="large" color="primary" />,
    },
  ];

  const testimonials = [
    {
      name: "김태희",
      role: "뷰티 크리에이터",
      avatar: "https://via.placeholder.com/150",
      content:
        "Connect를 통해 제 콘텐츠와 맞는 브랜드들을 만날 수 있었어요. 협업 과정이 매우 체계적이고 편리해서 콘텐츠 제작에 더 집중할 수 있었습니다.",
    },
    {
      name: "이민호",
      role: "마케팅 매니저, 코스메틱 브랜드",
      avatar: "https://via.placeholder.com/150",
      content:
        "다양한 크리에이터들을 한 곳에서 검색하고 협업할 수 있어 마케팅 캠페인 진행이 훨씬 수월해졌습니다. 특히 성과 분석 기능이 매우 유용합니다.",
    },
    {
      name: "박지성",
      role: "스포츠 인플루언서",
      avatar: "https://via.placeholder.com/150",
      content:
        "이전에는 브랜드와의 협업 관리가 복잡했는데, Connect를 사용하면서 계약부터 결제까지 모든 과정이 간소화되어 정말 편리합니다.",
    },
  ];

  return (
    <Box>
      {/* 히어로 섹션 */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
              >
                크리에이터와 브랜드를 연결하는 플랫폼
              </Typography>
              <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                Connect는 인플루언서 마케팅을 위한 올인원 솔루션입니다.
                크리에이터 검색부터 협업, 성과 분석까지 모든 과정을 한 곳에서
                관리하세요.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                {isAuthenticated ? (
                  <Button
                    component={Link}
                    to={
                      userType === "creator"
                        ? "/creator/dashboard"
                        : "/brand/dashboard"
                    }
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    대시보드로 이동
                  </Button>
                ) : (
                  <>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      color="secondary"
                      size="large"
                      sx={{ px: 4, py: 1.5 }}
                    >
                      무료로 시작하기
                    </Button>
                    <Button
                      component={Link}
                      to="/login"
                      variant="outlined"
                      color="inherit"
                      size="large"
                      sx={{ px: 4, py: 1.5 }}
                    >
                      로그인
                    </Button>
                  </>
                )}
              </Stack>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <Box
                component="img"
                src="https://via.placeholder.com/600x400"
                alt="Connect 플랫폼 이미지"
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 주요 기능 섹션 */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            fontWeight="bold"
          >
            주요 기능
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto" }}
          >
            Connect는 인플루언서 마케팅의 모든 단계를 지원하는 다양한 기능을
            제공합니다.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 사용자 후기 섹션 */}
      <Box sx={{ bgcolor: "grey.100", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              fontWeight="bold"
            >
              사용자 후기
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: "auto" }}
            >
              Connect를 통해 성공적인 협업을 경험한 크리에이터와 브랜드의
              이야기를 들어보세요.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                      "{testimonial.content}"
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{ mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA 섹션 */}
      <Box
        sx={{
          bgcolor: "primary.dark",
          color: "white",
          py: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            fontWeight="bold"
          >
            지금 바로 시작하세요
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Connect와 함께 더 효율적이고 성공적인 인플루언서 마케팅을
            경험해보세요.
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="secondary"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            무료로 가입하기
          </Button>
        </Container>
      </Box>

      {/* 푸터 */}
      <Box sx={{ bgcolor: "grey.900", color: "grey.300", py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Connect
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                크리에이터와 브랜드를 연결하는 인플루언서 마케팅 플랫폼
              </Typography>
              <Typography variant="body2">
                © 2023 Connect. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                링크
              </Typography>
              <Stack spacing={1}>
                <Link
                  to="/about"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Typography variant="body2">소개</Typography>
                </Link>
                <Link
                  to="/features"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Typography variant="body2">기능</Typography>
                </Link>
                <Link
                  to="/pricing"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Typography variant="body2">요금제</Typography>
                </Link>
                <Link
                  to="/contact"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Typography variant="body2">문의하기</Typography>
                </Link>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                법적 정보
              </Typography>
              <Stack spacing={1}>
                <Link
                  to="/terms"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Typography variant="body2">이용약관</Typography>
                </Link>
                <Link
                  to="/privacy"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Typography variant="body2">개인정보처리방침</Typography>
                </Link>
                <Link
                  to="/cookies"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <Typography variant="body2">쿠키 정책</Typography>
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
