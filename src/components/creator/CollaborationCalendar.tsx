import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  parseISO,
  isWeekend,
} from "date-fns";
import { ko } from "date-fns/locale";
import { useAuth } from "../../context/AuthContext";
import { Collaboration, Milestone } from "../../types";
import { collaborationApi } from "../../services/api";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  collaborationId: string;
  brandName: string;
  type: "milestone" | "deliverable" | "meeting";
  status: "pending" | "in-progress" | "completed" | "delayed";
  milestoneId?: string;
}

const CollaborationCalendar: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: "",
    type: "milestone",
    status: "pending",
    date: new Date(),
  });

  useEffect(() => {
    fetchCollaborations();
  }, []);

  useEffect(() => {
    if (collaborations.length > 0) {
      generateEvents();
    }
  }, [collaborations]);

  const fetchCollaborations = async () => {
    setIsLoading(true);
    try {
      // 실제 구현에서는 API에서 협업 정보를 가져옵니다
      const response = await collaborationApi.getByCreatorId(user?.id || "", {
        status: ["negotiation", "contracted", "in-progress"],
      });
      setCollaborations(response.data);
    } catch (error) {
      console.error("협업 정보 가져오기 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEvents = () => {
    const newEvents: CalendarEvent[] = [];

    collaborations.forEach((collaboration) => {
      // 마일스톤 이벤트 추가
      collaboration.milestones.forEach((milestone) => {
        newEvents.push({
          id: `milestone-${milestone.id}`,
          title: milestone.title,
          date: parseISO(milestone.dueDate),
          collaborationId: collaboration.id,
          brandName: collaboration.brandName || "브랜드",
          type: "milestone",
          status: milestone.status,
          milestoneId: milestone.id,
        });
      });

      // 계약 시작일 이벤트 추가
      newEvents.push({
        id: `start-${collaboration.id}`,
        title: `${collaboration.brandName || "브랜드"} 협업 시작`,
        date: parseISO(collaboration.startDate),
        collaborationId: collaboration.id,
        brandName: collaboration.brandName || "브랜드",
        type: "deliverable",
        status: "pending",
      });

      // 계약 종료일 이벤트 추가
      newEvents.push({
        id: `end-${collaboration.id}`,
        title: `${collaboration.brandName || "브랜드"} 협업 종료`,
        date: parseISO(collaboration.endDate),
        collaborationId: collaboration.id,
        brandName: collaboration.brandName || "브랜드",
        type: "deliverable",
        status: "pending",
      });
    });

    setEvents(newEvents);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleCloseEventDialog = () => {
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleOpenAddEventDialog = () => {
    if (!selectedDate) return;

    setNewEvent({
      title: "",
      type: "milestone",
      status: "pending",
      date: selectedDate,
    });

    setIsAddEventDialogOpen(true);
  };

  const handleCloseAddEventDialog = () => {
    setIsAddEventDialogOpen(false);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.collaborationId) return;

    const event: CalendarEvent = {
      id: `new-event-${Date.now()}`,
      title: newEvent.title || "",
      date: newEvent.date || new Date(),
      collaborationId: newEvent.collaborationId || "",
      brandName:
        collaborations.find((c) => c.id === newEvent.collaborationId)
          ?.brandName || "브랜드",
      type: newEvent.type as "milestone" | "deliverable" | "meeting",
      status: newEvent.status as
        | "pending"
        | "in-progress"
        | "completed"
        | "delayed",
    };

    setEvents([...events, event]);

    // 실제 구현에서는 API를 통해 마일스톤을 추가합니다
    if (event.type === "milestone" && event.collaborationId) {
      const newMilestone: Partial<Milestone> = {
        title: event.title,
        description: "",
        dueDate: event.date.toISOString(),
        status: event.status,
      };

      collaborationApi
        .addMilestone(event.collaborationId, newMilestone)
        .catch((error) => console.error("마일스톤 추가 오류:", error));
    }

    handleCloseAddEventDialog();
  };

  const handleUpdateEventStatus = async (
    status: "pending" | "in-progress" | "completed" | "delayed"
  ) => {
    if (!selectedEvent) return;

    // 이벤트 상태 업데이트
    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id ? { ...event, status } : event
    );

    setEvents(updatedEvents);

    // 실제 구현에서는 API를 통해 마일스톤 상태를 업데이트합니다
    if (selectedEvent.type === "milestone" && selectedEvent.milestoneId) {
      try {
        await collaborationApi.updateMilestone(
          selectedEvent.collaborationId,
          selectedEvent.milestoneId,
          { status }
        );
      } catch (error) {
        console.error("마일스톤 상태 업데이트 오류:", error);
      }
    }

    handleCloseEventDialog();
  };

  const renderHeader = () => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton onClick={handlePreviousMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="h5" component="h2" fontWeight="medium">
          {format(currentMonth, "yyyy년 MM월", { locale: ko })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "E";
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      days.push(
        <Grid item key={i} xs>
          <Typography
            variant="subtitle2"
            align="center"
            sx={{
              color:
                i === 0
                  ? "error.main"
                  : i === 6
                  ? "primary.main"
                  : "text.primary",
              fontWeight: "medium",
            }}
          >
            {format(day, dateFormat, { locale: ko })}
          </Typography>
        </Grid>
      );
    }

    return <Grid container>{days}</Grid>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isToday = isSameDay(day, new Date());
        const dayEvents = events.filter((event) => isSameDay(event.date, day));

        days.push(
          <Grid item key={day.toString()} xs>
            <Paper
              elevation={isSelected ? 3 : 0}
              sx={{
                height: 120,
                p: 1,
                bgcolor: isSelected
                  ? "primary.light"
                  : isToday
                  ? "secondary.light"
                  : isSameMonth(day, monthStart)
                  ? "background.paper"
                  : "background.default",
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: isSelected ? "primary.light" : "action.hover",
                },
              }}
              onClick={() => handleDateClick(cloneDay)}
            >
              <Typography
                variant="body2"
                align="center"
                sx={{
                  fontWeight: isToday ? "bold" : "normal",
                  color: isWeekend(day) ? "error.main" : "text.primary",
                }}
              >
                {format(day, "d")}
              </Typography>

              <Box sx={{ mt: 1, maxHeight: 85, overflow: "auto" }}>
                {dayEvents.map((event) => (
                  <Chip
                    key={event.id}
                    label={
                      event.title.length > 15
                        ? `${event.title.substring(0, 15)}...`
                        : event.title
                    }
                    size="small"
                    color={
                      event.status === "completed"
                        ? "success"
                        : event.status === "delayed"
                        ? "error"
                        : event.status === "in-progress"
                        ? "primary"
                        : "default"
                    }
                    variant={event.type === "milestone" ? "filled" : "outlined"}
                    sx={{
                      mb: 0.5,
                      width: "100%",
                      height: "auto",
                      "& .MuiChip-label": {
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container key={day.toString()} spacing={0}>
          {days}
        </Grid>
      );
      days = [];
    }
    return <Box>{rows}</Box>;
  };

  const renderSelectedDateEvents = () => {
    if (!selectedDate) return null;

    const dayEvents = events.filter((event) =>
      isSameDay(event.date, selectedDate)
    );

    if (dayEvents.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            선택한 날짜에 일정이 없습니다.
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={handleOpenAddEventDialog}
          >
            일정 추가
          </Button>
        </Box>
      );
    }

    return (
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight="medium">
            {format(selectedDate, "yyyy년 MM월 dd일 (E)", { locale: ko })} 일정
          </Typography>
          <Button
            startIcon={<AddIcon />}
            size="small"
            onClick={handleOpenAddEventDialog}
          >
            일정 추가
          </Button>
        </Box>

        {dayEvents.map((event) => (
          <Box
            key={event.id}
            sx={{
              p: 1.5,
              mb: 1,
              borderLeft: "4px solid",
              borderColor:
                event.status === "completed"
                  ? "success.main"
                  : event.status === "delayed"
                  ? "error.main"
                  : event.status === "in-progress"
                  ? "primary.main"
                  : "grey.400",
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
              cursor: "pointer",
              "&:hover": {
                boxShadow: 2,
                bgcolor: "action.hover",
              },
            }}
            onClick={() => handleEventClick(event)}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="subtitle2">{event.title}</Typography>
              <Chip
                label={
                  event.status === "completed"
                    ? "완료"
                    : event.status === "delayed"
                    ? "지연"
                    : event.status === "in-progress"
                    ? "진행 중"
                    : "예정"
                }
                size="small"
                color={
                  event.status === "completed"
                    ? "success"
                    : event.status === "delayed"
                    ? "error"
                    : event.status === "in-progress"
                    ? "primary"
                    : "default"
                }
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              {event.brandName} -{" "}
              {event.type === "milestone"
                ? "마일스톤"
                : event.type === "deliverable"
                ? "결과물"
                : "미팅"}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={9}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          {renderHeader()}
          {renderDays()}
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            renderCells()
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
          {renderSelectedDateEvents()}
        </Paper>
      </Grid>

      {/* 이벤트 상세 다이얼로그 */}
      <Dialog
        open={isEventDialogOpen}
        onClose={handleCloseEventDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {selectedEvent.title}
                <Chip
                  label={
                    selectedEvent.status === "completed"
                      ? "완료"
                      : selectedEvent.status === "delayed"
                      ? "지연"
                      : selectedEvent.status === "in-progress"
                      ? "진행 중"
                      : "예정"
                  }
                  color={
                    selectedEvent.status === "completed"
                      ? "success"
                      : selectedEvent.status === "delayed"
                      ? "error"
                      : selectedEvent.status === "in-progress"
                      ? "primary"
                      : "default"
                  }
                  size="small"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle2" gutterBottom>
                날짜:{" "}
                {format(selectedEvent.date, "yyyy년 MM월 dd일 (E)", {
                  locale: ko,
                })}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                브랜드: {selectedEvent.brandName}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                유형:{" "}
                {selectedEvent.type === "milestone"
                  ? "마일스톤"
                  : selectedEvent.type === "deliverable"
                  ? "결과물"
                  : "미팅"}
              </Typography>

              {selectedEvent.type === "milestone" && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    상태 변경
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      variant={
                        selectedEvent.status === "pending"
                          ? "contained"
                          : "outlined"
                      }
                      color="info"
                      size="small"
                      onClick={() => handleUpdateEventStatus("pending")}
                    >
                      예정
                    </Button>
                    <Button
                      variant={
                        selectedEvent.status === "in-progress"
                          ? "contained"
                          : "outlined"
                      }
                      color="primary"
                      size="small"
                      onClick={() => handleUpdateEventStatus("in-progress")}
                    >
                      진행 중
                    </Button>
                    <Button
                      variant={
                        selectedEvent.status === "completed"
                          ? "contained"
                          : "outlined"
                      }
                      color="success"
                      size="small"
                      onClick={() => handleUpdateEventStatus("completed")}
                    >
                      완료
                    </Button>
                    <Button
                      variant={
                        selectedEvent.status === "delayed"
                          ? "contained"
                          : "outlined"
                      }
                      color="error"
                      size="small"
                      onClick={() => handleUpdateEventStatus("delayed")}
                    >
                      지연
                    </Button>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEventDialog}>닫기</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* 이벤트 추가 다이얼로그 */}
      <Dialog
        open={isAddEventDialogOpen}
        onClose={handleCloseAddEventDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>일정 추가</DialogTitle>
        <DialogContent>
          <TextField
            label="제목"
            fullWidth
            margin="normal"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>협업</InputLabel>
            <Select
              value={newEvent.collaborationId || ""}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  collaborationId: e.target.value as string,
                })
              }
              label="협업"
            >
              {collaborations.map((collaboration) => (
                <MenuItem key={collaboration.id} value={collaboration.id}>
                  {collaboration.brandName || "브랜드"} -{" "}
                  {collaboration.type === "seeding"
                    ? "시딩"
                    : collaboration.type === "advertisement"
                    ? "광고"
                    : collaboration.type === "partnership"
                    ? "파트너십"
                    : "기타"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>유형</InputLabel>
            <Select
              value={newEvent.type || "milestone"}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  type: e.target.value as
                    | "milestone"
                    | "deliverable"
                    | "meeting",
                })
              }
              label="유형"
            >
              <MenuItem value="milestone">마일스톤</MenuItem>
              <MenuItem value="deliverable">결과물</MenuItem>
              <MenuItem value="meeting">미팅</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>상태</InputLabel>
            <Select
              value={newEvent.status || "pending"}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  status: e.target.value as
                    | "pending"
                    | "in-progress"
                    | "completed"
                    | "delayed",
                })
              }
              label="상태"
            >
              <MenuItem value="pending">예정</MenuItem>
              <MenuItem value="in-progress">진행 중</MenuItem>
              <MenuItem value="completed">완료</MenuItem>
              <MenuItem value="delayed">지연</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddEventDialog}>취소</Button>
          <Button
            onClick={handleAddEvent}
            variant="contained"
            color="primary"
            disabled={!newEvent.title || !newEvent.collaborationId}
          >
            추가
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default CollaborationCalendar;
