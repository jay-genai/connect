import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Pagination,
  Stack,
  SelectChangeEvent,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { mockCreatorApi } from "../../services/mockApi";
import { Creator } from "../../types";

const categories = [
  "전체",
  "테크",
  "뷰티",
  "패션",
  "음식",
  "여행",
  "피트니스",
  "라이프스타일",
  "게임",
  "교육",
];

const BrandCreatorsPage: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [followerRange, setFollowerRange] = useState<number[]>([0, 1000000]);
  const [showFilters, setShowFilters] = useState(false);

  // 페이지네이션
  const [page, setPage] = useState(1);
  const creatorsPerPage = 6;

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await mockCreatorApi.getCreators();
        setCreators(response.data);
        setFilteredCreators(response.data);

        // 팔로워 범위 설정
        const maxFollowers = Math.max(...response.data.map((c) => c.followers));
        setFollowerRange([0, maxFollowers]);

        setLoading(false);
      } catch (err) {
        setError("크리에이터 데이터를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  // 필터링 적용
  useEffect(() => {
    let result = [...creators];

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (creator) =>
          creator.displayName.toLowerCase().includes(query) ||
          creator.username.toLowerCase().includes(query) ||
          creator.bio.toLowerCase().includes(query)
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== "전체") {
      result = result.filter((creator) =>
        creator.categories.some(
          (category) =>
            category.toLowerCase() === selectedCategory.toLowerCase()
        )
      );
    }

    // 팔로워 수 필터링
    result = result.filter(
      (creator) =>
        creator.followers >= followerRange[0] &&
        creator.followers <= followerRange[1]
    );

    setFilteredCreators(result);
    setPage(1); // 필터 변경 시 첫 페이지로 이동
  }, [searchQuery, selectedCategory, followerRange, creators]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    setSelectedCategory(e.target.value);
  };

  const handleFollowerRangeChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setFollowerRange(newValue as number[]);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // 현재 페이지의 크리에이터
  const currentCreators = filteredCreators.slice(
    (page - 1) * creatorsPerPage,
    page * creatorsPerPage
  );

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
        크리에이터 찾기
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <TextField
            fullWidth
            placeholder="이름, 사용자명 또는 설명으로 검색"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}
          />
          <Button
            startIcon={<FilterIcon />}
            variant="outlined"
            onClick={() => setShowFilters(!showFilters)}
          >
            필터
          </Button>
        </Box>

        {showFilters && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    label="카테고리"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography gutterBottom>팔로워 수</Typography>
                <Box sx={{ px: 2 }}>
                  <Slider
                    value={followerRange}
                    onChange={handleFollowerRangeChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={Math.max(...creators.map((c) => c.followers))}
                    valueLabelFormat={(value) =>
                      `${(value / 10000).toFixed(1)}만`
                    }
                  />
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {(followerRange[0] / 10000).toFixed(1)}만
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(followerRange[1] / 10000).toFixed(1)}만
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredCreators.length}명의 크리에이터를 찾았습니다
        </Typography>
      </Box>

      {filteredCreators.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            검색 결과가 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            다른 검색어나 필터를 사용해보세요
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentCreators.map((creator) => (
              <Grid item xs={12} sm={6} md={4} key={creator.id}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={creator.profileImage}
                        alt={creator.displayName}
                        sx={{ width: 64, height: 64, mr: 2 }}
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
                      {creator.categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2 }} noWrap>
                      {creator.bio}
                    </Typography>

                    {creator.metrics && (
                      <Box sx={{ mb: 1 }}>
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          평균 조회수:{" "}
                          {creator.metrics.avgViews?.toLocaleString() ||
                            "정보 없음"}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          평균 참여율:{" "}
                          {creator.metrics.avgEngagementRate
                            ? `${(
                                creator.metrics.avgEngagementRate * 100
                              ).toFixed(1)}%`
                            : "정보 없음"}
                        </Typography>
                      </Box>
                    )}
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

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Stack spacing={2}>
              <Pagination
                count={Math.ceil(filteredCreators.length / creatorsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </Box>
        </>
      )}
    </Container>
  );
};

export default BrandCreatorsPage;
