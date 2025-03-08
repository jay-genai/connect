import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  SmartToy as AIIcon,
  Help as HelpIcon,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import { aiApi } from "../../services/api";

interface AutoResponseTemplate {
  id: string;
  name: string;
  triggerKeywords: string[];
  responseText: string;
  isActive: boolean;
}

const defaultTemplates: AutoResponseTemplate[] = [
  {
    id: "1",
    name: "시딩 문의 자동 응답",
    triggerKeywords: ["시딩", "제품 협찬", "제품 리뷰"],
    responseText:
      "안녕하세요! 시딩 문의에 감사드립니다. 현재 저의 시딩 단가는 [단가]원이며, 제품 리뷰는 [일정]일 이내에 진행됩니다. 자세한 내용은 추가 문의 부탁드립니다.",
    isActive: true,
  },
  {
    id: "2",
    name: "광고 문의 자동 응답",
    triggerKeywords: ["광고", "브랜디드", "유료 광고"],
    responseText:
      "안녕하세요! 광고 문의에 감사드립니다. 현재 저의 광고 단가는 [단가]원이며, 컨셉과 일정에 따라 조정될 수 있습니다. 구체적인 내용 논의를 위해 추가 정보 부탁드립니다.",
    isActive: true,
  },
  {
    id: "3",
    name: "협업 불가 자동 응답",
    triggerKeywords: ["담배", "주류", "도박", "성인"],
    responseText:
      "안녕하세요! 문의에 감사드립니다. 죄송하지만 해당 카테고리의 제품/서비스는 제 채널의 컨셉과 맞지 않아 협업이 어렵습니다. 다른 기회에 다시 연락주시면 감사하겠습니다.",
    isActive: true,
  },
];

const AutoResponseSettings: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] =
    useState<AutoResponseTemplate[]>(defaultTemplates);
  const [globalAutoResponseEnabled, setGlobalAutoResponseEnabled] =
    useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<AutoResponseTemplate | null>(null);
  const [newKeyword, setNewKeyword] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 API에서 템플릿을 가져옵니다
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleToggleGlobal = () => {
    setGlobalAutoResponseEnabled(!globalAutoResponseEnabled);
  };

  const handleToggleTemplate = (id: string) => {
    setTemplates(
      templates.map((template) =>
        template.id === id
          ? { ...template, isActive: !template.isActive }
          : template
      )
    );
  };

  const handleEditTemplate = (template: AutoResponseTemplate) => {
    setEditingTemplate({ ...template });
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    setTemplates(
      templates.map((template) =>
        template.id === editingTemplate.id ? editingTemplate : template
      )
    );

    setEditingTemplate(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddTemplate = () => {
    const newTemplate: AutoResponseTemplate = {
      id: `template-${Date.now()}`,
      name: "새 자동 응답",
      triggerKeywords: [],
      responseText: "",
      isActive: false,
    };

    setTemplates([...templates, newTemplate]);
    handleEditTemplate(newTemplate);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((template) => template.id !== id));
    if (editingTemplate?.id === id) {
      setEditingTemplate(null);
    }
  };

  const handleAddKeyword = () => {
    if (!editingTemplate || !newKeyword.trim()) return;

    setEditingTemplate({
      ...editingTemplate,
      triggerKeywords: [...editingTemplate.triggerKeywords, newKeyword.trim()],
    });

    setNewKeyword("");
  };

  const handleRemoveKeyword = (keyword: string) => {
    if (!editingTemplate) return;

    setEditingTemplate({
      ...editingTemplate,
      triggerKeywords: editingTemplate.triggerKeywords.filter(
        (k) => k !== keyword
      ),
    });
  };

  const handleGenerateAIResponse = async () => {
    if (!editingTemplate) return;

    setIsGeneratingAI(true);
    try {
      // 실제 구현에서는 AI API를 호출합니다
      const prompt = `다음 키워드에 대한 자동 응답 메시지를 생성해주세요: ${editingTemplate.triggerKeywords.join(
        ", "
      )}. 템플릿 이름: ${editingTemplate.name}`;

      const response = await aiApi.getAutoResponse(prompt, user?.id || "");
      setAiSuggestion(response.data.response);
    } catch (error) {
      console.error("AI 응답 생성 오류:", error);
      setAiSuggestion(
        "AI 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleUseAISuggestion = () => {
    if (!editingTemplate || !aiSuggestion) return;

    setEditingTemplate({
      ...editingTemplate,
      responseText: aiSuggestion,
    });

    setAiSuggestion("");
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="medium">
          자동 응답 설정
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={globalAutoResponseEnabled}
              onChange={handleToggleGlobal}
              color="primary"
            />
          }
          label="자동 응답 활성화"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" paragraph>
        자동 응답 기능을 사용하면 특정 키워드가 포함된 문의에 자동으로 응답할 수
        있습니다. 템플릿을 설정하고 활성화하여 반복적인 문의에 효율적으로
        대응하세요.
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          자동 응답 설정이 저장되었습니다.
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            {templates.map((template) => (
              <Accordion
                key={template.id}
                expanded={editingTemplate?.id === template.id}
                onChange={() =>
                  editingTemplate?.id === template.id
                    ? setEditingTemplate(null)
                    : handleEditTemplate(template)
                }
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle1">{template.name}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FormControlLabel
                        control={
                          <Switch
                            size="small"
                            checked={template.isActive}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleTemplate(template.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        }
                        label={template.isActive ? "활성" : "비활성"}
                        sx={{ mr: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {editingTemplate?.id === template.id ? (
                    <Box>
                      <TextField
                        label="템플릿 이름"
                        fullWidth
                        margin="normal"
                        value={editingTemplate.name}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            name: e.target.value,
                          })
                        }
                      />

                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        트리거 키워드
                        <Tooltip title="이 키워드가 포함된 문의가 들어오면 자동 응답이 발송됩니다">
                          <IconButton size="small">
                            <HelpIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        {editingTemplate.triggerKeywords.map((keyword) => (
                          <Chip
                            key={keyword}
                            label={keyword}
                            onDelete={() => handleRemoveKeyword(keyword)}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                        <TextField
                          label="새 키워드 추가"
                          size="small"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddKeyword()
                          }
                        />
                        <Button
                          variant="outlined"
                          onClick={handleAddKeyword}
                          disabled={!newKeyword.trim()}
                        >
                          추가
                        </Button>
                      </Box>

                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        응답 메시지
                      </Typography>

                      <TextField
                        label="자동 응답 내용"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        value={editingTemplate.responseText}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            responseText: e.target.value,
                          })
                        }
                        placeholder="문의에 대한 자동 응답 내용을 입력하세요. [단가], [일정] 등의 변수를 사용할 수 있습니다."
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Button
                          startIcon={<AIIcon />}
                          variant="outlined"
                          onClick={handleGenerateAIResponse}
                          disabled={
                            isGeneratingAI ||
                            editingTemplate.triggerKeywords.length === 0
                          }
                        >
                          {isGeneratingAI ? "생성 중..." : "AI 응답 생성"}
                        </Button>

                        <Button
                          startIcon={<SaveIcon />}
                          variant="contained"
                          color="primary"
                          onClick={handleSaveTemplate}
                        >
                          저장
                        </Button>
                      </Box>

                      {aiSuggestion && (
                        <Box
                          sx={{
                            mt: 3,
                            p: 2,
                            bgcolor: "background.default",
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            AI 추천 응답:
                          </Typography>
                          <Typography variant="body2" paragraph>
                            {aiSuggestion}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={handleUseAISuggestion}
                          >
                            이 응답 사용하기
                          </Button>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        트리거 키워드:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        {template.triggerKeywords.map((keyword) => (
                          <Chip
                            key={keyword}
                            label={keyword}
                            color="primary"
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        응답 메시지:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {template.responseText}
                      </Typography>

                      <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={() => handleEditTemplate(template)}
                      >
                        수정
                      </Button>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            fullWidth
            onClick={handleAddTemplate}
          >
            새 자동 응답 템플릿 추가
          </Button>
        </>
      )}
    </Paper>
  );
};

export default AutoResponseSettings;
