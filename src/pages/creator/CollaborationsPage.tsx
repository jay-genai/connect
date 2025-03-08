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
  LinearProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { collaborationApi } from "../../services/apiOverride";
import { Collaboration } from "../../types";

const CollaborationsPage: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollaborations = async () => {
      try {
        if (!user?.id) {
          throw new Error("사용자 정보를 찾을 수 없습니다.");
        }

        const response = await collaborationApi.getByCreatorId(user.id);
        setCollaborations(response.data);
        setLoading(false);
      } catch (err) {
        setError("협업 데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, [user]);

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

  const calculateProgress = (collaboration: Collaboration) => {
    if (!collaboration.milestones || collaboration.milestones.length === 0) {
      return 0;
    }

    const completedMilestones = collaboration.milestones.filter(
      (milestone) => milestone.status === "completed"
    ).length;

    return (completedMilestones / collaboration.milestones.length) * 100;
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            아직 이 상태의 협업이 없습니다. 다른 탭을 확인해보세요.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {getFilteredCollaborations().map((collab) => (
            <Grid item xs={12} md={6} key={collab.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={collab.brandLogo}
                      alt={collab.brandName}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" component="div">
                        {collab.brandName}
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

                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
                    진행 상황
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(collab)}
                    sx={{ mb: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="right"
                  >
                    {Math.round(calculateProgress(collab))}% 완료
                  </Typography>

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
                </CardContent>
                <Divider />
                <CardActions>
                  <Button
                    component={Link}
                    to={`/collaboration/${collab.id}`}
                    size="small"
                  >
                    상세 보기
                  </Button>
                  <Button
                    component={Link}
                    to={`/messages/${collab.id}`}
                    size="small"
                    color="primary"
                  >
                    메시지
                  </Button>
                  {collab.status === "negotiation" && (
                    <Button
                      component={Link}
                      to={`/contract/${collab.id}`}
                      size="small"
                      color="secondary"
                    >
                      계약서 검토
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

export default CollaborationsPage;
