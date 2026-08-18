export type Locale = "en" | "ko";

const sharedLinks = [
  { label: "GitHub", href: "https://github.com/HarimxChoi" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/harimxchoi" },
];

export const portfolio = {
  en: {
    meta: {
      title: "Harim Choi | Machine Learning Engineer",
      description:
        "Machine learning engineer building reliable systems from tabular ML, NLP, computer vision, and LLM agents.",
    },
    nav: {
      brand: "Harim Choi",
      links: [
        ["Index", "#projects"],
      ],
    },
    hero: {
      eyebrow: "Harim Choi · Seoul",
      title: "Machine Learning Engineer",
      body:
        "I turn data, models, and operating workflows into reliable machine-learning systems.",
      links: sharedLinks,
    },
    careerIntro: {
      number: "01",
      eyebrow: "Career",
      title: "Systems built around real decisions, not isolated models.",
      body:
        "Four roles across public procurement, construction engineering, document automation, and global retail data. Each role connects modeling with the workflow that consumes the result.",
    },
    career: [
      {
        company: "Sejong Bid Institute",
        role: "Researcher",
        period: "Apr 2026–Present",
        context:
          "Public-procurement probabilistic ML, Document AI, and production operations",
        categories: ["Tabular ML", "Probabilistic ML", "MLOps", "Document AI"],
        tools: [
          "Routed GPU inference",
          "Multiprocessing",
          "Model registry",
          "Artifact validation",
          "OCR",
          "TabICLv2",
          "Quantile / distributional regression",
          "Conformal prediction",
          "CRPS / multi-pinball",
          "Monte Carlo simulation",
        ],
        bullets: [
          "Probabilistic Bid ML & MLOps | Took over a public-procurement AI system built by a five-person team over six months and rebuilt it in three months. Modeled regional competitor bids with quantile models and CQR/R2CCP, then generated about 80,000 candidate bids per notice from a q1000 model zoo using TabICLv2, CatBoost, XGBoost, and AutoGluon. Connected candidates to Monte Carlo simulation and operated the workflow through Airflow DAGs, parallel GPU inference, artifact checksums, dry-runs, and approval-gated deployment. The system serves more than 1,000 clients, improved the internal relative bid-award KPI by 30%, and reduced inference time from 136 seconds to 25 seconds.",
          "Document AI OCR | Collected HWP/HWPX and PDF notices, parsed them with rhwp, hwp5, and liteparse v2, and normalized the output to JSON. Used Gemini 2.5 Flash-Lite only to copy target fields while deterministic code validated amounts, ratios, and units. The pipeline processes about 2,000 new notices per day and achieved F1 0.985 on key-field extraction.",
        ],
      },
      {
        company: "Hanmac Group",
        role: "ML Engineer / Researcher",
        period: "Nov 2024–Feb 2026",
        context:
          "Procurement NLP, multimodal distribution forecasting, and RAG agents",
        categories: ["NLP", "RAG / Agentic AI", "Probabilistic ML", "Document AI"],
        tools: [
          "OCR",
          "Vector DB (FAISS)",
          "LangGraph",
          "LangChain",
          "Weak supervision",
          "RoBERTa-large + LoRA / PEFT",
          "ONNX Runtime INT8",
          "FastAPI",
          "R2CCP / contextual calibration",
        ],
        bullets: [
          "Multimodal PQ Bid Prediction | Divided PQ competition into eight contexts and modeled multimodal bid distributions with R2CCP. Corrected interval collapse in the public implementation with entropy regularization and per-bin conformal thresholds, preserving separated valid ranges before estimating bid probability with 500K Monte Carlo runs. Eight models trained on 69,934 cases reached 90.73% coverage on 13,984 time-ordered validation cases and improved the group-company PQ bid KPI by 35%.",
          "Procurement NLP API | Trained a RoBERTa-large+LoRA binary model for bid eligibility, then generated detailed-domain labels through a UMAP/HDBSCAN ontology and SBERT-RoBERTa teacher-based weak labeling. Quantized the binary and multiclass models to about 330 MB with static INT8 ONNX and deployed them through a FastAPI CPU batch path. The system reached Macro-F1 0.9639 and Accuracy 96.4% for eligibility, F1 0.90 for detailed domains, and about 50 ms inference per notice.",
          "Cost-Estimation RAG Agent | Built a FAISS-based vector index from government-document OCR output, standard-cost references, and unit-price data. Connected LangChain retrieval and a LangGraph workflow to cost estimation, quantity-takeoff sheets, and official-letter drafts.",
        ],
        evidenceImage: "/img/r2ccp-comparison.png",
        evidenceAlt:
          "Comparison between a collapsed cumulative prediction interval and per-bin intervals that preserve a bimodal distribution",
        evidenceCaption: "Synthetic bimodal example · method comparison",
      },
      {
        company: "Sanha General Technology",
        role: "AI / Automation Engineer",
        period: "Jan 2021–Nov 2024",
        context: "Document, CAD, ERP, and drone-survey automation for construction engineering",
        categories: ["Document AI", "Automation", "3D Vision / CAD"],
        tools: [
          "OCR",
          "Document layout parsing",
          "Rule-based post-processing",
          "Template automation",
          "AutoCAD add-in",
          "ERP integration",
          "Drone imagery",
          "Survey-to-3D",
        ],
        bullets: [
          "Document Automation | Structured heterogeneous construction documents with OCR and layout parsing, then added confidence-based review and rule-based post-processing.",
          "CAD & ERP Automation | Built an AutoCAD add-in and template automation for repetitive drawing work and connected document and drawing outputs to ERP input workflows.",
          "Drone & Survey 3D Workflow | Converted drone imagery and survey data into 3D outputs for field review.",
          "Result | Reduced document work from more than four hours to about 30 minutes and converted outsourced or manual document and drawing tasks into in-house automation tools.",
        ],
      },
      {
        company: "Nielsen Korea GTC",
        role: "Data Analyst",
        period: "Aug 2019–Oct 2020",
        context: "Computer vision and RPA for global retail product data",
        categories: ["Computer Vision", "RPA", "Data Engineering"],
        tools: [
          "Product image analysis",
          "Attribute extraction",
          "Barcode recognition",
          "Barcode database",
          "RPA",
          "Data quality checks",
          "Workflow automation",
        ],
        bullets: [
          "Retail Vision | Extracted operational visual attributes from global retail product images and validated data quality.",
          "Barcode Data | Connected barcode-recognition results to the product database and built a unified image and product-information workflow.",
          "RPA & Exception Routing | Automated repetitive input and validation steps, routed only exceptions for review, and reduced department-wide processing time by about 40%.",
        ],
      },
    ],
    projectIntro: {
      number: "01",
      eyebrow: "Index",
      title: "Project Notes",
      body:
        "Systems and research ordered by recency.",
    },
    projectGroups: [
      {
        index: "A",
        title: "Production ML · Document AI · Probabilistic Systems",
        description:
          "Work projects that turn unstructured procurement data into deployable classifiers, calibrated distributions, and approval-gated decisions.",
        projects: [
          {
            title: "Uncertainty-Aware Bid ML",
            status: "Production ML / probabilistic decision system",
            period: "Apr 2026–Present",
            summary:
              "A q1000 and Monte Carlo decision system that provides bid-win probabilities and uncertainty for each client.",
            categories: ["Probabilistic ML", "Uncertainty Quantification", "MLOps"],
            tools: ["XGBoost", "CatBoost", "TabICLv2", "Quantile regression", "Monte Carlo", "SHA256 manifests"],
            bullets: [
              "Models regional competitor patterns with quantile models and CQR/R2CCP, then generates about 80,000 candidate bids per notice from a q1000 model zoo.",
              "Evaluates candidate validity, lowest-price probability, and bid-win probability through regional Monte Carlo simulation, with training, GPU inference, reporting, and verification in one pipeline.",
            ],
            metric: "Bid KPI +30% · inference 136 s → 25 s",
          },
          {
            title: "Document AI OCR",
            status: "Production Document AI / batch extraction",
            period: "Apr 2026–Present",
            summary:
              "A deterministic Document AI pipeline that structures HWP, HWPX, and PDF notices while separating field copying from amount, ratio, and unit validation.",
            categories: ["Document AI", "OCR", "Batch Processing"],
            tools: ["Python", "HWP/HWPX", "PDF", "Gemini 2.5 Flash-Lite", "ThreadPool", "Structured logs"],
            bullets: [
              "Parses each format with rhwp, hwp5, and liteparse v2, normalizes the output to JSON, and uses a lightweight LLM only to copy required fields.",
              "Processes about 2,000 new notices per day and validates amounts, ratios, and units with deterministic code.",
            ],
            metric: "F1 0.985 · about 2,000 notices/day",
          },
          {
            title: "Procurement NLP",
            status: "Production NLP / weak supervision / CPU serving",
            period: "Nov 2024–Feb 2026",
            summary:
              "A CPU NLP API that classifies bid eligibility and detailed work categories from Korean procurement-notice titles.",
            categories: ["NLP", "Weak Supervision", "Model Deployment"],
            tools: ["RoBERTa-large", "LoRA", "SBERT", "UMAP/HDBSCAN", "ONNX INT8", "FastAPI"],
            bullets: [
              "Builds a domain ontology with UMAP and HDBSCAN, then trains the detailed-category model from SBERT–RoBERTa weak labels and a RoBERTa-large+LoRA teacher representation.",
              "Quantizes both models to INT8 ONNX and serves them through a FastAPI CPU batch path at about 50 ms per notice.",
            ],
            href: "https://github.com/HarimxChoi/nlp-analysis-agent",
            metric: "Macro-F1 0.9639 · category F1 0.90 · about 50 ms CPU",
          },
          {
            title: "R2CCP Bid Prediction",
            status: "Probabilistic ML / conformal prediction",
            period: "Nov 2024–Feb 2026",
            summary:
              "A multimodal bid-rate forecasting system that preserves disjoint conformal regions and turns eight context distributions into candidate decisions through 500K Monte Carlo simulation.",
            categories: ["Probabilistic ML", "Conformal Prediction", "Decision Modeling"],
            tools: ["R2CCP", "Entropy regularization", "Per-bin threshold", "8 context models", "Monte Carlo"],
            bullets: [
              "Corrected interval collapse in the public R2CCP implementation with entropy regularization and per-bin conformal thresholds so separated valid regions remain separated.",
              "Trained eight context models on 69,934 cases and estimated bid-win probability for each candidate range with 500,000 Monte Carlo simulations.",
            ],
            href: "https://github.com/HarimxChoi/ensemble-bid-prediction",
            metric: "90.73% coverage · PQ bid KPI +35%",
          },
        ],
      },
      {
        index: "B",
        title: "Agentic AI · Retrieval · Product Systems",
        description:
          "Agent infrastructure that retrieves evidence, controls actions, persists state, and survives real operating constraints.",
        projects: [
          {
            title: "google-surf-mcp",
            status: "Public OSS / MCP search infrastructure",
            period: "Apr 2026–Present",
            summary:
              "One MCP for general search, academic search, web extraction, and spatial PDF parsing, with parallel queries and recoverable CAPTCHA handoff.",
            categories: ["Agentic AI", "Information Retrieval", "Document Processing / Security"],
            tools: [
              "TypeScript / Node.js",
              "MCP",
              "Google Search",
              "Parallel search",
              "Readability",
              "Spatial PDF parsing",
              "SSRF defense",
              "CAPTCHA handoff",
              "Telemetry",
            ],
            bullets: [
              "Combines Google Search and Google Scholar with Playwright and Readability extraction plus coordinate-aware academic PDF parsing.",
              "Adds provider fallback, SSRF protection, CAPTCHA continuation, and 388 tests covering search, extraction, recovery, and security.",
            ],
            href: "https://github.com/HarimxChoi/google-surf-mcp",
            image: "/img/google-surf-demo.gif",
            imageAlt: "google-surf-mcp search and extraction demo",
            imageCaption: "Public OSS demo",
            metric: "MCP TOPLIST · Top 1% of 95K servers",
          },
          {
            title: "Monogram",
            status: "Public OSS / personal knowledge automation",
            period: "Apr 2026–Present",
            summary:
              "A personal knowledge system that turns one share action into organized, searchable knowledge from news, social media, papers, videos, and documents.",
            categories: ["RAG / Retrieval", "Agentic AI", "Knowledge Automation"],
            tools: [
              "Python",
              "EmbeddingGemma-300M",
              "ONNX INT8",
              "Sharded vector index",
              "BM25 / RRF",
              "MCP",
              "PageRank / MMR",
              "Git Tree API",
            ],
            bullets: [
              "Processes inputs through an Orchestrator → Classifier → Extractor → Verifier → Writer pipeline.",
              "Combines an ONNX INT8 embedding model, a Git-backed sharded vector index, BM25, RRF, Personalized PageRank, and MMR behind one retrieval path.",
              "Uses atomic Git Tree commits with SSRF defense, secret redaction, cassette evaluation, backup, and a kill switch.",
            ],
            href: "https://github.com/HarimxChoi/monogram",
            image: "/img/monogram-dashboard.png",
            imageAlt: "Monogram project dashboard using synthetic example data",
            imageCaption: "Dashboard · synthetic example data",
            metric: "One share action · capture, organize, search",
          },
          {
            title: "Bau Browser",
            status: "Private local MVP / agent-native browser",
            period: "2026",
            summary:
              "A local-first desktop browser where users control private data and agent actions through a scoped propose → approve → execute flow.",
            categories: ["Agentic AI", "Browser Automation", "Agent Safety"],
            tools: [
              "TypeScript",
              "Electron 43",
              "MCP",
              "SQLite",
              "Two-phase HITL",
              "Origin / action scoping",
              "Encrypted sync",
              "Decision logging",
              "Prompt-injection testing",
            ],
            bullets: [
              "Built the browser surface from tabs and session restoration through safe browsing, document extraction, and encrypted synchronization.",
              "Trained a Qwen3.5-4B bound-draft pilot that selects trusted identifiers while the host owns executable arguments. It generated the correct action and arguments in 36/36 new-domain tasks, with zero actions outside the allowed scope.",
            ],
            image: "/img/bau-browser-synthetic.png",
            imageAlt: "Bau Browser native desktop capture using a synthetic comparison fixture",
            imageCaption: "Native desktop capture · synthetic fixture",
            metric: "New-domain tasks · exact action binding 36/36 · out-of-scope actions 0",
          },
          {
            title: "LangGraph Travel Agent",
            status: "Delivered to a U.S. travel agency / Public OSS",
            period: "May 2025–Jul 2025",
            summary:
              "A travel advisor delivered to a U.S. agency that turns a natural-language request into three bookable packages and connects review, CRM, and customer messaging.",
            categories: ["Agentic AI", "Workflow Orchestration", "API Integration"],
            tools: [
              "Python",
              "LangGraph",
              "AsyncIO",
              "FastAPI",
              "LangGraph checkpointer",
              "HITL",
              "Tool calling",
              "Amadeus / Hotelbeds",
              "Twilio / HubSpot",
            ],
            bullets: [
              "Manages budget, schedule, and preference constraints in LangGraph state and searches Amadeus and Hotelbeds concurrently to generate three travel-package tiers.",
              "Connects FastAPI task polling, resumable checkpoints, HubSpot handoff, and an explicit review boundary before outbound actions.",
            ],
            href: "https://github.com/HarimxChoi/langgraph-travel-agent",
            metric: "Agent delivered to a U.S. travel agency",
          },
        ],
      },
      {
        index: "C",
        title: "Agent Evaluation · Decision Systems",
        description:
          "Research and systems that separate observed performance from what can be known before acting.",
        projects: [
          {
            title: "Vargo",
            status: "Private research / reliable agent evaluation",
            period: "2026–Present",
            summary:
              "Research asking whether task text, embeddings, or hidden states can identify the best LLM-agent configuration before execution.",
            categories: ["Agentic AI", "LLM Evaluation", "Research Infrastructure"],
            tools: [
              "Python",
              "Agent evaluation",
              "Scaffold / memory / retry ablation",
              "Verifier cascade",
              "Configuration selection gap",
              "Domain-shift analysis",
              "Contamination control",
              "Reproducibility harness",
            ],
            bullets: [
              "Ran the same 134 ALFWorld tasks across 29 agent configurations and compared pre-execution routers with bounded candidate execution and verification.",
              "Verified execution increased recovered oracle gap from 54% to 85% and recovered 100% within an 11-configuration deployable pool; the paper is under review at TMLR.",
            ],
            metric: "Oracle-gap recovery 54% → 85% · TMLR review",
          },
          {
            title: "EMH Agent",
            status: "Public OSS / point-in-time RL portfolio agent",
            period: "2026–Present",
            summary:
              "A reinforcement-learning investment agent that builds and evaluates portfolios using only the information available at each point in time.",
            categories: ["Agentic AI", "Reinforcement Learning", "Decision Systems"],
            tools: [
              "Python",
              "Reinforcement learning (TQC)",
              "Point-in-time data",
              "Typed schemas",
              "Multi-agent architecture",
              "Policy gate",
              "Human approval",
              "Execution harness",
              "Provenance / reconciliation",
            ],
            bullets: [
              "Uses a point-in-time information agent and a three-seed TQC ensemble to allocate IVV, IEF, and SHV without future-data leakage.",
              "Deducts transaction costs, slippage, and financing costs before comparing return and drawdown with IVV over the same 756 trading days.",
            ],
            href: "https://github.com/HarimxChoi/emh-agent",
            metric: "Cost-aware 3-year validation · TQC +183.9% vs. IVV +99.6%",
          },
        ],
      },
      {
        index: "D",
        title: "LLM Quantization · Efficient Inference",
        description:
          "Low-bit methods for reducing the memory cost of model weights and inference state.",
        projects: [
          {
            title: "WarpQuant",
            status: "Technical report / low-bit LLM inference",
            period: "Aug 2026",
            summary:
              "A dual-domain post-training quantization method that compresses transformer weights after Hadamard rotation and spends a small recovery budget on columns ranked by Output-Fisher sensitivity. The same report evaluates a TurboQuant-style KV cache and per-token INT8 activations.",
            categories: ["LLM Quantization", "Efficient Inference", "Post-Training Quantization"],
            tools: [
              "PyTorch",
              "Hadamard rotation",
              "Block-GPTQ",
              "Output-Fisher",
              "KV cache quantization",
              "INT8 activation",
            ],
            bullets: [
              "Compresses the Qwen3.8-27B text backbone to 3.6165 bpw and 11.32 GiB with a rotation-domain 3-bit base and Output-Fisher column recovery.",
              "Extends the report to recent-window KV cache quantization and per-token dynamic INT8 activations.",
            ],
            href: "https://github.com/HarimxChoi/WarpQuant",
            image: "/img/warpquant-card.svg",
            imageAlt: "WarpQuant dual-domain quantization diagram",
            imageCaption: "Dual-domain PTQ",
            metric: "Qwen3.8-27B · 3.6165 text bpw",
          },
        ],
      },
      {
        index: "E",
        title: "Computer Vision · Calibration · Reliability",
        description:
          "Vision research for scarce labels, ambiguous boundaries, deployment constraints, and signals that must be calibrated before they are trusted.",
        projects: [
          {
            title: "WSSS",
            status: "Commissioned state-of-the-art weakly supervised segmentation research",
            period: "Aug 2025–Oct 2025",
            summary:
              "Improves segmentation learned from image-level labels by finding unreliable pixels in automatically generated masks and repairing only those regions before retraining.",
            categories: ["Computer Vision", "Weak Supervision", "Evaluation / Reliability"],
            tools: [
              "PyTorch",
              "WeCLIP+",
              "Semantic segmentation",
              "Pseudo-labeling",
              "Reliability mapping",
              "Disagreement-aware self-training",
              "COCO-Val / mIoU",
            ],
            bullets: [
              "Keeps CLIP and DINOv2 frozen, trains only the fusion head and decoder, and identifies unreliable pixels where the two representations disagree.",
              "Repairs only those pixels and reuses the corrected pseudo-mask for self-training.",
            ],
            href: "https://github.com/HarimxChoi/wsss-refined-pseudolabels",
            image: "/img/wsss-architecture.png",
            imageAlt: "Architecture diagram for weakly supervised semantic segmentation and pseudo-label refinement",
            imageCaption: "Model and pseudo-label refinement architecture",
            metric: "Commissioned WSSS SOTA research · 53.31% mIoU · +1.5 pp over WeCLIP+",
          },
          {
            title: "MyShot",
            status: "Private research / 3D golf vision and shot prediction",
            period: "2026–Present",
            summary:
              "Connects golfer, club, and ball tracking with 3D swing mechanics and personalized shot-outcome prediction from one phone video.",
            categories: ["Object Detection", "Human Pose", "3D Vision", "Prediction & UQ"],
            tools: [
              "YOLO11",
              "RTMPose",
              "MotionAGFormer",
              "Golf biomechanics",
              "Personal calibration",
              "Physics-based ball flight",
              "Reliability scoring",
            ],
            bullets: [
              "Tracks the golfer, club, and ball, reconstructs the full swing in 3D, and computes joint motion, X-Factor, swing power, and clubhead speed.",
              "Combines personal club records with a physics-based ball-flight model to estimate ball speed, direction, and carry while flagging unreliable pose frames.",
            ],
            metric: "Clubhead-speed median error 6.1% · MPJPE 35.6 mm · X-Factor MAE 3.1°",
          },
          {
            title: "EAT",
            status: "Private research / medical-image calibration",
            period: "Nov 2025–Present",
            summary:
              "E-AT combines focal loss, bidirectional R-Drop, and adaptive FGM so an ISIC skin-lesion classifier learns both class quality and better-calibrated confidence.",
            categories: ["Computer Vision", "Calibration / UQ", "Robust ML"],
            tools: [
              "PyTorch",
              "ConvNeXtV2-Tiny",
              "ISIC",
              "Focal loss",
              "R-Drop",
              "FGM",
              "Expected Calibration Error (ECE)",
              "Confidence calibration",
            ],
            bullets: [
              "Reached best macro-F1 0.8647 and minimum ECE 1.03% on balanced four-class ISIC, measured at separate checkpoints.",
              "Coupled sample difficulty, bounded perturbation, and consistency between two stochastic predictions in one training objective.",
            ],
            metric: "ECE 1.03% vs. CR-SAM (AAAI 2024) 1.7%",
          },
        ],
      },
    ],
    skillsIntro: {
      number: "02",
      eyebrow: "Skills",
      title: "Core technologies organized by the systems I build.",
      body:
        "The emphasis is on modern modeling, reliable decisions, efficient inference, and production delivery rather than a list of basic tools.",
    },
    skills: [
      [
        "Tabular & Probabilistic ML",
        [
          "TabPFN",
          "TabICLv2",
          "Prior-Data Fitted Networks",
          "Tabular ICL",
          "AutoGluon",
          "Quantile / distributional prediction",
          "Conformal prediction",
          "Calibration",
          "Monte Carlo simulation",
        ],
      ],
      [
        "NLP & Document Intelligence",
        [
          "Transformers",
          "PEFT / LoRA",
          "Weak supervision",
          "Knowledge distillation",
          "OCR",
          "Document parsing",
          "Information extraction",
        ],
      ],
      [
        "Vision & Multimodal Learning",
        [
          "Vision-language / foundation models",
          "Object detection",
          "WSSS",
          "Semantic segmentation",
          "2D / 3D pose estimation",
        ],
      ],
      [
        "RAG & Agentic Systems",
        [
          "Vector retrieval",
          "Hybrid search",
          "Reranking",
          "LangGraph",
          "MCP",
          "Tool calling",
          "HITL",
        ],
      ],
      [
        "Efficient Model Inference",
        [
          "INT3 / INT8 quantization",
          "Weight / KV / activation compression",
          "ONNX CPU / GPU inference",
        ],
      ],
      [
        "Production ML Systems",
        [
          "Data / training pipelines",
          "Parallel inference",
          "API / batch serving",
          "Model / artifact lifecycle",
          "Monitoring",
        ],
      ],
    ],
    approachIntro: {
      number: "03",
      eyebrow: "Approach",
      title: "What stays constant when the domain changes.",
    },
    approach: [
      {
        number: "1",
        title: "Measure the failure before optimizing the model.",
        body:
          "Audit the denominator, data split, leakage, metric implementation, and domain gap. A higher score is useful only when the score still represents the decision being made.",
      },
      {
        number: "2",
        title: "Design the entire decision path.",
        body:
          "Connect extraction, prediction, uncertainty, simulation, approval, execution, observability, and recovery instead of stopping at a model endpoint.",
      },
      {
        number: "3",
        title: "Treat cost and operating constraints as model inputs.",
        body:
          "CPU latency, GPU scheduling, write gates, human approval, mobile memory, and reproducibility shape the architecture from the beginning.",
      },
    ],
    footer: {
      line: "Machine Learning · Production systems · Open source · Research",
      location: "Seoul, South Korea",
      links: sharedLinks,
    },
  },
  ko: {
    meta: {
      title: "최하림 | Machine Learning Engineer",
      description:
        "Tabular ML, NLP, Computer Vision과 LLM Agent를 실제 의사결정 시스템으로 연결하는 머신러닝 엔지니어 최하림의 포트폴리오입니다.",
    },
    nav: {
      brand: "최하림",
      links: [
        ["목록", "#projects"],
      ],
    },
    hero: {
      eyebrow: "최하림 · 서울",
      title: "Machine Learning Engineer",
      body:
        "데이터·모델·운영 흐름을 신뢰할 수 있는 머신러닝 시스템으로 구현합니다.",
      links: sharedLinks,
    },
    careerIntro: {
      number: "01",
      eyebrow: "경력",
      title: "모델 하나가 아니라 실제 의사결정 경로를 만듭니다.",
      body:
        "공공조달, 건설엔지니어링, 문서 자동화와 글로벌 리테일 데이터에서 모델링 결과가 실제 업무로 이어지는 경로를 구축해 왔습니다.",
    },
    career: [
      {
        company: "세종분석연구원",
        role: "연구원",
        period: "2026.04–현재",
        context:
          "공공조달 확률예측·Document AI 시스템 재구축 및 운영",
        categories: ["Tabular ML", "Probabilistic ML", "MLOps", "Document AI"],
        tools: [
          "Routed GPU inference",
          "Multiprocessing",
          "Model registry",
          "Artifact validation",
          "OCR",
          "TabICLv2",
          "분위 / 분포회귀",
          "Conformal prediction",
          "CRPS / multi-pinball",
          "Monte Carlo simulation",
        ],
        bullets: [
          "확률예측·MLOps | 기존 5인 프로젝트팀이 6개월간 개발한 공공조달 AI 시스템을 인수해 3개월 안에 재구축했습니다. 지역별 경쟁사 투찰분포를 분위모델+CQR/R2CCP로 모델링하고, TabICLv2·CatBoost·XGBoost·AutoGluon q1000 model zoo에서 공고당 약 8만 개 후보를 생성했습니다. Monte Carlo simulation으로 후보별 위험·유효확률·낙찰확률을 계산하고 Airflow DAG, 병렬 GPU 추론, artifact checksum, dry-run과 승인 후 배포까지 운영했습니다. 매일 1,000개 이상 고객사에 향후 2일 내 입찰 가능한 공고의 추천가격과 낙찰확률을 제공하며, 기존 단일 분위모델 대비 내부 상대 낙찰 KPI를 30% 개선하고 추론시간을 136초에서 25초로 줄였습니다.",
          "Document AI OCR | HWP/HWPX·PDF 공고문을 수집해 rhwp·hwp5·liteparse v2로 파싱하고 JSON으로 정규화했습니다. Gemini 2.5 Flash-Lite는 주요 필드 복사에만 사용하고 금액·비율·단위는 코드로 검증하는 결정론적 경로를 구성했습니다. 매일 약 2,000개 신규 공고를 처리하며 주요 필드 추출 F1 0.985를 달성했습니다.",
        ],
      },
      {
        company: "한맥그룹",
        role: "ML 엔지니어 / 연구원",
        period: "2024.11–2026.02",
        context: "공공조달 NLP·다봉형 확률예측·RAG 수량산출 Agent 개발",
        categories: ["NLP", "RAG / Agentic AI", "Probabilistic ML", "Document AI"],
        tools: [
          "OCR",
          "VectorDB (FAISS)",
          "LangGraph",
          "LangChain",
          "Weak supervision",
          "RoBERTa-large + LoRA / PEFT",
          "ONNX Runtime INT8",
          "FastAPI",
          "R2CCP / contextual calibration",
        ],
        bullets: [
          "다봉형 PQ 낙찰예측 | PQ 경쟁환경을 8개 context로 분리하고 R2CCP로 다봉형 투찰분포를 모델링했습니다. 공개 구현체의 interval collapse를 entropy regularization과 per-bin conformal threshold로 수정해 떨어진 유효구간을 보존하고, 50만 회 Monte Carlo simulation으로 투찰범위별 낙찰확률을 계산했습니다. 69,934건으로 학습한 8개 모델이 시간순 validation 13,984건에서 coverage 90.73%를 기록했고 그룹사 PQ 낙찰 KPI를 35% 개선했습니다.",
          "공공조달 NLP API | RoBERTa-large+LoRA로 입찰가능성 binary model을 만들고, UMAP·HDBSCAN ontology와 SBERT·RoBERTa teacher 기반 weak labeling으로 세부분야 데이터를 생성했습니다. Binary·multiclass model을 static INT8 ONNX 약 330MB로 경량화해 FastAPI batch path로 CPU 배포했습니다. 입찰가능성 Macro-F1 0.9639·Accuracy 96.4%, 세부분야 F1 0.90과 공고당 약 50ms 추론을 기록했습니다.",
          "원가계산 RAG Agent | 정부 문서 OCR 결과와 표준품셈·단가 데이터를 FAISS 기반 Vector DB/index로 구성했습니다. LangChain retrieval과 LangGraph workflow에서 검색 결과를 원가 계산, 수량산출서와 공문 초안 생성까지 연결했습니다.",
        ],
        evidenceImage: "/img/r2ccp-comparison.png",
        evidenceAlt: "다봉 분포가 하나의 구간으로 뭉개지는 현상과 구간별 threshold를 적용한 결과 비교",
        evidenceCaption: "합성 다봉 분포 예시 · 방법 비교",
      },
      {
        company: "산하종합기술",
        role: "AI / 자동화 엔지니어",
        period: "2021.01–2024.11",
        context: "건설 문서, CAD, ERP와 측량 workflow 자동화",
        categories: ["Document AI", "Automation", "3D Vision / CAD"],
        tools: [
          "OCR",
          "Document layout parsing",
          "Rule-based post-processing",
          "Template automation",
          "AutoCAD add-in",
          "ERP 연계",
          "Drone imagery",
          "Survey-to-3D",
        ],
        bullets: [
          "문서 자동화 | 형식이 다른 건설 문서를 OCR·layout parsing으로 구조화하고 confidence 기반 검토와 규칙 기반 후처리를 적용했습니다.",
          "CAD·ERP 자동화 | 반복 도면 작업을 줄이는 AutoCAD add-in과 template automation을 개발하고 문서·도면 결과를 ERP 입력 흐름에 연결했습니다.",
          "드론·측량 3D workflow | 드론 이미지와 측량 데이터를 현장 검토용 3D 결과로 변환하는 workflow를 구축했습니다.",
          "성과 | 4시간 이상 걸리던 문서 작업을 약 30분대로 단축하고 외주·수작업 문서와 도면 업무를 사내 자동화 도구로 전환했습니다.",
        ],
      },
      {
        company: "닐슨코리아 GTC",
        role: "데이터 분석가",
        period: "2019.08–2020.10",
        context: "글로벌 리테일 상품 데이터의 Computer Vision·RPA 자동화",
        categories: ["Computer Vision", "RPA", "Data Engineering"],
        tools: [
          "상품 이미지 분석",
          "속성 추출",
          "바코드 인식",
          "바코드 데이터베이스",
          "RPA",
          "데이터 품질 검사",
          "Workflow 자동화",
        ],
        bullets: [
          "Retail Vision | 글로벌 리테일 상품 이미지에서 업무에 필요한 시각 속성을 추출하고 품질을 검사했습니다.",
          "Barcode Data | 바코드 인식 결과를 상품 데이터베이스와 연결해 이미지·상품정보 처리 흐름을 구축했습니다.",
          "RPA & Exception Routing | 반복 입력과 검수 단계를 자동화하고 예외 항목만 별도 검토하도록 분리해 부서 전체 처리시간을 약 40% 단축했습니다.",
        ],
      },
    ],
    projectIntro: {
      number: "01",
      eyebrow: "목록",
      title: "프로젝트 노트",
      body:
        "시스템과 연구를 최근 순으로 정리했습니다.",
    },
    projectGroups: [
      {
        index: "A",
        title: "Production ML · Document AI · Probabilistic Systems",
        description:
          "비정형 공공조달 데이터를 분류·확률분포·검증된 의사결정으로 바꾸어 실제 업무에 연결한 프로젝트입니다.",
        projects: [
          {
            title: "Uncertainty-Aware Bid ML",
            status: "Production ML / 확률적 의사결정 시스템",
            period: "2026.04–현재",
            summary:
              "고객사별 낙찰확률과 불확실성을 함께 제공하는 q1000·Monte Carlo 의사결정 ML입니다.",
            categories: ["Probabilistic ML", "Uncertainty Quantification", "MLOps"],
            tools: ["XGBoost", "CatBoost", "TabICLv2", "Quantile Regression", "Monte Carlo", "SHA256 manifest"],
            bullets: [
              "지역별 경쟁사 투찰 패턴을 분위모델과 CQR/R2CCP 분포로 모델링하고 q1000 model zoo에서 공고당 약 8만 개 후보 투찰값을 생성했습니다.",
              "지역별 Monte Carlo simulation으로 유효확률, 최저가 확률과 예상 낙찰확률을 계산하고 학습·GPU 추론·리포트·검증을 하나의 pipeline으로 운영했습니다.",
            ],
            metric: "낙찰 KPI +30% · 추론 136초 → 25초",
          },
          {
            title: "Document AI OCR",
            status: "Production Document AI / batch extraction",
            period: "2026.04–현재",
            summary:
              "HWP·HWPX·PDF 공고문을 구조화하고 필드 복사와 금액·비율·단위 검증을 분리한 결정론적 Document AI pipeline입니다.",
            categories: ["Document AI", "OCR", "Batch Processing"],
            tools: ["Python", "HWP/HWPX", "PDF", "Gemini 2.5 Flash-Lite", "ThreadPool", "Structured Logs"],
            bullets: [
              "rhwp, hwp5와 liteparse v2로 본문을 추출해 JSON으로 정규화하고, 경량 LLM에는 필요한 필드 복사만 맡겼습니다.",
              "매일 약 2,000개 신규 공고를 처리하며 금액·비율·단위는 코드로 계산하고 검증했습니다.",
            ],
            metric: "F1 0.985 · 일 약 2,000건",
          },
          {
            title: "Procurement NLP",
            status: "Production NLP / weak supervision / CPU serving",
            period: "2024.11–2026.02",
            summary:
              "공고명만으로 입찰가능성과 세부분야를 분류하고 CPU에서 운영하는 한국어 조달 NLP API입니다.",
            categories: ["NLP", "Weak Supervision", "Model Deployment"],
            tools: ["RoBERTa-large", "LoRA", "SBERT", "UMAP/HDBSCAN", "ONNX INT8", "FastAPI"],
            bullets: [
              "UMAP·HDBSCAN으로 분야별 ontology를 만들고 RoBERTa-large+LoRA teacher 표현과 SBERT–RoBERTa weak labeling으로 multiclass model을 학습했습니다.",
              "두 모델을 INT8 ONNX로 양자화하고 FastAPI CPU batch path에서 공고당 약 50ms로 추론했습니다.",
            ],
            href: "https://github.com/HarimxChoi/nlp-analysis-agent",
            metric: "Macro-F1 0.9639 · 세부분야 F1 0.90 · 약 50ms CPU",
          },
          {
            title: "R2CCP Bid Prediction",
            status: "Probabilistic ML / conformal prediction",
            period: "2024.11–2026.02",
            summary:
              "다봉형 입찰률 분포의 서로 떨어진 예측구간을 보존하고, 8개 문맥 분포를 50만 회 Monte Carlo simulation으로 의사결정에 연결한 프로젝트입니다.",
            categories: ["Probabilistic ML", "Conformal Prediction", "Decision Modeling"],
            tools: ["R2CCP", "Entropy Regularization", "Per-bin Threshold", "8 Context Models", "Monte Carlo"],
            bullets: [
              "공개 R2CCP 구현체의 interval collapse를 entropy regularization과 per-bin conformal threshold로 수정해 떨어진 유효구간을 보존했습니다.",
              "69,934건으로 8개 context model을 학습하고 후보별 50만 회 Monte Carlo simulation으로 투찰범위별 낙찰확률을 계산했습니다.",
            ],
            href: "https://github.com/HarimxChoi/ensemble-bid-prediction",
            metric: "Coverage 90.73% · PQ 낙찰 KPI +35%",
          },
        ],
      },
      {
        index: "B",
        title: "Agentic AI · Retrieval · Product Systems",
        description:
          "근거를 검색하고 행동을 통제하며 상태를 보존하고 실제 운영 제약을 견디는 Agent 인프라입니다.",
        projects: [
          {
            title: "google-surf-mcp",
            status: "Public OSS / MCP 검색 인프라",
            period: "2026.04–현재",
            summary:
              "일반검색, 학술검색, 웹 본문 추출과 좌표 기반 PDF parsing을 하나의 MCP로 통합하고 병렬검색과 CAPTCHA 복구를 지원합니다.",
            categories: ["Agentic AI", "Information Retrieval", "Document Processing / Security"],
            tools: [
              "TypeScript / Node.js",
              "MCP",
              "Google Search",
              "병렬 검색",
              "Readability",
              "Spatial PDF parsing",
              "SSRF 방어",
              "CAPTCHA handoff",
              "Telemetry",
            ],
            bullets: [
              "Google Search·Scholar, Playwright·Readability 본문 추출과 문서 좌표·읽기 순서를 복원하는 학술 PDF parsing을 한 경로로 구성했습니다.",
              "Provider fallback, SSRF 방어, CAPTCHA handoff와 검색·추출·복구·보안을 다루는 388개 test를 구성했습니다.",
            ],
            href: "https://github.com/HarimxChoi/google-surf-mcp",
            image: "/img/google-surf-demo.gif",
            imageAlt: "google-surf-mcp 검색 및 문서 추출 데모",
            imageCaption: "Public OSS 데모",
            metric: "MCP TOPLIST · 9.5만 서버 중 상위 1%",
          },
          {
            title: "Monogram",
            status: "Public OSS / 개인 지식관리(PKM) 자동화",
            period: "2026.04–현재",
            summary:
              "뉴스·SNS·논문·영상과 문서를 공유 한 번으로 정리하고 나중에 다시 검색하는 개인 지식관리 시스템입니다.",
            categories: ["RAG / Retrieval", "Agentic AI", "Knowledge Automation"],
            tools: [
              "Python",
              "EmbeddingGemma-300M",
              "ONNX INT8",
              "Sharded vector index",
              "BM25 / RRF",
              "MCP",
              "PageRank / MMR",
              "Git Tree API",
            ],
            bullets: [
              "입력을 Orchestrator → Classifier → Extractor → Verifier → Writer 5단계로 처리합니다.",
              "ONNX INT8 embedding, Git-backed sharded vector index와 BM25를 RRF로 결합하고 Personalized PageRank와 MMR로 확장했습니다.",
              "Git Tree API 원자적 저장과 SSRF 방어, secret redaction, cassette evaluation, backup, kill-switch를 구성했습니다.",
            ],
            href: "https://github.com/HarimxChoi/monogram",
            image: "/img/monogram-dashboard.png",
            imageAlt: "합성 예시 데이터로 구성한 Monogram 프로젝트 대시보드",
            imageCaption: "대시보드 · 합성 예시 데이터",
            metric: "공유 한 번으로 수집·정리·검색",
          },
          {
            title: "Bau Browser",
            status: "Private local MVP / agent-native browser",
            period: "2026",
            summary:
              "사용자가 프라이버시와 Agent 실행권한을 직접 관리하고, 허용한 범위 안에서만 행동하게 만든 local-first desktop browser입니다.",
            categories: ["Agentic AI", "Browser Automation", "Agent Safety"],
            tools: [
              "TypeScript",
              "Electron 43",
              "MCP",
              "SQLite",
              "Two-phase HITL",
              "Origin / action scoping",
              "Encrypted sync",
              "Decision logging",
              "Prompt-injection testing",
            ],
            bullets: [
              "탭과 세션 복원부터 safe browsing, 문서 추출과 암호화 동기화까지 browser surface를 구현했습니다.",
              "Qwen3.5-4B bound-draft pilot은 trusted identifier만 선택하고 실행 argument는 host가 구성하게 했습니다. 새로운 도메인의 36개 task에서 행동과 인수를 36/36 정확히 생성했고, 허용 범위를 벗어난 행동은 0건이었습니다.",
            ],
            image: "/img/bau-browser-synthetic.png",
            imageAlt: "합성 비교 fixture를 사용한 Bau Browser 네이티브 데스크톱 화면",
            imageCaption: "네이티브 데스크톱 캡처 · 합성 fixture",
            metric: "새로운 도메인 task · 행동·인수 36/36 · 허용 범위 밖 행동 0건",
          },
          {
            title: "LangGraph Travel Agent",
            status: "미국 여행사 납품 / Public OSS",
            period: "2025.05–2025.07",
            summary:
              "자연어 여행요청을 예약 가능한 3개 상품으로 만들고 상담자 검토, CRM과 고객 연락까지 연결해 미국 여행사에 납품한 Agent입니다.",
            categories: ["Agentic AI", "Workflow Orchestration", "API Integration"],
            tools: [
              "Python",
              "LangGraph",
              "AsyncIO",
              "FastAPI",
              "LangGraph checkpointer",
              "HITL",
              "Tool calling",
              "Amadeus / Hotelbeds",
              "Twilio / HubSpot",
            ],
            bullets: [
              "예산·일정·선호를 LangGraph state로 관리하고 Amadeus와 Hotelbeds를 비동기로 병렬 검색해 3단계 여행 패키지를 생성했습니다.",
              "FastAPI task polling, 재개 가능한 checkpoint와 HubSpot 연동을 연결하고 외부 action 전에는 명시적 검토 경계를 두었습니다.",
            ],
            href: "https://github.com/HarimxChoi/langgraph-travel-agent",
            metric: "미국 여행사 납품 Agent",
          },
        ],
      },
      {
        index: "C",
        title: "Agent Evaluation · Decision Systems",
        description:
          "관측된 성능과 실행 전에 알 수 있는 정보를 분리해 평가하는 연구와 의사결정 시스템입니다.",
        projects: [
          {
            title: "Vargo",
            status: "Private research / 신뢰 가능한 Agent 평가",
            period: "2026–현재",
            summary:
              "Task text, embedding이나 hidden state만으로 실행 전에 최적 LLM Agent 설정을 선택할 수 있는지 검증한 연구입니다.",
            categories: ["Agentic AI", "LLM Evaluation", "Research Infrastructure"],
            tools: [
              "Python",
              "Agent evaluation",
              "Scaffold / memory / retry ablation",
              "Verifier cascade",
              "Agent 구성 선택의 간극",
              "Domain-shift analysis",
              "Contamination control",
              "Reproducibility harness",
            ],
            bullets: [
              "같은 134개 ALFWorld task를 29개 Agent 설정으로 실행하고, 실행 전 router와 여러 후보를 직접 실행한 뒤 검증하는 방식을 비교했습니다.",
              "검증된 실행은 최적 성능과의 격차 회수율을 54%에서 85%로 높였고 11개 배포 후보군에서는 100% 회수했습니다. 논문은 TMLR review 중입니다.",
            ],
            metric: "최적 격차 회수 54% → 85% · TMLR review",
          },
          {
            title: "EMH Agent",
            status: "Public OSS / point-in-time RL 포트폴리오 Agent",
            period: "2026–현재",
            summary:
              "각 시점에 실제로 알 수 있었던 정보만 사용해 포트폴리오를 구성하고 평가하는 강화학습 투자 Agent입니다.",
            categories: ["Agentic AI", "Reinforcement Learning", "Decision Systems"],
            tools: [
              "Python",
              "강화학습(TQC)",
              "Point-in-time data",
              "Typed schemas",
              "Multi-agent architecture",
              "Policy gate",
              "Human approval",
              "Execution harness",
              "Provenance / reconciliation",
            ],
            bullets: [
              "Point-in-time 정보수집 Agent와 3개 seed의 TQC ensemble로 IVV·IEF·SHV 투자비중을 결정하고 미래정보 누수를 차단했습니다.",
              "거래비용, slippage와 차입비용을 차감한 뒤 같은 756거래일의 수익률과 drawdown을 IVV와 비교했습니다.",
            ],
            href: "https://github.com/HarimxChoi/emh-agent",
            metric: "비용을 반영한 3년 검증 · TQC +183.9% vs. IVV +99.6%",
          },
        ],
      },
      {
        index: "D",
        title: "LLM Quantization · Efficient Inference",
        description:
          "모델 가중치와 추론 상태의 메모리 비용을 줄이는 저비트 양자화 연구입니다.",
        projects: [
          {
            title: "WarpQuant",
            status: "Technical report / 저비트 LLM 추론",
            period: "2026.08",
            summary:
              "Hadamard 회전 뒤 Transformer 가중치를 압축하고, Output-Fisher 민감도가 높은 column에 작은 복원 예산을 배분하는 dual-domain PTQ 방법입니다. 같은 리포트에서 TurboQuant식 KV cache와 token별 INT8 activation도 함께 평가합니다.",
            categories: ["LLM Quantization", "Efficient Inference", "Post-Training Quantization"],
            tools: [
              "PyTorch",
              "Hadamard rotation",
              "Block-GPTQ",
              "Output-Fisher",
              "KV cache quantization",
              "INT8 activation",
            ],
            bullets: [
              "회전 영역 3-bit base와 Output-Fisher column 복원으로 Qwen3.8-27B text backbone을 3.6165 bpw, 11.32 GiB로 압축했습니다.",
              "Recent-window KV cache quantization과 token별 dynamic INT8 activation을 같은 리포트에서 평가했습니다.",
            ],
            href: "https://github.com/HarimxChoi/WarpQuant",
            image: "/img/warpquant-card.svg",
            imageAlt: "WarpQuant dual-domain 양자화 구조",
            imageCaption: "Dual-domain PTQ",
            metric: "Qwen3.8-27B · 3.6165 text bpw",
          },
        ],
      },
      {
        index: "E",
        title: "Computer Vision · Calibration · Reliability",
        description:
          "데이터가 부족하고 경계가 모호하며 배포 제약이 있는 환경에서 어떤 신호를 어디까지 믿을 수 있는지 다루는 Vision 연구입니다.",
        projects: [
          {
            title: "WSSS",
            status: "WSSS SOTA 연구용역",
            period: "2025.08–2025.10",
            summary:
              "이미지 단위 정답만으로 segmentation을 학습할 때, 자동 생성된 mask에서 신뢰하기 어려운 pixel만 찾아 복원한 뒤 다시 학습하는 방법입니다.",
            categories: ["Computer Vision", "Weak Supervision", "Evaluation / Reliability"],
            tools: [
              "PyTorch",
              "WeCLIP+",
              "Semantic segmentation",
              "Pseudo-labeling",
              "Reliability mapping",
              "Disagreement-aware self-training",
              "COCO-Val / mIoU",
            ],
            bullets: [
              "CLIP과 DINOv2 backbone은 고정하고 두 표현을 결합하는 fusion head와 decoder만 학습했습니다.",
              "두 표현이 다르게 판단한 pixel만 복원한 뒤 수정한 pseudo-mask를 self-training에 다시 사용했습니다.",
            ],
            href: "https://github.com/HarimxChoi/wsss-refined-pseudolabels",
            image: "/img/wsss-architecture.png",
            imageAlt: "약지도학습 semantic segmentation과 pseudo-label refinement 구조",
            imageCaption: "모델 및 pseudo-label refinement 구조",
            metric: "WSSS SOTA 연구용역 · mIoU 53.31% · WeCLIP+ 대비 +1.5%p",
          },
          {
            title: "MyShot",
            status: "Private research / 3D golf vision and shot prediction",
            period: "2026–현재",
            summary:
              "휴대폰 영상 하나에서 골퍼·클럽·공을 추적하고 3D 스윙 mechanics를 개인화한 샷 결과 예측으로 연결합니다.",
            categories: ["Object Detection", "Human Pose", "3D Vision", "Prediction & UQ"],
            tools: [
              "YOLO11",
              "RTMPose",
              "MotionAGFormer",
              "Golf biomechanics",
              "Personal calibration",
              "Physics-based ball flight",
              "Reliability scoring",
            ],
            bullets: [
              "골퍼·클럽·공을 추적하고 전체 스윙을 3D로 복원해 관절 움직임, X-Factor, swing power와 clubhead speed를 계산했습니다.",
              "클럽별 개인 기록과 physics-based ball-flight model을 결합해 ball speed, 방향과 carry를 계산하고 불안정한 pose frame을 구분합니다.",
            ],
            metric: "클럽헤드 속도 중앙오차 6.1% · MPJPE 35.6mm · X-Factor MAE 3.1°",
          },
          {
            title: "EAT",
            status: "Private research / 의료 이미지 calibration",
            period: "2025.11–현재",
            summary:
              "Focal loss, bidirectional R-Drop과 adaptive FGM을 결합해 ISIC 피부 병변 분류기의 성능과 confidence calibration을 함께 학습한 E-AT 연구입니다.",
            categories: ["Computer Vision", "Calibration / UQ", "Robust ML"],
            tools: [
              "PyTorch",
              "ConvNeXtV2-Tiny",
              "ISIC",
              "Focal loss",
              "R-Drop",
              "FGM",
              "Expected Calibration Error (ECE)",
              "Confidence calibration",
            ],
            bullets: [
              "균형 4-class ISIC에서 최고 macro-F1 0.8647과 minimum ECE 1.03%를 서로 다른 checkpoint에서 기록했습니다.",
              "Sample difficulty, 제한된 perturbation과 두 stochastic prediction의 consistency를 하나의 objective로 연결했습니다.",
            ],
            metric: "ECE 1.03% vs. CR-SAM (AAAI 2024) 1.7%",
          },
        ],
      },
    ],
    skillsIntro: {
      number: "02",
      eyebrow: "핵심 기술",
      title: "구축한 시스템을 기준으로 정리한 핵심 기술입니다.",
      body:
        "기초 도구를 나열하기보다 최신 모델링, 신뢰도 평가, 효율적 추론과 프로덕션 구현 역량을 중심으로 정리했습니다.",
    },
    skills: [
      [
        "Tabular & Probabilistic ML",
        [
          "TabPFN",
          "TabICLv2",
          "Prior-Data Fitted Networks",
          "Tabular ICL",
          "AutoGluon",
          "Quantile / distributional prediction",
          "Conformal prediction",
          "Calibration",
          "Monte Carlo simulation",
        ],
      ],
      [
        "NLP & Document Intelligence",
        [
          "Transformers",
          "PEFT / LoRA",
          "Weak supervision",
          "Knowledge distillation",
          "OCR",
          "Document parsing",
          "Information extraction",
        ],
      ],
      [
        "Vision & Multimodal Learning",
        [
          "Vision-language / foundation models",
          "Object detection",
          "WSSS",
          "Semantic segmentation",
          "2D / 3D pose estimation",
        ],
      ],
      [
        "RAG & Agentic Systems",
        [
          "Vector retrieval",
          "Hybrid search",
          "Reranking",
          "LangGraph",
          "MCP",
          "Tool calling",
          "HITL",
        ],
      ],
      [
        "Efficient Model Inference",
        [
          "INT3 / INT8 quantization",
          "Weight / KV / activation compression",
          "ONNX CPU / GPU inference",
        ],
      ],
      [
        "Production ML Systems",
        [
          "Data / training pipelines",
          "Parallel inference",
          "API / batch serving",
          "Model / artifact lifecycle",
          "Monitoring",
        ],
      ],
    ],
    approachIntro: {
      number: "03",
      eyebrow: "접근 방식",
      title: "도메인이 바뀌어도 반복되는 문제 해결 방식입니다.",
    },
    approach: [
      {
        number: "1",
        title: "모델을 최적화하기 전에 실패를 측정합니다.",
        body:
          "분모, 데이터 split, 누수, metric 구현과 domain gap부터 확인합니다. 점수가 실제 의사결정을 나타낼 때만 성능 개선을 의미 있게 봅니다.",
      },
      {
        number: "2",
        title: "의사결정 경로 전체를 설계합니다.",
        body:
          "추출, 예측, 불확실성, 시뮬레이션, 승인, 실행, 관측과 복구를 연결하고 모델 endpoint에서 멈추지 않습니다.",
      },
      {
        number: "3",
        title: "비용과 운영 제약을 처음부터 모델 입력처럼 다룹니다.",
        body:
          "CPU latency, GPU scheduling, write gate, 인간 승인, mobile memory와 재현성이 처음부터 아키텍처를 결정하도록 설계합니다.",
      },
    ],
    footer: {
      line: "Machine Learning · Production systems · Open source · Research",
      location: "서울, 대한민국",
      links: sharedLinks,
    },
  },
} as const;
