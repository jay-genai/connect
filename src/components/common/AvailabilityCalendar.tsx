import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  useTheme,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWeekend,
  isBefore,
  startOfDay,
} from "date-fns";

interface AvailabilityCalendarProps {
  availableDates: string[];
  onDateSelect?: (date: string) => void;
  onDatesChange?: (dates: string[]) => void;
  isEditable?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  availableDates = [],
  onDateSelect,
  onDatesChange,
  isEditable = false,
  minDate = new Date(),
  maxDate = addMonths(new Date(), 3),
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDates, setSelectedDates] = useState<string[]>(availableDates);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [dateToConfirm, setDateToConfirm] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDates(availableDates);
  }, [availableDates]);

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  const handleDateClick = (day: Date) => {
    const today = startOfDay(new Date());

    // Prevent selecting dates in the past
    if (isBefore(day, today)) {
      return;
    }

    // If not editable, just call onDateSelect if provided
    if (!isEditable) {
      if (onDateSelect) {
        const dateString = day.toISOString();
        onDateSelect(dateString);
      }
      return;
    }

    const dateString = day.toISOString();

    // If date is already selected, remove it
    if (selectedDates.includes(dateString)) {
      const newSelectedDates = selectedDates.filter((d) => d !== dateString);
      setSelectedDates(newSelectedDates);
      if (onDatesChange) {
        onDatesChange(newSelectedDates);
      }
    } else {
      // If date is not selected, add it
      const newSelectedDates = [...selectedDates, dateString];
      setSelectedDates(newSelectedDates);
      if (onDatesChange) {
        onDatesChange(newSelectedDates);
      }
    }
  };

  const handleConfirmDate = () => {
    if (dateToConfirm && onDateSelect) {
      onDateSelect(dateToConfirm);
    }
    setConfirmDialogOpen(false);
    setDateToConfirm(null);
  };

  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    const startDate = startOfMonth(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <Grid item key={i} xs>
          <Typography variant="subtitle2" align="center">
            {format(addDays(startDate, i), dateFormat)}
          </Typography>
        </Grid>
      );
    }

    return <Grid container>{days}</Grid>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const today = startOfDay(new Date());

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isSelected = selectedDates.some((date) =>
          isSameDay(new Date(date), cloneDay)
        );
        const isDisabled =
          isBefore(day, today) ||
          isBefore(day, minDate) ||
          (maxDate && isBefore(maxDate, day));

        days.push(
          <Grid item key={day.toString()} xs>
            <Box
              sx={{
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isDisabled ? "default" : "pointer",
                borderRadius: "50%",
                backgroundColor: isSelected
                  ? theme.palette.primary.main
                  : isSameMonth(day, monthStart)
                  ? "transparent"
                  : theme.palette.grey[100],
                color: isSelected
                  ? theme.palette.primary.contrastText
                  : isDisabled
                  ? theme.palette.text.disabled
                  : isWeekend(day)
                  ? theme.palette.error.main
                  : isSameMonth(day, monthStart)
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: isDisabled
                    ? undefined
                    : isSelected
                    ? theme.palette.primary.dark
                    : theme.palette.action.hover,
                },
              }}
              onClick={() => !isDisabled && handleDateClick(cloneDay)}
            >
              {formattedDate}
            </Box>
          </Grid>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Grid container key={day.toString()} spacing={1}>
          {days}
        </Grid>
      );
      days = [];
    }
    return <Box sx={{ mt: 2 }}>{rows}</Box>;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button onClick={handlePreviousMonth}>&lt;</Button>
        <Typography variant="h6">
          {format(currentMonth, "MMMM yyyy")}
        </Typography>
        <Button onClick={handleNextMonth}>&gt;</Button>
      </Box>

      {renderDays()}
      {renderCells()}

      {isEditable && (
        <Box mt={3}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Dates:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {selectedDates.length > 0 ? (
              selectedDates.map((date) => (
                <Chip
                  key={date}
                  label={format(new Date(date), "MMM d, yyyy")}
                  onDelete={() => handleDateClick(new Date(date))}
                  color="primary"
                  size="small"
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No dates selected
              </Typography>
            )}
          </Box>
        </Box>
      )}

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Date Selection</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to select{" "}
            {dateToConfirm
              ? format(new Date(dateToConfirm), "MMMM d, yyyy")
              : ""}
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDate} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

// Helper functions
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  return result;
};

const endOfWeek = (date: Date): Date => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (6 - day));
  return result;
};

export default AvailabilityCalendar;
