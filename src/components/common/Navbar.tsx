import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Creator, Brand } from "../../types";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, userType, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // 크리에이터 메뉴 항목
  const creatorMenuItems = [
    { text: "대시보드", path: "/creator/dashboard", icon: <DashboardIcon /> },
    { text: "협업", path: "/collaborations", icon: null },
    { text: "일정", path: "/calendar", icon: null },
    { text: "인사이트", path: "/insights", icon: null },
  ];

  // 브랜드 메뉴 항목
  const brandMenuItems = [
    { text: "대시보드", path: "/brand/dashboard", icon: <DashboardIcon /> },
    { text: "협업", path: "/brand/collaborations", icon: null },
    { text: "크리에이터 찾기", path: "/brand/creators", icon: null },
  ];

  // 현재 사용자 유형에 따른 메뉴 항목
  const menuItems = userType === "creator" ? creatorMenuItems : brandMenuItems;

  // 사용자 정보 가져오기
  const getUserDisplayName = () => {
    if (!user) return "User";

    if (userType === "creator") {
      return (user as Creator).displayName || (user as Creator).name;
    } else {
      return (user as Brand).name;
    }
  };

  const getUserProfileImage = () => {
    if (!user) return undefined;

    if (userType === "creator") {
      return (user as Creator).profileImage;
    } else {
      return (user as Brand).logo;
    }
  };

  const getUserUsername = () => {
    if (!user) return "";

    if (userType === "creator") {
      return (user as Creator).username;
    } else {
      return "";
    }
  };

  // 모바일 드로어 내용
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Connect
        </Typography>
      </Box>
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleDrawerToggle}
                sx={{
                  bgcolor: isActive(item.path) ? "action.selected" : "inherit",
                }}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem onClick={handleLogout}>
              <ListItemText primary="로그아웃" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem component={Link} to="/login" onClick={handleDrawerToggle}>
              <ListItemText primary="로그인" />
            </ListItem>
            <ListItem
              component={Link}
              to="/register"
              onClick={handleDrawerToggle}
            >
              <ListItemText primary="회원가입" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* 로고 */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 4,
              fontWeight: "bold",
              color: "text.primary",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            Connect
          </Typography>

          {/* 데스크톱 메뉴 */}
          {!isMobile && isAuthenticated && (
            <Box sx={{ flexGrow: 1, display: "flex" }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    mx: 1,
                    fontWeight: isActive(item.path) ? "bold" : "normal",
                    borderBottom: isActive(item.path)
                      ? `2px solid ${theme.palette.primary.main}`
                      : "none",
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: "transparent",
                      borderBottom: `2px solid ${theme.palette.primary.light}`,
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* 모바일 메뉴 토글 */}
          {isMobile && (
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

          {/* 우측 메뉴 */}
          <Box sx={{ flexGrow: isMobile ? 1 : 0, textAlign: "right" }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <Avatar
                    alt={getUserDisplayName()}
                    src={getUserProfileImage()}
                    sx={{ width: 32, height: 32 }}
                  />
                </IconButton>
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
                        userType === "creator"
                          ? `/@${getUserUsername()}`
                          : "/brand/profile"
                      );
                    }}
                  >
                    <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                    프로필
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleProfileMenuClose();
                      navigate("/settings");
                    }}
                  >
                    <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                    설정
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    로그아웃
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box>
                {!isMobile && (
                  <>
                    <Button
                      color="inherit"
                      component={Link}
                      to="/login"
                      sx={{ mr: 1 }}
                    >
                      로그인
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to="/register"
                    >
                      회원가입
                    </Button>
                  </>
                )}
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* 모바일 드로어 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
