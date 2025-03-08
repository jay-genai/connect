import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import {
  Insights as InsightsIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { aiApi } from "../../services/apiOverride";

const InsightsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contentInsights, setContentInsights] = useState<string[]>([]);
  const [autoResponses, setAutoResponses] = useState<string[]>([]);
  const [legalAdvice, setLegalAdvice] = useState<string[]>([]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);

        // AI 인사이트 가져오기
        const contentResponse = await aiApi.getContentInsights(user?.id || "");
        setContentInsights(contentResponse.data.insights);

        // 자동 응답 가져오기
        const responseData = await aiApi.getAutoResponse(
          user?.id || "",
          "general"
        );
        setAutoResponses([responseData.data.response]);

        // 법률 조언 가져오기
        const legalData = await aiApi.getLegalAdvice(user?.id || "");
        setLegalAdvice(legalData.data.advice);

        setLoading(false);
      } catch (err) {
        setError("인사이트 데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user]);

  // 샘플 성과 데이터
  const performanceData = {
    views: {
      current: 125000,
      previous: 110000,
      change: 13.6,
    },
    engagement: {
      current: 8.2,
      previous: 7.5,
      change: 9.3,
    },
    followers: {
      current: 250000,
      previous: 235000,
      change: 6.4,
    },
    revenue: {
      current: 3500000,
      previous: 3000000,
      change: 16.7,
    },
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        인사이트
      </Typography>

      {/* 성과 요약 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    평균 조회수
                  </Typography>
                  <Typography variant="h5" component="div">
                    {performanceData.views.current.toLocaleString()}
                  </Typography>
                </Box>
                <Chip
                  label={`+${performanceData.views.change}%`}
                  color="success"
                  size="small"
                  icon={<TrendingUpIcon />}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                지난 달 대비
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    참여율
                  </Typography>
                  <Typography variant="h5" component="div">
                    {performanceData.engagement.current}%
                  </Typography>
                </Box>
                <Chip
                  label={`+${performanceData.engagement.change}%`}
                  color="success"
                  size="small"
                  icon={<TrendingUpIcon />}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                지난 달 대비
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    팔로워
                  </Typography>
                  <Typography variant="h5" component="div">
                    {performanceData.followers.current.toLocaleString()}
                  </Typography>
                </Box>
                <Chip
                  label={`+${performanceData.followers.change}%`}
                  color="success"
                  size="small"
                  icon={<TrendingUpIcon />}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                지난 달 대비
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    예상 수익
                  </Typography>
                  <Typography variant="h5" component="div">
                    {performanceData.revenue.current.toLocaleString()}원
                  </Typography>
                </Box>
                <Chip
                  label={`+${performanceData.revenue.change}%`}
                  color="success"
                  size="small"
                  icon={<TrendingUpIcon />}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                지난 달 대비
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 콘텐츠 인사이트 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <InsightsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">콘텐츠 인사이트</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <BarChartIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="medium">
                    성과 분석
                  </Typography>
                </Box>
                <List>
                  {contentInsights.slice(0, 3).map((insight, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LightbulbIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={insight} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TimelineIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="medium">
                    트렌드 분석
                  </Typography>
                </Box>
                <List>
                  {contentInsights.slice(3, 6).map((insight, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LightbulbIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={insight} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* 협업 인사이트 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <GroupIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">협업 인사이트</Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                >
                  자동 응답 제안
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  브랜드 문의에 대한 자동 응답 제안입니다. 이를 참고하여
                  효율적으로 응답하세요.
                </Typography>
                <List>
                  {autoResponses.map((response, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LightbulbIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={response} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  gutterBottom
                >
                  계약 관련 조언
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  브랜드와의 계약 시 주의해야 할 법률적 조언입니다.
                </Typography>
                <List>
                  {legalAdvice.map((advice, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <LightbulbIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={advice} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default InsightsPage;
