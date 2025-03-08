import { mockAuthApi, mockCreatorApi, mockInquiryApi } from "./mockApi";
import { Collaboration } from "../types";
import { addDays } from "date-fns";

// 목업 협업 데이터
const mockCollaborations: Collaboration[] = [
  {
    id: "collab-1",
    brandId: "brand-1",
    creatorId: "creator-1",
    brandName: "테크기어",
    brandLogo: "https://via.placeholder.com/50",
    creatorName: "Test Creator",
    creatorImage: "https://via.placeholder.com/50",
    type: "advertisement",
    status: "in-progress",
    budget: 1500000,
    startDate: addDays(new Date(), -10).toISOString(),
    endDate: addDays(new Date(), 20).toISOString(),
    description: "무선 게이밍 헤드셋 X1 광고 캠페인",
    deliverables: ["제품 리뷰 영상 1개", "인스타그램 스토리 3개"],
    milestones: [
      {
        id: "milestone-1",
        title: "계약 체결",
        description: "계약서 검토 및 서명",
        dueDate: addDays(new Date(), -8).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-2",
        title: "컨텐츠 기획안 제출",
        description: "영상 컨셉 및 스토리보드 제출",
        dueDate: addDays(new Date(), -3).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-3",
        title: "촬영 및 편집",
        description: "컨텐츠 촬영 및 1차 편집본 제작",
        dueDate: addDays(new Date(), 5).toISOString(),
        status: "in-progress",
      },
      {
        id: "milestone-4",
        title: "피드백 및 수정",
        description: "브랜드 피드백 반영 및 최종 편집",
        dueDate: addDays(new Date(), 12).toISOString(),
        status: "pending",
      },
      {
        id: "milestone-5",
        title: "컨텐츠 업로드",
        description: "최종 컨텐츠 업로드 및 홍보",
        dueDate: addDays(new Date(), 18).toISOString(),
        status: "pending",
      },
    ],
    messages: [
      {
        id: "message-1",
        senderId: "brand-1",
        senderType: "brand",
        content:
          "안녕하세요, 테크기어입니다. 무선 게이밍 헤드셋 X1 광고 캠페인을 위해 연락드립니다.",
        timestamp: addDays(new Date(), -15).toISOString(),
      },
      {
        id: "message-2",
        senderId: "creator-1",
        senderType: "creator",
        content:
          "안녕하세요! 제안해주신 캠페인에 관심이 있습니다. 자세한 내용 논의해보고 싶습니다.",
        timestamp: addDays(new Date(), -14).toISOString(),
      },
      {
        id: "message-3",
        senderId: "brand-1",
        senderType: "brand",
        content:
          "좋습니다. 저희 제품은 최신 블루투스 5.2 기술을 적용한 저지연 게이밍 헤드셋입니다. 예산은 150만원이며, 제품 리뷰 영상 1개와 인스타그램 스토리 3개를 원합니다.",
        timestamp: addDays(new Date(), -14).toISOString(),
      },
      {
        id: "message-4",
        senderId: "creator-1",
        senderType: "creator",
        content:
          "제안 내용 확인했습니다. 조건에 동의합니다. 계약서 검토 후 진행하겠습니다.",
        timestamp: addDays(new Date(), -13).toISOString(),
      },
    ],
    contract: {
      id: "contract-1",
      title: "테크기어 X Test Creator 광고 계약서",
      content:
        "본 계약은 테크기어(이하 '갑')와 Test Creator(이하 '을') 간에 체결되는 광고 계약으로...",
      status: "signed",
      createdAt: addDays(new Date(), -12).toISOString(),
      signedAt: addDays(new Date(), -8).toISOString(),
    },
  },
  {
    id: "collab-2",
    brandId: "brand-2",
    creatorId: "creator-1",
    brandName: "스포츠웨어",
    brandLogo: "https://via.placeholder.com/50",
    creatorName: "Test Creator",
    creatorImage: "https://via.placeholder.com/50",
    type: "seeding",
    status: "completed",
    startDate: addDays(new Date(), -40).toISOString(),
    endDate: addDays(new Date(), -10).toISOString(),
    description: "신제품 운동복 라인 시딩",
    deliverables: ["제품 언박싱 영상", "착용 리뷰"],
    milestones: [
      {
        id: "milestone-1",
        title: "제품 수령",
        description: "시딩 제품 수령 및 확인",
        dueDate: addDays(new Date(), -35).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-2",
        title: "컨텐츠 제작",
        description: "언박싱 및 리뷰 컨텐츠 제작",
        dueDate: addDays(new Date(), -20).toISOString(),
        status: "completed",
      },
      {
        id: "milestone-3",
        title: "컨텐츠 업로드",
        description: "최종 컨텐츠 업로드",
        dueDate: addDays(new Date(), -15).toISOString(),
        status: "completed",
      },
    ],
    messages: [
      {
        id: "message-1",
        senderId: "brand-2",
        senderType: "brand",
        content:
          "안녕하세요, 스포츠웨어입니다. 신제품 운동복 라인 시딩을 위해 연락드립니다.",
        timestamp: addDays(new Date(), -45).toISOString(),
      },
      {
        id: "message-2",
        senderId: "creator-1",
        senderType: "creator",
        content: "안녕하세요! 제품 시딩에 관심이 있습니다. 어떤 제품인가요?",
        timestamp: addDays(new Date(), -44).toISOString(),
      },
    ],
  },
  {
    id: "collab-3",
    brandId: "brand-3",
    creatorId: "creator-1",
    brandName: "푸드브랜드",
    brandLogo: "https://via.placeholder.com/50",
    creatorName: "Test Creator",
    creatorImage: "https://via.placeholder.com/50",
    type: "partnership",
    status: "negotiation",
    startDate: addDays(new Date(), 15).toISOString(),
    endDate: addDays(new Date(), 75).toISOString(),
    description: "건강 간식 브랜드 장기 파트너십",
    deliverables: ["월 2회 컨텐츠 제작", "오프라인 이벤트 참여"],
    milestones: [],
    messages: [
      {
        id: "message-1",
        senderId: "brand-3",
        senderType: "brand",
        content:
          "안녕하세요, 푸드브랜드입니다. 저희 건강 간식 브랜드와 장기 파트너십을 제안드립니다.",
        timestamp: addDays(new Date(), -5).toISOString(),
      },
      {
        id: "message-2",
        senderId: "creator-1",
        senderType: "creator",
        content:
          "안녕하세요! 제안에 관심이 있습니다. 구체적인 조건을 알려주시겠어요?",
        timestamp: addDays(new Date(), -4).toISOString(),
      },
      {
        id: "message-3",
        senderId: "brand-3",
        senderType: "brand",
        content:
          "네, 월 2회 컨텐츠 제작과 분기별 오프라인 이벤트 참여를 원합니다. 월 300만원의 고정 보수를 제안드립니다.",
        timestamp: addDays(new Date(), -3).toISOString(),
      },
    ],
  },
];

// 실제 API 대신 목업 API를 사용하도록 오버라이드
export const authApi = mockAuthApi;
export const creatorApi = mockCreatorApi;
export const inquiryApi = mockInquiryApi;

// 협업 API 목업 구현
export const collaborationApi = {
  getByCreatorId: async (
    creatorId: string,
    filters?: { status?: string[] }
  ) => {
    // 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredCollaborations = [...mockCollaborations];

    if (filters?.status && filters.status.length > 0) {
      filteredCollaborations = filteredCollaborations.filter((collab) =>
        filters.status?.includes(collab.status)
      );
    }

    return { data: filteredCollaborations };
  },

  getById: async (collaborationId: string) => {
    // 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    const collaboration = mockCollaborations.find(
      (collab) => collab.id === collaborationId
    );

    if (!collaboration) {
      throw new Error("Collaboration not found");
    }

    return { data: collaboration };
  },

  update: async (collaborationId: string, data: Partial<Collaboration>) => {
    // 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockCollaborations.findIndex(
      (collab) => collab.id === collaborationId
    );

    if (index === -1) {
      throw new Error("Collaboration not found");
    }

    mockCollaborations[index] = { ...mockCollaborations[index], ...data };

    return { data: mockCollaborations[index] };
  },

  updateMilestone: async (
    collaborationId: string,
    milestoneId: string,
    data: any
  ) => {
    // 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    const collaboration = mockCollaborations.find(
      (collab) => collab.id === collaborationId
    );

    if (!collaboration) {
      throw new Error("Collaboration not found");
    }

    const milestoneIndex = collaboration.milestones.findIndex(
      (m) => m.id === milestoneId
    );

    if (milestoneIndex === -1) {
      throw new Error("Milestone not found");
    }

    collaboration.milestones[milestoneIndex] = {
      ...collaboration.milestones[milestoneIndex],
      ...data,
    };

    return { data: collaboration.milestones[milestoneIndex] };
  },

  addMilestone: async (collaborationId: string, milestoneData: any) => {
    // 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));

    const collaboration = mockCollaborations.find(
      (collab) => collab.id === collaborationId
    );

    if (!collaboration) {
      throw new Error("Collaboration not found");
    }

    const newMilestone = {
      id: `milestone-${Date.now()}`,
      ...milestoneData,
    };

    collaboration.milestones.push(newMilestone);

    return { data: newMilestone };
  },
};

// AI API 목업 구현
export const aiApi = {
  getAutoResponse: async (query: string, creatorId: string) => {
    // 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      data: {
        response:
          "안녕하세요! 문의에 감사드립니다. 현재 저의 단가는 광고 150만원, 시딩 30만원입니다. 자세한 내용은 추가 문의 부탁드립니다.",
      },
    };
  },

  getContentInsights: async (contentData: any) => {
    // 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      data: {
        insights: [
          "10-15분 길이의 영상이 가장 높은 시청 완료율을 보입니다.",
          "제품 리뷰 영상은 평균보다 25% 높은 댓글 참여율을 보입니다.",
          "주말에 업로드된 컨텐츠는 평일 대비 15% 더 많은 조회수를 기록합니다.",
          "인트로를 30초 이내로 유지한 영상은 이탈률이 20% 낮습니다.",
          "시청자의 68%가 모바일 기기를 통해 컨텐츠를 시청합니다.",
          "댓글에서 가장 많이 언급된 키워드는 '퀄리티', '정보', '재미'입니다.",
          "협찬 컨텐츠는 비협찬 컨텐츠보다 평균 시청 시간이 10% 짧습니다.",
        ],
      },
    };
  },

  getLegalAdvice: async (contractText: string) => {
    // 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      data: {
        advice: [
          "계약 기간이 명확하게 명시되어 있지 않습니다. 시작일과 종료일을 구체적으로 명시하는 것이 좋습니다.",
          "지적재산권 귀속에 관한 조항이 모호합니다. 컨텐츠의 소유권과 라이센스 범위를 명확히 하세요.",
          "보수 지급 조건과 일정이 구체적이지 않습니다. 금액, 지급 방식, 지급 일정을 상세히 명시하세요.",
          "계약 해지 조건이 일방적으로 설정되어 있습니다. 양측에 공정한 해지 조건을 설정하세요.",
        ],
      },
    };
  },
};
