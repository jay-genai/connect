import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ko } from "date-fns/locale";
import { InquiryTemplate, InquiryField } from "../../types";
import { inquiryApi } from "../../services/apiOverride";

interface InquiryFormProps {
  template: InquiryTemplate;
  creatorUsername: string;
  onSubmit: () => void;
  onCancel: () => void;
}

interface FormValues {
  [key: string]: any;
}

interface FormErrors {
  [key: string]: string;
}

const InquiryForm: React.FC<InquiryFormProps> = ({
  template,
  creatorUsername,
  onSubmit,
  onCancel,
}) => {
  const [values, setValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [inquiryId, setInquiryId] = useState<string | null>(null);

  const handleChange = (field: InquiryField, value: any) => {
    setValues({
      ...values,
      [field.name]: value,
    });

    // 에러 상태 초기화
    if (errors[field.name]) {
      setErrors({
        ...errors,
        [field.name]: "",
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    template.fields.forEach((field) => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = "필수 입력 항목입니다.";
        isValid = false;
      }

      // 이메일 유효성 검사
      if (field.name === "brandEmail" && values[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(values[field.name])) {
          newErrors[field.name] = "유효한 이메일 주소를 입력해주세요.";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await inquiryApi.submitInquiry(creatorUsername, {
        brandName: values.brandName || "",
        brandEmail: values.brandEmail || "",
        brandLogo: values.brandLogo,
        templateId: template.id,
        type: template.type,
        content: values,
      });

      setInquiryId(response.data.id);
      setIsVerifying(true);
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      setSubmitError("문의 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async () => {
    if (!inquiryId || !verificationCode) return;

    setIsSubmitting(true);
    setVerificationError(null);

    try {
      await inquiryApi.verifyEmail(inquiryId, verificationCode);
      onSubmit();
    } catch (error) {
      console.error("Error verifying email:", error);
      setVerificationError("인증 코드가 올바르지 않습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: InquiryField) => {
    switch (field.type) {
      case "text":
        return (
          <TextField
            key={field.id}
            label={field.label}
            fullWidth
            margin="normal"
            value={values[field.name] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
          />
        );

      case "textarea":
        return (
          <TextField
            key={field.id}
            label={field.label}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={values[field.name] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
          />
        );

      case "select":
        return (
          <FormControl
            key={field.id}
            fullWidth
            margin="normal"
            error={!!errors[field.name]}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={values[field.name] || ""}
              onChange={(e) => handleChange(field, e.target.value)}
              label={field.label}
              required={field.required}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {errors[field.name] && (
              <FormHelperText>{errors[field.name]}</FormHelperText>
            )}
          </FormControl>
        );

      case "date":
        return (
          <LocalizationProvider
            key={field.id}
            dateAdapter={AdapterDateFns}
            adapterLocale={ko}
          >
            <DatePicker
              label={field.label}
              value={values[field.name] ? new Date(values[field.name]) : null}
              onChange={(date: Date | null) =>
                handleChange(field, date?.toISOString())
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  required: field.required,
                  error: !!errors[field.name],
                  helperText: errors[field.name],
                },
              }}
            />
          </LocalizationProvider>
        );

      case "checkbox":
        return (
          <FormControl
            key={field.id}
            fullWidth
            margin="normal"
            error={!!errors[field.name]}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!values[field.name]}
                  onChange={(e) => handleChange(field, e.target.checked)}
                />
              }
              label={field.label}
            />
            {errors[field.name] && (
              <FormHelperText>{errors[field.name]}</FormHelperText>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  if (isVerifying) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, bgcolor: "background.default", borderRadius: 2 }}
      >
        <Typography variant="h6" gutterBottom>
          이메일 인증
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {values.brandEmail}로 인증 코드가 발송되었습니다. 이메일을 확인하고
          아래에 인증 코드를 입력해주세요.
        </Typography>

        {verificationError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {verificationError}
          </Alert>
        )}

        <TextField
          label="인증 코드"
          fullWidth
          margin="normal"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="인증 코드 6자리를 입력해주세요"
          required
        />

        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerify}
            disabled={isSubmitting || !verificationCode}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "인증 완료"}
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        {template.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {template.description}
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      {template.fields.map((field) => renderField(field))}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
          취소
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "문의 제출"}
        </Button>
      </Box>
    </Box>
  );
};

export default InquiryForm;
