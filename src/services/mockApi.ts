import {
  testCreator,
  testCreatorProfile,
  defaultInquiryTemplates,
  sampleInquiries,
  loginCredentials,
  sampleCreators,
  testBrand,
} from "../utils/mockData";
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
  Task,
  SubTask,
  DailySchedule,
} from "../types";

// 지연 시간 시뮬레이션 (ms)
const DELAY = 500;

// 목업 데이터 저장소
let creator = { ...testCreator };
let creatorProfile = { ...testCreatorProfile };
let brand = { ...testBrand };
let inquiryTemplates = [...defaultInquiryTemplates];
let inquiries = [...sampleInquiries];
let currentUser: Creator | Brand | null = null;
let tasks: Task[] = [
  {
    id: "task-1",
    creatorId: "creator-1",
    title: "테크기어 제품 리뷰 촬영",
    description: "스마트워치 언박싱 및 기능 테스트 영상 촬영",
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 2)
    ).toISOString(),
    status: "pending",
    priority: "high",
    category: "collaboration",
    tags: ["촬영", "리뷰", "테크"],
    collaborationId: "collab-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      {
        id: "subtask-1",
        taskId: "task-1",
        title: "촬영 장비 준비",
        status: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: "subtask-2",
        taskId: "task-1",
        title: "스크립트 작성",
        status: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: "subtask-3",
        taskId: "task-1",
        title: "촬영 진행",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: "subtask-4",
        taskId: "task-1",
        title: "편집 및 업로드",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "task-2",
    creatorId: "creator-1",
    title: "스포츠웨어 인스타그램 포스팅",
    description: "새로운 스포츠웨어 라인 착용 사진 3장 포스팅",
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 5)
    ).toISOString(),
    status: "in-progress",
    priority: "medium",
    category: "collaboration",
    tags: ["인스타그램", "패션", "스포츠"],
    collaborationId: "collab-2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subtasks: [
      {
        id: "subtask-5",
        taskId: "task-2",
        title: "컨셉 기획",
        status: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: "subtask-6",
        taskId: "task-2",
        title: "촬영 장소 섭외",
        status: "completed",
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      },
      {
        id: "subtask-7",
        taskId: "task-2",
        title: "사진 촬영",
        status: "in-progress",
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "task-3",
    creatorId: "creator-1",
    title: "주간 콘텐츠 기획 회의",
    description: "다음 달 콘텐츠 방향성 및 일정 논의",
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 1)
    ).toISOString(),
    status: "pending",
    priority: "high",
    category: "content",
    tags: ["회의", "기획", "콘텐츠"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    creatorId: "creator-1",
    title: "유튜브 채널 분석 및 전략 수립",
    description: "지난 달 성과 분석 및 개선 방안 도출",
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 7)
    ).toISOString(),
    status: "pending",
    priority: "medium",
    category: "content",
    tags: ["분석", "전략", "유튜브"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    creatorId: "creator-1",
    title: "푸드브랜드 콜라보레이션 제안서 검토",
    description: "새로운 콜라보레이션 제안 검토 및 답변 준비",
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 3)
    ).toISOString(),
    status: "pending",
    priority: "low",
    category: "collaboration",
    tags: ["제안", "검토", "푸드"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let dailySchedules: DailySchedule[] = [
  {
    date: new Date().toISOString(),
    tasks: tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    }),
    availabilityStatus: "partially-available",
    workHours: {
      start: "10:00",
      end: "18:00",
    },
    notes: "오전에는 회의, 오후에는 촬영 예정",
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    tasks: tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
      return (
        taskDate.getDate() === tomorrow.getDate() &&
        taskDate.getMonth() === tomorrow.getMonth() &&
        taskDate.getFullYear() === tomorrow.getFullYear()
      );
    }),
    availabilityStatus: "available",
    workHours: {
      start: "09:00",
      end: "17:00",
    },
  },
  {
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    tasks: tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const dayAfterTomorrow = new Date(
        new Date().setDate(new Date().getDate() + 2)
      );
      return (
        taskDate.getDate() === dayAfterTomorrow.getDate() &&
        taskDate.getMonth() === dayAfterTomorrow.getMonth() &&
        taskDate.getFullYear() === dayAfterTomorrow.getFullYear()
      );
    }),
    availabilityStatus: "unavailable",
    notes: "개인 일정으로 불가능",
  },
];

// 지연 함수
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 응답 생성 함수
const createResponse = <T>(
  data: T,
  success = true,
  status = 200,
  message = ""
) => {
  return {
    data,
    success,
    status,
    message,
  };
};

// 인증 API
export const mockAuthApi = {
  login: async (email: string, password: string, type: "creator" | "brand") => {
    await delay(DELAY);

    if (type === "creator") {
      if (
        email === testCreator.email &&
        password === loginCredentials.password
      ) {
        return {
          success: true,
          data: {
            token: "mock-token",
            user: { ...testCreator },
          },
        };
      }
    } else if (type === "brand") {
      if (email === testBrand.email && password === testBrand.password) {
        return {
          success: true,
          data: {
            token: "mock-brand-token",
            user: { ...testBrand, password: undefined },
          },
        };
      }
    }

    throw new Error("Invalid credentials");
  },

  register: async (
    userData: Partial<Creator | Brand>,
    userType: "creator" | "brand"
  ) => {
    await delay(DELAY);

    if (userType === "creator") {
      const creatorData = userData as Partial<Creator>;
      const newCreator: Creator = {
        id: `creator-${Date.now()}`,
        username: creatorData.username || `user_${Date.now()}`,
        displayName: creatorData.displayName || creatorData.name || "",
        name: creatorData.name || "",
        email: creatorData.email || "",
        bio: creatorData.bio || "",
        followers: 0,
        following: 0,
        channels: [],
        availableDates: [],
        pricing: {},
        categories: [],
        ...creatorData,
      };

      creator = newCreator;
      currentUser = creator;
      return createResponse({ token: "mock-token", user: creator });
    }

    throw new Error("Brand registration not implemented");
  },

  logout: async () => {
    await delay(DELAY);
    currentUser = null;
    return createResponse({ success: true });
  },

  getCurrentUser: async () => {
    await delay(DELAY);

    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    return createResponse(currentUser);
  },
};

// 크리에이터 API
export const mockCreatorApi = {
  getCreators: async () => {
    await delay(DELAY);
    return createResponse(sampleCreators);
  },

  getProfile: async (creatorId: string) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      return createResponse(creator);
    }

    throw new Error("Creator not found");
  },

  updateProfile: async (creatorId: string, data: Partial<Creator>) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      creator = { ...creator, ...data };
      return createResponse(creator);
    }

    throw new Error("Creator not found");
  },

  updateAvailability: async (creatorId: string, dates: string[]) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      creator.availableDates = dates;
      creatorProfile.availableDates = dates;
      return createResponse(creator);
    }

    throw new Error("Creator not found");
  },

  updatePricing: async (creatorId: string, pricing: Creator["pricing"]) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      creator.pricing = pricing;
      return createResponse(creator);
    }

    throw new Error("Creator not found");
  },

  getMetrics: async (creatorId: string) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      return createResponse(creator.metrics);
    }

    throw new Error("Creator not found");
  },

  getInsights: async (creatorId: string) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      return createResponse({
        insights: [
          "시청자들은 10-15분 길이의 컨텐츠에서 가장 높은 시청 완료율을 보입니다.",
          "제품 리뷰 영상은 평균보다 25% 높은 댓글 참여율을 보입니다.",
          "주말에 업로드된 컨텐츠는 평일 대비 15% 더 많은 조회수를 기록합니다.",
          "인트로를 30초 이내로 유지한 영상은 이탈률이 20% 낮습니다.",
          "시청자의 68%가 모바일 기기를 통해 컨텐츠를 시청합니다.",
        ],
      });
    }

    throw new Error("Creator not found");
  },

  getPublicProfile: async (username: string) => {
    await delay(DELAY);

    if (username === "test_creator") {
      return createResponse(creatorProfile);
    }

    throw new Error("Creator not found");
  },

  getInquiryTemplates: async (creatorId: string) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      return createResponse(inquiryTemplates);
    }

    throw new Error("Creator not found");
  },

  updateInquiryTemplate: async (
    creatorId: string,
    templateId: string,
    data: Partial<InquiryTemplate>
  ) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      const index = inquiryTemplates.findIndex(
        (template) => template.id === templateId
      );

      if (index === -1) {
        throw new Error("Template not found");
      }

      inquiryTemplates[index] = { ...inquiryTemplates[index], ...data };
      return createResponse(inquiryTemplates[index]);
    }

    throw new Error("Creator not found");
  },

  createInquiryTemplate: async (
    creatorId: string,
    data: Omit<InquiryTemplate, "id">
  ) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      const newTemplate: InquiryTemplate = {
        id: `template-${Date.now()}`,
        ...data,
      };

      inquiryTemplates.push(newTemplate);
      return createResponse(newTemplate);
    }

    throw new Error("Creator not found");
  },

  deleteInquiryTemplate: async (creatorId: string, templateId: string) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      const index = inquiryTemplates.findIndex(
        (template) => template.id === templateId
      );

      if (index === -1) {
        throw new Error("Template not found");
      }

      inquiryTemplates.splice(index, 1);
      return createResponse({ success: true });
    }

    throw new Error("Creator not found");
  },

  getInquiries: async (creatorId: string, status?: Inquiry["status"]) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      let filteredInquiries = inquiries.filter(
        (inquiry) => inquiry.creatorId === creatorId
      );

      if (status) {
        filteredInquiries = filteredInquiries.filter(
          (inquiry) => inquiry.status === status
        );
      }

      return createResponse(filteredInquiries);
    }

    throw new Error("Creator not found");
  },

  respondToInquiry: async (
    creatorId: string,
    inquiryId: string,
    response: string
  ) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      const index = inquiries.findIndex((inquiry) => inquiry.id === inquiryId);

      if (index === -1) {
        throw new Error("Inquiry not found");
      }

      inquiries[index] = {
        ...inquiries[index],
        response,
        status: "responded",
        isAutoResponded: false,
        respondedAt: new Date().toISOString(),
      };

      return createResponse(inquiries[index]);
    }

    throw new Error("Creator not found");
  },

  convertInquiryToCollaboration: async (
    creatorId: string,
    inquiryId: string,
    collaborationData: Partial<Collaboration>
  ) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      const index = inquiries.findIndex((inquiry) => inquiry.id === inquiryId);

      if (index === -1) {
        throw new Error("Inquiry not found");
      }

      inquiries[index] = {
        ...inquiries[index],
        status: "converted",
      };

      // 실제로는 여기서 새 협업을 생성하고 반환하지만, 목업에서는 간단히 처리
      const newCollaboration: Collaboration = {
        id: `collab-${Date.now()}`,
        brandId: "brand-1",
        creatorId,
        brandName: inquiries[index].brandName,
        brandLogo: inquiries[index].brandLogo,
        creatorName: creator.name,
        creatorImage: creator.profileImage,
        type: inquiries[index].type,
        status: "negotiation",
        startDate: new Date().toISOString(),
        endDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toISOString(),
        description: `${inquiries[index].brandName}와의 협업`,
        deliverables: [],
        milestones: [],
        messages: [],
        ...collaborationData,
      };

      return createResponse(newCollaboration);
    }

    throw new Error("Creator not found");
  },

  rejectInquiry: async (
    creatorId: string,
    inquiryId: string,
    reason?: string
  ) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      const index = inquiries.findIndex((inquiry) => inquiry.id === inquiryId);

      if (index === -1) {
        throw new Error("Inquiry not found");
      }

      inquiries[index] = {
        ...inquiries[index],
        response: reason || "현재 새로운 협업을 진행하기 어려운 상황입니다.",
        status: "rejected",
        respondedAt: new Date().toISOString(),
      };

      return createResponse(inquiries[index]);
    }

    throw new Error("Creator not found");
  },
};

// 문의 API
export const mockInquiryApi = {
  submitInquiry: async (creatorUsername: string, inquiryData: any) => {
    await delay(DELAY);

    if (creatorUsername === "test_creator") {
      const newInquiry: Inquiry = {
        id: `inquiry-${Date.now()}`,
        creatorId: creator.id,
        brandName: inquiryData.brandName,
        brandEmail: inquiryData.brandEmail,
        brandLogo: inquiryData.brandLogo,
        templateId: inquiryData.templateId,
        type: inquiryData.type,
        status: "pending",
        content: inquiryData.content,
        createdAt: new Date().toISOString(),
      };

      inquiries.push(newInquiry);
      return createResponse(newInquiry);
    }

    throw new Error("Creator not found");
  },

  verifyEmail: async (inquiryId: string, verificationCode: string) => {
    await delay(DELAY);

    // 간단한 검증을 위해 모든 코드를 허용
    const inquiry = inquiries.find((inq) => inq.id === inquiryId);
    if (!inquiry) {
      throw new Error("Inquiry not found");
    }

    // 자동 응답 설정이 있는지 확인
    const template = inquiryTemplates.find((t) => t.id === inquiry.templateId);
    if (template) {
      // 자동 응답 생성
      const autoResponse = `안녕하세요, ${inquiry.brandName}님!\n\n${
        inquiry.type === "seeding"
          ? `시딩 문의에 감사드립니다. 현재 저의 시딩 단가는 ${creator.pricing.seedingPrice?.toLocaleString()}원이며, 제품 리뷰는 약 2주 이내에 진행됩니다.`
          : inquiry.type === "advertisement"
          ? `광고 문의에 감사드립니다. 현재 저의 광고 단가는 ${creator.pricing.adPrice?.toLocaleString()}원이며, 컨셉과 일정에 따라 조정될 수 있습니다.`
          : `파트너십 문의에 감사드립니다. 장기 협업의 경우 ${creator.pricing.collaborationPrice?.toLocaleString()}원부터 시작하며, 구체적인 내용은 추가 논의가 필요합니다.`
      }\n\n자세한 내용은 곧 이메일로 연락드리겠습니다.\n\n감사합니다,\nTest Creator 드림`;

      // 문의 상태 업데이트
      inquiry.status = "responded";
      inquiry.response = autoResponse;
      inquiry.isAutoResponded = true;
      inquiry.respondedAt = new Date().toISOString();
    }

    return createResponse({ success: true });
  },

  getInquiries: async (creatorId: string, status?: string) => {
    await delay(DELAY);

    if (creatorId === creator.id) {
      let filteredInquiries = [...inquiries];

      if (status) {
        filteredInquiries = filteredInquiries.filter(
          (inq) => inq.status === status
        );
      }

      return createResponse(filteredInquiries);
    }

    throw new Error("Creator not found");
  },

  getInquiry: async (inquiryId: string) => {
    await delay(DELAY);

    const inquiry = inquiries.find((inq) => inq.id === inquiryId);
    if (!inquiry) {
      throw new Error("Inquiry not found");
    }

    return createResponse(inquiry);
  },

  respondToInquiry: async (inquiryId: string, response: string) => {
    await delay(DELAY);

    const inquiry = inquiries.find((inq) => inq.id === inquiryId);
    if (!inquiry) {
      throw new Error("Inquiry not found");
    }

    inquiry.status = "responded";
    inquiry.response = response;
    inquiry.isAutoResponded = false;
    inquiry.respondedAt = new Date().toISOString();

    return createResponse(inquiry);
  },

  convertToCollaboration: async (inquiryId: string) => {
    await delay(DELAY);

    const inquiry = inquiries.find((inq) => inq.id === inquiryId);
    if (!inquiry) {
      throw new Error("Inquiry not found");
    }

    inquiry.status = "converted";

    // 실제로는 여기서 새 협업을 생성하고 반환하지만, 목업에서는 생략

    return createResponse({ success: true });
  },

  rejectInquiry: async (inquiryId: string, reason?: string) => {
    await delay(DELAY);

    const inquiry = inquiries.find((inq) => inq.id === inquiryId);
    if (!inquiry) {
      throw new Error("Inquiry not found");
    }

    inquiry.status = "rejected";
    if (reason) {
      inquiry.response = reason;
    }
    inquiry.respondedAt = new Date().toISOString();

    return createResponse(inquiry);
  },
};

// Task API
export const mockTaskApi = {
  // 크리에이터의 모든 태스크 가져오기
  getTasks: async (
    creatorId: string,
    filters?: {
      status?: "pending" | "in-progress" | "completed" | "canceled";
      priority?: "low" | "medium" | "high";
      category?: "content" | "collaboration" | "personal" | "other";
      startDate?: string;
      endDate?: string;
      collaborationId?: string;
    }
  ) => {
    await delay(DELAY);

    let filteredTasks = tasks.filter((task) => task.creatorId === creatorId);

    if (filters) {
      if (filters.status) {
        filteredTasks = filteredTasks.filter(
          (task) => task.status === filters.status
        );
      }

      if (filters.priority) {
        filteredTasks = filteredTasks.filter(
          (task) => task.priority === filters.priority
        );
      }

      if (filters.category) {
        filteredTasks = filteredTasks.filter(
          (task) => task.category === filters.category
        );
      }

      if (filters.startDate) {
        const startDate = new Date(filters.startDate);
        filteredTasks = filteredTasks.filter(
          (task) => new Date(task.dueDate) >= startDate
        );
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        filteredTasks = filteredTasks.filter(
          (task) => new Date(task.dueDate) <= endDate
        );
      }

      if (filters.collaborationId) {
        filteredTasks = filteredTasks.filter(
          (task) => task.collaborationId === filters.collaborationId
        );
      }
    }

    return createResponse({ data: filteredTasks });
  },

  // 특정 태스크 가져오기
  getTask: async (taskId: string) => {
    await delay(DELAY);

    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    return createResponse({ data: task });
  },

  // 새 태스크 생성
  createTask: async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    await delay(DELAY);

    const newTask: Task = {
      ...taskData,
      id: `task-${tasks.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);

    // 해당 날짜의 일정에 태스크 추가
    const taskDate = new Date(newTask.dueDate);
    const scheduleIndex = dailySchedules.findIndex((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return (
        scheduleDate.getDate() === taskDate.getDate() &&
        scheduleDate.getMonth() === taskDate.getMonth() &&
        scheduleDate.getFullYear() === taskDate.getFullYear()
      );
    });

    if (scheduleIndex !== -1) {
      dailySchedules[scheduleIndex].tasks.push(newTask);
    } else {
      dailySchedules.push({
        date: newTask.dueDate,
        tasks: [newTask],
        availabilityStatus: "partially-available",
      });
    }

    return createResponse({ data: newTask });
  },

  // 태스크 업데이트
  updateTask: async (
    taskId: string,
    taskData: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>
  ) => {
    await delay(DELAY);

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...taskData,
      updatedAt: new Date().toISOString(),
    };

    tasks[taskIndex] = updatedTask;

    // 완료 상태로 변경된 경우 completedAt 추가
    if (taskData.status === "completed" && !tasks[taskIndex].completedAt) {
      tasks[taskIndex].completedAt = new Date().toISOString();
    }

    // 일정에서도 태스크 업데이트
    dailySchedules.forEach((schedule) => {
      const scheduleTaskIndex = schedule.tasks.findIndex(
        (task) => task.id === taskId
      );
      if (scheduleTaskIndex !== -1) {
        schedule.tasks[scheduleTaskIndex] = updatedTask;
      }
    });

    return createResponse({ data: updatedTask });
  },

  // 태스크 삭제
  deleteTask: async (taskId: string) => {
    await delay(DELAY);

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    tasks.splice(taskIndex, 1);

    // 일정에서도 태스크 삭제
    dailySchedules.forEach((schedule) => {
      schedule.tasks = schedule.tasks.filter((task) => task.id !== taskId);
    });

    return createResponse({ success: true });
  },

  // 서브태스크 추가
  addSubtask: async (
    taskId: string,
    subtaskData: Omit<SubTask, "id" | "taskId" | "createdAt">
  ) => {
    await delay(DELAY);

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    const newSubtask: SubTask = {
      ...subtaskData,
      id: `subtask-${Math.floor(Math.random() * 1000)}`,
      taskId,
      createdAt: new Date().toISOString(),
    };

    if (!tasks[taskIndex].subtasks) {
      tasks[taskIndex].subtasks = [];
    }

    tasks[taskIndex].subtasks!.push(newSubtask);
    tasks[taskIndex].updatedAt = new Date().toISOString();

    return createResponse({ data: newSubtask });
  },

  // 서브태스크 업데이트
  updateSubtask: async (
    taskId: string,
    subtaskId: string,
    subtaskData: Partial<Omit<SubTask, "id" | "taskId" | "createdAt">>
  ) => {
    await delay(DELAY);

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    if (!tasks[taskIndex].subtasks) {
      throw new Error("Subtasks not found");
    }

    const subtaskIndex = tasks[taskIndex].subtasks!.findIndex(
      (subtask) => subtask.id === subtaskId
    );

    if (subtaskIndex === -1) {
      throw new Error("Subtask not found");
    }

    const updatedSubtask: SubTask = {
      ...tasks[taskIndex].subtasks![subtaskIndex],
      ...subtaskData,
    };

    // 완료 상태로 변경된 경우 completedAt 추가
    if (subtaskData.status === "completed" && !updatedSubtask.completedAt) {
      updatedSubtask.completedAt = new Date().toISOString();
    }

    tasks[taskIndex].subtasks![subtaskIndex] = updatedSubtask;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    return createResponse({ data: updatedSubtask });
  },

  // 서브태스크 삭제
  deleteSubtask: async (taskId: string, subtaskId: string) => {
    await delay(DELAY);

    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    if (!tasks[taskIndex].subtasks) {
      throw new Error("Subtasks not found");
    }

    tasks[taskIndex].subtasks = tasks[taskIndex].subtasks!.filter(
      (subtask) => subtask.id !== subtaskId
    );
    tasks[taskIndex].updatedAt = new Date().toISOString();

    return createResponse({ success: true });
  },

  // 일정 가져오기
  getDailySchedules: async (
    creatorId: string,
    startDate: string,
    endDate: string
  ) => {
    await delay(DELAY);

    const start = new Date(startDate);
    const end = new Date(endDate);

    const filteredSchedules = dailySchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= start && scheduleDate <= end;
    });

    return createResponse({ data: filteredSchedules });
  },

  // 일정 업데이트
  updateDailySchedule: async (
    date: string,
    scheduleData: Partial<Omit<DailySchedule, "date" | "tasks">>
  ) => {
    await delay(DELAY);

    const scheduleIndex = dailySchedules.findIndex((schedule) => {
      const scheduleDate = new Date(schedule.date);
      const targetDate = new Date(date);
      return (
        scheduleDate.getDate() === targetDate.getDate() &&
        scheduleDate.getMonth() === targetDate.getMonth() &&
        scheduleDate.getFullYear() === targetDate.getFullYear()
      );
    });

    if (scheduleIndex === -1) {
      // 해당 날짜의 일정이 없으면 새로 생성
      const newSchedule: DailySchedule = {
        date,
        tasks: tasks.filter((task) => {
          const taskDate = new Date(task.dueDate);
          const targetDate = new Date(date);
          return (
            taskDate.getDate() === targetDate.getDate() &&
            taskDate.getMonth() === targetDate.getMonth() &&
            taskDate.getFullYear() === targetDate.getFullYear()
          );
        }),
        ...scheduleData,
        availabilityStatus: scheduleData.availabilityStatus || "available",
      };

      dailySchedules.push(newSchedule);
      return createResponse({ data: newSchedule });
    }

    // 기존 일정 업데이트
    dailySchedules[scheduleIndex] = {
      ...dailySchedules[scheduleIndex],
      ...scheduleData,
    };

    return createResponse({ data: dailySchedules[scheduleIndex] });
  },
};
