import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Divider,
  Avatar,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Message as MessageIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Movie as MovieIcon,
  Publish as PublishIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Collaboration, Milestone } from "../../types";

interface CollaborationTicketProps {
  collaboration: Collaboration;
  onViewDetails: (id: string) => void;
}

const CollaborationTicket: React.FC<CollaborationTicketProps> = ({
  collaboration,
  onViewDetails,
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const statusColors: Record<
    string,
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
  > = {
    inquiry: "info",
    negotiation: "warning",
    contracted: "success",
    "in-progress": "primary",
    completed: "success",
    cancelled: "error",
  };

  const collaborationSteps = [
    {
      label: "최초 문의",
      description: "브랜드의 광고 관련 최초 문의 (일정 & 단가)",
    },
    {
      label: "비즈니스 조율",
      description: "크리에이터 회신 및 비즈니스 관련 조율",
    },
    { label: "계약 체결", description: "계약서 작성, 검토 및 체결" },
    { label: "컨텐츠 기획", description: "광고 컨텐츠 기획안 작성 및 피드백" },
    { label: "제작", description: "영상 촬영 및 편집" },
    { label: "검토", description: "가편 전달, 브랜드 검토 및 피드백, 수정" },
    { label: "업로드", description: "최종 컨텐츠 업로드" },
  ];

  // 현재 단계 결정 (실제로는 collaboration 상태와 마일스톤을 기반으로 계산)
  const getCurrentStep = () => {
    switch (collaboration.status) {
      case "inquiry":
        return 0;
      case "negotiation":
        return 1;
      case "contracted":
        return 2;
      case "in-progress":
        // 마일스톤 상태에 따라 3-5 단계 결정
        const completedMilestones = collaboration.milestones.filter(
          (m) => m.status === "completed"
        ).length;
        const totalMilestones = collaboration.milestones.length;
        const progress = completedMilestones / totalMilestones;

        if (progress < 0.3) return 3;
        if (progress < 0.7) return 4;
        return 5;
      case "completed":
        return 6;
      default:
        return 0;
    }
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleViewMessages = () => {
    navigate(`/messages/${collaboration.id}`);
  };

  const handleViewContract = () => {
    navigate(`/collaborations/${collaboration.id}/contract`);
  };

  const getNextActionText = () => {
    switch (collaboration.status) {
      case "inquiry":
        return "문의에 답변하기";
      case "negotiation":
        return "조건 협의하기";
      case "contracted":
        return "컨텐츠 기획 시작하기";
      case "in-progress":
        return "진행 상황 업데이트하기";
      case "completed":
        return "인사이트 확인하기";
      default:
        return "세부 정보 보기";
    }
  };

  const getNextActionHandler = () => {
    switch (collaboration.status) {
      case "inquiry":
      case "negotiation":
        return handleViewMessages;
      case "contracted":
        return () => onViewDetails(collaboration.id);
      case "in-progress":
        return () => onViewDetails(collaboration.id);
      case "completed":
        return () => navigate(`/collaborations/${collaboration.id}/insights`);
      default:
        return () => onViewDetails(collaboration.id);
    }
  };

  const renderUpcomingMilestones = () => {
    const pendingMilestones = collaboration.milestones
      .filter((m) => m.status === "pending" || m.status === "in-progress")
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );

    if (pendingMilestones.length === 0) {
      return (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, fontStyle: "italic" }}
        >
          모든 마일스톤이 완료되었습니다.
        </Typography>
      );
    }

    return (
      <List dense disablePadding>
        {pendingMilestones.slice(0, 3).map((milestone) => (
          <ListItem key={milestone.id} disablePadding sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {milestone.status === "in-progress" ? (
                <AssignmentIcon color="primary" fontSize="small" />
              ) : (
                <AssignmentIcon color="action" fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={milestone.title}
              secondary={`마감일: ${format(
                new Date(milestone.dueDate),
                "yyyy년 MM월 dd일"
              )}`}
              primaryTypographyProps={{
                variant: "body2",
                fontWeight:
                  milestone.status === "in-progress" ? "bold" : "normal",
              }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      {/* 헤더 섹션 */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          bgcolor: "background.default",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={collaboration.brandLogo}
            alt={collaboration.brandName || "브랜드"}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="h6" component="div">
              {collaboration.brandName || "브랜드 협업"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
              <Chip
                label={
                  collaboration.status === "inquiry"
                    ? "문의"
                    : collaboration.status === "negotiation"
                    ? "협의 중"
                    : collaboration.status === "contracted"
                    ? "계약 완료"
                    : collaboration.status === "in-progress"
                    ? "진행 중"
                    : collaboration.status === "completed"
                    ? "완료"
                    : "취소됨"
                }
                color={statusColors[collaboration.status]}
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                {collaboration.type === "seeding"
                  ? "시딩"
                  : collaboration.type === "advertisement"
                  ? "광고"
                  : collaboration.type === "partnership"
                  ? "파트너십"
                  : "기타"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {collaboration.budget && (
            <Chip
              icon={<MoneyIcon />}
              label={`${collaboration.budget.toLocaleString()}원`}
              variant="outlined"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          <IconButton
            size="small"
            onClick={handleToggleExpand}
            aria-expanded={expanded}
            aria-label="상세 정보 보기"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* 기본 정보 섹션 */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {collaboration.description.length > 100
            ? `${collaboration.description.substring(0, 100)}...`
            : collaboration.description}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="body2">
            <strong>기간:</strong>{" "}
            {format(new Date(collaboration.startDate), "yyyy.MM.dd")} -{" "}
            {format(new Date(collaboration.endDate), "yyyy.MM.dd")}
          </Typography>
          <Typography variant="body2">
            <strong>생성일:</strong>{" "}
            {format(
              new Date(collaboration.messages[0]?.timestamp || new Date()),
              "yyyy.MM.dd"
            )}
          </Typography>
        </Box>
      </Box>

      {/* 확장 섹션 */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            진행 단계
          </Typography>

          <Stepper
            activeStep={getCurrentStep()}
            orientation="vertical"
            sx={{ mt: 1 }}
          >
            {collaborationSteps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>{step.label}</StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            다가오는 마일스톤
          </Typography>
          {renderUpcomingMilestones()}
        </Box>

        <Divider />
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            startIcon={<MessageIcon />}
            onClick={handleViewMessages}
            size="small"
          >
            메시지
          </Button>

          {collaboration.status !== "inquiry" && (
            <Button
              startIcon={<DescriptionIcon />}
              onClick={handleViewContract}
              size="small"
            >
              계약서
            </Button>
          )}
        </Box>
      </Collapse>

      {/* 액션 섹션 */}
      <Divider />
      <Box sx={{ p: 2, bgcolor: "background.default" }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={getNextActionHandler()}
        >
          {getNextActionText()}
        </Button>
      </Box>
    </Paper>
  );
};

export default CollaborationTicket;
