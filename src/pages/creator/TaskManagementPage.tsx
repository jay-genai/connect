import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Today as TodayIcon,
  CalendarMonth as CalendarIcon,
  Flag as FlagIcon,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  format,
  isToday,
  isTomorrow,
  addDays,
  isAfter,
  isBefore,
} from "date-fns";
import { ko } from "date-fns/locale";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useAuth } from "../../context/AuthContext";
import TaskList from "../../components/creator/TaskList";
import MilestoneTimeline from "../../components/creator/MilestoneTimeline";
import { Task, Collaboration } from "../../types";
import { isDateWithinDays, isDueDatePassed } from "../../utils/dateUtils";

// 필터 및 정렬 옵션 타입 정의
type FilterOption =
  | "all"
  | "pending"
  | "in-progress"
  | "completed"
  | "today"
  | "tomorrow"
  | "upcoming";
type SortOption = "dueDate" | "priority" | "status";

const TaskManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [taskFilter, setTaskFilter] = useState<FilterOption>("all");
  const [taskSort, setTaskSort] = useState<SortOption>("dueDate");
  const [selectedCollaboration, setSelectedCollaboration] = useState<
    string | null
  >(null);

  const handleTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue);
    },
    []
  );

  const handleFilterClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setFilterAnchorEl(event.currentTarget);
    },
    []
  );

  const handleFilterClose = useCallback((filter: FilterOption) => {
    setTaskFilter(filter);
    setFilterAnchorEl(null);
  }, []);

  const handleSortClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setSortAnchorEl(event.currentTarget);
    },
    []
  );

  const handleSortClose = useCallback((sort: SortOption) => {
    setTaskSort(sort);
    setSortAnchorEl(null);
  }, []);

  const handleOpenTaskDialog = useCallback(() => {
    setOpenTaskDialog(true);
  }, []);

  const handleCloseTaskDialog = useCallback(() => {
    setOpenTaskDialog(false);
    taskFormik.resetForm();
  }, []);

  const handleCollaborationChange = useCallback((value: string) => {
    setSelectedCollaboration(value);
  }, []);

  const taskFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      priority: "medium",
      category: "collaboration",
      collaborationId: "",
      status: "pending",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("제목을 입력해주세요"),
      description: Yup.string(),
      dueDate: Yup.date().required("마감일을 선택해주세요"),
      priority: Yup.string().required("우선순위를 선택해주세요"),
      category: Yup.string().required("카테고리를 선택해주세요"),
      collaborationId: Yup.string().when("category", {
        is: "collaboration",
        then: (schema) => schema.required("협업을 선택해주세요"),
      }),
    }),
    onSubmit: async (values) => {
      try {
        const newTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
          creatorId: user?.id || "",
          title: values.title,
          description: values.description || "",
          dueDate: values.dueDate.toISOString(),
          status: "pending",
          priority: values.priority as "low" | "medium" | "high",
          category: values.category as
            | "content"
            | "collaboration"
            | "personal"
            | "other",
          collaborationId: values.collaborationId || undefined,
        };

        // 새 태스크 생성
        const newTaskWithId: Task = {
          ...newTask,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
        handleCloseTaskDialog();
      } catch (error) {
        console.error("태스크 생성 오류:", error);
      }
    },
  });

  const handleTaskStatusChange = useCallback(
    async (
      taskId: string,
      newStatus: "pending" | "in-progress" | "completed" | "canceled"
    ) => {
      try {
        // 태스크 상태 업데이트
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: newStatus,
                  completedAt:
                    newStatus === "completed"
                      ? new Date().toISOString()
                      : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : task
          )
        );
      } catch (error) {
        console.error("태스크 상태 업데이트 오류:", error);
      }
    },
    []
  );

  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      // 태스크 삭제
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("태스크 삭제 오류:", error);
    }
  }, []);

  // 필터링 및 정렬 로직을 별도 함수로 분리
  const getFilteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // 협업 필터링
    if (selectedCollaboration) {
      filtered = filtered.filter(
        (task) => task.collaborationId === selectedCollaboration
      );
    }

    // 상태 필터링
    switch (taskFilter) {
      case "pending":
        filtered = filtered.filter((task) => task.status === "pending");
        break;
      case "in-progress":
        filtered = filtered.filter((task) => task.status === "in-progress");
        break;
      case "completed":
        filtered = filtered.filter((task) => task.status === "completed");
        break;
      case "today":
        filtered = filtered.filter((task) => {
          const date = new Date(task.dueDate);
          return date.toDateString() === new Date().toDateString();
        });
        break;
      case "tomorrow":
        filtered = filtered.filter((task) => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const date = new Date(task.dueDate);
          return date.toDateString() === tomorrow.toDateString();
        });
        break;
      case "upcoming":
        filtered = filtered.filter((task) => isDateWithinDays(task.dueDate, 7));
        break;
      default:
        // "all" 필터는 추가 필터링 없음
        break;
    }

    // 정렬
    switch (taskSort) {
      case "dueDate":
        filtered.sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
        break;
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        break;
      case "status":
        const statusOrder = {
          "in-progress": 0,
          pending: 1,
          completed: 2,
          canceled: 3,
        };
        filtered.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
        break;
    }

    return filtered;
  }, [tasks, selectedCollaboration, taskFilter, taskSort]);

  const getCollaborationMilestones = useMemo(() => {
    if (!selectedCollaboration) {
      return [];
    }

    const collaboration = collaborations.find(
      (c) => c.id === selectedCollaboration
    );
    return collaboration ? collaboration.milestones : [];
  }, [collaborations, selectedCollaboration]);

  const selectedCollaborationData = useMemo(() => {
    return collaborations.find((c) => c.id === selectedCollaboration);
  }, [collaborations, selectedCollaboration]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!user?.id) {
          throw new Error("사용자 정보를 찾을 수 없습니다.");
        }

        // 임시 데이터
        const tasks: Task[] = [
          {
            id: "task1",
            creatorId: user.id,
            title: "브랜드 A 컨셉 기획",
            description: "여름 신제품 홍보 캠페인 컨셉 기획",
            dueDate: "2023-06-05",
            status: "completed",
            priority: "high",
            category: "collaboration",
            collaborationId: "collab1",
            createdAt: "2023-06-01",
            updatedAt: "2023-06-05",
            completedAt: "2023-06-05",
          },
          {
            id: "task2",
            creatorId: user.id,
            title: "브랜드 A 콘텐츠 촬영",
            description: "여름 신제품 홍보 캠페인 콘텐츠 촬영",
            dueDate: "2023-06-15",
            status: "completed",
            priority: "high",
            category: "collaboration",
            collaborationId: "collab1",
            createdAt: "2023-06-06",
            updatedAt: "2023-06-15",
            completedAt: "2023-06-15",
          },
          {
            id: "task3",
            creatorId: user.id,
            title: "브랜드 A 콘텐츠 편집",
            description: "여름 신제품 홍보 캠페인 콘텐츠 편집",
            dueDate: "2023-06-25",
            status: "in-progress",
            priority: "high",
            category: "collaboration",
            collaborationId: "collab1",
            createdAt: "2023-06-16",
            updatedAt: "2023-06-16",
          },
        ];
        const collaborations: Collaboration[] = [
          {
            id: "collab1",
            brandId: "brand1",
            creatorId: user.id,
            brandName: "브랜드 A",
            brandLogo: "https://via.placeholder.com/150",
            type: "advertisement",
            status: "in-progress",
            budget: 2000000,
            startDate: "2023-06-01",
            endDate: "2023-07-15",
            description: "여름 신제품 홍보 캠페인",
            deliverables: [
              "인스타그램 포스트 3개",
              "유튜브 영상 1개",
              "스토리 5개",
            ],
            milestones: [
              {
                id: "milestone1",
                title: "컨셉 기획 및 승인",
                description: "캠페인 컨셉 기획 및 브랜드 승인",
                dueDate: "2023-06-05",
                status: "completed",
              },
              {
                id: "milestone2",
                title: "콘텐츠 촬영",
                description: "제품 사진 및 영상 촬영",
                dueDate: "2023-06-15",
                status: "completed",
              },
              {
                id: "milestone3",
                title: "콘텐츠 편집 및 승인",
                description: "촬영된 콘텐츠 편집 및 브랜드 승인",
                dueDate: "2023-06-25",
                status: "in-progress",
              },
            ],
            messages: [],
          },
        ];

        setTasks(tasks);
        setCollaborations(collaborations);
        setLoading(false);
      } catch (err) {
        console.error("데이터 로딩 오류:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          태스크 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          브랜드 협업 마일스톤과 일일 태스크를 관리하세요.
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ px: 2, pt: 2 }}
        >
          <Tab icon={<TodayIcon />} label="일일 태스크" iconPosition="start" />
          <Tab icon={<CalendarIcon />} label="마일스톤" iconPosition="start" />
        </Tabs>

        <Divider sx={{ mt: 1 }} />

        <Box sx={{ p: 0 }}>
          {activeTab === 0 ? (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={handleFilterClick}
                    size="small"
                  >
                    필터
                  </Button>
                  <Menu
                    anchorEl={filterAnchorEl}
                    open={Boolean(filterAnchorEl)}
                    onClose={() => setFilterAnchorEl(null)}
                  >
                    <MenuItem onClick={() => handleFilterClose("all")}>
                      모든 태스크
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterClose("pending")}>
                      대기 중
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterClose("in-progress")}>
                      진행 중
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterClose("completed")}>
                      완료됨
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleFilterClose("today")}>
                      오늘
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterClose("tomorrow")}>
                      내일
                    </MenuItem>
                    <MenuItem onClick={() => handleFilterClose("upcoming")}>
                      다가오는 7일
                    </MenuItem>
                  </Menu>

                  <Button
                    variant="outlined"
                    startIcon={<SortIcon />}
                    onClick={handleSortClick}
                    size="small"
                  >
                    정렬
                  </Button>
                  <Menu
                    anchorEl={sortAnchorEl}
                    open={Boolean(sortAnchorEl)}
                    onClose={() => setSortAnchorEl(null)}
                  >
                    <MenuItem onClick={() => handleSortClose("dueDate")}>
                      마감일순
                    </MenuItem>
                    <MenuItem onClick={() => handleSortClose("priority")}>
                      우선순위순
                    </MenuItem>
                    <MenuItem onClick={() => handleSortClose("status")}>
                      상태순
                    </MenuItem>
                  </Menu>

                  <FormControl
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 200, ml: 1 }}
                  >
                    <InputLabel>협업 필터</InputLabel>
                    <Select
                      value={selectedCollaboration || ""}
                      onChange={(e) =>
                        handleCollaborationChange(e.target.value)
                      }
                      label="협업 필터"
                    >
                      <MenuItem value="">모든 협업</MenuItem>
                      {collaborations.map((collab) => (
                        <MenuItem key={collab.id} value={collab.id}>
                          {collab.brandName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenTaskDialog}
                >
                  새 태스크
                </Button>
              </Box>

              <TaskList
                tasks={getFilteredTasks}
                collaborations={collaborations}
                onStatusChange={handleTaskStatusChange}
                onDelete={handleDeleteTask}
              />
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <FormControl variant="outlined" sx={{ minWidth: 250 }}>
                  <InputLabel>브랜드 선택</InputLabel>
                  <Select
                    value={selectedCollaboration || ""}
                    onChange={(e) => handleCollaborationChange(e.target.value)}
                    label="브랜드 선택"
                  >
                    <MenuItem value="">브랜드를 선택하세요</MenuItem>
                    {collaborations.map((collab) => (
                      <MenuItem key={collab.id} value={collab.id}>
                        {collab.brandName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    마일스톤을 확인할 브랜드를 선택하세요
                  </FormHelperText>
                </FormControl>
              </Box>

              {selectedCollaboration ? (
                <MilestoneTimeline
                  milestones={getCollaborationMilestones}
                  collaboration={selectedCollaborationData}
                />
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 8,
                  }}
                >
                  <CalendarIcon
                    sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    브랜드를 선택하세요
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    마일스톤 타임라인을 확인하려면 브랜드를 선택하세요.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* 태스크 생성 다이얼로그 */}
      <Dialog
        open={openTaskDialog}
        onClose={handleCloseTaskDialog}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={taskFormik.handleSubmit}>
          <DialogTitle>새 태스크 생성</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="title"
                  name="title"
                  label="태스크 제목"
                  value={taskFormik.values.title}
                  onChange={taskFormik.handleChange}
                  error={
                    taskFormik.touched.title && Boolean(taskFormik.errors.title)
                  }
                  helperText={
                    taskFormik.touched.title && taskFormik.errors.title
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="설명"
                  multiline
                  rows={3}
                  value={taskFormik.values.description}
                  onChange={taskFormik.handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="마감일"
                  value={taskFormik.values.dueDate}
                  onChange={(date) => taskFormik.setFieldValue("dueDate", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error:
                        taskFormik.touched.dueDate &&
                        Boolean(taskFormik.errors.dueDate),
                      helperText:
                        taskFormik.touched.dueDate &&
                        (taskFormik.errors.dueDate as string),
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>우선순위</InputLabel>
                  <Select
                    id="priority"
                    name="priority"
                    value={taskFormik.values.priority}
                    onChange={taskFormik.handleChange}
                    label="우선순위"
                  >
                    <MenuItem value="low">낮음</MenuItem>
                    <MenuItem value="medium">중간</MenuItem>
                    <MenuItem value="high">높음</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    id="category"
                    name="category"
                    value={taskFormik.values.category}
                    onChange={taskFormik.handleChange}
                    label="카테고리"
                  >
                    <MenuItem value="collaboration">협업</MenuItem>
                    <MenuItem value="content">콘텐츠</MenuItem>
                    <MenuItem value="personal">개인</MenuItem>
                    <MenuItem value="other">기타</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                {taskFormik.values.category === "collaboration" && (
                  <FormControl
                    fullWidth
                    error={
                      taskFormik.touched.collaborationId &&
                      Boolean(taskFormik.errors.collaborationId)
                    }
                  >
                    <InputLabel>협업</InputLabel>
                    <Select
                      id="collaborationId"
                      name="collaborationId"
                      value={taskFormik.values.collaborationId}
                      onChange={taskFormik.handleChange}
                      label="협업"
                    >
                      {collaborations.map((collab) => (
                        <MenuItem key={collab.id} value={collab.id}>
                          {collab.brandName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {taskFormik.touched.collaborationId &&
                        taskFormik.errors.collaborationId}
                    </FormHelperText>
                  </FormControl>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTaskDialog}>취소</Button>
            <Button type="submit" variant="contained">
              생성
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default React.memo(TaskManagementPage);
