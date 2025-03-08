import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Collaboration } from "../../types";

// 실제로는 API에서 가져올 데이터
const mockCollaborations: Collaboration[] = [
  {
    id: "collab-1",
    brandId: "brand-1",
    creatorId: "creator-1",
    brandName: "테크기어",
    creatorName: "Test Creator",
    creatorImage: "https://via.placeholder.com/150",
    type: "advertisement",
    status: "in-progress",
    budget: 1500000,
    startDate: new Date(
      new Date().setDate(new Date().getDate() - 10)
    ).toISOString(),
    endDate: new Date(
      new Date().setDate(new Date().getDate() + 20)
    ).toISOString(),
    description: "신제품 스마트워치 광고 캠페인",
    deliverables: ["언박싱 영상", "제품 리뷰", "인스타그램 스토리 3회"],
    milestones: [
      {
        id: "milestone-1",
        title: "계약 체결",
        description: "협업 계약서 서명 및 계약금 지급",
        dueDate: new Date(
          new Date().setDate(new Date().getDate() - 8)
        ).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-2",
        title: "콘텐츠 기획",
        description: "콘텐츠 방향성 및 스크립트 확정",
        dueDate: new Date(
          new Date().setDate(new Date().getDate() - 3)
        ).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-3",
        title: "촬영 및 편집",
        description: "제품 촬영 및 영상 편집",
        dueDate: new Date(
          new Date().setDate(new Date().getDate() + 5)
        ).toISOString(),
        status: "in-progress",
      },
      {
        id: "milestone-4",
        title: "콘텐츠 업로드",
        description: "최종 콘텐츠 업로드 및 홍보",
        dueDate: new Date(
          new Date().setDate(new Date().getDate() + 15)
        ).toISOString(),
        status: "pending",
      },
    ],
    messages: [],
  },
  {
    id: "collab-2",
    brandId: "brand-1",
    creatorId: "creator-2",
    brandName: "테크기어",
    creatorName: "뷰티 구루",
    creatorImage: "https://via.placeholder.com/150",
    type: "seeding",
    status: "completed",
    budget: 500000,
    startDate: new Date(
      new Date().setDate(new Date().getDate() - 30)
    ).toISOString(),
    endDate: new Date(
      new Date().setDate(new Date().getDate() - 5)
    ).toISOString(),
    description: "스마트 뷰티 디바이스 시딩",
    deliverables: ["언박싱 영상", "사용 후기"],
    milestones: [
      {
        id: "milestone-1",
        title: "제품 발송",
        description: "제품 발송 및 수령 확인",
        dueDate: new Date(
          new Date().setDate(new Date().getDate() - 28)
        ).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-2",
        title: "콘텐츠 업로드",
        description: "리뷰 콘텐츠 업로드",
        dueDate: new Date(
          new Date().setDate(new Date().getDate() - 10)
        ).toISOString(),
        status: "completed",
      },
    ],
    messages: [],
  },
  {
    id: "collab-3",
    brandId: "brand-1",
    creatorId: "creator-3",
    brandName: "테크기어",
    creatorName: "푸드 러버",
    creatorImage: "https://via.placeholder.com/150",
    type: "partnership",
    status: "negotiation",
    startDate: new Date(
      new Date().setDate(new Date().getDate() - 5)
    ).toISOString(),
    endDate: new Date(
      new Date().setDate(new Date().getDate() + 90)
    ).toISOString(),
    description: "스마트 주방 가전 장기 파트너십",
    deliverables: ["월 2회 레시피 영상", "분기별 오프라인 이벤트 참여"],
    milestones: [
      {
        id: "milestone-1",
        title: "계약 협상",
        description: "파트너십 조건 및 계약 내용 협의",
        dueDate: new Date(
          new Date().setDate(new Date().getDate() + 5)
        ).toISOString(),
        status: "in-progress",
      },
    ],
    messages: [],
  },
];

const BrandCollaborationsPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        // 실제로는 API 호출
        setCollaborations(mockCollaborations);
        setLoading(false);
      } catch (err) {
        setError("협업 데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getFilteredCollaborations = () => {
    if (tabValue === 0) {
      return collaborations;
    } else if (tabValue === 1) {
      return collaborations.filter(
        (collab) =>
          collab.status === "in-progress" || collab.status === "contracted"
      );
    } else if (tabValue === 2) {
      return collaborations.filter((collab) => collab.status === "negotiation");
    } else if (tabValue === 3) {
      return collaborations.filter((collab) => collab.status === "completed");
    }
    return collaborations;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "negotiation":
        return "warning";
      case "contracted":
      case "in-progress":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "negotiation":
        return "협상 중";
      case "contracted":
        return "계약 완료";
      case "in-progress":
        return "진행 중";
      case "completed":
        return "완료됨";
      case "cancelled":
        return "취소됨";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "seeding":
        return "제품 시딩";
      case "advertisement":
        return "광고 콘텐츠";
      case "partnership":
        return "장기 파트너십";
      default:
        return type;
    }
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
        협업 관리
      </Typography>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="전체" />
          <Tab label="진행 중" />
          <Tab label="협상 중" />
          <Tab label="완료됨" />
        </Tabs>
      </Paper>

      {getFilteredCollaborations().length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            해당하는 협업이 없습니다.
          </Typography>
          <Button
            component={Link}
            to="/brand/creators"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            크리에이터 찾기
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {getFilteredCollaborations().map((collab) => (
            <Grid item xs={12} md={6} key={collab.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={collab.creatorImage}
                      alt={collab.creatorName}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" component="div">
                        {collab.creatorName}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                        <Chip
                          label={getTypeText(collab.type)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={getStatusText(collab.status)}
                          size="small"
                          color={getStatusColor(collab.status) as any}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body1" gutterBottom>
                    {collab.description}
                  </Typography>

                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      기간: {new Date(collab.startDate).toLocaleDateString()} ~{" "}
                      {new Date(collab.endDate).toLocaleDateString()}
                    </Typography>
                    {collab.budget && (
                      <Typography variant="body2" color="text.secondary">
                        예산: {collab.budget.toLocaleString()}원
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    산출물:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}
                  >
                    {collab.deliverables.map((deliverable, index) => (
                      <Chip key={index} label={deliverable} size="small" />
                    ))}
                  </Box>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    마일스톤:
                  </Typography>
                  {collab.milestones.slice(0, 2).map((milestone) => (
                    <Box key={milestone.id} sx={{ mb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2">
                          {milestone.title}
                        </Typography>
                        <Chip
                          label={
                            milestone.status === "completed"
                              ? "완료"
                              : milestone.status === "in-progress"
                              ? "진행 중"
                              : milestone.status === "delayed"
                              ? "지연됨"
                              : "대기 중"
                          }
                          size="small"
                          color={
                            milestone.status === "completed"
                              ? "success"
                              : milestone.status === "in-progress"
                              ? "info"
                              : milestone.status === "delayed"
                              ? "error"
                              : "default"
                          }
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        기한: {new Date(milestone.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  ))}
                  {collab.milestones.length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      외 {collab.milestones.length - 2}개 마일스톤
                    </Typography>
                  )}
                </CardContent>
                <Divider />
                <CardActions>
                  <Button
                    component={Link}
                    to={`/brand/collaboration/${collab.id}`}
                    size="small"
                  >
                    상세 보기
                  </Button>
                  <Button
                    component={Link}
                    to={`/brand/messages/${collab.id}`}
                    size="small"
                    color="primary"
                  >
                    메시지
                  </Button>
                  {collab.status === "negotiation" && (
                    <Button size="small" color="secondary">
                      계약서 작성
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default BrandCollaborationsPage;
