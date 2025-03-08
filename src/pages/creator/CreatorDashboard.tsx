import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Message as MessageIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  ArrowForward as ArrowForwardIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useNavigate, Link } from "react-router-dom";

import AnalyticsCard from "../../components/common/AnalyticsCard";
import AvailabilityCalendar from "../../components/common/AvailabilityCalendar";
import { useAuth } from "../../context/AuthContext";
import { creatorApi, collaborationApi } from "../../services/api";
import { Creator, Collaboration, Inquiry } from "../../types";
import { mockInquiryApi } from "../../services/mockApi";

const CreatorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const creator = user as Creator;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<Creator["metrics"] | null>(null);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [isUpdatingAvailability, setIsUpdatingAvailability] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // 목업 데이터로 대체 - metrics
        const metricsData = {
          totalViews: 12000,
          engagementRate: 0.046,
          followers: 5000,
          growth: 0.125,
        };
        setMetrics(metricsData);

        // 목업 데이터로 대체 - insights
        const insightsData = {
          data: {
            insights: [
              "10-15분 길이의 컨텐츠에서 가장 높은 시청 완료율을 보입니다.",
              "제품 리뷰 영상은 평균보다 25% 높은 댓글 참여율을 보입니다.",
              "주말에 업로드된 컨텐츠는 평일 대비 15% 더 많은 조회수를 기록합니다.",
              "인스타그램 스토리 참여율이 지난 달 대비 18% 증가했습니다.",
            ],
          },
        };
        setInsights(insightsData.data.insights);

        // Fetch active collaborations - 이 부분도 오류가 발생할 수 있으므로 목업 데이터로 대체
        try {
          const collaborationsResponse = await collaborationApi.getByCreatorId(
            creator.id,
            {
              status: ["inquiry", "negotiation", "contracted", "in-progress"],
            }
          );
          setCollaborations(collaborationsResponse.data);
        } catch (error) {
          console.error("Error fetching collaborations:", error);
          // 기본 목업 데이터 설정
          setCollaborations([]);
        }

        // Set available dates
        setAvailableDates(creator.availableDates || []);

        // Fetch inquiries
        try {
          if (creator.username) {
            // id 대신 username 사용
            const response = await mockInquiryApi.getInquiries(
              creator.username
            );
            setInquiries(response.data);
          }
        } catch (error) {
          console.error("Error fetching inquiries:", error);
          setInquiries([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (creator) {
      // creator.id 체크 대신 creator 자체 체크
      fetchDashboardData();
    }
  }, [creator]);

  const handleUpdateAvailability = async (dates: string[]) => {
    setIsUpdatingAvailability(true);
    try {
      await creatorApi.updateAvailability(creator.id, dates);
      setAvailableDates(dates);
      setIsCalendarOpen(false);
    } catch (error) {
      console.error("Error updating availability:", error);
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  const handleRefreshMetrics = async () => {
    setIsLoading(true);
    try {
      // 목업 데이터로 대체
      const metricsData = {
        totalViews: Math.floor(12000 + Math.random() * 2000),
        engagementRate: 0.046 + Math.random() * 0.01,
        followers: 5000 + Math.floor(Math.random() * 200),
        growth: 0.125 + Math.random() * 0.02,
      };
      setMetrics(metricsData);

      const insightsData = {
        data: {
          insights: [
            "10-15분 길이의 컨텐츠에서 가장 높은 시청 완료율을 보입니다.",
            "제품 리뷰 영상은 평균보다 25% 높은 댓글 참여율을 보입니다.",
            "주말에 업로드된 컨텐츠는 평일 대비 15% 더 많은 조회수를 기록합니다.",
            "인스타그램 스토리 참여율이 지난 달 대비 18% 증가했습니다.",
          ],
        },
      };
      setInsights(insightsData.data.insights);
    } catch (error) {
      console.error("Error refreshing metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCollaborationCard = (collaboration: Collaboration) => {
    const statusColors = {
      inquiry: "info",
      negotiation: "warning",
      contracted: "success",
      "in-progress": "primary",
      completed: "success",
      cancelled: "error",
    };

    return (
      <Card
        key={collaboration.id}
        elevation={2}
        sx={{
          mb: 2,
          borderRadius: 2,
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                {collaboration.description.length > 40
                  ? `${collaboration.description.substring(0, 40)}...`
                  : collaboration.description}
              </Typography>
              <Chip
                label={
                  collaboration.status.charAt(0).toUpperCase() +
                  collaboration.status.slice(1)
                }
                color={statusColors[collaboration.status] as any}
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                <strong>Brand:</strong>{" "}
                {collaboration.brandName || "Unknown Brand"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Type:</strong>{" "}
                {collaboration.type.charAt(0).toUpperCase() +
                  collaboration.type.slice(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Timeline:</strong>{" "}
                {format(new Date(collaboration.startDate), "MMM d")} -{" "}
                {format(new Date(collaboration.endDate), "MMM d, yyyy")}
              </Typography>
              {collaboration.budget && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Budget:</strong> $
                  {collaboration.budget.toLocaleString()}
                </Typography>
              )}
            </Box>

            <Avatar
              src={collaboration.brandLogo}
              alt={collaboration.brandName || "Brand"}
              sx={{ width: 50, height: 50 }}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            startIcon={<MessageIcon />}
            onClick={() => navigate(`/messages/${collaboration.id}`)}
          >
            Messages
          </Button>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => navigate(`/collaborations/${collaboration.id}`)}
          >
            View Details
          </Button>
        </CardActions>
      </Card>
    );
  };

  if (isLoading && !metrics) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Creator Dashboard
        </Typography>
        <Box>
          <Tooltip title="Refresh Metrics">
            <IconButton onClick={handleRefreshMetrics} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<CalendarIcon />}
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            sx={{ ml: 1 }}
          >
            Manage Availability
          </Button>
        </Box>
      </Box>

      {/* Analytics Section */}
      <Typography variant="h5" component="h2" fontWeight="medium" mb={3}>
        Performance Overview
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Total Views"
            value={metrics?.totalViews || 0}
            change={12.5}
            changeLabel="vs last month"
            chartData={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              values: [1200, 1900, 3000, 5000, 8000, 12000],
            }}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Engagement Rate"
            value={`${(metrics?.engagementRate || 0) * 100}`}
            unit="%"
            change={-2.3}
            changeLabel="vs last month"
            chartData={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              values: [4.8, 5.2, 4.9, 5.1, 4.7, 4.6],
            }}
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Active Collaborations"
            value={collaborations.length}
            change={50}
            changeLabel="vs last month"
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Revenue"
            value={collaborations.reduce(
              (sum, collab) => sum + (collab.budget || 0),
              0
            )}
            unit="USD"
            change={35.8}
            changeLabel="vs last month"
            chartData={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              values: [1500, 2200, 1800, 2500, 3200, 4500],
            }}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      {/* Growth Insights */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Growth Insights
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {insights.length > 0 ? (
          <Grid container spacing={2}>
            {insights.map((insight, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <CheckIcon color="success" sx={{ mr: 1, mt: 0.3 }} />
                  <Typography variant="body1">{insight}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            No insights available at the moment. Check back later.
          </Typography>
        )}
      </Paper>

      {/* Upcoming Collaborations and Availability */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Typography variant="h5" component="h2" fontWeight="medium" mb={2}>
            Active Collaborations
          </Typography>

          {collaborations.length > 0 ? (
            collaborations.map(renderCollaborationCard)
          ) : (
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                textAlign: "center",
                bgcolor: "background.default",
              }}
            >
              <ScheduleIcon
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                No Active Collaborations
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                You don't have any active collaborations at the moment.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/profile")}
              >
                Update Your Profile
              </Button>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h5" component="h2" fontWeight="medium">
                Your Availability
              </Typography>
              <IconButton
                size="small"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <EditIcon />
              </IconButton>
            </Box>

            {isCalendarOpen ? (
              <>
                <AvailabilityCalendar
                  availableDates={availableDates}
                  onDatesChange={handleUpdateAvailability}
                  isEditable={true}
                />
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsCalendarOpen(false)}
                    sx={{ mr: 1 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleUpdateAvailability(availableDates)}
                    disabled={isUpdatingAvailability}
                  >
                    {isUpdatingAvailability ? "Saving..." : "Save Changes"}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" paragraph>
                  You have {availableDates.length} available dates in the next 3
                  months.
                </Typography>
                <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                  {availableDates.length > 0 ? (
                    availableDates
                      .sort(
                        (a, b) => new Date(a).getTime() - new Date(b).getTime()
                      )
                      .map((date, index) => (
                        <Chip
                          key={index}
                          label={format(new Date(date), "EEE, MMM d, yyyy")}
                          color="primary"
                          variant="outlined"
                          size="small"
                          sx={{ m: 0.5 }}
                        />
                      ))
                  ) : (
                    <Typography color="text.secondary" align="center">
                      No available dates set. Click the edit button to add your
                      availability.
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* 요약 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "primary.light",
              color: "white",
            }}
          >
            <Typography variant="h6" gutterBottom>
              새 문의
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {inquiries.filter((inq) => inq.status === "pending").length}
            </Typography>
            <Button
              component={Link}
              to="/inquiries"
              variant="outlined"
              color="inherit"
              size="small"
            >
              모두 보기
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              활성 협업
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              3
            </Typography>
            <Button
              component={Link}
              to="/collaborations"
              variant="outlined"
              color="primary"
              size="small"
            >
              관리하기
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              예정된 일정
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              5
            </Typography>
            <Button
              component={Link}
              to="/calendar"
              variant="outlined"
              color="primary"
              size="small"
              startIcon={<CalendarIcon />}
            >
              일정 보기
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "secondary.light",
              color: "white",
            }}
          >
            <Typography variant="h6" gutterBottom>
              알림
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              2
            </Typography>
            <Button
              component={Link}
              to="/notifications"
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<NotificationsIcon />}
            >
              확인하기
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* 최근 문의 */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">최근 문의</Typography>
              <Button
                component={Link}
                to="/inquiries"
                size="small"
                endIcon={<ArrowForwardIcon />}
              >
                모두 보기
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {inquiries.length > 0 ? (
              <List sx={{ width: "100%" }}>
                {inquiries.slice(0, 5).map((inquiry) => (
                  <React.Fragment key={inquiry.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar src={inquiry.brandLogo} alt={inquiry.brandName}>
                          {inquiry.brandName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={inquiry.brandName}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {inquiry.type === "seeding"
                                ? "제품 시딩"
                                : inquiry.type === "advertisement"
                                ? "광고 콘텐츠"
                                : "파트너십"}
                            </Typography>
                            {" — "}
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </React.Fragment>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Chip
                          label={
                            inquiry.status === "pending"
                              ? "대기 중"
                              : inquiry.status === "responded"
                              ? "응답 완료"
                              : inquiry.status === "converted"
                              ? "협업 전환"
                              : "거절됨"
                          }
                          color={
                            inquiry.status === "pending"
                              ? "warning"
                              : inquiry.status === "responded"
                              ? "success"
                              : inquiry.status === "converted"
                              ? "info"
                              : "error"
                          }
                          size="small"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ py: 4 }}
              >
                아직 문의가 없습니다.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* 콘텐츠 성과 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              콘텐츠 성과
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <ViewIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" component="div">
                    125K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    평균 조회수
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <ThumbUpIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" component="div">
                    8.2K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    평균 좋아요
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <CommentIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="h5" component="div">
                    1.5K
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    평균 댓글
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                인사이트
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="시청자들은 10-15분 길이의 컨텐츠에서 가장 높은 시청 완료율을 보입니다." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="제품 리뷰 영상은 평균보다 25% 높은 댓글 참여율을 보입니다." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="주말에 업로드된 컨텐츠는 평일 대비 15% 더 많은 조회수를 기록합니다." />
                </ListItem>
              </List>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Button
                  component={Link}
                  to="/insights"
                  variant="contained"
                  color="primary"
                >
                  자세한 인사이트 보기
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreatorDashboard;
