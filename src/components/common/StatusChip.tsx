import React from "react";
import { Chip, ChipProps } from "@mui/material";

type StatusType =
  | "pending"
  | "in-progress"
  | "completed"
  | "canceled"
  | "cancelled"
  | "delayed"
  | "inquiry"
  | "negotiation"
  | "contracted";

interface StatusChipProps extends Omit<ChipProps, "label" | "color"> {
  status: StatusType;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
  customLabel?: string;
}

const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = "small",
  variant = "filled",
  customLabel,
  ...props
}) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "info";
      case "pending":
        return "default";
      case "canceled":
      case "cancelled":
        return "error";
      case "delayed":
        return "error";
      case "inquiry":
      case "negotiation":
        return "warning";
      case "contracted":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: StatusType) => {
    if (customLabel) return customLabel;

    switch (status) {
      case "completed":
        return "완료됨";
      case "in-progress":
        return "진행 중";
      case "pending":
        return "대기 중";
      case "canceled":
        return "취소됨";
      case "cancelled":
        return "취소됨";
      case "delayed":
        return "지연됨";
      case "inquiry":
        return "문의";
      case "negotiation":
        return "협상 중";
      case "contracted":
        return "계약 완료";
      default:
        return status;
    }
  };

  return (
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
      size={size}
      variant={variant}
      {...props}
    />
  );
};

export default StatusChip;
