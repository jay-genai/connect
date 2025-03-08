import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { mockCreatorApi } from "../../services/mockApi";
import { Creator } from "../../types";

const BrandDashboard: React.FC = () => {
  const { user } = useAuth();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeCollaborations, setActiveCollaborations] = useState(0);
  const [pendingInquiries, setPendingInquiries] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 크리에이터 데이터 가져오기
        const response = await mockCreatorApi.getCreators();
        setCreators(response.data);
        setFilteredCreators(response.data);

        // 활성 협업 및 대기 중인 문의 수 가져오기 (실제로는 API 호출)
        setActiveCollaborations(3);
        setPendingInquiries(5);

        setLoading(false);
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 검색 기능
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCreators(creators);
    } else {
      const filtered = creators.filter(
        (creator) =>
          creator.displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          creator.categories.some((category) =>
            category.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredCreators(filtered);
    }
  }, [searchQuery, creators]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        안녕하세요, {user?.name || "브랜드"}님
      </Typography>

      {/* 요약 카드 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "primary.light",
              color: "white",
            }}
          >
            <Typography variant="h6" gutterBottom>
              활성 협업
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {activeCollaborations}
            </Typography>
            <Button
              component={Link}
              to="/brand/collaborations"
              variant="outlined"
              color="inherit"
              size="small"
            >
              모두 보기
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography variant="h6" gutterBottom>
              대기 중인 문의
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              {pendingInquiries}
            </Typography>
            <Button
              component={Link}
              to="/brand/inquiries"
              variant="outlined"
              color="primary"
              size="small"
            >
              관리하기
            </Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "secondary.light",
              color: "white",
            }}
          >
            <Typography variant="h6" gutterBottom>
              새 협업 시작하기
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              component={Link}
              to="/brand/creators"
              variant="contained"
              color="secondary"
              size="medium"
              sx={{ mt: 1 }}
            >
              크리에이터 찾기
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* 크리에이터 검색 섹션 */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          크리에이터 찾기
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="이름, 사용자명 또는 카테고리로 검색"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button startIcon={<FilterIcon />}>필터</Button>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
        </Box>

        <Grid container spacing={3}>
          {filteredCreators.slice(0, 6).map((creator) => (
            <Grid item xs={12} sm={6} md={4} key={creator.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      src={creator.profileImage}
                      alt={creator.displayName}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6" component="div">
                        {creator.displayName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{creator.username}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    팔로워: {creator.followers.toLocaleString()}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    {creator.categories.slice(0, 3).map((category, index) => (
                      <Chip
                        key={index}
                        label={category}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" noWrap>
                    {creator.bio}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button
                    component={Link}
                    to={`/@${creator.username}`}
                    size="small"
                  >
                    프로필 보기
                  </Button>
                  <Button
                    component={Link}
                    to={`/brand/inquiry/${creator.username}`}
                    size="small"
                    color="primary"
                  >
                    문의하기
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredCreators.length > 6 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button component={Link} to="/brand/creators" variant="outlined">
              더 많은 크리에이터 보기
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BrandDashboard;
