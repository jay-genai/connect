import React, { useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Alert,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { Milestone, Collaboration } from "../../types";
import StatusChip from "../common/StatusChip";
import { formatKoreanDate, isDueDatePassed } from "../../utils/dateUtils";

interface MilestoneTimelineProps {
  milestones: Milestone[] | (() => Milestone[]);
  collaboration?: Collaboration;
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  collaboration,
}) => {
  const milestoneList =
    typeof milestones === "function" ? milestones() : milestones;

  const sortedMilestones = useMemo(
    () =>
      [...milestoneList].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      ),
    [milestoneList]
  );

  const getActiveStep = useCallback(() => {
    const completedCount = milestoneList.filter(
      (milestone) => milestone.status === "completed"
    ).length;

    if (completedCount === milestoneList.length) {
      return milestoneList.length;
    }

    const inProgressIndex = sortedMilestones.findIndex(
      (milestone) => milestone.status === "in-progress"
    );

    if (inProgressIndex !== -1) {
      return inProgressIndex;
    }

    return completedCount;
  }, [milestoneList, sortedMilestones]);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon color="success" />;
      case "in-progress":
        return <PlayArrowIcon color="info" />;
      case "delayed":
        return <WarningIcon color="error" />;
      case "pending":
        return <ScheduleIcon color="action" />;
      default:
        return <ScheduleIcon color="action" />;
    }
  }, []);

  const collaborationTypeLabel = useMemo(() => {
    if (!collaboration) return "";

    switch (collaboration.type) {
      case "seeding":
        return "제품 시딩";
      case "advertisement":
        return "광고 콘텐츠";
      case "partnership":
        return "장기 파트너십";
      default:
        return "기타";
    }
  }, [collaboration]);

  const emptyMilestonesView = useMemo(
    () => (
      <Alert severity="info" sx={{ mt: 2 }}>
        이 협업에 설정된 마일스톤이 없습니다.
      </Alert>
    ),
    []
  );

  if (milestoneList.length === 0) {
    return emptyMilestonesView;
  }

  return (
    <Box>
      {collaboration && (
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            {collaboration.brandName} 협업 정보
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                협업 유형
              </Typography>
              <Typography variant="body1">{collaborationTypeLabel}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                기간
              </Typography>
              <Typography variant="body1">
                {formatKoreanDate(collaboration.startDate)} ~{" "}
                {formatKoreanDate(collaboration.endDate)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                상태
              </Typography>
              <StatusChip status={collaboration.status} />
            </Box>
            {collaboration.budget && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  예산
                </Typography>
                <Typography variant="body1">
                  {collaboration.budget.toLocaleString()}원
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      <Typography variant="h6" gutterBottom>
        마일스톤 타임라인
      </Typography>

      <Stepper activeStep={getActiveStep()} orientation="vertical">
        {sortedMilestones.map((milestone, index) => (
          <Step key={milestone.id}>
            <StepLabel
              StepIconComponent={() => getStatusIcon(milestone.status)}
              optional={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {formatKoreanDate(milestone.dueDate)}
                  </Typography>
                  <StatusChip
                    status={milestone.status}
                    size="small"
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                </Box>
              }
            >
              <Typography
                variant="subtitle1"
                color={
                  milestone.status === "delayed" ||
                  (isDueDatePassed(milestone.dueDate) &&
                    milestone.status !== "completed")
                    ? "error.main"
                    : "text.primary"
                }
              >
                {milestone.title}
              </Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {milestone.description}
                </Typography>
                {milestone.feedback && (
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, mt: 1, bgcolor: "background.default" }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      피드백
                    </Typography>
                    <Typography variant="body2">
                      {milestone.feedback}
                    </Typography>
                  </Paper>
                )}
                {milestone.status === "delayed" && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    이 마일스톤은 지연되었습니다. 브랜드와 일정 조정이 필요할 수
                    있습니다.
                  </Alert>
                )}
                {isDueDatePassed(milestone.dueDate) &&
                  milestone.status !== "completed" && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      마감일이 지났습니다. 가능한 빨리 완료하세요.
                    </Alert>
                  )}
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default React.memo(MilestoneTimeline);
