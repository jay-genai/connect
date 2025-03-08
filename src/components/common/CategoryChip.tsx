import React from "react";
import { Chip, ChipProps } from "@mui/material";

type CategoryType = "collaboration" | "content" | "personal" | "other";

interface CategoryChipProps extends Omit<ChipProps, "label"> {
  category: CategoryType;
  size?: "small" | "medium";
  variant?: "filled" | "outlined";
  customLabel?: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  size = "small",
  variant = "outlined",
  customLabel,
  ...props
}) => {
  const getCategoryLabel = (category: CategoryType) => {
    if (customLabel) return customLabel;

    switch (category) {
      case "collaboration":
        return "협업";
      case "content":
        return "콘텐츠";
      case "personal":
        return "개인";
      case "other":
        return "기타";
      default:
        return category;
    }
  };

  return (
    <Chip
      label={getCategoryLabel(category)}
      size={size}
      variant={variant}
      {...props}
    />
  );
};

export default CategoryChip;
