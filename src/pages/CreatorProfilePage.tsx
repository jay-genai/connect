import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Avatar,
  Button,
  Chip,
  Divider,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Stack,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Language as WebsiteIcon,
  Twitter as TwitterIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { mockCreatorApi } from "../services/mockApi";
import { Creator } from "../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`creator-tabpanel-${index}`}
      aria-labelledby={`creator-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const CreatorProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        if (!username) {
          throw new Error("크리에이터 사용자명이 필요합니다.");
        }

        // 실제로는 API 호출로 크리에이터 정보를 가져옵니다.
        // 여기서는 mockCreatorApi의 getCreators를 사용하여 모든 크리에이터를 가져온 후 필터링합니다.
        const response = await mockCreatorApi.getCreators();
        const foundCreator = response.data.find(
          (c) => c.username === username.replace("@", "")
        );

        if (!foundCreator) {
          throw new Error("크리에이터를 찾을 수 없습니다.");
        }

        setCreator(foundCreator);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "크리에이터 정보를 불러오는 중 오류가 발생했습니다."
        );
        setLoading(false);
      }
    };

    fetchCreator();
  }, [username]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!creator) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">크리에이터 정보를 찾을 수 없습니다.</Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* 커버 이미지 */}
      <Box
        sx={{
          height: { xs: 150, md: 250 },
          bgcolor: "primary.light",
          backgroundImage: creator.coverImage
            ? `url(${creator.coverImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      />

      <Container maxWidth="lg">
        {/* 프로필 헤더 */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, md: 4 },
            mt: -5,
            mb: 4,
            borderRadius: 2,
            position: "relative",
          }}
        >
          <Grid container spacing={3}>
            <Grid
              item
              xs={12}
              md={3}
              sx={{ textAlign: { xs: "center", md: "left" } }}
            >
              <Avatar
                src={creator.profileImage}
                alt={creator.displayName}
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  border: "4px solid white",
                  boxShadow: 1,
                  mx: { xs: "auto", md: 0 },
                  mt: { xs: -8, md: -10 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {creator.displayName}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  @{creator.username}
                </Typography>
                <Typography variant="body1" paragraph>
                  {creator.bio}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  {creator.categories.map((category, index) => (
                    <Chip key={index} label={category} size="small" />
                  ))}
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                alignItems: "flex-start",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<EmailIcon />}
                sx={{ mt: { xs: 0, md: 2 } }}
              >
                문의하기
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* 통계 정보 */}
          <Grid container spacing={3}>
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                  {creator.followers.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  팔로워
                </Typography>
              </Box>
            </Grid>
            {creator.metrics?.avgViews && (
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {creator.metrics.avgViews.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    평균 조회수
                  </Typography>
                </Box>
              </Grid>
            )}
            {creator.metrics?.avgEngagementRate && (
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {(creator.metrics.avgEngagementRate * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    참여율
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={6} sm={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                  {creator.location || "N/A"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  지역
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* 소셜 미디어 링크 */}
          <Box
            sx={{ display: "flex", justifyContent: "center", mt: 3, gap: 2 }}
          >
            {creator.platforms?.map((platform, index) => (
              <IconButton
                key={index}
                component="a"
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                size="large"
              >
                {platform.name === "youtube" ? (
                  <YouTubeIcon fontSize="large" />
                ) : platform.name === "instagram" ? (
                  <InstagramIcon fontSize="large" />
                ) : platform.name === "twitter" ? (
                  <TwitterIcon fontSize="large" />
                ) : (
                  <WebsiteIcon fontSize="large" />
                )}
              </IconButton>
            ))}
          </Box>
        </Paper>

        {/* 탭 메뉴 */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : undefined}
            centered={!isMobile}
          >
            <Tab label="포트폴리오" />
            <Tab label="협업 정보" />
            <Tab label="리뷰" />
          </Tabs>

          {/* 포트폴리오 탭 */}
          <TabPanel value={tabValue} index={0}>
            {creator.portfolio && creator.portfolio.length > 0 ? (
              <Grid container spacing={3}>
                {creator.portfolio.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card sx={{ height: "100%" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl}
                        alt={item.title}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          {item.title}
                        </Typography>
                        {item.brand && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            브랜드: {item.brand}
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {new Date(item.date).toLocaleDateString()}
                        </Typography>
                        {item.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {item.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  포트폴리오 항목이 없습니다.
                </Typography>
              </Box>
            )}
          </TabPanel>

          {/* 협업 정보 탭 */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    협업 유형
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Stack spacing={2}>
                    {creator.pricing.seedingPrice && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          제품 시딩
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          제품을 제공받고 솔직한 리뷰를 제작합니다.
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {creator.pricing.seedingPrice.toLocaleString()}원부터
                        </Typography>
                      </Box>
                    )}
                    {creator.pricing.adPrice && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          광고 콘텐츠
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          브랜드의 제품이나 서비스를 홍보하는 콘텐츠를
                          제작합니다.
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {creator.pricing.adPrice.toLocaleString()}원부터
                        </Typography>
                      </Box>
                    )}
                    {creator.pricing.collaborationPrice && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          장기 파트너십
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          브랜드와 장기적인 협업 관계를 구축합니다.
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {creator.pricing.collaborationPrice.toLocaleString()}
                          원부터
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    가능한 날짜
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {creator.availableDates &&
                  creator.availableDates.length > 0 ? (
                    <Grid container spacing={1}>
                      {creator.availableDates
                        .slice(0, 12)
                        .map((date, index) => (
                          <Grid item xs={6} sm={4} key={index}>
                            <Chip
                              label={new Date(date).toLocaleDateString()}
                              variant="outlined"
                              sx={{ width: "100%" }}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      가능한 날짜 정보가 없습니다.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </TabPanel>

          {/* 리뷰 탭 */}
          <TabPanel value={tabValue} index={2}>
            {creator.reviews && creator.reviews.length > 0 ? (
              <Stack spacing={3}>
                {creator.reviews.map((review) => (
                  <Paper key={review.id} sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {review.brandName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", mb: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Box
                          key={i}
                          sx={{
                            color:
                              i < review.rating ? "warning.main" : "grey.300",
                            mr: 0.5,
                          }}
                        >
                          ★
                        </Box>
                      ))}
                    </Box>
                    <Typography variant="body1">{review.comment}</Typography>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  아직 리뷰가 없습니다.
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
};

export default CreatorProfilePage;
