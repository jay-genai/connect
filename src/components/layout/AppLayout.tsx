import React, { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  BarChart as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Handshake as HandshakeIcon,
  Campaign as CampaignIcon,
  Task as TaskIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 260;

interface AppLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  divider?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const { isAuthenticated, user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] =
    useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleProfileMenuClose();
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    if (userType === "creator") {
      return (user as any).displayName || (user as any).username || "";
    } else {
      return (user as any).name || "";
    }
  };

  const getUserProfileImage = () => {
    if (!user) return "";
    if (userType === "creator") {
      return (user as any).profileImage || "";
    } else {
      return (user as any).logo || "";
    }
  };

  const creatorMenuItems: (MenuItem | { divider: boolean })[] = [
    { text: "대시보드", icon: <DashboardIcon />, path: "/creator/dashboard" },
    {
      text: "콜라보레이션",
      icon: <HandshakeIcon />,
      path: "/creator/collaborations",
    },
    { text: "일정 관리", icon: <CalendarIcon />, path: "/creator/calendar" },
    { text: "태스크", icon: <TaskIcon />, path: "/creator/task-management" },
    { text: "인사이트", icon: <AnalyticsIcon />, path: "/creator/insights" },
    { divider: true },
    { text: "설정", icon: <SettingsIcon />, path: "/creator/settings" },
  ];

  const brandMenuItems: (MenuItem | { divider: boolean })[] = [
    { text: "대시보드", icon: <DashboardIcon />, path: "/brand/dashboard" },
    { text: "크리에이터 찾기", icon: <PeopleIcon />, path: "/brand/creators" },
    {
      text: "콜라보레이션",
      icon: <HandshakeIcon />,
      path: "/brand/collaborations",
    },
    { text: "문의하기", icon: <CampaignIcon />, path: "/brand/inquiry" },
    { divider: true },
    { text: "설정", icon: <SettingsIcon />, path: "/brand/settings" },
  ];

  const menuItems = userType === "creator" ? creatorMenuItems : brandMenuItems;

  const drawer = (
    <>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: [1],
          backgroundColor: theme.palette.primary.main,
          color: "white",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ fontWeight: "bold", letterSpacing: 1 }}
        >
          CONNECT
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          src={getUserProfileImage()}
          alt={getUserDisplayName()}
          sx={{
            width: 40,
            height: 40,
            border: "2px solid",
            borderColor: theme.palette.primary.main,
          }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {getUserDisplayName()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userType === "creator" ? "크리에이터" : "브랜드"}
          </Typography>
        </Box>
      </Box>
      <Divider />
      <List component="nav" sx={{ px: 1 }}>
        {menuItems.map((item, index) =>
          "divider" in item ? (
            <Divider key={`divider-${index}`} sx={{ my: 1 }} />
          ) : (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main + "20",
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main + "30",
                    },
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: "none",
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "white",
          color: "text.primary",
        }}
      >
        <Toolbar>
          {!open && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="알림">
              <IconButton
                size="large"
                color="inherit"
                onClick={handleNotificationsOpen}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="메시지">
              <IconButton size="large" color="inherit">
                <Badge badgeContent={5} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="프로필">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  src={getUserProfileImage()}
                  alt={getUserDisplayName()}
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: open ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        {children}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate(
              userType === "creator" ? "/creator/profile" : "/brand/profile"
            );
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>프로필</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleProfileMenuClose();
            navigate(
              userType === "creator" ? "/creator/settings" : "/brand/settings"
            );
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>설정</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>로그아웃</ListItemText>
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            알림
          </Typography>
        </Box>
        <MenuItem onClick={handleNotificationsClose}>
          <ListItemText
            primary="새로운 콜라보레이션 요청"
            secondary="테크기어에서 새로운 콜라보레이션을 제안했습니다."
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <ListItemText
            primary="일정 알림"
            secondary="내일 '제품 리뷰 촬영' 일정이 있습니다."
          />
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          <ListItemText
            primary="메시지 알림"
            secondary="스포츠웨어에서 새로운 메시지를 보냈습니다."
          />
        </MenuItem>
        <Box
          sx={{
            p: 1,
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <RouterLink
            to="/notifications"
            style={{
              textDecoration: "none",
              color: theme.palette.primary.main,
            }}
          >
            <Typography variant="body2">모든 알림 보기</Typography>
          </RouterLink>
        </Box>
      </Menu>
    </Box>
  );
};

export default AppLayout;
