import {
  Creator,
  Brand,
  Collaboration,
  Message,
  Milestone,
  CreatorProfile,
  InquiryTemplate,
  InquiryField,
  Inquiry,
  Channel,
  CreatorMetrics,
} from "../types";

// 테스트 크리에이터 계정
export const testCreator: Creator = {
  id: "creator-1",
  username: "test_creator",
  displayName: "Test Creator",
  name: "Test Creator",
  email: "test_creator@connect.com",
  bio: "테크 리뷰어 & 라이프스타일 크리에이터",
  profileImage: "https://via.placeholder.com/150",
  followers: 250000,
  following: 120,
  channels: [
    {
      id: "channel-1",
      platform: "youtube",
      handle: "TestCreator",
      url: "https://youtube.com/c/TestCreator",
      followers: 250000,
      engagementRate: 0.08,
    },
    {
      id: "channel-2",
      platform: "instagram",
      handle: "test_creator",
      url: "https://instagram.com/test_creator",
      followers: 180000,
      engagementRate: 0.05,
    },
  ],
  availableDates: [
    new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
    new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    new Date(new Date().setDate(new Date().getDate() + 12)).toISOString(),
    new Date(new Date().setDate(new Date().getDate() + 13)).toISOString(),
    new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
    new Date(new Date().setDate(new Date().getDate() + 21)).toISOString(),
  ],
  pricing: {
    seedingPrice: 300000,
    adPrice: 1500000,
    collaborationPrice: 3000000,
  },
  categories: ["테크", "가전", "라이프스타일"],
  platforms: [
    {
      name: "youtube",
      url: "https://youtube.com/c/TestCreator",
      followers: 250000,
    },
    {
      name: "instagram",
      url: "https://instagram.com/test_creator",
      followers: 180000,
    },
  ],
  metrics: {
    avgEngagementRate: 0.08,
    avgViews: 120000,
    avgLikes: 15000,
    avgComments: 800,
  },
  location: "서울",
  languages: ["한국어", "영어"],
};

// 테스트 크리에이터 프로필
export const testCreatorProfile: CreatorProfile = {
  username: "test_creator",
  displayName: "Test Creator",
  bio: "테크 리뷰어 & 라이프스타일 크리에이터",
  profileImage: "https://via.placeholder.com/150",
  bannerImage: "https://via.placeholder.com/1200x300",
  channels: testCreator.channels || [],
  categories: testCreator.categories,
  metrics: {
    totalFollowers: testCreator.channels
      ? testCreator.channels.reduce(
          (sum, channel) => sum + channel.followers,
          0
        )
      : 0,
    averageViews: testCreator.metrics?.avgViews || 0,
    engagementRate: testCreator.metrics?.avgEngagementRate || 0,
  },
  inquiryTemplates: [],
  availableDates: testCreator.availableDates || [],
};

// 기본 문의 템플릿 필드
const defaultSeedingFields: InquiryField[] = [
  {
    id: "field-1",
    name: "brandName",
    label: "브랜드명",
    type: "text",
    placeholder: "귀사의 브랜드명을 입력해주세요",
    required: true,
  },
  {
    id: "field-2",
    name: "brandEmail",
    label: "이메일",
    type: "text",
    placeholder: "연락 가능한 이메일 주소를 입력해주세요",
    required: true,
  },
  {
    id: "field-3",
    name: "productName",
    label: "제품명",
    type: "text",
    placeholder: "시딩을 원하시는 제품명을 입력해주세요",
    required: true,
  },
  {
    id: "field-4",
    name: "productDescription",
    label: "제품 설명",
    type: "textarea",
    placeholder: "제품에 대한 간략한 설명을 입력해주세요",
    required: true,
  },
  {
    id: "field-5",
    name: "preferredDate",
    label: "희망 일정",
    type: "date",
    required: false,
  },
  {
    id: "field-6",
    name: "additionalInfo",
    label: "추가 정보",
    type: "textarea",
    placeholder: "추가로 알려주실 내용이 있으면 입력해주세요",
    required: false,
  },
];

const defaultAdFields: InquiryField[] = [
  {
    id: "field-1",
    name: "brandName",
    label: "브랜드명",
    type: "text",
    placeholder: "귀사의 브랜드명을 입력해주세요",
    required: true,
  },
  {
    id: "field-2",
    name: "brandEmail",
    label: "이메일",
    type: "text",
    placeholder: "연락 가능한 이메일 주소를 입력해주세요",
    required: true,
  },
  {
    id: "field-3",
    name: "campaignName",
    label: "캠페인명",
    type: "text",
    placeholder: "캠페인명을 입력해주세요",
    required: true,
  },
  {
    id: "field-4",
    name: "campaignDescription",
    label: "캠페인 설명",
    type: "textarea",
    placeholder: "캠페인에 대한 간략한 설명을 입력해주세요",
    required: true,
  },
  {
    id: "field-5",
    name: "budget",
    label: "예산 범위",
    type: "select",
    options: [
      "100만원 이하",
      "100만원-300만원",
      "300만원-500만원",
      "500만원-1000만원",
      "1000만원 이상",
    ],
    required: true,
  },
  {
    id: "field-6",
    name: "preferredDate",
    label: "희망 일정",
    type: "date",
    required: false,
  },
  {
    id: "field-7",
    name: "contentType",
    label: "컨텐츠 유형",
    type: "select",
    options: ["제품 리뷰", "언박싱", "튜토리얼", "브랜디드 컨텐츠", "기타"],
    required: true,
  },
  {
    id: "field-8",
    name: "additionalInfo",
    label: "추가 정보",
    type: "textarea",
    placeholder: "추가로 알려주실 내용이 있으면 입력해주세요",
    required: false,
  },
];

const defaultPartnershipFields: InquiryField[] = [
  {
    id: "field-1",
    name: "brandName",
    label: "브랜드명",
    type: "text",
    placeholder: "귀사의 브랜드명을 입력해주세요",
    required: true,
  },
  {
    id: "field-2",
    name: "brandEmail",
    label: "이메일",
    type: "text",
    placeholder: "연락 가능한 이메일 주소를 입력해주세요",
    required: true,
  },
  {
    id: "field-3",
    name: "partnershipType",
    label: "파트너십 유형",
    type: "select",
    options: [
      "장기 브랜드 앰배서더",
      "공동 제품 개발",
      "이벤트 협업",
      "콘텐츠 시리즈",
      "기타",
    ],
    required: true,
  },
  {
    id: "field-4",
    name: "partnershipDescription",
    label: "파트너십 설명",
    type: "textarea",
    placeholder: "제안하시는 파트너십에 대한 설명을 입력해주세요",
    required: true,
  },
  {
    id: "field-5",
    name: "duration",
    label: "예상 기간",
    type: "select",
    options: ["1개월 이하", "1-3개월", "3-6개월", "6-12개월", "1년 이상"],
    required: true,
  },
  {
    id: "field-6",
    name: "budget",
    label: "예산 범위",
    type: "select",
    options: [
      "500만원 이하",
      "500만원-1000만원",
      "1000만원-3000만원",
      "3000만원-5000만원",
      "5000만원 이상",
    ],
    required: true,
  },
  {
    id: "field-7",
    name: "additionalInfo",
    label: "추가 정보",
    type: "textarea",
    placeholder: "추가로 알려주실 내용이 있으면 입력해주세요",
    required: false,
  },
];

// 기본 문의 템플릿
export const defaultInquiryTemplates: InquiryTemplate[] = [
  {
    id: "template-1",
    name: "시딩 문의",
    type: "seeding",
    description: "제품 시딩 및 리뷰 요청을 위한 문의 양식입니다.",
    fields: defaultSeedingFields,
    isDefault: true,
    isActive: true,
  },
  {
    id: "template-2",
    name: "광고 문의",
    type: "advertisement",
    description: "유료 광고 및 브랜디드 컨텐츠 제작을 위한 문의 양식입니다.",
    fields: defaultAdFields,
    isDefault: true,
    isActive: true,
  },
  {
    id: "template-3",
    name: "파트너십 문의",
    type: "partnership",
    description: "장기 파트너십 및 협업 제안을 위한 문의 양식입니다.",
    fields: defaultPartnershipFields,
    isDefault: true,
    isActive: true,
  },
];

// 테스트 크리에이터 프로필에 기본 템플릿 추가
testCreatorProfile.inquiryTemplates = defaultInquiryTemplates;

// 샘플 문의 데이터
export const sampleInquiries: Inquiry[] = [
  {
    id: "inquiry-1",
    creatorId: testCreator.id,
    brandName: "테크기어",
    brandEmail: "marketing@techgear.com",
    brandLogo: "https://via.placeholder.com/50",
    templateId: "template-1",
    type: "seeding",
    status: "pending",
    content: {
      brandName: "테크기어",
      brandEmail: "marketing@techgear.com",
      productName: "무선 게이밍 헤드셋 X1",
      productDescription:
        "최신 블루투스 5.2 기술을 적용한 저지연 게이밍 헤드셋입니다. 노이즈 캔슬링과 7.1 서라운드 사운드를 지원합니다.",
      preferredDate: new Date(
        new Date().setDate(new Date().getDate() + 14)
      ).toISOString(),
      additionalInfo:
        "언박싱 및 게임 플레이 중 사용 경험에 대한 리뷰를 희망합니다.",
    },
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 2)
    ).toISOString(),
  },
  {
    id: "inquiry-2",
    creatorId: testCreator.id,
    brandName: "스마트라이프",
    brandEmail: "partnerships@smartlife.com",
    brandLogo: "https://via.placeholder.com/50",
    templateId: "template-2",
    type: "advertisement",
    status: "responded",
    content: {
      brandName: "스마트라이프",
      brandEmail: "partnerships@smartlife.com",
      campaignName: "스마트홈 에코시스템 출시 캠페인",
      campaignDescription:
        "새롭게 출시되는 스마트홈 제품 라인업을 소개하는 캠페인입니다. 스마트 스피커, 조명, 센서 등 다양한 제품을 포함합니다.",
      budget: "300만원-500만원",
      preferredDate: new Date(
        new Date().setDate(new Date().getDate() + 20)
      ).toISOString(),
      contentType: "제품 리뷰",
      additionalInfo:
        "실제 사용 경험과 설치 과정을 보여주는 컨텐츠를 희망합니다.",
    },
    response:
      "안녕하세요, 스마트라이프 팀! 제안해주신 캠페인에 관심이 있습니다. 자세한 논의를 위해 미팅을 잡아보면 어떨까요? 가능한 일정을 알려주시면 감사하겠습니다.",
    isAutoResponded: false,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 5)
    ).toISOString(),
    respondedAt: new Date(
      new Date().setDate(new Date().getDate() - 3)
    ).toISOString(),
  },
  {
    id: "inquiry-3",
    creatorId: testCreator.id,
    brandName: "게임스튜디오",
    brandEmail: "creator@gamestudio.com",
    brandLogo: "https://via.placeholder.com/50",
    templateId: "template-3",
    type: "partnership",
    status: "converted",
    content: {
      brandName: "게임스튜디오",
      brandEmail: "creator@gamestudio.com",
      partnershipType: "콘텐츠 시리즈",
      partnershipDescription:
        "신작 게임 출시에 맞춰 6부작 콘텐츠 시리즈를 제작하고자 합니다. 게임 플레이, 개발자 인터뷰, 팁과 트릭 등 다양한 내용을 다룰 예정입니다.",
      duration: "1-3개월",
      budget: "1000만원-3000만원",
      additionalInfo:
        "게임 출시일은 다음 달 15일이며, 그 전에 티저 영상 1개와 출시 후 5개의 영상을 계획하고 있습니다.",
    },
    response:
      "제안해주신 파트너십에 매우 관심이 있습니다. 협업을 위한 계약서를 작성하고 세부 사항을 논의해보겠습니다.",
    isAutoResponded: false,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 10)
    ).toISOString(),
    respondedAt: new Date(
      new Date().setDate(new Date().getDate() - 8)
    ).toISOString(),
  },
  {
    id: "inquiry-4",
    creatorId: testCreator.id,
    brandName: "뷰티브랜드",
    brandEmail: "marketing@beautyband.com",
    templateId: "template-1",
    type: "seeding",
    status: "rejected",
    content: {
      brandName: "뷰티브랜드",
      brandEmail: "marketing@beautyband.com",
      productName: "스킨케어 세트",
      productDescription: "자연 성분으로 만든 스킨케어 제품 세트입니다.",
      additionalInfo: "언박싱 및 사용 후기를 담은 컨텐츠를 희망합니다.",
    },
    response:
      "죄송합니다만, 현재 뷰티 카테고리의 제품은 제 채널의 주제와 맞지 않아 협업이 어렵습니다. 다른 기회에 기술 관련 제품으로 문의주시면 검토하겠습니다.",
    isAutoResponded: true,
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toISOString(),
    respondedAt: new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).toISOString(),
  },
  {
    id: "inquiry-5",
    creatorId: testCreator.id,
    brandName: "모바일액세서리",
    brandEmail: "contact@mobileacc.com",
    templateId: "template-1",
    type: "seeding",
    status: "pending",
    content: {
      brandName: "모바일액세서리",
      brandEmail: "contact@mobileacc.com",
      productName: "스마트폰 거치대 겸 충전기",
      productDescription:
        "무선 충전과 거치대 기능을 동시에 제공하는 다기능 스마트폰 액세서리입니다.",
      preferredDate: new Date(
        new Date().setDate(new Date().getDate() + 10)
      ).toISOString(),
    },
    createdAt: new Date().toISOString(),
  },
];

// 로그인 정보
export const loginCredentials = {
  email: "test_creator@connect.com",
  password: "superchips",
};

// 테스트 브랜드 계정
export const testBrand = {
  id: "brand-1",
  email: "test_brand@connect.com",
  password: "brandpass123",
  name: "테스트 브랜드",
  logo: "/images/brand-logo.png",
  industry: "테크놀로지",
  description: "테스트용 브랜드 계정입니다.",
  website: "https://testbrand.com",
  socialMedia: {
    instagram: "testbrand",
    facebook: "testbrand",
    twitter: "testbrand",
  },
  contactPerson: "김브랜드",
  contactEmail: "contact@testbrand.com",
  contactPhone: "010-1234-5678",
  createdAt: new Date().toISOString(),
};

// 샘플 크리에이터 목록
export const sampleCreators: Creator[] = [
  {
    id: "creator-1",
    username: "test_creator",
    displayName: "Test Creator",
    email: "test_creator@connect.com",
    bio: "테크 리뷰어 & 라이프스타일 크리에이터",
    profileImage: "https://via.placeholder.com/150",
    followers: 250000,
    following: 120,
    categories: ["테크", "가전", "라이프스타일"],
    platforms: [
      {
        name: "youtube",
        url: "https://youtube.com/c/TestCreator",
        followers: 250000,
      },
      {
        name: "instagram",
        url: "https://instagram.com/test_creator",
        followers: 180000,
      },
    ],
    pricing: {
      seedingPrice: 300000,
      adPrice: 1500000,
      collaborationPrice: 3000000,
    },
    metrics: {
      avgEngagementRate: 0.08,
      avgViews: 120000,
      avgLikes: 15000,
      avgComments: 800,
    },
    location: "서울",
    languages: ["한국어", "영어"],
  },
  {
    id: "creator-2",
    username: "beauty_guru",
    displayName: "뷰티 구루",
    email: "beauty_guru@connect.com",
    bio: "메이크업 아티스트 & 뷰티 크리에이터",
    profileImage: "https://via.placeholder.com/150",
    followers: 450000,
    following: 230,
    categories: ["뷰티", "메이크업", "스킨케어"],
    platforms: [
      {
        name: "youtube",
        url: "https://youtube.com/c/BeautyGuru",
        followers: 450000,
      },
      {
        name: "instagram",
        url: "https://instagram.com/beauty_guru",
        followers: 380000,
      },
    ],
    pricing: {
      seedingPrice: 500000,
      adPrice: 2500000,
      collaborationPrice: 5000000,
    },
    metrics: {
      avgEngagementRate: 0.1,
      avgViews: 200000,
      avgLikes: 25000,
      avgComments: 1200,
    },
    location: "서울",
    languages: ["한국어"],
  },
  {
    id: "creator-3",
    username: "food_lover",
    displayName: "푸드 러버",
    email: "food_lover@connect.com",
    bio: "음식 리뷰어 & 요리 크리에이터",
    profileImage: "https://via.placeholder.com/150",
    followers: 320000,
    following: 180,
    categories: ["음식", "요리", "맛집"],
    platforms: [
      {
        name: "youtube",
        url: "https://youtube.com/c/FoodLover",
        followers: 320000,
      },
      {
        name: "instagram",
        url: "https://instagram.com/food_lover",
        followers: 280000,
      },
    ],
    pricing: {
      seedingPrice: 400000,
      adPrice: 1800000,
      collaborationPrice: 3500000,
    },
    metrics: {
      avgEngagementRate: 0.09,
      avgViews: 150000,
      avgLikes: 18000,
      avgComments: 950,
    },
    location: "부산",
    languages: ["한국어"],
  },
  {
    id: "creator-4",
    username: "travel_addict",
    displayName: "여행 중독자",
    email: "travel_addict@connect.com",
    bio: "여행 블로거 & 사진작가",
    profileImage: "https://via.placeholder.com/150",
    followers: 280000,
    following: 150,
    categories: ["여행", "사진", "라이프스타일"],
    platforms: [
      {
        name: "youtube",
        url: "https://youtube.com/c/TravelAddict",
        followers: 280000,
      },
      {
        name: "instagram",
        url: "https://instagram.com/travel_addict",
        followers: 320000,
      },
    ],
    pricing: {
      seedingPrice: 350000,
      adPrice: 1700000,
      collaborationPrice: 3200000,
    },
    metrics: {
      avgEngagementRate: 0.11,
      avgViews: 130000,
      avgLikes: 20000,
      avgComments: 1000,
    },
    location: "제주",
    languages: ["한국어", "영어"],
  },
  {
    id: "creator-5",
    username: "fitness_coach",
    displayName: "피트니스 코치",
    email: "fitness_coach@connect.com",
    bio: "피트니스 트레이너 & 건강 크리에이터",
    profileImage: "https://via.placeholder.com/150",
    followers: 380000,
    following: 200,
    categories: ["피트니스", "건강", "운동"],
    platforms: [
      {
        name: "youtube",
        url: "https://youtube.com/c/FitnessCoach",
        followers: 380000,
      },
      {
        name: "instagram",
        url: "https://instagram.com/fitness_coach",
        followers: 420000,
      },
    ],
    pricing: {
      seedingPrice: 450000,
      adPrice: 2200000,
      collaborationPrice: 4500000,
    },
    metrics: {
      avgEngagementRate: 0.12,
      avgViews: 180000,
      avgLikes: 22000,
      avgComments: 1100,
    },
    location: "서울",
    languages: ["한국어"],
  },
  {
    id: "creator-6",
    username: "fashion_stylist",
    displayName: "패션 스타일리스트",
    email: "fashion_stylist@connect.com",
    bio: "패션 스타일리스트 & 트렌드 크리에이터",
    profileImage: "https://via.placeholder.com/150",
    followers: 420000,
    following: 220,
    categories: ["패션", "스타일", "쇼핑"],
    platforms: [
      {
        name: "youtube",
        url: "https://youtube.com/c/FashionStylist",
        followers: 420000,
      },
      {
        name: "instagram",
        url: "https://instagram.com/fashion_stylist",
        followers: 480000,
      },
    ],
    pricing: {
      seedingPrice: 550000,
      adPrice: 2800000,
      collaborationPrice: 5500000,
    },
    metrics: {
      avgEngagementRate: 0.09,
      avgViews: 190000,
      avgLikes: 24000,
      avgComments: 1300,
    },
    location: "서울",
    languages: ["한국어", "영어"],
  },
];
