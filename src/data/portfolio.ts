export type Lang = "en" | "ko";
export type EvidenceTier = "A" | "B" | "C";
export type Access = "public" | "private" | "employment";

export interface LocalizedText {
  en: string;
  ko: string;
}

export interface Career {
  company: LocalizedText;
  role: LocalizedText;
  period: LocalizedText;
  context: LocalizedText;
  proof: LocalizedText;
  domains: string[];
  methods: string[];
  evidence: EvidenceTier;
}

export interface Project {
  title: string;
  summary: LocalizedText;
  proof: LocalizedText;
  domains: string[];
  methods: string[];
  access: Exclude<Access, "employment">;
  evidence: EvidenceTier;
  href?: string;
  image?: string;
  imageAlt?: LocalizedText;
  stat?: LocalizedText;
  tone?: "dark" | "accent" | "light";
}

export const careers: Career[] = [
  {
    company: { en: "Sejong Analysis Research Institute", ko: "세종분석연구원" },
    role: { en: "Researcher / Applied ML Engineer", ko: "연구원 / Applied ML Engineer" },
    period: { en: "2026.04-present", ko: "2026.04-현재" },
    context: {
      en: "Public-procurement decision ML from upstream collection and OCR to probabilistic forecasts, Monte Carlo recommendations, validation, and candidate deployment.",
      ko: "공공조달 분석 서비스에서 upstream 수집과 OCR부터 확률예측, Monte Carlo 추천, 검증과 후보 배포까지 전체 의사결정 경로를 개발합니다.",
    },
    proof: {
      en: "Rebuilt a five-person, six-month predecessor scope independently in three months. Internal measures: OCR about 50% to 90%, relative bid-award KPI +35%, and vectorized inference 136s to 25s.",
      ko: "AI 프로젝트팀 5명이 6개월간 개발한 범위를 혼자 3개월 안에 재구축했습니다. 내부 측정 기준 OCR 약 50%→90%, 상대 낙찰 KPI +35%, 추론 시간 136초→25초를 기록했습니다.",
    },
    domains: ["Tabular ML", "Probabilistic ML", "Document AI", "MLOps"],
    methods: ["OCR", "TabICL / PFN", "Quantile Regression", "Conformal Prediction", "CRPS", "Monte Carlo"],
    evidence: "C",
  },
  {
    company: { en: "Hanmac Group", ko: "한맥그룹" },
    role: { en: "ML Engineer / Researcher", ko: "ML 엔지니어 / 연구원" },
    period: { en: "2024.11-2026.02", ko: "2024.11-2026.02" },
    context: {
      en: "Built Korean NLP, probabilistic prediction, and a retrieval-based cost-estimation agent for construction-engineering procurement workflows.",
      ko: "건설엔지니어링 조달 업무를 위한 한국어 NLP, 확률예측과 검색 기반 원가계산 Agent를 개발했습니다.",
    },
    proof: {
      en: "Exported a RoBERTa-large + LoRA classifier to an approximately 330MB INT8 ONNX model with about 50ms CPU inference. Connected OCR and standard-cost data through FAISS, LangChain, and LangGraph; redesigned R2CCP calibration and improved an internal KPI by more than 30%.",
      ko: "RoBERTa-large + LoRA 분류기를 약 330MB INT8 ONNX와 약 50ms CPU 추론으로 연결했습니다. OCR·표준품셈 데이터를 FAISS·LangChain·LangGraph workflow로 구성했고, R2CCP calibration을 다시 설계해 내부 KPI를 30% 이상 개선했습니다.",
    },
    domains: ["NLP", "RAG / Agentic AI", "Probabilistic ML", "Document AI"],
    methods: ["RoBERTa-large", "LoRA / PEFT", "ONNX INT8", "FastAPI", "FAISS", "LangGraph", "LangChain", "Calibration"],
    evidence: "C",
  },
  {
    company: { en: "Sanha General Technology", ko: "산하종합기술" },
    role: { en: "AI / Automation Engineer", ko: "AI / 자동화 엔지니어" },
    period: { en: "2021.01-2024.11", ko: "2021.01-2024.11" },
    context: {
      en: "Sole in-house developer for construction-engineering and surveying workflows across documents, CAD, ERP, and 3D data.",
      ko: "건설엔지니어링·측량 회사의 사내 단독 개발자로 문서, CAD, ERP와 3D 업무를 자동화했습니다.",
    },
    proof: {
      en: "Built OCR processing, an AutoCAD add-in, ERP integrations, and drone/survey 3D workflows. Document processing fell from roughly four hours to the thirty-minute range in internal records.",
      ko: "OCR 문서 처리, AutoCAD add-in, ERP 연계와 드론·측량 기반 3D workflow를 개발했습니다. 내부 기록에서 4시간대였던 문서 작업을 30분대로 줄였습니다.",
    },
    domains: ["Document AI", "Automation", "3D Vision / CAD"],
    methods: ["OCR", "Layout Parsing", "Rule-based Post-processing", "AutoCAD Add-in", "ERP Integration", "Drone Imagery", "Survey-to-3D"],
    evidence: "C",
  },
  {
    company: { en: "Nielsen Korea GTC", ko: "닐슨코리아 GTC" },
    role: { en: "Data Analyst", ko: "데이터 분석가" },
    period: { en: "2019.08-2020.10", ko: "2019.08-2020.10" },
    context: {
      en: "Automated product-image analysis, attribute extraction, and barcode data workflows for global retail research.",
      ko: "글로벌 리테일 조사에서 상품 이미지 분석, 속성 추출과 바코드 데이터 업무를 자동화했습니다.",
    },
    proof: {
      en: "Combined computer vision and RPA to reduce departmental data-processing time by approximately 40% according to internal records.",
      ko: "Computer Vision과 RPA를 결합해 부서 데이터 처리 시간을 내부 기록 기준 약 40% 줄였습니다.",
    },
    domains: ["CV", "RPA", "Data Engineering"],
    methods: ["Product Image Analysis", "Attribute Extraction", "Barcode Recognition", "RPA", "Data Quality", "Workflow Automation"],
    evidence: "C",
  },
];

export const projects: Project[] = [
  {
    title: "google-surf-mcp",
    summary: {
      en: "Search and extraction infrastructure that gives LLM agents one MCP interface for Google Search, web pages, and academic PDFs.",
      ko: "LLM agent가 Google 검색, 웹 본문과 학술 PDF를 하나의 MCP 인터페이스에서 사용할 수 있게 만든 검색·추출 인프라입니다.",
    },
    proof: {
      en: "Five MCP tools, parallel search, Readability and spatial-PDF parsing, redirect-aware SSRF defense, CAPTCHA handoff, rate limiting, telemetry, and live-markup regression fixtures. 278 stars and 33 forks on 2026-08-12.",
      ko: "5개 MCP 도구, 병렬 검색, Readability·spatial PDF parser, redirect 단계 SSRF 방어, CAPTCHA handoff, rate limit, telemetry와 live-markup 회귀 fixture를 구현했습니다. 2026-08-12 기준 278 stars, 33 forks입니다.",
    },
    domains: ["Agentic AI", "Information Retrieval", "Document Processing"],
    methods: ["TypeScript", "MCP", "Google Search", "Readability", "Spatial PDF Parsing", "SSRF Defense", "Telemetry"],
    access: "public",
    evidence: "A",
    href: "https://github.com/HarimxChoi/google-surf-mcp",
    image: "/img/google-surf-demo.gif",
    imageAlt: { en: "google-surf-mcp search and extraction demo", ko: "google-surf-mcp 검색 및 추출 데모" },
    stat: { en: "278 stars · 33 forks", ko: "278 stars · 33 forks" },
    tone: "accent",
  },
  {
    title: "Monogram",
    summary: {
      en: "A local-first knowledge system that turns Telegram, Obsidian, and MCP inputs into a Git-backed knowledge base with semantic retrieval.",
      ko: "Telegram·Obsidian·MCP 입력을 검증해 Git 기반 지식베이스에 축적하고 semantic retrieval로 다시 찾는 local-first 시스템입니다.",
    },
    proof: {
      en: "Runs EmbeddingGemma-300M with ONNX INT8, stores vectors in a custom Git-backed sharded index, and combines dense search with BM25/RRF. MCP semantic search adds Personalized PageRank and MMR; writes use atomic Git Tree commits.",
      ko: "EmbeddingGemma-300M을 ONNX INT8로 실행하고 custom Git-backed sharded vector index와 BM25/RRF를 결합했습니다. MCP semantic search에 Personalized PageRank와 MMR을 적용하고 Git Tree API로 원자적으로 저장합니다.",
    },
    domains: ["RAG / Retrieval", "Agentic AI", "Knowledge Automation"],
    methods: ["Python", "EmbeddingGemma", "ONNX INT8", "Custom Vector Index", "BM25 / RRF", "MCP", "PageRank / MMR"],
    access: "public",
    evidence: "A",
    href: "https://github.com/HarimxChoi/monogram",
    image: "/img/monogram-demo.gif",
    imageAlt: { en: "Monogram knowledge dashboard demo", ko: "Monogram 지식 dashboard 데모" },
  },
  {
    title: "Bau Browser",
    summary: {
      en: "An Electron browser workspace that puts agent permissions, user approval, and local audit boundaries inside the product runtime.",
      ko: "Agent 권한, 사용자 승인과 local audit 경계를 제품 runtime 안에 둔 Electron 기반 browser workspace입니다.",
    },
    proof: {
      en: "Implements origin/action scoping, propose-approve-execute HITL, evidence capture, local decision logs, encrypted sync, MCP client/server paths, and prompt-injection tests.",
      ko: "origin/action scope, propose-approve-execute HITL, evidence capture, local decision log, encrypted sync, MCP client/server와 prompt-injection test를 구현했습니다.",
    },
    domains: ["Agentic AI", "Browser Automation", "Agent Safety"],
    methods: ["TypeScript", "Electron", "MCP", "SQLite", "Two-phase HITL", "Action Scoping", "Decision Logging"],
    access: "private",
    evidence: "B",
  },
  {
    title: "LangGraph Travel Agent",
    summary: {
      en: "A multi-tool travel workflow delivered to a US travel agency, then released as open source after contractual source-code IP transfer.",
      ko: "미국 여행사에 납품한 뒤 계약에 따라 소스코드 IP를 이전받아 오픈소스로 공개한 multi-tool 여행 Agent입니다.",
    },
    proof: {
      en: "Calls Amadeus, Hotelbeds, Twilio, and HubSpot asynchronously, manages budget and itinerary state in LangGraph, persists checkpoints in Redis, and gates external messages behind human approval.",
      ko: "Amadeus, Hotelbeds, Twilio와 HubSpot을 비동기로 호출하고 LangGraph로 예산·일정 상태를 관리합니다. Redis checkpoint로 중단 후 재개하며 외부 전송은 사용자 승인 뒤에만 실행합니다.",
    },
    domains: ["Agentic AI", "Workflow Orchestration", "API Integration"],
    methods: ["Python", "LangGraph", "AsyncIO", "FastAPI", "Redis", "Human-in-the-loop", "Tool Calling"],
    access: "public",
    evidence: "A",
    href: "https://github.com/HarimxChoi/langgraph-travel-agent",
    stat: { en: "4 external APIs", ko: "외부 API 4개" },
  },
  {
    title: "WSSS Refined Pseudo-labels",
    summary: {
      en: "Weakly supervised semantic segmentation that refines unreliable pseudo-labels and updates only disagreement regions.",
      ko: "불안정한 pseudo-label을 보정하고 모델과 label이 다른 영역만 갱신하는 약지도 semantic segmentation 연구입니다.",
    },
    proof: {
      en: "Combines reliability maps with disagreement-aware self-training. The complete COCO-Val 2014 MSC+flip evaluation covered all 40,137 samples and recorded 53.31% mIoU.",
      ko: "reliability map과 disagreement-aware self-training을 결합했습니다. COCO-Val 2014 전체 40,137개 sample의 MSC+flip 평가에서 mIoU 53.31%를 기록했습니다.",
    },
    domains: ["CV", "Weakly Supervised Learning", "Evaluation"],
    methods: ["PyTorch", "WeCLIP+", "Semantic Segmentation", "Pseudo-labeling", "Reliability Mapping", "COCO-Val / mIoU"],
    access: "public",
    evidence: "B",
    href: "https://github.com/HarimxChoi/wsss-refined-pseudolabels",
    image: "/img/wsss-architecture.png",
    imageAlt: { en: "WSSS pseudo-label refinement architecture", ko: "WSSS pseudo-label refinement 구조" },
    stat: { en: "53.31% mIoU · 40,137 samples", ko: "mIoU 53.31% · 40,137 samples" },
  },
  {
    title: "Vargo",
    summary: {
      en: "Agent-evaluation research separating configuration performance differences from whether the winning configuration can be identified before execution.",
      ko: "LLM agent 구성의 성능 차이와 실행 전에 winning configuration을 식별할 수 있는지를 분리해 검증한 연구입니다.",
    },
    proof: {
      en: "Uses sealed cells, disjoint-fold controls, verifier cascades, and independent reproduction paths. Leakage, cache-key, seed, and control-wiring failures are retained as invalidated results rather than hidden.",
      ko: "sealed cell, disjoint-fold control, verifier cascade와 독립 재현 경로를 사용합니다. 누수·cache key·seed·control wiring 문제가 발견된 결과는 폐기 기록으로 보존합니다.",
    },
    domains: ["Agentic AI", "LLM Evaluation", "Research Infrastructure"],
    methods: ["Python", "Agent Evaluation", "Verifier Cascade", "Disjoint Controls", "Contamination Control", "Reproducibility"],
    access: "private",
    evidence: "B",
  },
  {
    title: "MyShot",
    summary: {
      en: "A monocular 3D golf-pose program that repaired pseudo-train/test leakage and separated clean-2D validation from the raw-video domain gap.",
      ko: "pseudo-train/test 누수를 수정하고 clean-2D 검증과 raw-video domain gap을 분리한 단안 3D 골프 자세 연구입니다.",
    },
    proof: {
      en: "Rebuilt evaluation with a 431/30 disjoint split. Under the clean-2D input boundary, it recorded MPJPE 35.6mm and X-Factor MAE 3.1 degrees; raw-video performance remains a separate question.",
      ko: "431/30 disjoint split으로 평가를 다시 구성했습니다. clean-2D 입력 범위에서 MPJPE 35.6mm와 X-Factor MAE 3.1°를 기록했으며 raw-video 성능과 분리해 관리합니다.",
    },
    domains: ["CV", "3D Pose Estimation", "Evaluation"],
    methods: ["PyTorch", "YOLO-Pose", "MotionAGFormer", "MPJPE", "X-Factor", "Leakage Audit", "Domain-shift Analysis"],
    access: "private",
    evidence: "B",
  },
  {
    title: "EAT Calibration Research",
    summary: {
      en: "A calibration and robustness program that keeps checkpoint basis, distribution shift, and negative ablations visible alongside accuracy.",
      ko: "accuracy와 함께 checkpoint 기준, distribution shift와 실패한 ablation까지 보존하는 calibration·robustness 연구입니다.",
    },
    proof: {
      en: "In a CIFAR-100 seed-42 matched protocol, PECC v6 recorded 81.23% accuracy and 3.37% post-temperature ECE. Failed LAPC variants and metric anomalies remain in the experiment ledger.",
      ko: "CIFAR-100 seed-42 matched protocol에서 PECC v6는 accuracy 81.23%, temperature scaling 후 ECE 3.37%를 기록했습니다. 실패한 LAPC와 metric anomaly도 원장에 유지합니다.",
    },
    domains: ["CV", "Calibration / UQ", "Robust ML"],
    methods: ["PyTorch", "CIFAR-100", "Adversarial Training", "Temperature Scaling", "ECE", "Negative Ablation"],
    access: "private",
    evidence: "B",
  },
  {
    title: "EMH Agent",
    summary: {
      en: "A private pre-release decision system that separates point-in-time evidence, typed proposals, policy, human approval, and mock execution.",
      ko: "point-in-time evidence, typed proposal, policy, human approval과 mock execution을 분리한 private pre-release 의사결정 시스템입니다.",
    },
    proof: {
      en: "Intelligence, trading, arbitrage, and household packages cannot execute external actions directly. One-time capabilities, receipts, and reconciliation live in a separate harness; no live-trading authority is present.",
      ko: "Intelligence·Trading·Arbitrage·Household package는 외부 행동을 직접 실행하지 않습니다. one-time capability, receipt와 reconciliation은 별도 harness에 있으며 live trading 권한은 없습니다.",
    },
    domains: ["Agentic AI", "Reinforcement Learning", "Decision Systems"],
    methods: ["Python", "Point-in-Time Data", "Typed Schemas", "Policy Gate", "Human Approval", "Execution Harness", "Provenance"],
    access: "private",
    evidence: "B",
  },
];
