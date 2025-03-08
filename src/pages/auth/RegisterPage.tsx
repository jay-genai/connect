import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Link as MuiLink,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 기본 정보
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userType: "creator",
  });

  // 크리에이터 정보
  const [creatorData, setCreatorData] = useState({
    displayName: "",
    username: "",
    bio: "",
    categories: "",
  });

  // 브랜드 정보
  const [brandData, setBrandData] = useState({
    brandName: "",
    industry: "",
    website: "",
    description: "",
  });

  // 유효성 검사 오류
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    displayName: false,
    username: false,
    brandName: false,
    industry: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 오류 상태 초기화
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleCreatorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreatorData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 오류 상태 초기화
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 오류 상태 초기화
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const validateBasicInfo = () => {
    const errors = {
      email: !formData.email.includes("@"),
      password: formData.password.length < 6,
      confirmPassword: formData.password !== formData.confirmPassword,
    };

    setFormErrors((prev) => ({
      ...prev,
      ...errors,
    }));

    return !Object.values(errors).some(Boolean);
  };

  const validateCreatorInfo = () => {
    const errors = {
      displayName: creatorData.displayName.trim() === "",
      username: creatorData.username.trim() === "",
    };

    setFormErrors((prev) => ({
      ...prev,
      ...errors,
    }));

    return !Object.values(errors).some(Boolean);
  };

  const validateBrandInfo = () => {
    const errors = {
      brandName: brandData.brandName.trim() === "",
      industry: brandData.industry.trim() === "",
    };

    setFormErrors((prev) => ({
      ...prev,
      ...errors,
    }));

    return !Object.values(errors).some(Boolean);
  };

  const handleNext = () => {
    if (activeStep === 0 && validateBasicInfo()) {
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (formData.userType === "creator" && validateCreatorInfo()) {
        setActiveStep(2);
      } else if (formData.userType === "brand" && validateBrandInfo()) {
        setActiveStep(2);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // 회원가입 데이터 준비
      const userData =
        formData.userType === "creator"
          ? {
              email: formData.email,
              password: formData.password,
              userType: formData.userType,
              displayName: creatorData.displayName,
              username: creatorData.username,
              bio: creatorData.bio,
              categories: creatorData.categories
                .split(",")
                .map((cat) => cat.trim()),
            }
          : {
              email: formData.email,
              password: formData.password,
              userType: formData.userType,
              name: brandData.brandName,
              industry: brandData.industry,
              website: brandData.website,
              description: brandData.description,
            };

      // 회원가입 API 호출
      await register(userData, formData.userType as "creator" | "brand");

      // 성공 시 대시보드로 이동
      navigate("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const steps = ["기본 정보", "프로필 정보", "완료"];

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Connect 회원가입
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {activeStep === 0 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="이메일"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={formErrors.email}
                    helperText={
                      formErrors.email ? "유효한 이메일을 입력해주세요" : ""
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="비밀번호"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={formErrors.password}
                    helperText={
                      formErrors.password
                        ? "비밀번호는 6자 이상이어야 합니다"
                        : ""
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="비밀번호 확인"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={formErrors.confirmPassword}
                    helperText={
                      formErrors.confirmPassword
                        ? "비밀번호가 일치하지 않습니다"
                        : ""
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">계정 유형</FormLabel>
                    <RadioGroup
                      row
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                    >
                      <FormControlLabel
                        value="creator"
                        control={<Radio />}
                        label="크리에이터"
                      />
                      <FormControlLabel
                        value="brand"
                        control={<Radio />}
                        label="브랜드"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && formData.userType === "creator" && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="이름"
                    name="displayName"
                    value={creatorData.displayName}
                    onChange={handleCreatorInputChange}
                    error={formErrors.displayName}
                    helperText={
                      formErrors.displayName ? "이름을 입력해주세요" : ""
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="사용자명"
                    name="username"
                    value={creatorData.username}
                    onChange={handleCreatorInputChange}
                    error={formErrors.username}
                    helperText={
                      formErrors.username
                        ? "사용자명을 입력해주세요"
                        : "프로필 URL에 사용됩니다 (예: @username)"
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="자기소개"
                    name="bio"
                    multiline
                    rows={3}
                    value={creatorData.bio}
                    onChange={handleCreatorInputChange}
                    placeholder="간단한 자기소개를 입력해주세요"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="카테고리"
                    name="categories"
                    value={creatorData.categories}
                    onChange={handleCreatorInputChange}
                    placeholder="콤마(,)로 구분하여 입력 (예: 테크, 라이프스타일, 뷰티)"
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && formData.userType === "brand" && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="브랜드명"
                    name="brandName"
                    value={brandData.brandName}
                    onChange={handleBrandInputChange}
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
                    label="산업 분야"
                    name="industry"
                    value={brandData.industry}
                    onChange={handleBrandInputChange}
                    error={formErrors.industry}
                    helperText={
                      formErrors.industry ? "산업 분야를 입력해주세요" : ""
                    }
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="웹사이트"
                    name="website"
                    value={brandData.website}
                    onChange={handleBrandInputChange}
                    placeholder="https://example.com"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="브랜드 설명"
                    name="description"
                    multiline
                    rows={3}
                    value={brandData.description}
                    onChange={handleBrandInputChange}
                    placeholder="브랜드에 대한 간단한 설명을 입력해주세요"
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                가입 정보 확인
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">이메일:</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="body1">{formData.email}</Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2">계정 유형:</Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Typography variant="body1">
                    {formData.userType === "creator" ? "크리에이터" : "브랜드"}
                  </Typography>
                </Grid>

                {formData.userType === "creator" && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">이름:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {creatorData.displayName}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">사용자명:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        @{creatorData.username}
                      </Typography>
                    </Grid>

                    {creatorData.categories && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2">카테고리:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Typography variant="body1">
                            {creatorData.categories}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {formData.userType === "brand" && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">브랜드명:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {brandData.brandName}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">산업 분야:</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        {brandData.industry}
                      </Typography>
                    </Grid>

                    {brandData.website && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2">웹사이트:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Typography variant="body1">
                            {brandData.website}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </>
                )}
              </Grid>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            {activeStep > 0 ? (
              <Button onClick={handleBack} disabled={loading}>
                이전
              </Button>
            ) : (
              <Button component={Link} to="/login" disabled={loading}>
                로그인으로 돌아가기
              </Button>
            )}

            {activeStep < 2 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={loading}
              >
                다음
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "가입하기"}
              </Button>
            )}
          </Box>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography variant="body2">
            이미 계정이 있으신가요?{" "}
            <MuiLink component={Link} to="/login">
              로그인하기
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
