import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Tooltip,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Info as InfoIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeLabel?: string;
  chartData?: {
    labels: string[];
    values: number[];
  };
  insights?: string[];
  isLoading?: boolean;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  unit,
  change,
  changeLabel,
  chartData,
  insights,
  isLoading = false,
}) => {
  const theme = useTheme();

  const renderChangeIndicator = () => {
    if (change === undefined) return null;

    const isPositive = change >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? "success.main" : "error.main";

    return (
      <Box display="flex" alignItems="center">
        <Icon sx={{ color, fontSize: 16, mr: 0.5 }} />
        <Typography variant="body2" sx={{ color, fontWeight: "medium" }}>
          {isPositive ? "+" : ""}
          {change}%{changeLabel && ` ${changeLabel}`}
        </Typography>
      </Box>
    );
  };

  const renderChart = () => {
    if (!chartData || !chartData.labels || !chartData.values) return null;

    const data = {
      labels: chartData.labels,
      datasets: [
        {
          label: title,
          data: chartData.values,
          borderColor: theme.palette.primary.main,
          backgroundColor: `${theme.palette.primary.main}20`,
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
        },
      ],
    };

    // Use type assertion to bypass TypeScript type checking for Chart.js options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 5,
          },
        },
        y: {
          grid: {
            borderDash: [2],
            drawBorder: false,
          },
          beginAtZero: true,
          ticks: {
            maxTicksLimit: 5,
          },
        },
      },
    } as any; // Type assertion to bypass strict type checking

    return (
      <Box sx={{ height: 120, mt: 2 }}>
        <Line data={data} options={options} />
      </Box>
    );
  };

  const renderInsights = () => {
    if (!insights || insights.length === 0) return null;

    return (
      <Box mt={2}>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" gutterBottom>
          Insights
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          {insights.map((insight, index) => (
            <Box key={index} display="flex" alignItems="flex-start">
              <InfoIcon
                sx={{
                  color: "info.main",
                  fontSize: 16,
                  mr: 1,
                  mt: 0.3,
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {insight}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        position: "relative",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Tooltip title="Share this insight">
          <IconButton size="small">
            <ShareIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box display="flex" alignItems="baseline" mt={1}>
        <Typography variant="h4" component="div" fontWeight="medium">
          {typeof value === "number" ? value.toLocaleString() : value}
        </Typography>
        {unit && (
          <Typography variant="body1" color="text.secondary" sx={{ ml: 1 }}>
            {unit}
          </Typography>
        )}
      </Box>

      {renderChangeIndicator()}
      {renderChart()}
      {renderInsights()}

      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: 2,
            zIndex: 1,
          }}
        >
          <Typography>Loading...</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AnalyticsCard;
