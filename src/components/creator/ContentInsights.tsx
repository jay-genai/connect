import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as LightbulbIcon,
  Comment as CommentIcon,
  Visibility as ViewIcon,
  ThumbUp as LikeIcon,
  Share as ShareIcon,
  Refresh as RefreshIcon,
  BarChart as ChartIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from "@mui/icons-material";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { useAuth } from "../../context/AuthContext";
import { aiApi, creatorApi } from "../../services/api";
import AnalyticsCard from "../common/AnalyticsCard";

interface ContentData {
  id: string;
  title: string;
  thumbnail: string;
  publishDate: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime: number;
  engagementRate: number;
  isSponsored: boolean;
}

interface CommentData {
  id: string;
  content: string;
  author: string;
  likes: number;
  timestamp: string;
  sentiment: "positive" | "negative" | "neutral";
}

interface TrendData {
  keyword: string;
  volume: number;
  growth: number;
  relevance: number;
}

const ContentInsights: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState<ContentData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [savedInsights, setSavedInsights] = useState<string[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 실제 구현에서는 API에서 데이터를 가져옵니다
      // 여기서는 더미 데이터를 사용합니다

      // 컨텐츠 데이터
      const dummyContents: ContentData[] = [
        {
          id: "1",
          title: "최신 스마트폰 리뷰: 갤럭시 vs 아이폰",
          thumbnail: "https://via.placeholder.com/150",
          publishDate: "2023-05-15T12:00:00Z",
          views: 45000,
          likes: 3200,
          comments: 420,
          shares: 180,
          watchTime: 320000, // 초 단위
          engagementRate: 0.085,
          isSponsored: true,
        },
        {
          id: "2",
          title: "일상 브이로그: 서울 카페 투어",
          thumbnail: "https://via.placeholder.com/150",
          publishDate: "2023-05-01T12:00:00Z",
          views: 28000,
          likes: 2100,
          comments: 310,
          shares: 95,
          watchTime: 280000,
          engagementRate: 0.092,
          isSponsored: false,
        },
        {
          id: "3",
          title: "신제품 언박싱: 최신 노트북",
          thumbnail: "https://via.placeholder.com/150",
          publishDate: "2023-04-20T12:00:00Z",
          views: 62000,
          likes: 4100,
          comments: 520,
          shares: 230,
          watchTime: 410000,
          engagementRate: 0.078,
          isSponsored: true,
        },
        {
          id: "4",
          title: "여름 패션 하울: 트렌드 아이템",
          thumbnail: "https://via.placeholder.com/150",
          publishDate: "2023-04-10T12:00:00Z",
          views: 38000,
          likes: 2800,
          comments: 350,
          shares: 120,
          watchTime: 290000,
          engagementRate: 0.086,
          isSponsored: false,
        },
      ];

      // 댓글 데이터
      const dummyComments: CommentData[] = [
        {
          id: "1",
          content: "정말 유익한 컨텐츠네요! 다음 영상도 기대할게요.",
          author: "뷰티러버",
          likes: 45,
          timestamp: "2023-05-16T08:30:00Z",
          sentiment: "positive",
        },
        {
          id: "2",
          content: "이 제품 저도 사용해봤는데 정말 좋았어요. 리뷰 감사합니다!",
          author: "테크팬",
          likes: 32,
          timestamp: "2023-05-15T14:20:00Z",
          sentiment: "positive",
        },
        {
          id: "3",
          content: "설명이 너무 빨라서 이해하기 어려웠어요.",
          author: "초보시청자",
          likes: 8,
          timestamp: "2023-05-15T10:15:00Z",
          sentiment: "negative",
        },
        {
          id: "4",
          content: "다음에는 좀 더 저렴한 제품도 리뷰해주세요.",
          author: "알뜰족",
          likes: 27,
          timestamp: "2023-05-14T22:40:00Z",
          sentiment: "neutral",
        },
      ];

      // 트렌드 데이터
      const dummyTrends: TrendData[] = [
        {
          keyword: "쇼츠 컨텐츠",
          volume: 85000,
          growth: 32,
          relevance: 0.9,
        },
        {
          keyword: "언박싱",
          volume: 62000,
          growth: 18,
          relevance: 0.85,
        },
        {
          keyword: "일상 브이로그",
          volume: 54000,
          growth: 12,
          relevance: 0.78,
        },
        {
          keyword: "리뷰",
          volume: 48000,
          growth: 8,
          relevance: 0.92,
        },
        {
          keyword: "챌린지",
          volume: 42000,
          growth: 25,
          relevance: 0.7,
        },
      ];

      // 인사이트 데이터
      const dummyInsights = [
        "시청자들은 10-15분 길이의 컨텐츠에서 가장 높은 시청 완료율을 보입니다.",
        "제품 리뷰 영상은 평균보다 25% 높은 댓글 참여율을 보입니다.",
        "주말에 업로드된 컨텐츠는 평일 대비 15% 더 많은 조회수를 기록합니다.",
        "인트로를 30초 이내로 유지한 영상은 이탈률이 20% 낮습니다.",
        "시청자의 68%가 모바일 기기를 통해 컨텐츠를 시청합니다.",
        '댓글에서 가장 많이 언급된 키워드는 "퀄리티", "정보", "재미"입니다.',
        "협찬 컨텐츠는 비협찬 컨텐츠보다 평균 시청 시간이 10% 짧습니다.",
      ];

      setContents(dummyContents);
      setComments(dummyComments);
      setTrends(dummyTrends);
      setInsights(dummyInsights);
      setSavedInsights([
        "시청자의 68%가 모바일 기기를 통해 컨텐츠를 시청합니다.",
      ]);
    } catch (error) {
      console.error("데이터 가져오기 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleGenerateInsights = async () => {
    setIsGeneratingInsights(true);
    try {
      // 실제 구현에서는 AI API를 호출합니다
      const response = await aiApi.getContentInsights({
        creatorId: user?.id,
        contents: contents,
      });

      setInsights([...insights, ...response.data.insights]);
    } catch (error) {
      console.error("인사이트 생성 오류:", error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const handleSaveInsight = (insight: string) => {
    if (savedInsights.includes(insight)) {
      setSavedInsights(savedInsights.filter((item) => item !== insight));
    } else {
      setSavedInsights([...savedInsights, insight]);
    }
  };

  const renderPerformanceTab = () => {
    const viewsData = {
      labels: contents.map((content) => content.title.substring(0, 15) + "..."),
      datasets: [
        {
          label: "조회수",
          data: contents.map((content) => content.views),
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          borderWidth: 1,
        },
      ],
    };

    const engagementData = {
      labels: contents.map((content) => content.title.substring(0, 15) + "..."),
      datasets: [
        {
          label: "좋아요",
          data: contents.map((content) => content.likes),
          backgroundColor: theme.palette.success.main,
          borderColor: theme.palette.success.main,
          borderWidth: 1,
        },
        {
          label: "댓글",
          data: contents.map((content) => content.comments),
          backgroundColor: theme.palette.info.main,
          borderColor: theme.palette.info.main,
          borderWidth: 1,
        },
        {
          label: "공유",
          data: contents.map((content) => content.shares),
          backgroundColor: theme.palette.warning.main,
          borderColor: theme.palette.warning.main,
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
      },
    } as any;

    return (
      <Box>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsCard
              title="총 조회수"
              value={contents.reduce((sum, content) => sum + content.views, 0)}
              change={12.5}
              changeLabel="vs 지난달"
              chartData={{
                labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
                values: [12000, 19000, 25000, 32000, 45000, 52000],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsCard
              title="평균 시청 시간"
              value={(
                contents.reduce((sum, content) => sum + content.watchTime, 0) /
                contents.length /
                60
              ).toFixed(1)}
              unit="분"
              change={-2.3}
              changeLabel="vs 지난달"
              chartData={{
                labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
                values: [4.8, 5.2, 4.9, 5.1, 4.7, 4.6],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsCard
              title="평균 참여율"
              value={(
                (contents.reduce(
                  (sum, content) => sum + content.engagementRate,
                  0
                ) /
                  contents.length) *
                100
              ).toFixed(1)}
              unit="%"
              change={8.4}
              changeLabel="vs 지난달"
              chartData={{
                labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
                values: [7.2, 7.5, 7.8, 8.1, 8.5, 8.7],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsCard
              title="신규 구독자"
              value="1,250"
              change={15.8}
              changeLabel="vs 지난달"
              chartData={{
                labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
                values: [850, 920, 980, 1050, 1150, 1250],
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                컨텐츠별 조회수
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <Bar data={viewsData} options={options} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                컨텐츠별 참여도
              </Typography>
              <Box sx={{ height: 300, mt: 2 }}>
                <Bar data={engagementData} options={options} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderAudienceTab = () => {
    const ageData = {
      labels: ["13-17", "18-24", "25-34", "35-44", "45-54", "55+"],
      datasets: [
        {
          data: [5, 35, 30, 15, 10, 5],
          backgroundColor: [
            theme.palette.primary.light,
            theme.palette.primary.main,
            theme.palette.primary.dark,
            theme.palette.secondary.light,
            theme.palette.secondary.main,
            theme.palette.secondary.dark,
          ],
          borderWidth: 1,
        },
      ],
    };

    const genderData = {
      labels: ["남성", "여성", "기타"],
      datasets: [
        {
          data: [45, 52, 3],
          backgroundColor: [
            theme.palette.info.main,
            theme.palette.error.main,
            theme.palette.warning.main,
          ],
          borderWidth: 1,
        },
      ],
    };

    const locationData = {
      labels: ["서울", "경기", "부산", "인천", "대구", "기타"],
      datasets: [
        {
          data: [35, 25, 12, 8, 7, 13],
          backgroundColor: [
            theme.palette.primary.main,
            theme.palette.primary.light,
            theme.palette.secondary.main,
            theme.palette.secondary.light,
            theme.palette.info.main,
            theme.palette.grey[400],
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right" as const,
        },
      },
    } as any;

    return (
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                연령 분포
              </Typography>
              <Box sx={{ height: 250, mt: 2 }}>
                <Doughnut data={ageData} options={options} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                성별 분포
              </Typography>
              <Box sx={{ height: 250, mt: 2 }}>
                <Doughnut data={genderData} options={options} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                지역 분포
              </Typography>
              <Box sx={{ height: 250, mt: 2 }}>
                <Doughnut data={locationData} options={options} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            시청자 댓글 분석
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Chip
                  label="긍정적 댓글: 65%"
                  color="success"
                  icon={<TrendingUpIcon />}
                />
                <Chip
                  label="부정적 댓글: 15%"
                  color="error"
                  icon={<TrendingDownIcon />}
                />
                <Chip label="중립적 댓글: 20%" color="default" />
              </Box>

              <List>
                {comments.map((comment) => (
                  <ListItem
                    key={comment.id}
                    sx={{
                      mb: 1,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor:
                        comment.sentiment === "positive"
                          ? "success.light"
                          : comment.sentiment === "negative"
                          ? "error.light"
                          : "grey.300",
                    }}
                  >
                    <ListItemIcon>
                      <CommentIcon
                        color={
                          comment.sentiment === "positive"
                            ? "success"
                            : comment.sentiment === "negative"
                            ? "error"
                            : "action"
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={comment.content}
                      secondary={`${comment.author} • 좋아요 ${comment.likes}개`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                자주 언급되는 키워드
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip label="퀄리티 (45)" color="primary" />
                <Chip label="정보 (38)" color="primary" variant="outlined" />
                <Chip label="재미 (32)" color="primary" variant="outlined" />
                <Chip label="편집 (28)" color="secondary" variant="outlined" />
                <Chip label="설명 (25)" color="secondary" variant="outlined" />
                <Chip label="음질 (18)" color="default" variant="outlined" />
                <Chip label="자막 (15)" color="default" variant="outlined" />
                <Chip label="길이 (12)" color="default" variant="outlined" />
              </Box>

              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                시청자 요청 주제
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip label="비교 리뷰 (28)" color="primary" />
                <Chip
                  label="튜토리얼 (22)"
                  color="primary"
                  variant="outlined"
                />
                <Chip label="Q&A (18)" color="secondary" variant="outlined" />
                <Chip
                  label="일상 브이로그 (15)"
                  color="secondary"
                  variant="outlined"
                />
                <Chip
                  label="협찬 제품 (12)"
                  color="default"
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    );
  };

  const renderTrendsTab = () => {
    return (
      <Box>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">인기 트렌드 키워드</Typography>
            <Button startIcon={<RefreshIcon />} size="small">
              새로고침
            </Button>
          </Box>

          <Grid container spacing={2}>
            {trends.map((trend) => (
              <Grid item xs={12} sm={6} md={4} key={trend.keyword}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" component="div">
                        {trend.keyword}
                      </Typography>
                      <Chip
                        label={`+${trend.growth}%`}
                        color="success"
                        size="small"
                        icon={<TrendingUpIcon />}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      검색량: {trend.volume.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      관련성: {(trend.relevance * 100).toFixed(0)}%
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">관련 컨텐츠 보기</Button>
                    <Button size="small">아이디어 저장</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">AI 컨텐츠 인사이트</Typography>
            <Button
              startIcon={<LightbulbIcon />}
              variant="outlined"
              color="primary"
              onClick={handleGenerateInsights}
              disabled={isGeneratingInsights}
            >
              {isGeneratingInsights ? "생성 중..." : "새 인사이트 생성"}
            </Button>
          </Box>

          {isGeneratingInsights && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          <List>
            {insights.map((insight, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 1,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <ListItemIcon>
                  <LightbulbIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={insight} />
                <IconButton
                  edge="end"
                  onClick={() => handleSaveInsight(insight)}
                  color={
                    savedInsights.includes(insight) ? "primary" : "default"
                  }
                >
                  {savedInsights.includes(insight) ? (
                    <BookmarkIcon />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              </ListItem>
            ))}
          </List>

          {savedInsights.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                저장된 인사이트
              </Typography>
              <List>
                {savedInsights.map((insight, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      mb: 1,
                      bgcolor: "primary.light",
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon>
                      <BookmarkIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={insight} />
                    <IconButton
                      edge="end"
                      onClick={() => handleSaveInsight(insight)}
                    >
                      <BookmarkIcon color="primary" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Box>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    switch (activeTab) {
      case 0:
        return renderPerformanceTab();
      case 1:
        return renderAudienceTab();
      case 2:
        return renderTrendsTab();
      default:
        return null;
    }
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" component="h1" fontWeight="bold">
            컨텐츠 인사이트
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            variant="outlined"
            onClick={fetchData}
            disabled={isLoading}
          >
            데이터 새로고침
          </Button>
        </Box>

        <Typography variant="body1" color="text.secondary" paragraph>
          채널 성과를 분석하고 AI 기반 인사이트를 통해 컨텐츠 전략을 개선하세요.
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="성과 분석" />
          <Tab label="시청자 분석" />
          <Tab label="트렌드 및 인사이트" />
        </Tabs>
      </Paper>

      {renderContent()}
    </Box>
  );
};

export default ContentInsights;
