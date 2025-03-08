import { createTheme } from "@mui/material/styles";

// 색상 팔레트 정의
const primaryColor = {
  main: "#4361ee",
  light: "#738efc",
  dark: "#2c41b5",
  contrastText: "#ffffff",
};

const secondaryColor = {
  main: "#f72585",
  light: "#ff5ca8",
  dark: "#c00062",
  contrastText: "#ffffff",
};

// 테마 생성
const theme = createTheme({
  palette: {
    primary: primaryColor,
    secondary: secondaryColor,
    error: {
      main: "#ef476f",
      light: "#ff7a9c",
      dark: "#b80046",
    },
    warning: {
      main: "#ffd166",
      light: "#ffe499",
      dark: "#c9a03a",
    },
    info: {
      main: "#118ab2",
      light: "#4fb8e5",
      dark: "#006082",
    },
    success: {
      main: "#06d6a0",
      light: "#5dffd3",
      dark: "#00a371",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#2b2d42",
      secondary: "#6c757d",
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
  typography: {
    fontFamily: '"Pretendard", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
      letterSpacing: "-0.01em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      fontSize: "0.875rem",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0, 0, 0, 0.03)",
    "0px 4px 8px rgba(0, 0, 0, 0.05)",
    "0px 6px 12px rgba(0, 0, 0, 0.06)",
    "0px 8px 16px rgba(0, 0, 0, 0.07)",
    "0px 10px 20px rgba(0, 0, 0, 0.08)",
    "0px 12px 24px rgba(0, 0, 0, 0.09)",
    "0px 14px 28px rgba(0, 0, 0, 0.10)",
    "0px 16px 32px rgba(0, 0, 0, 0.11)",
    "0px 18px 36px rgba(0, 0, 0, 0.12)",
    "0px 20px 40px rgba(0, 0, 0, 0.13)",
    "0px 22px 44px rgba(0, 0, 0, 0.14)",
    "0px 24px 48px rgba(0, 0, 0, 0.15)",
    "0px 26px 52px rgba(0, 0, 0, 0.16)",
    "0px 28px 56px rgba(0, 0, 0, 0.17)",
    "0px 30px 60px rgba(0, 0, 0, 0.18)",
    "0px 32px 64px rgba(0, 0, 0, 0.19)",
    "0px 34px 68px rgba(0, 0, 0, 0.20)",
    "0px 36px 72px rgba(0, 0, 0, 0.21)",
    "0px 38px 76px rgba(0, 0, 0, 0.22)",
    "0px 40px 80px rgba(0, 0, 0, 0.23)",
    "0px 42px 84px rgba(0, 0, 0, 0.24)",
    "0px 44px 88px rgba(0, 0, 0, 0.25)",
    "0px 46px 92px rgba(0, 0, 0, 0.26)",
    "0px 48px 96px rgba(0, 0, 0, 0.27)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 8px rgba(38, 46, 86, 0.1)",
          },
          transition: "all 0.2s ease-in-out",
        },
        contained: {
          "&:hover": {
            boxShadow: "0px 6px 12px rgba(38, 46, 86, 0.15)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        },
        elevation2: {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 16,
        },
        sizeSmall: {
          height: 24,
          fontSize: "0.75rem",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          textTransform: "none",
          minHeight: 48,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: "3px 3px 0 0",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&.Mui-selected": {
            backgroundColor: `${primaryColor.main}15`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        },
      },
    },
  },
});

export default theme;
