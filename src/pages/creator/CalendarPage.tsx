import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  Event as EventIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import CollaborationCalendar from "../../components/creator/CollaborationCalendar";
import AvailabilityCalendar from "../../components/common/AvailabilityCalendar";
import { creatorApi } from "../../services/api";
import { Creator } from "../../types";
import { mockCreatorApi } from "../../services/mockApi";

// 간단한 캘린더 컴포넌트
const SimpleCalendar: React.FC<{ availableDates: string[] }> = ({
  availableDates,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
  };

  const isDateAvailable = (day: number) => {
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];

    return availableDates.some((d) => d.startsWith(dateStr));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      selectedDate &&
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

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
        <Button onClick={prevMonth}>&lt;</Button>
        <Typography variant="h6">
          {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
        </Typography>
        <Button onClick={nextMonth}>&gt;</Button>
      </Box>

      <Grid container spacing={1}>
        {dayNames.map((day, index) => (
          <Grid item xs={12 / 7} key={index}>
            <Box sx={{ textAlign: "center", fontWeight: "bold", py: 1 }}>
              {day}
            </Box>
          </Grid>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <Grid item xs={12 / 7} key={`empty-${index}`}>
            <Box sx={{ height: 40 }}></Box>
          </Grid>
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const available = isDateAvailable(day);
          const today = isToday(day);
          const selected = isSelected(day);

          return (
            <Grid item xs={12 / 7} key={day}>
              <Box
                onClick={() => handleDateClick(day)}
                sx={{
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  borderRadius: "50%",
                  bgcolor: selected
                    ? "primary.main"
                    : available
                    ? "primary.light"
                    : "transparent",
                  color: selected
                    ? "white"
                    : available
                    ? "primary.contrastText"
                    : "text.primary",
                  border: today ? "2px solid" : "none",
                  borderColor: today ? "secondary.main" : "transparent",
                  "&:hover": {
                    bgcolor: !selected ? "action.hover" : undefined,
                  },
                }}
              >
                {day}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [availableDates, setAvailableDates] = useState<string[]>(
    creator?.availableDates || []
  );
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUpdateAvailability = async (dates: string[]) => {
    setIsUpdatingAvailability(true);
    try {
      await creatorApi.updateAvailability(creator?.id || "", dates);
      setAvailableDates(dates);
    } catch (error) {
      console.error("가용성 업데이트 오류:", error);
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        if (!user?.id) {
          throw new Error("사용자 정보를 찾을 수 없습니다.");
        }

        const response = await mockCreatorApi.getProfile(user.id);
        setCreator(response.data);
        setLoading(false);
      } catch (err) {
        setError("크리에이터 정보를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchCreator();
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
          일정 관리
        </Typography>
        <Typography variant="body1" color="text.secondary">
          협업 일정과 가용성을 관리하세요.
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ px: 2, pt: 2 }}
        >
          <Tab icon={<EventIcon />} label="협업 일정" iconPosition="start" />
          <Tab
            icon={<DateRangeIcon />}
            label="가용성 관리"
            iconPosition="start"
          />
        </Tabs>

        <Divider sx={{ mt: 1 }} />

        <Box sx={{ p: 0 }}>
          {activeTab === 0 ? (
            <CollaborationCalendar />
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
                <Typography variant="h5" component="h2" fontWeight="medium">
                  가용성 설정
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateAvailability(availableDates)}
                  disabled={isUpdatingAvailability}
                >
                  {isUpdatingAvailability ? "저장 중..." : "변경사항 저장"}
                </Button>
              </Box>

              <Typography variant="body1" paragraph>
                컨텐츠 제작이 가능한 날짜를 선택하세요. 브랜드가 협업을 요청할
                때 이 정보를 볼 수 있습니다.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <AvailabilityCalendar
                    availableDates={availableDates}
                    onDatesChange={setAvailableDates}
                    isEditable={true}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "background.default",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight="medium"
                    >
                      가용성 요약
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>선택된 날짜:</strong> {availableDates.length}일
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>다음 30일:</strong>{" "}
                        {
                          availableDates.filter((date) => {
                            const today = new Date();
                            const dateObj = new Date(date);
                            const diffTime =
                              dateObj.getTime() - today.getTime();
                            const diffDays = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );
                            return diffDays >= 0 && diffDays <= 30;
                          }).length
                        }
                        일 가능
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>31-60일:</strong>{" "}
                        {
                          availableDates.filter((date) => {
                            const today = new Date();
                            const dateObj = new Date(date);
                            const diffTime =
                              dateObj.getTime() - today.getTime();
                            const diffDays = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );
                            return diffDays > 30 && diffDays <= 60;
                          }).length
                        }
                        일 가능
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>61-90일:</strong>{" "}
                        {
                          availableDates.filter((date) => {
                            const today = new Date();
                            const dateObj = new Date(date);
                            const diffTime =
                              dateObj.getTime() - today.getTime();
                            const diffDays = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );
                            return diffDays > 60 && diffDays <= 90;
                          }).length
                        }
                        일 가능
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary">
                      브랜드가 협업을 요청할 때 이 정보를 볼 수 있습니다.
                      정기적으로 가용성을 업데이트하여 최신 상태를 유지하세요.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CalendarPage;
