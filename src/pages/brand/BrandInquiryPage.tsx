import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";
import { mockCreatorApi, mockInquiryApi } from "../../services/mockApi";
import { Creator } from "../../types";

const BrandInquiryPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 폼 상태
  const [formData, setFormData] = useState({
    brandName: "",
    brandEmail: "",
    inquiryType: "seeding",
    productDescription: "",
    budget: "",
    timeline: "",
    additionalInfo: "",
  });

  const [formErrors, setFormErrors] = useState({
    brandName: false,
    brandEmail: false,
    productDescription: false,
  });

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        if (!username) {
          throw new Error("크리에이터 사용자명이 필요합니다.");
        }

        // 실제로는 API 호출로 크리에이터 정보를 가져옵니다.
        // 여기서는 mockCreatorApi의 getCreators를 사용하여 모든 크리에이터를 가져온 후 필터링합니다.
        const response = await mockCreatorApi.getCreators();
        const foundCreator = response.data.find((c) => c.username === username);

        if (!foundCreator) {
          throw new Error("크리에이터를 찾을 수 없습니다.");
        }

        setCreator(foundCreator);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "크리에이터 정보를 불러오는 중 오류가 발생했습니다."
        );
        setLoading(false);
      }
    };

    fetchCreator();
  }, [username]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 상태 초기화
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {
      brandName: formData.brandName.trim() === "",
      brandEmail:
        formData.brandEmail.trim() === "" || !formData.brandEmail.includes("@"),
      productDescription: formData.productDescription.trim() === "",
    };

    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // 문의 데이터 준비
      const inquiryData = {
        brandName: formData.brandName,
        brandEmail: formData.brandEmail,
        brandLogo: "https://via.placeholder.com/150", // 실제로는 브랜드 로고 URL
        templateId: "template-1", // 실제로는 선택된 템플릿 ID
        type: formData.inquiryType,
        content: {
          productDescription: formData.productDescription,
          budget: formData.budget,
          timeline: formData.timeline,
          additionalInfo: formData.additionalInfo,
        },
      };

      // 문의 제출
      if (username) {
        await mockInquiryApi.submitInquiry(username, inquiryData);
        setSuccess(true);

        // 3초 후 대시보드로 리다이렉트
        setTimeout(() => {
          navigate("/brand/dashboard");
        }, 3000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "문의 제출 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !creator) {
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

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/brand/dashboard")}
        >
          대시보드로 돌아가기
        </Button>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          문의가 성공적으로 제출되었습니다. 곧 대시보드로 이동합니다.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/brand/dashboard")}
        >
          지금 대시보드로 이동
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {creator && (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <Avatar
                  src={creator.profileImage}
                  alt={creator.displayName}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={9}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {creator.displayName}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  @{creator.username}
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
                <Typography variant="body1" gutterBottom>
                  {creator.bio}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  팔로워: {creator.followers.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              {creator.displayName}님에게 문의하기
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="브랜드명"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    error={formErrors.brandName}
                    helperText={
                      formErrors.brandName ? "브랜드명을 입력해주세요" : ""
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="이메일"
                    name="brandEmail"
                    type="email"
                    value={formData.brandEmail}
                    onChange={handleInputChange}
                    error={formErrors.brandEmail}
                    helperText={
                      formErrors.brandEmail
                        ? "유효한 이메일을 입력해주세요"
                        : ""
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>문의 유형</InputLabel>
                    <Select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleSelectChange}
                      label="문의 유형"
                    >
                      <MenuItem value="seeding">제품 시딩</MenuItem>
                      <MenuItem value="advertisement">광고 콘텐츠</MenuItem>
                      <MenuItem value="partnership">장기 파트너십</MenuItem>
                      <MenuItem value="other">기타</MenuItem>
                    </Select>
                    <FormHelperText>
                      {formData.inquiryType === "seeding" &&
                        "제품을 제공하고 리뷰를 받습니다"}
                      {formData.inquiryType === "advertisement" &&
                        "유료 광고 콘텐츠를 의뢰합니다"}
                      {formData.inquiryType === "partnership" &&
                        "장기적인 협업 관계를 제안합니다"}
                      {formData.inquiryType === "other" && "기타 협업 제안"}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="제품/서비스 설명"
                    name="productDescription"
                    multiline
                    rows={4}
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    error={formErrors.productDescription}
                    helperText={
                      formErrors.productDescription
                        ? "제품 또는 서비스에 대한 설명을 입력해주세요"
                        : ""
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="예산 (선택사항)"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="예: 1,000,000원"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="희망 일정 (선택사항)"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    placeholder="예: 2023년 12월 중순"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="추가 정보 (선택사항)"
                    name="additionalInfo"
                    multiline
                    rows={3}
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Button variant="outlined" onClick={() => navigate(-1)}>
                      취소
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : "문의 보내기"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default BrandInquiryPage;
