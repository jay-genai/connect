import React from "react";
import { Chip, ChipProps } from "@mui/material";

type PriorityType = "high" | "medium" | "low";

interface PriorityChipProps extends Omit<ChipProps, "label" | "color"> {
  priority: PriorityType;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
  customLabel?: string;
}

const PriorityChip: React.FC<PriorityChipProps> = ({
  priority,
  size = "small",
  variant = "filled",
  customLabel,
  ...props
}) => {
  const getPriorityColor = (priority: PriorityType) => {
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

  const getPriorityLabel = (priority: PriorityType) => {
    if (customLabel) return customLabel;

    switch (priority) {
      case "high":
        return "높음";
      case "medium":
        return "중간";
      case "low":
        return "낮음";
      default:
        return priority;
    }
  };

  return (
    <Chip
      label={getPriorityLabel(priority)}
      color={getPriorityColor(priority)}
      size={size}
      variant={variant}
      {...props}
    />
  );
};

export default PriorityChip;
