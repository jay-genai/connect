import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Typography,
  Paper,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  PlayArrow as PlayIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Flag as FlagIcon,
  Business as BusinessIcon,
  Today as TodayIcon,
} from "@mui/icons-material";
import { format, isToday, isTomorrow, isAfter } from "date-fns";
import { Task, Collaboration } from "../../types";
import StatusChip from "../common/StatusChip";
import PriorityChip from "../common/PriorityChip";
import CategoryChip from "../common/CategoryChip";
import { formatFriendlyDate, isDueDatePassed } from "../../utils/dateUtils";

interface TaskListProps {
  tasks: Task[] | (() => Task[]);
  collaborations: Collaboration[];
  onStatusChange: (
    taskId: string,
    newStatus: "pending" | "in-progress" | "completed" | "canceled"
  ) => void;
  onDelete: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  collaborations,
  onStatusChange,
  onDelete,
}) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<{
    [key: string]: HTMLElement | null;
  }>({});

  const handleMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, taskId: string) => {
      setMenuAnchorEl((prev) => ({ ...prev, [taskId]: event.currentTarget }));
    },
    []
  );

  const handleMenuClose = useCallback((taskId: string) => {
    setMenuAnchorEl((prev) => ({ ...prev, [taskId]: null }));
  }, []);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon color="success" />;
      case "in-progress":
        return <PlayIcon color="info" />;
      case "pending":
        return <UncheckedIcon color="action" />;
      default:
        return <UncheckedIcon color="action" />;
    }
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const getCollaborationName = useCallback(
    (collaborationId?: string) => {
      if (!collaborationId) return null;
      const collaboration = collaborations.find(
        (c) => c.id === collaborationId
      );
      return collaboration ? collaboration.brandName : null;
    },
    [collaborations]
  );

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    if (isToday(date)) {
      return "오늘";
    } else if (isTomorrow(date)) {
      return "내일";
    } else {
      return format(date, "yyyy년 MM월 dd일");
    }
  };

  const taskList = typeof tasks === "function" ? tasks() : tasks;

  const emptyTasksView = useMemo(
    () => (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "background.default",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          태스크가 없습니다
        </Typography>
        <Typography variant="body2" color="text.secondary">
          새 태스크를 생성하여 일정을 관리하세요.
        </Typography>
      </Paper>
    ),
    []
  );

  if (taskList.length === 0) {
    return emptyTasksView;
  }

  return (
    <Paper elevation={1} sx={{ borderRadius: 2 }}>
      <List sx={{ width: "100%" }}>
        {taskList.map((task, index) => (
          <React.Fragment key={task.id}>
            <ListItem
              alignItems="flex-start"
              sx={{
                py: 2,
                bgcolor:
                  task.status === "completed" ? "action.hover" : "inherit",
              }}
            >
              <ListItemIcon
                onClick={() =>
                  onStatusChange(
                    task.id,
                    task.status === "completed" ? "pending" : "completed"
                  )
                }
                sx={{ cursor: "pointer" }}
              >
                {getStatusIcon(task.status)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        textDecoration:
                          task.status === "completed" ? "line-through" : "none",
                        color:
                          task.status === "completed"
                            ? "text.secondary"
                            : "text.primary",
                      }}
                    >
                      {task.title}
                    </Typography>
                    <PriorityChip
                      priority={task.priority}
                      size="small"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          textDecoration:
                            task.status === "completed"
                              ? "line-through"
                              : "none",
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                        mt: 1,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TodayIcon
                          fontSize="small"
                          sx={{ mr: 0.5, color: "text.secondary" }}
                        />
                        <Typography
                          variant="caption"
                          color={
                            isDueDatePassed(task.dueDate) &&
                            task.status !== "completed"
                              ? "error"
                              : "text.secondary"
                          }
                        >
                          {formatFriendlyDate(task.dueDate)}
                        </Typography>
                      </Box>
                      {task.collaborationId && (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <BusinessIcon
                            fontSize="small"
                            sx={{ mr: 0.5, color: "text.secondary" }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {getCollaborationName(task.collaborationId)}
                          </Typography>
                        </Box>
                      )}
                      <CategoryChip
                        category={task.category}
                        size="small"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={(e) => handleMenuOpen(e, task.id)}
                >
                  <MoreIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl[task.id]}
                  open={Boolean(menuAnchorEl[task.id])}
                  onClose={() => handleMenuClose(task.id)}
                >
                  <MenuItem onClick={() => onStatusChange(task.id, "pending")}>
                    <UncheckedIcon fontSize="small" sx={{ mr: 1 }} />
                    대기 중으로 변경
                  </MenuItem>
                  <MenuItem
                    onClick={() => onStatusChange(task.id, "in-progress")}
                  >
                    <PlayIcon fontSize="small" sx={{ mr: 1 }} />
                    진행 중으로 변경
                  </MenuItem>
                  <MenuItem
                    onClick={() => onStatusChange(task.id, "completed")}
                  >
                    <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                    완료로 변경
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => onDelete(task.id)}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    삭제
                  </MenuItem>
                </Menu>
              </ListItemSecondaryAction>
            </ListItem>
            {index < taskList.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default React.memo(TaskList);
