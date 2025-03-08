import axios from "axios";
import {
  Creator,
  Brand,
  Collaboration,
  Message,
  Contract,
  ContentPerformance,
  Milestone,
  CreatorProfile,
  InquiryTemplate,
  Inquiry,
} from "../types";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Creator API
export const creatorApi = {
  getProfile: (creatorId: string) => api.get<Creator>(`/creators/${creatorId}`),
  updateProfile: (creatorId: string, data: Partial<Creator>) =>
    api.put<Creator>(`/creators/${creatorId}`, data),
  updateAvailability: (creatorId: string, dates: string[]) =>
    api.put<Creator>(`/creators/${creatorId}/availability`, {
      availableDates: dates,
    }),
  updatePricing: (creatorId: string, pricing: Creator["pricing"]) =>
    api.put<Creator>(`/creators/${creatorId}/pricing`, { pricing }),
  getMetrics: (creatorId: string) =>
    api.get<Creator["metrics"]>(`/creators/${creatorId}/metrics`),
  getInsights: (creatorId: string) =>
    api.get<{ insights: string[] }>(`/creators/${creatorId}/insights`),
  getPublicProfile: (username: string) =>
    api.get<CreatorProfile>(`/creators/username/${username}`),
  getInquiryTemplates: (creatorId: string) =>
    api.get<InquiryTemplate[]>(`/creators/${creatorId}/inquiry-templates`),
  updateInquiryTemplate: (
    creatorId: string,
    templateId: string,
    data: Partial<InquiryTemplate>
  ) =>
    api.put<InquiryTemplate>(
      `/creators/${creatorId}/inquiry-templates/${templateId}`,
      data
    ),
  createInquiryTemplate: (
    creatorId: string,
    data: Omit<InquiryTemplate, "id">
  ) =>
    api.post<InquiryTemplate>(`/creators/${creatorId}/inquiry-templates`, data),
  deleteInquiryTemplate: (creatorId: string, templateId: string) =>
    api.delete(`/creators/${creatorId}/inquiry-templates/${templateId}`),
  getInquiries: (creatorId: string, status?: Inquiry["status"]) =>
    api.get<Inquiry[]>(`/creators/${creatorId}/inquiries`, {
      params: { status },
    }),
  respondToInquiry: (creatorId: string, inquiryId: string, response: string) =>
    api.post<Inquiry>(`/creators/${creatorId}/inquiries/${inquiryId}/respond`, {
      response,
    }),
  convertInquiryToCollaboration: (
    creatorId: string,
    inquiryId: string,
    collaborationData: Partial<Collaboration>
  ) =>
    api.post<Collaboration>(
      `/creators/${creatorId}/inquiries/${inquiryId}/convert`,
      collaborationData
    ),
  rejectInquiry: (creatorId: string, inquiryId: string, reason?: string) =>
    api.post<Inquiry>(`/creators/${creatorId}/inquiries/${inquiryId}/reject`, {
      reason,
    }),
};

// Brand API
export const brandApi = {
  getProfile: (brandId: string) => api.get<Brand>(`/brands/${brandId}`),
  updateProfile: (brandId: string, data: Partial<Brand>) =>
    api.put<Brand>(`/brands/${brandId}`, data),
  getCollaborationHistory: (brandId: string) =>
    api.get<Collaboration[]>(`/brands/${brandId}/collaborations`),
};

// Collaboration API
export const collaborationApi = {
  create: (data: Omit<Collaboration, "id">) =>
    api.post<Collaboration>("/collaborations", data),
  getById: (collaborationId: string) =>
    api.get<Collaboration>(`/collaborations/${collaborationId}`),
  getByCreatorId: (creatorId: string, filters?: { status?: string[] }) =>
    api.get<Collaboration[]>(`/creators/${creatorId}/collaborations`, {
      params: filters,
    }),
  getByBrandId: (brandId: string, filters?: { status?: string[] }) =>
    api.get<Collaboration[]>(`/brands/${brandId}/collaborations`, {
      params: filters,
    }),
  update: (collaborationId: string, data: Partial<Collaboration>) =>
    api.put<Collaboration>(`/collaborations/${collaborationId}`, data),
  getMessages: (collaborationId: string) =>
    api.get<Message[]>(`/collaborations/${collaborationId}/messages`),
  sendMessage: (
    collaborationId: string,
    message: Omit<Message, "id" | "timestamp">
  ) =>
    api.post<Message>(`/collaborations/${collaborationId}/messages`, message),
  getMilestones: (collaborationId: string) =>
    api.get<Collaboration["milestones"]>(
      `/collaborations/${collaborationId}/milestones`
    ),
  addMilestone: (collaborationId: string, milestone: Partial<Milestone>) =>
    api.post<Milestone>(
      `/collaborations/${collaborationId}/milestones`,
      milestone
    ),
  updateMilestone: (
    collaborationId: string,
    milestoneId: string,
    data: Partial<Collaboration["milestones"][0]>
  ) =>
    api.put(
      `/collaborations/${collaborationId}/milestones/${milestoneId}`,
      data
    ),
  getContract: (collaborationId: string) =>
    api.get<Contract>(`/collaborations/${collaborationId}/contract`),
  updateContract: (collaborationId: string, data: Partial<Contract>) =>
    api.put<Contract>(`/collaborations/${collaborationId}/contract`, data),
  getPerformance: (collaborationId: string) =>
    api.get<ContentPerformance[]>(
      `/collaborations/${collaborationId}/performance`
    ),
};

// AI Assistant API
export const aiApi = {
  getAutoResponse: (query: string, creatorId: string) =>
    api.post<{ response: string }>("/ai/auto-response", { query, creatorId }),
  getLegalAdvice: (contractText: string) =>
    api.post<{ advice: string[] }>("/ai/legal-advice", { contractText }),
  getContentInsights: (contentData: any) =>
    api.post<{ insights: string[] }>("/ai/content-insights", contentData),
  getGrowthRecommendations: (creatorId: string) =>
    api.post<{ recommendations: string[] }>("/ai/growth-recommendations", {
      creatorId,
    }),
};

// Authentication API
export const authApi = {
  login: (email: string, password: string, userType: "creator" | "brand") =>
    api.post<{ token: string; user: Creator | Brand }>("/auth/login", {
      email,
      password,
      userType,
    }),
  register: (
    userData: Partial<Creator | Brand>,
    userType: "creator" | "brand"
  ) =>
    api.post<{ token: string; user: Creator | Brand }>("/auth/register", {
      ...userData,
      userType,
    }),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get<Creator | Brand>("/auth/me"),
};

// Inquiry API
export const inquiryApi = {
  submitInquiry: (
    username: string,
    data: Omit<Inquiry, "id" | "creatorId" | "status" | "createdAt">
  ) => api.post<Inquiry>(`/inquiries/${username}`, data),
  verifyEmail: (inquiryId: string, verificationCode: string) =>
    api.post<{ success: boolean }>(`/inquiries/${inquiryId}/verify`, {
      verificationCode,
    }),
  getInquiryStatus: (inquiryId: string, brandEmail: string) =>
    api.get<Inquiry>(`/inquiries/${inquiryId}/status`, {
      params: { email: brandEmail },
    }),
};

export default api;
