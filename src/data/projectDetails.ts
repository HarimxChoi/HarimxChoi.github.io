export interface ProjectMetricCard {
  label: string;
  value: string;
  note?: string;
}

export interface ProjectFlowStep {
  label: string;
  description: string;
}

export interface ProjectFlow {
  title: string;
  intro?: string;
  steps: ProjectFlowStep[];
}

export interface ProjectFigure {
  src: string;
  alt: string;
  caption?: string;
}

export interface ProjectResultTable {
  title: string;
  columns: string[];
  rows: string[][];
  caption?: string;
}

export interface ProjectEvidenceLink {
  label: string;
  href: string;
  note?: string;
}

export interface ProjectDetail {
  claim: string;
  lead: string[];
  metricCards?: ProjectMetricCard[];
  flow?: ProjectFlow;
  figures?: ProjectFigure[];
  resultTables?: ProjectResultTable[];
  contribution?: string[];
  evidenceLinks?: ProjectEvidenceLink[];
  category: string;
  builtWith: string[];
}

type ProjectLanguage = "en" | "ko";

const details: Record<ProjectLanguage, Record<string, ProjectDetail>> = {
  en: {
    wsss: {
      claim: "State-of-the-art WSSS research · +1.5 pp mIoU over the previous SOTA",
      lead: [
        "When segmentation is trained from image-level labels alone, automatically generated masks contain pixels the model should not trust. This method finds only those unreliable pixels, repairs them, and retrains the model with cleaner supervision.",
        "Frozen CLIP and DINOv2 representations provide complementary signals. Their agreement becomes a pixel-level reliability map, disagreeing pixels are repaired, and the feature-fusion heads and decoder are trained on the refined masks.",
      ],
      metricCards: [
        {
          label: "COCO-Val 2014",
          value: "40,137 images",
          note: "Evaluation over the complete validation set",
        },
        {
          label: "Refined WSSS",
          value: "53.31% mIoU",
          note: "Final semantic-segmentation performance",
        },
        {
          label: "Previous SOTA",
          value: "+1.5 pp",
          note: "Compared with WeCLIP+ at 51.8% mIoU",
        },
      ],
      flow: {
        title: "From weak labels to reliable pixel supervision",
        intro: "The model preserves strong pretrained representations and spends learning capacity on the uncertain parts of each generated mask.",
        steps: [
          {
            label: "Frozen representations",
            description: "Extract complementary visual evidence with CLIP and DINOv2 without updating either backbone.",
          },
          {
            label: "Reliability map",
            description: "Measure where the two representations support the same pixel assignment and where they disagree.",
          },
          {
            label: "Pixel repair",
            description: "Replace only the unreliable regions instead of regenerating the entire pseudo-mask.",
          },
          {
            label: "Segmentation training",
            description: "Train the feature-fusion heads and segmentation decoder using the repaired masks as supervision.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/wsss/wsss-performance.svg",
          alt: "Bar chart comparing WSSS performance of WeCLIP+ at 51.8 percent mIoU and the refined method at 53.31 percent mIoU on all 40,137 COCO-Val 2014 images",
          caption: "COCO-Val 2014 · all 40,137 validation images · mIoU",
        },
      ],
      resultTables: [
        {
          title: "COCO-Val comparison",
          columns: ["Method", "Supervision", "mIoU"],
          rows: [
            ["WeCLIP+", "Image-level labels", "51.80%"],
            ["Refined pseudo-label method", "Image-level labels", "53.31%"],
          ],
          caption: "Both figures use the full COCO-Val 2014 evaluation set.",
        },
      ],
      contribution: [
        "Designed the pixel-reliability and selective-repair strategy around frozen CLIP and DINOv2 representations.",
        "Implemented the refinement and retraining pipeline, then evaluated the final model over the complete COCO-Val 2014 set.",
      ],
      evidenceLinks: [
        {
          label: "Source code",
          href: "https://github.com/HarimxChoi/wsss-refined-pseudolabels",
          note: "Training, refinement, and evaluation implementation",
        },
      ],
      category: "Computer Vision",
      builtWith: ["PyTorch", "CLIP", "DINOv2", "Semantic segmentation", "COCO-Val 2014"],
    },
    "emh-agent": {
      claim: "Cost-aware 3-year validation · TQC +183.9% vs. IVV +99.6%",
      lead: [
        "EMH Agent learns a daily allocation across US equities, government bonds, and cash-like assets using only the information available at each point in time. The environment carries current weights, drawdown, and prior reward forward instead of evaluating isolated predictions.",
        "The policy was evaluated over the same 756 held-out trading sessions as IVV. Transaction costs, slippage, and financing costs are deducted before returns are measured, and three independently trained TQC policies are combined deterministically.",
      ],
      metricCards: [
        {
          label: "Held-out validation",
          value: "756 sessions",
          note: "2019–2021 point-in-time evaluation",
        },
        {
          label: "Cumulative return",
          value: "+183.9%",
          note: "IVV returned +99.6% over the same dates",
        },
        {
          label: "Maximum drawdown",
          value: "−14.2%",
          note: "Compared with −33.8% for IVV",
        },
      ],
      flow: {
        title: "From point-in-time observations to a cost-aware portfolio",
        intro: "Each decision uses a frozen historical panel and is scored only after trading frictions have been deducted.",
        steps: [
          {
            label: "Point-in-time panel",
            description: "Build lagged return, risk, and market-context features for IVV, IEF, and SHV without future prices.",
          },
          {
            label: "TQC policy",
            description: "Map the current state, portfolio weights, and drawdown to bounded asset allocations.",
          },
          {
            label: "Cost-aware simulation",
            description: "Apply each allocation over the next 21 sessions after transaction, slippage, and financing costs.",
          },
          {
            label: "Deterministic ensemble",
            description: "Average three independently trained policies and compare the resulting daily path with IVV on identical dates.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/emh-agent/emh-cumulative.svg",
          alt: "Cumulative wealth and drawdown curves comparing a three-seed TQC ensemble with IVV across 756 held-out trading sessions from 2019 to 2021",
          caption: "Same 756 held-out sessions · transaction, slippage, and financing costs included",
        },
        {
          src: "/img/projects/emh-agent/emh-yearly.svg",
          alt: "Annual returns and maximum drawdowns for the TQC ensemble and IVV in 2019, 2020, and 2021",
          caption: "Year-by-year return and maximum drawdown on the validation window",
        },
      ],
      resultTables: [
        {
          title: "Held-out validation",
          columns: ["Period", "TQC return", "IVV return", "TQC MDD", "IVV MDD"],
          rows: [
            ["2019", "+32.1%", "+31.1%", "−5.3%", "−6.6%"],
            ["2020", "+56.5%", "+18.4%", "−14.2%", "−33.8%"],
            ["2021", "+37.2%", "+28.7%", "−5.9%", "−5.1%"],
            ["Full period", "+183.9%", "+99.6%", "−14.2%", "−33.8%"],
          ],
          caption: "Returns are computed from the reproduced daily paths of the same validation window.",
        },
        {
          title: "Five-window stress test",
          columns: ["Window", "Sessions", "TQC annualized", "IVV annualized"],
          rows: [
            ["Development", "1,995", "34.7%", "11.9%"],
            ["Validation", "756", "41.6%", "25.9%"],
            ["Continuity", "840", "1.9%", "6.5%"],
            ["Archival A", "147", "13.4%", "28.9%"],
            ["Archival B", "105", "24.3%", "28.3%"],
          ],
          caption: "The cost-aware TQC candidate was evaluated across all predefined windows; performance was not uniform across regimes.",
        },
      ],
      contribution: [
        "Built the point-in-time data contract, cost-aware portfolio environment, TQC training loop, and deterministic multi-seed evaluator.",
        "Separated research proposals from execution authority through typed policy gates, receipts, and reconciliation boundaries.",
      ],
      evidenceLinks: [
        {
          label: "Project repository",
          href: "https://github.com/HarimxChoi/emh-agent",
          note: "Point-in-time dataset, training, and evaluation implementation",
        },
      ],
      category: "Reinforcement Learning",
      builtWith: ["Python", "TQC", "Point-in-time data", "Gymnasium", "Stable-Baselines3"],
    },
    vargo: {
      claim: "Agent routing hits an identification wall · verified execution reaches the deployable ceiling",
      lead: [
        "Twenty-nine agent configurations produce different winners across the same 134 ALFWorld tasks, with as much as 29 percentage points of per-task headroom over one fixed configuration. The central problem is not whether better configurations exist, but whether a router can identify the winner before running it.",
        "Task text, frozen embeddings, hidden states, fine-tuned encoders, contextual routers, and deployment-time bandits all failed to recover that ordering reliably. Vargo therefore changes the decision: execute a bounded sequence of candidates, verify each outcome, and stop as soon as success is certified.",
      ],
      metricCards: [
        {
          label: "Evaluation matrix",
          value: "134 × 29",
          note: "ALFWorld tasks × agent configurations",
        },
        {
          label: "Oracle headroom",
          value: "up to +29 pp",
          note: "Best per-task configuration vs. one fixed setup",
        },
        {
          label: "Verified execution",
          value: "K = 11",
          note: "Reached the deployable capture ceiling",
        },
      ],
      flow: {
        title: "Replace winner prediction with bounded execution and verification",
        intro: "The system stops asking which configuration looks best and instead asks whether a candidate has produced a verifiable success.",
        steps: [
          {
            label: "Task and candidates",
            description: "Hold the task fixed and enumerate the reasoning, memory, retry, and verification configurations that can execute it.",
          },
          {
            label: "Fixed execution order",
            description: "Run candidates under a bounded budget rather than training another selector on an unstable ranking signal.",
          },
          {
            label: "Outcome verifier",
            description: "Check the environment result after each attempt and distinguish certified success from plausible-looking traces.",
          },
          {
            label: "Early stop",
            description: "Return the first verified success together with its execution record; otherwise expose the exhausted budget.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/vargo/vargo-identification-wall.png",
          alt: "Bar chart showing that task-side features, 2026 routing methods, deployment bandits, and activation probes fail to identify the per-task winning agent configuration before execution",
          caption: "Every tested pre-execution signal falls short of reliably identifying the per-task winner",
        },
        {
          src: "/img/projects/vargo/vargo-verified-execution.png",
          alt: "Capture curve showing the percentage of oracle gap recovered as the verified execution budget increases from 3 to 13 agent configurations",
          caption: "Corrected ALFWorld matrix · anchor-failure subset n=42 · 90% task-bootstrap intervals",
        },
      ],
      resultTables: [
        {
          title: "Two different decision problems",
          columns: ["Approach", "Signal available", "Observed outcome"],
          rows: [
            ["Pre-execution routing", "Task text, embeddings, hidden states, bandit feedback", "Could not identify the per-task winner"],
            ["Verified execution", "Actual candidate outcomes under bounded budget", "Reached the deployable ceiling at K=11"],
          ],
        },
      ],
      contribution: [
        "Built the 134-task × 29-configuration evaluation matrix and separated oracle headroom from what a deployable selector can actually identify.",
        "Implemented routing baselines, activation probes, contamination controls, and the verified-execution capture evaluation.",
      ],
      category: "Agent Evaluation",
      builtWith: ["Python", "ALFWorld", "Agent routing", "Verifier cascade", "Reproducible evaluation"],
    },
    eat: {
      claim: "Calibration-aware medical-image training · best ECE 0.94% · macro-F1 86.37%",
      lead: [
        "A classifier can be correct often and still be wrong about how confident it should be. EAT studies that gap on four-class ISIC skin-lesion classification, tracking calibration and classification quality separately throughout training.",
        "The method uses sample difficulty to coordinate focal weighting, a bounded parameter perturbation, and consistency between two stochastic forward passes. This gives difficult examples more attention while discouraging confidence that changes under a small perturbation.",
      ],
      metricCards: [
        {
          label: "ISIC validation",
          value: "n = 5,268",
          note: "Fold 3 · seed 42 · four classes",
        },
        {
          label: "Equal compute",
          value: "12.79% → 5.87%",
          note: "ECE: CE epoch 20 vs. Focal+R-Drop epoch 10",
        },
        {
          label: "Best observed",
          value: "0.94% ECE",
          note: "Macro-F1 reached 86.37% within 30 epochs",
        },
      ],
      flow: {
        title: "Train for both class accuracy and trustworthy confidence",
        intro: "The same sample-level difficulty signal controls how strongly the objective focuses, perturbs, and regularizes each example.",
        steps: [
          {
            label: "Clean stochastic pass",
            description: "Estimate the target-class probability and derive a difficulty score from the model's current confidence.",
          },
          {
            label: "Difficulty-aware objective",
            description: "Use focal weighting so hard or under-confident examples contribute more strongly to the classification loss.",
          },
          {
            label: "Elastic perturbation",
            description: "Scale a bounded parameter perturbation with sample difficulty and run a second stochastic forward pass.",
          },
          {
            label: "Consistency update",
            description: "Combine classification and bidirectional R-Drop consistency in one backward update.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/eat/eat-equal-compute-reliability.svg",
          alt: "Reliability curves and confidence distributions comparing cross-entropy at epoch 20 with Focal plus R-Drop at epoch 10 under the same estimated compute budget on 5,268 ISIC validation images",
          caption: "Matched cumulative compute · CE e20 vs. Focal+R-Drop e10 · ISIC fold 3, n=5,268",
        },
        {
          src: "/img/projects/eat/eat-training-curves.svg",
          alt: "Thirty-epoch expected calibration error and macro-F1 curves for cross-entropy, Focal plus R-Drop, and adaptive robust training on ISIC validation data",
          caption: "Calibration and classification were tracked separately after every epoch",
        },
      ],
      resultTables: [
        {
          title: "Equal-compute comparison",
          columns: ["Method", "Checkpoint", "Estimated cumulative FLOPs", "ECE", "Macro-F1"],
          rows: [
            ["Cross-entropy", "epoch 20", "5.52 × 10¹⁵", "12.79%", "84.32%"],
            ["Focal + R-Drop", "epoch 10", "5.52 × 10¹⁵", "5.87%", "83.19%"],
          ],
          caption: "Focal+R-Drop uses two stochastic forward passes per update, so ten epochs match the estimated compute of twenty CE epochs.",
        },
      ],
      contribution: [
        "Designed the difficulty-coupled focal, perturbation, and consistency objective and implemented the training and evaluation pipeline.",
        "Separated calibration from classification during analysis and regenerated reliability diagrams directly from saved class probabilities.",
      ],
      category: "Calibration & Uncertainty",
      builtWith: ["PyTorch", "ConvNeXt V2", "Focal loss", "R-Drop", "ISIC"],
    },
    "langgraph-travel-agent": {
      claim: "Travel advisor delivered to a U.S. agency · concurrent supplier search with resumable human review",
      lead: [
        "A travel request is not one model call: missing customer information, supplier latency, budget constraints, package comparison, CRM handoff, and outbound communication all have to remain consistent across a long-running workflow.",
        "This system keeps that state in LangGraph, pauses when customer information is incomplete, searches Amadeus and Hotelbeds concurrently, and turns the results into Budget, Balanced, and Premium packages before a human reviews the next action.",
      ],
      metricCards: [
        { label: "Supplier search", value: "Concurrent", note: "Amadeus and Hotelbeds via asyncio.gather" },
        { label: "Package synthesis", value: "3 tiers", note: "Budget, Balanced, and Premium" },
        { label: "Delivery", value: "U.S. agency", note: "Contract work released later as public OSS" },
      ],
      flow: {
        title: "A resumable path from request to reviewable travel package",
        intro: "Each node has one operational responsibility, while the graph retains enough state to pause and resume without rebuilding the request.",
        steps: [
          { label: "Collect constraints", description: "Normalize traveler, dates, budget, and preferences; pause when required customer information is missing." },
          { label: "Search concurrently", description: "Run flight and hotel supplier queries in parallel and return results through asynchronous task polling." },
          { label: "Synthesize packages", description: "Build three comparable package tiers and calculate the full trip cost from the same typed schema." },
          { label: "Review and handoff", description: "Save the selected context to HubSpot and keep outbound actions behind an explicit review boundary." },
        ],
      },
      figures: [
        {
          src: "/img/projects/langgraph-travel-agent/travel-architecture.svg",
          alt: "Architecture diagram of a LangGraph travel advisor with FastAPI task polling, customer-information handoff, concurrent Amadeus and Hotelbeds search, package synthesis, HubSpot handoff, and a review boundary",
          caption: "Code-grounded workflow · InMemorySaver and in-memory job store in the public implementation",
        },
        {
          src: "/img/projects/langgraph-travel-agent/travel-package-example.svg",
          alt: "Synthetic example comparing Budget, Balanced, and Premium travel packages with itemized total-cost arithmetic",
          caption: "Schema-based synthetic example · not live supplier or client data",
        },
      ],
      contribution: [
        "Designed and implemented the LangGraph state, conditional routing, asynchronous supplier search, package synthesis, API task lifecycle, and CRM handoff.",
        "Delivered the system to a U.S. travel agency and retained the contractual IP for a later public-source release.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/langgraph-travel-agent", note: "Graph, API, supplier tools, and typed travel-package models" },
      ],
      category: "Agent Systems",
      builtWith: ["Python", "LangGraph", "FastAPI", "AsyncIO", "Amadeus / Hotelbeds"],
    },
    myshot: {
      claim: "Single-camera golf swing reconstruction · mean |r| 0.95 on six independent motion-capture trials",
      lead: [
        "MyShot turns a smartphone golf video into a time-aligned 3D skeleton and measures how the torso and pelvis rotate through the swing. The difficult part is not drawing a pose on one frame, but preserving the motion pattern when depth is inferred from a single camera.",
        "A 2D pose detector first tracks the golfer, then a 243-frame MotionAGFormer model lifts the sequence into 3D. Training data, evaluation clips, and motion-capture trials are kept disjoint so that the temporal biomechanics can be checked outside the source video domain.",
      ],
      metricCards: [
        { label: "Independent mocap", value: "6 trials", note: "CMU golf swings not used for training" },
        { label: "X-Factor pattern", value: "mean |r| 0.95", note: "Predicted vs. motion-capture torso rotation" },
        { label: "Clean-2D study", value: "35.6 mm", note: "Mean 3D joint error on synchronized validation" },
      ],
      flow: {
        title: "From a monocular video to a biomechanical time series",
        intro: "The pipeline separates 2D detection error from 3D lifting and evaluates both joint geometry and the motion pattern used in golf analysis.",
        steps: [
          { label: "Video and 2D joints", description: "Detect the golfer and normalize 17 joints across the full swing rather than treating frames independently." },
          { label: "Temporal 3D lifting", description: "Use a 243-frame MotionAGFormer window to infer depth and preserve motion continuity." },
          { label: "Biomechanics", description: "Derive torso, pelvis, X-Factor, and knee trajectories from the reconstructed skeleton." },
          { label: "Cross-domain evaluation", description: "Compare time-aligned curves with independent CMU motion capture and inspect domain shift separately." },
        ],
      },
      figures: [
        {
          src: "/img/projects/myshot/myshot-golfdb-2d-to-3d.png",
          alt: "An anonymized four-phase golf swing example showing the source frame, detected 2D joints, and reconstructed 3D skeleton at address, top, impact, and finish",
          caption: "Anonymized research-dataset example · current model · address, top, impact, and finish",
        },
        {
          src: "/img/projects/myshot/myshot-method.svg",
          alt: "Method diagram from monocular golf video through 2D pose detection and 243-frame MotionAGFormer lifting to 3D joints and biomechanical curves",
          caption: "Detection, temporal lifting, biomechanics, and cross-domain validation are evaluated separately",
        },
        {
          src: "/img/projects/myshot/myshot-cmu-xfactor.png",
          alt: "Six small-multiple plots comparing predicted and ground-truth normalized X-Factor curves on independent CMU golf motion-capture trials",
          caption: "Independent CMU motion capture · six trials · mean absolute correlation 0.95",
        },
      ],
      contribution: [
        "Built the 2D-to-3D training and inference path, phase-aligned biomechanics, disjoint data split, leakage audit, and cross-domain evaluation.",
        "Separated clean-2D lifting accuracy from real-video detection error so model limits remain visible at deployment time.",
      ],
      category: "Computer Vision",
      builtWith: ["PyTorch", "MotionAGFormer", "2D pose", "Monocular 3D pose", "Motion capture"],
    },
    "google-surf-mcp": {
      claim: "Search and extraction infrastructure for AI agents · 6 MCP tools · 388 tests",
      lead: [
        "Agent search fails in more places than the search box: providers throttle, redirects hide internal targets, pages change markup, PDFs lose reading order, and CAPTCHA interrupts automation. google-surf-mcp turns those failures into one recoverable tool boundary.",
        "The server combines Google and academic search with web and PDF extraction, parallel execution, provider fallback, CAPTCHA handoff, cache control, parser self-healing, and SSRF protection. Agents receive structured results without carrying browser-specific recovery logic into every workflow.",
      ],
      metricCards: [
        { label: "MCP interface", value: "6 tools", note: "Search, parallel search, web, PDF, and academic retrieval" },
        { label: "Validation", value: "388 / 388", note: "Full Vitest suite across 44 test files" },
        { label: "Runtime boundary", value: "Recoverable", note: "Fallback, cache, CAPTCHA handoff, and self-healing parsers" },
      ],
      flow: {
        title: "One agent interface across unstable search and document sources",
        intro: "Provider selection, extraction, recovery, and security are separated so a failure can be handled at the layer that owns it.",
        steps: [
          { label: "Agent request", description: "Expose search and extraction as typed MCP tools with a consistent response schema." },
          { label: "Provider routing", description: "Choose browser or API search, run parallel queries, and fall back per query instead of failing the full batch." },
          { label: "Document extraction", description: "Recover readable web text and spatially ordered PDF content behind the same interface." },
          { label: "Recovery and safety", description: "Handle CAPTCHA, cache, rate limits, parser drift, redirects, and SSRF before returning structured results." },
        ],
      },
      figures: [
        {
          src: "/img/projects/google-surf-mcp/google-surf-architecture.svg",
          alt: "Architecture diagram showing six MCP tools routed through search providers, web and PDF extraction, recovery, caching, CAPTCHA handoff, parser healing, and SSRF protection",
          caption: "Six tools share provider, extraction, recovery, and safety layers",
        },
        {
          src: "/img/projects/google-surf-mcp/google-surf-validation.svg",
          alt: "Validation chart showing 388 passing tests across search and providers, extraction and SSRF, recovery and healing, and runtime state",
          caption: "Full Vitest run · 388 tests in 44 files",
        },
      ],
      contribution: [
        "Designed the MCP API and implemented provider routing, concurrent search, web and PDF extraction, caching, recovery, and security boundaries.",
        "Published the package and built a regression suite around real markup drift, redirect, CAPTCHA, parser, and cloud-runtime failure modes.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/google-surf-mcp", note: "Published MCP server, tests, and runtime documentation" },
      ],
      category: "Production ML Infrastructure",
      builtWith: ["TypeScript", "MCP", "Playwright", "PDF extraction", "Vitest"],
    },
    monogram: {
      claim: "Local-first knowledge pipeline · validated capture, atomic Git storage, and hybrid retrieval",
      lead: [
        "Personal knowledge systems usually split capture, structure, search, and backup into separate tools. Monogram treats them as one path: accept a message or document, verify what should be saved, commit all related files atomically, and make the result searchable from the same local knowledge base.",
        "Semantic retrieval uses EmbeddingGemma-300M with an ONNX backend and a Git-backed sharded INT8 index. Dense similarity and BM25 are fused with RRF, with optional graph expansion and reranking; the implementation does not depend on FAISS or an external vector database.",
      ],
      metricCards: [
        { label: "Capture pipeline", value: "5 stages", note: "Orchestrator, classifier, extractor, verifier, writer" },
        { label: "Storage boundary", value: "1 Git commit", note: "Related notes and assets written atomically" },
        { label: "Semantic index", value: "256-d INT8", note: "Domain-by-month JSONL shards" },
      ],
      flow: {
        title: "From an unstructured input to a searchable, versioned note",
        intro: "The system separates understanding from writing, then uses Git as both the storage transaction and recovery boundary.",
        steps: [
          { label: "Capture", description: "Accept Telegram, MCP, Obsidian, or document inputs through the same ingestion boundary." },
          { label: "Structure and verify", description: "Classify the input, extract fields, and verify the proposed note before writing." },
          { label: "Atomic storage", description: "Create or update all files with one Git Tree commit so partial writes cannot split the knowledge item." },
          { label: "Hybrid retrieval", description: "Combine sharded semantic search and BM25 through RRF, with optional graph expansion, MMR, and reranking." },
        ],
      },
      figures: [
        {
          src: "/img/projects/monogram/monogram-architecture.svg",
          alt: "Monogram architecture showing Telegram, MCP and document inputs through a five-stage validation pipeline into an atomic Git Tree commit and searchable outputs",
          caption: "One path from capture and verification to atomic storage and retrieval",
        },
        {
          src: "/img/projects/monogram/monogram-hybrid-retrieval.svg",
          alt: "Hybrid retrieval diagram showing EmbeddingGemma ONNX embeddings, a sharded INT8 JSONL index, NumPy similarity scan, BM25, RRF, and optional reranking",
          caption: "Custom sharded vector index + BM25/RRF · no FAISS dependency",
        },
        {
          src: "/img/monogram-dashboard.png",
          alt: "Monogram dashboard rendered with synthetic example data",
          caption: "Encrypted dashboard · synthetic example data",
        },
      ],
      contribution: [
        "Designed the five-stage capture pipeline, atomic Git Tree writer, sharded semantic index, hybrid retrieval path, MCP surface, and recovery controls.",
        "Added SSRF defense, secret redaction, cassette evaluation, backup, and a kill switch around automatic capture and retrieval.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/monogram", note: "Capture pipeline, Git storage, retrieval, MCP server, and dashboard" },
      ],
      category: "RAG & Retrieval",
      builtWith: ["Python", "EmbeddingGemma", "ONNX Runtime", "BM25 / RRF", "Git Tree API"],
    },
    "bau-browser": {
      claim: "Agent-native browser with bounded actions · exact 17/36 → 36/36 and forbidden executions 6 → 0",
      lead: [
        "A browser agent can read untrusted pages and then act with a user's identity, so a fluent plan is not enough. Bau Browser keeps targets, verbs, origins, arguments, approval, execution, and receipts inside separate host-owned boundaries that remain inspectable before and after an action.",
        "The local model selects a compact bound draft rather than writing executable arguments. Trusted bindings and TaskSpec data are compiled by the host, shown through a propose–approve–execute flow, and recorded with postconditions and a decision log.",
      ],
      metricCards: [
        { label: "Synthetic exact", value: "17/36 → 36/36", note: "Base vs. bound-draft adapter" },
        { label: "Forbidden execution", value: "6 → 0", note: "Origin-disjoint 36-case preflight" },
        { label: "Safety gate", value: "12/12", note: "Adapter passed recovery and verification cases" },
      ],
      flow: {
        title: "The model proposes identifiers; the host owns executable authority",
        intro: "The browser keeps page understanding, action compilation, user approval, execution, and audit records as separate contracts.",
        steps: [
          { label: "Observe", description: "Build a PageGraph and TaskSpec from the active origin without granting an action yet." },
          { label: "Bound draft", description: "Let the local model choose trusted target, verb, effect, and binding identifiers, not raw executable values." },
          { label: "Compile and approve", description: "Reconstruct arguments from host-owned bindings, validate scope, and show the proposed action to the user." },
          { label: "Execute and receipt", description: "Run only the approved action, verify postconditions, and write receipts and the DecisionLog." },
        ],
      },
      figures: [
        {
          src: "/img/projects/bau-browser/bau-execution-architecture.svg",
          alt: "Bau Browser architecture from desktop browser and scoped PageGraph through bound draft, host compiler, propose approve execute flow, browser or MCP action, receipts, postconditions, and decision log",
          caption: "Executable values and authority remain in the trusted host, not in model output",
        },
        {
          src: "/img/projects/bau-browser/bau-bound-draft-preflight.svg",
          alt: "Synthetic 36-case comparison showing base exact responses 17 of 36 and six forbidden executions versus adapter exact responses 36 of 36 and zero forbidden executions",
          caption: "Origin-disjoint synthetic preflight · not a live or official browser benchmark",
        },
        {
          src: "/img/bau-browser-synthetic.png",
          alt: "Native Bau Browser desktop capture using a synthetic product-comparison fixture",
          caption: "Native desktop capture · synthetic fixture",
        },
      ],
      contribution: [
        "Built the Electron browser surface, scoped agent contracts, host compiler, two-phase HITL, MCP boundary, receipts, postconditions, and SQLite decision log.",
        "Designed and trained the compact Qwen3.5-4B bound-draft pilot, then evaluated the frozen 36-case synthetic gate across exactness, compilation, binding, safety, and forbidden actions.",
      ],
      category: "Agent Safety",
      builtWith: ["TypeScript", "Electron", "MCP", "Qwen3.5-4B", "SQLite"],
    },
  },
  ko: {
    wsss: {
      claim: "WSSS SOTA 연구 · 기존 SOTA 대비 mIoU +1.5%p",
      lead: [
        "이미지 단위 정답만으로 segmentation을 학습할 때, 자동 생성된 mask에서 신뢰하기 어려운 pixel만 찾아 복원한 뒤 다시 학습하는 방법입니다.",
        "CLIP과 DINOv2 backbone은 고정한 채 서로 보완적인 신호로 사용했습니다. 두 표현이 일치하는 정도로 pixel별 reliability map을 만들고, 의견이 다른 pixel만 복원한 뒤 feature-fusion head와 decoder를 학습했습니다.",
      ],
      metricCards: [
        {
          label: "COCO-Val 2014",
          value: "40,137 images",
          note: "전체 validation image로 평가",
        },
        {
          label: "Refined WSSS",
          value: "53.31% mIoU",
          note: "최종 semantic segmentation 성능",
        },
        {
          label: "기존 SOTA 대비",
          value: "+1.5%p",
          note: "WeCLIP+ 51.8% mIoU 기준",
        },
      ],
      flow: {
        title: "이미지 정답에서 신뢰 가능한 pixel supervision까지",
        intro: "강한 pretrained representation은 그대로 유지하고, 자동 생성된 mask에서 불확실한 부분에만 학습을 집중했습니다.",
        steps: [
          {
            label: "Frozen representation",
            description: "CLIP과 DINOv2 backbone을 업데이트하지 않고 서로 다른 시각 정보를 추출합니다.",
          },
          {
            label: "Reliability map",
            description: "두 표현이 같은 pixel assignment를 지지하는지 비교해 신뢰하기 어려운 영역을 찾습니다.",
          },
          {
            label: "Pixel repair",
            description: "전체 pseudo-mask를 다시 만들지 않고, 의견이 다른 pixel만 선택적으로 복원합니다.",
          },
          {
            label: "Segmentation 학습",
            description: "복원된 mask를 supervision으로 사용해 feature-fusion head와 segmentation decoder를 학습합니다.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/wsss/wsss-performance.svg",
          alt: "COCO-Val 2014 전체 40,137개 이미지에서 WeCLIP+ 51.8% mIoU와 refined method 53.31% mIoU를 비교한 막대그래프",
          caption: "COCO-Val 2014 · validation image 40,137개 전체 · mIoU",
        },
      ],
      resultTables: [
        {
          title: "COCO-Val 성능 비교",
          columns: ["Method", "Supervision", "mIoU"],
          rows: [
            ["WeCLIP+", "Image-level labels", "51.80%"],
            ["Refined pseudo-label method", "Image-level labels", "53.31%"],
          ],
          caption: "두 결과 모두 COCO-Val 2014 전체 평가셋을 사용했습니다.",
        },
      ],
      contribution: [
        "Frozen CLIP과 DINOv2 representation을 이용한 pixel reliability와 selective repair 방법을 설계했습니다.",
        "Pseudo-label refinement부터 재학습까지 전체 pipeline을 구현하고 COCO-Val 2014 전체 데이터로 최종 성능을 평가했습니다.",
      ],
      evidenceLinks: [
        {
          label: "Source code",
          href: "https://github.com/HarimxChoi/wsss-refined-pseudolabels",
          note: "학습, refinement와 평가 구현",
        },
      ],
      category: "Computer Vision",
      builtWith: ["PyTorch", "CLIP", "DINOv2", "Semantic segmentation", "COCO-Val 2014"],
    },
    "emh-agent": {
      claim: "비용을 반영한 3년 검증 · TQC +183.9% vs. IVV +99.6%",
      lead: [
        "EMH Agent는 각 시점까지 알 수 있었던 정보만 사용해 미국 주식·국채·현금성 자산의 일별 비중을 결정합니다. 개별 예측을 따로 평가하지 않고 현재 비중, drawdown과 직전 보상을 다음 의사결정 상태로 이어갑니다.",
        "IVV와 동일한 756개 검증 거래일에서 정책을 평가했습니다. 거래비용, slippage와 financing cost를 수익률에서 먼저 차감하고, 서로 다른 seed로 학습한 TQC 정책 세 개를 고정된 방식으로 결합했습니다.",
      ],
      metricCards: [
        {
          label: "Held-out validation",
          value: "756 sessions",
          note: "2019–2021 point-in-time 평가",
        },
        {
          label: "누적수익률",
          value: "+183.9%",
          note: "같은 기간 IVV +99.6%",
        },
        {
          label: "Maximum drawdown",
          value: "−14.2%",
          note: "같은 기간 IVV −33.8%",
        },
      ],
      flow: {
        title: "당시의 정보에서 비용을 반영한 포트폴리오까지",
        intro: "미래 가격이 섞이지 않은 고정된 historical panel을 사용하고, 실제 거래 마찰을 차감한 뒤 정책을 평가했습니다.",
        steps: [
          {
            label: "Point-in-time panel",
            description: "IVV, IEF, SHV의 과거 수익률과 위험, 시장 맥락을 미래 정보 없이 feature로 구성합니다.",
          },
          {
            label: "TQC policy",
            description: "현재 상태와 보유 비중, drawdown을 입력받아 자산별 비중을 제한된 범위에서 결정합니다.",
          },
          {
            label: "Cost-aware simulation",
            description: "거래비용, slippage와 financing cost를 차감하며 다음 21개 거래일의 포트폴리오를 전개합니다.",
          },
          {
            label: "Deterministic ensemble",
            description: "독립적으로 학습한 정책 세 개를 결합하고 동일한 날짜의 IVV와 일별 경로를 비교합니다.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/emh-agent/emh-cumulative.svg",
          alt: "2019년부터 2021년까지 756개 검증 거래일에서 TQC 3-seed ensemble과 IVV의 누적 자산 및 drawdown을 비교한 그래프",
          caption: "동일한 검증 거래일 756개 · 거래비용, slippage와 financing cost 반영",
        },
        {
          src: "/img/projects/emh-agent/emh-yearly.svg",
          alt: "2019년, 2020년, 2021년 TQC ensemble과 IVV의 연간 수익률 및 maximum drawdown 비교",
          caption: "검증 구간을 연도별 수익률과 maximum drawdown으로 분해",
        },
      ],
      resultTables: [
        {
          title: "Held-out validation",
          columns: ["기간", "TQC 수익률", "IVV 수익률", "TQC MDD", "IVV MDD"],
          rows: [
            ["2019", "+32.1%", "+31.1%", "−5.3%", "−6.6%"],
            ["2020", "+56.5%", "+18.4%", "−14.2%", "−33.8%"],
            ["2021", "+37.2%", "+28.7%", "−5.9%", "−5.1%"],
            ["전체", "+183.9%", "+99.6%", "−14.2%", "−33.8%"],
          ],
          caption: "같은 검증 구간에서 재생성한 일별 수익률 경로를 기준으로 계산했습니다.",
        },
        {
          title: "5개 window stress test",
          columns: ["Window", "Sessions", "TQC 연환산", "IVV 연환산"],
          rows: [
            ["Development", "1,995", "34.7%", "11.9%"],
            ["Validation", "756", "41.6%", "25.9%"],
            ["Continuity", "840", "1.9%", "6.5%"],
            ["Archival A", "147", "13.4%", "28.9%"],
            ["Archival B", "105", "24.3%", "28.3%"],
          ],
          caption: "사전에 정한 모든 window에서 비용을 반영한 같은 TQC 후보를 비교했으며, 시장 구간에 따라 결과가 달랐습니다.",
        },
      ],
      contribution: [
        "Point-in-time data contract, 비용을 반영한 portfolio environment, TQC 학습과 multi-seed 평가 경로를 구현했습니다.",
        "연구 제안과 실제 실행 권한을 typed policy gate, receipt와 reconciliation 경계로 분리했습니다.",
      ],
      evidenceLinks: [
        {
          label: "Project repository",
          href: "https://github.com/HarimxChoi/emh-agent",
          note: "Point-in-time dataset, 학습과 평가 구현",
        },
      ],
      category: "Reinforcement Learning",
      builtWith: ["Python", "TQC", "Point-in-time data", "Gymnasium", "Stable-Baselines3"],
    },
    vargo: {
      claim: "Agent routing의 identification wall · 실행·검증으로 deployable ceiling 도달",
      lead: [
        "같은 ALFWorld 과제 134개에서도 29개 Agent 구성의 승자는 과제마다 달랐고, 과제별 최적 구성을 쓸 때 하나의 고정 구성보다 최대 29%p의 성능 여지가 있었습니다. 문제는 더 좋은 구성이 있는지가 아니라, 실행 전에 그 승자를 알아낼 수 있는가였습니다.",
        "Task text, frozen embedding, hidden state, fine-tuned encoder, contextual router와 deployment-time bandit까지 비교했지만 승자 순서를 안정적으로 복원하지 못했습니다. 그래서 Vargo는 후보를 제한된 순서로 실행하고, 매번 결과를 검증해 성공이 확인되면 멈추는 방식으로 문제를 바꿨습니다.",
      ],
      metricCards: [
        {
          label: "Evaluation matrix",
          value: "134 × 29",
          note: "ALFWorld 과제 × Agent 구성",
        },
        {
          label: "Oracle headroom",
          value: "최대 +29%p",
          note: "과제별 최적 구성 vs. 하나의 고정 구성",
        },
        {
          label: "Verified execution",
          value: "K = 11",
          note: "Deployable capture ceiling 도달",
        },
      ],
      flow: {
        title: "승자 예측을 제한된 실행과 검증으로 바꾸기",
        intro: "어떤 구성이 좋아 보이는지 예측하는 대신, 실제 후보가 검증 가능한 성공을 만들었는지 묻습니다.",
        steps: [
          {
            label: "Task와 후보 구성",
            description: "과제를 고정하고 reasoning, memory, retry와 verification 방식이 다른 실행 가능한 구성을 나열합니다.",
          },
          {
            label: "고정된 실행 순서",
            description: "불안정한 ranking signal에 selector를 다시 학습하지 않고 제한된 예산 안에서 후보를 실행합니다.",
          },
          {
            label: "Outcome verifier",
            description: "각 시도 뒤 환경 결과를 검사해 그럴듯한 trace와 실제 성공을 구분합니다.",
          },
          {
            label: "Early stop",
            description: "첫 verified success와 실행 기록을 반환하고, 없으면 소진된 예산을 그대로 남깁니다.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/vargo/vargo-identification-wall.png",
          alt: "Task-side feature, 2026 routing method, deployment bandit와 activation probe가 실행 전에 과제별 최적 Agent 구성을 식별하지 못한 결과를 보여주는 그래프",
          caption: "비교한 모든 pre-execution signal이 과제별 승자를 안정적으로 식별하지 못했습니다",
        },
        {
          src: "/img/projects/vargo/vargo-verified-execution.png",
          alt: "검증하며 실행하는 Agent 구성 수를 3개에서 13개까지 늘릴 때 회수한 oracle gap 비율을 보여주는 곡선",
          caption: "Corrected ALFWorld matrix · anchor 실패 subset n=42 · 90% task-bootstrap interval",
        },
      ],
      resultTables: [
        {
          title: "서로 다른 두 의사결정 문제",
          columns: ["접근", "사용 가능한 신호", "관찰된 결과"],
          rows: [
            ["Pre-execution routing", "Task text, embedding, hidden state, bandit feedback", "과제별 승자를 식별하지 못함"],
            ["Verified execution", "제한된 예산 안의 실제 후보 실행 결과", "K=11에서 deployable ceiling 도달"],
          ],
        },
      ],
      contribution: [
        "134개 과제 × 29개 구성의 평가 matrix를 만들고, 사후에 알 수 있는 oracle headroom과 실제 selector가 식별할 수 있는 성능을 분리했습니다.",
        "Routing baseline, activation probe, contamination control과 verified-execution capture 평가를 구현했습니다.",
      ],
      category: "Agent Evaluation",
      builtWith: ["Python", "ALFWorld", "Agent routing", "Verifier cascade", "Reproducible evaluation"],
    },
    eat: {
      claim: "의료 이미지 calibration 연구 · best ECE 0.94% · macro-F1 86.37%",
      lead: [
        "분류 정확도가 높아도 모델이 자신의 정답 확률을 잘못 판단할 수 있습니다. EAT는 4개 피부 병변을 분류하는 ISIC 데이터에서 정확도와 confidence의 일치 정도를 학습 전 과정에서 따로 측정한 연구입니다.",
        "Sample difficulty를 기준으로 focal weighting, 제한된 parameter perturbation과 두 stochastic forward의 일관성을 함께 조절했습니다. 어려운 샘플에 더 집중하면서 작은 perturbation에 따라 confidence가 크게 흔들리지 않도록 학습했습니다.",
      ],
      metricCards: [
        {
          label: "ISIC validation",
          value: "n = 5,268",
          note: "Fold 3 · seed 42 · 4 classes",
        },
        {
          label: "동일 연산량",
          value: "12.79% → 5.87%",
          note: "ECE: CE epoch 20 vs. Focal+R-Drop epoch 10",
        },
        {
          label: "Best observed",
          value: "0.94% ECE",
          note: "30 epoch 안에서 macro-F1 86.37%",
        },
      ],
      flow: {
        title: "분류 성능과 믿을 수 있는 confidence를 함께 학습하기",
        intro: "같은 sample-level difficulty 신호로 각 샘플의 loss, perturbation과 consistency 강도를 함께 조절했습니다.",
        steps: [
          {
            label: "Clean stochastic pass",
            description: "Target class 확률을 구하고 현재 confidence에서 sample difficulty를 계산합니다.",
          },
          {
            label: "Difficulty-aware objective",
            description: "어렵거나 confidence가 낮은 샘플이 분류 loss에 더 크게 반영되도록 focal weighting을 적용합니다.",
          },
          {
            label: "Elastic perturbation",
            description: "Sample difficulty에 따라 제한된 parameter perturbation을 만들고 두 번째 stochastic forward를 실행합니다.",
          },
          {
            label: "Consistency update",
            description: "분류 loss와 bidirectional R-Drop consistency를 한 번의 backward update로 결합합니다.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/eat/eat-equal-compute-reliability.svg",
          alt: "ISIC validation 이미지 5,268개에서 같은 추정 연산량을 사용한 cross-entropy epoch 20과 Focal plus R-Drop epoch 10의 reliability curve 및 confidence 분포 비교",
          caption: "동일한 누적 연산량 · CE e20 vs. Focal+R-Drop e10 · ISIC fold 3, n=5,268",
        },
        {
          src: "/img/projects/eat/eat-training-curves.svg",
          alt: "ISIC validation에서 cross-entropy, Focal plus R-Drop과 adaptive robust training의 30 epoch ECE 및 macro-F1 곡선",
          caption: "매 epoch마다 calibration과 classification 성능을 분리해 추적했습니다",
        },
      ],
      resultTables: [
        {
          title: "동일 연산량 비교",
          columns: ["Method", "Checkpoint", "추정 누적 FLOPs", "ECE", "Macro-F1"],
          rows: [
            ["Cross-entropy", "epoch 20", "5.52 × 10¹⁵", "12.79%", "84.32%"],
            ["Focal + R-Drop", "epoch 10", "5.52 × 10¹⁵", "5.87%", "83.19%"],
          ],
          caption: "Focal+R-Drop은 update마다 두 번 stochastic forward를 사용하므로 10 epoch가 CE 20 epoch와 같은 추정 연산량입니다.",
        },
      ],
      contribution: [
        "Difficulty와 focal, perturbation, consistency를 연결한 objective와 전체 학습·평가 pipeline을 구현했습니다.",
        "Calibration과 classification을 분리해 분석하고 저장된 class probability에서 reliability diagram을 다시 생성했습니다.",
      ],
      category: "Calibration & Uncertainty",
      builtWith: ["PyTorch", "ConvNeXt V2", "Focal loss", "R-Drop", "ISIC"],
    },
    "langgraph-travel-agent": {
      claim: "미국 여행사 납품 · 공급사 병렬 검색과 중단 후 재개가 가능한 여행 상담 Agent",
      lead: [
        "여행 상담은 한 번의 모델 호출로 끝나지 않습니다. 누락된 고객 정보, 공급사 응답 지연, 예산 제약, 패키지 비교, CRM 연동과 외부 전송이 긴 workflow 안에서 일관되게 이어져야 합니다.",
        "이 시스템은 상태를 LangGraph에 유지하고 고객 정보가 부족하면 멈춘 뒤 이어서 실행합니다. Amadeus와 Hotelbeds를 병렬 검색하고 Budget, Balanced, Premium 패키지로 정리한 다음 사람이 다음 action을 검토할 수 있게 했습니다.",
      ],
      metricCards: [
        { label: "공급사 검색", value: "병렬 실행", note: "Amadeus와 Hotelbeds를 asyncio.gather로 호출" },
        { label: "패키지 생성", value: "3단계", note: "Budget, Balanced, Premium" },
        { label: "납품", value: "미국 여행사", note: "계약 후 IP를 받아 Public OSS로 공개" },
      ],
      flow: {
        title: "상담 요청에서 검토 가능한 여행 패키지까지",
        intro: "각 node는 하나의 운영 책임만 맡고, graph state는 중간에 멈춰도 같은 요청을 다시 만들지 않고 이어갈 수 있게 합니다.",
        steps: [
          { label: "조건 수집", description: "여행자, 일정, 예산과 선호를 정리하고 필수 고객 정보가 부족하면 입력을 기다립니다." },
          { label: "병렬 검색", description: "항공과 호텔 공급사를 동시에 검색하고 FastAPI 비동기 task polling으로 결과를 전달합니다." },
          { label: "패키지 합성", description: "같은 typed schema에서 세 가지 패키지를 만들고 전체 여행 비용을 일관된 방식으로 계산합니다." },
          { label: "검토와 연동", description: "선택 맥락을 HubSpot에 연결하고 외부 action은 명시적 검토 경계 뒤에 둡니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/langgraph-travel-agent/travel-architecture.svg",
          alt: "FastAPI task polling, 고객 정보 handoff, Amadeus와 Hotelbeds 병렬 검색, 패키지 합성, HubSpot 연동과 검토 경계로 구성된 LangGraph 여행 상담 Agent 구조도",
          caption: "실제 코드 기반 구조 · 공개 구현은 InMemorySaver와 in-memory job store 사용",
        },
        {
          src: "/img/projects/langgraph-travel-agent/travel-package-example.svg",
          alt: "Budget, Balanced, Premium 여행 패키지와 항목별 전체 비용 계산을 비교한 합성 예시",
          caption: "Schema 기반 합성 예시 · 실제 공급사 가격이나 고객 데이터가 아닙니다",
        },
      ],
      contribution: [
        "LangGraph state와 conditional routing, 공급사 비동기 검색, 패키지 합성, API task lifecycle과 CRM handoff를 설계하고 구현했습니다.",
        "미국 여행사에 시스템을 납품했고 계약에 따라 IP를 받아 이후 Public OSS로 공개했습니다.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/langgraph-travel-agent", note: "Graph, API, supplier tool과 typed travel-package model" },
      ],
      category: "Agent Systems",
      builtWith: ["Python", "LangGraph", "FastAPI", "AsyncIO", "Amadeus / Hotelbeds"],
    },
    myshot: {
      claim: "스마트폰 골프 스윙 3D 복원 · 독립 모션캡처 6개에서 X-Factor 평균 |r| 0.95",
      lead: [
        "MyShot은 스마트폰으로 촬영한 골프 영상을 시간축이 맞는 3D skeleton으로 바꾸고, 스윙 중 몸통과 골반의 회전을 측정합니다. 한 프레임에 pose를 그리는 것보다 단안 영상에서 추정한 깊이가 전체 스윙의 동작 패턴을 유지하게 만드는 것이 핵심 문제였습니다.",
        "먼저 2D pose detector로 관절을 추적하고, 243-frame MotionAGFormer가 sequence를 3D로 변환합니다. 학습 데이터와 평가 clip, motion-capture trial을 분리해 source video 밖에서도 시간적 biomechanics가 유지되는지 확인했습니다.",
      ],
      metricCards: [
        { label: "독립 mocap", value: "6 trials", note: "학습에 사용하지 않은 CMU 골프 스윙" },
        { label: "X-Factor 패턴", value: "평균 |r| 0.95", note: "예측값과 motion-capture 몸통 회전 비교" },
        { label: "Clean-2D 실험", value: "35.6 mm", note: "동기화 validation의 평균 3D 관절 오차" },
      ],
      flow: {
        title: "단안 영상에서 biomechanics time series까지",
        intro: "2D detection 오차와 3D lifting 오차를 분리하고, 관절 위치와 실제 골프 분석에 쓰는 동작 패턴을 함께 평가했습니다.",
        steps: [
          { label: "영상과 2D 관절", description: "프레임을 따로 처리하지 않고 전체 스윙의 17개 관절을 검출하고 정규화합니다." },
          { label: "Temporal 3D lifting", description: "243-frame MotionAGFormer window로 깊이를 추정하고 동작의 연속성을 유지합니다." },
          { label: "Biomechanics", description: "복원된 skeleton에서 몸통, 골반, X-Factor와 무릎 움직임을 계산합니다." },
          { label: "Cross-domain 평가", description: "독립 CMU motion capture의 시간 곡선과 비교하고 domain shift를 별도로 확인합니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/myshot/myshot-golfdb-2d-to-3d.png",
          alt: "익명화한 골프 스윙의 address, top, impact, finish에서 원본 frame, 2D 관절과 3D skeleton 복원 결과를 비교한 예시",
          caption: "익명화한 연구 데이터 예시 · 현재 모델 · address, top, impact, finish",
        },
        {
          src: "/img/projects/myshot/myshot-method.svg",
          alt: "단안 골프 영상에서 2D pose detection, 243-frame MotionAGFormer 3D lifting, biomechanics curve와 cross-domain validation으로 이어지는 구조도",
          caption: "Detection, temporal lifting, biomechanics와 cross-domain validation을 분리해 평가했습니다",
        },
        {
          src: "/img/projects/myshot/myshot-cmu-xfactor.png",
          alt: "독립 CMU 골프 motion-capture 6개에서 예측 X-Factor와 정답 곡선을 비교한 그래프",
          caption: "독립 CMU motion capture · 6 trials · 평균 절대상관 0.95",
        },
      ],
      contribution: [
        "2D-to-3D 학습·추론 경로, phase-aligned biomechanics, disjoint split, leakage audit와 cross-domain 평가를 구현했습니다.",
        "Clean-2D lifting 성능과 실제 영상의 detection error를 분리해 deployment에서의 한계를 함께 확인했습니다.",
      ],
      category: "Computer Vision",
      builtWith: ["PyTorch", "MotionAGFormer", "2D pose", "Monocular 3D pose", "Motion capture"],
    },
    "google-surf-mcp": {
      claim: "AI Agent 검색·문서 추출 인프라 · MCP 도구 6개 · 테스트 388개",
      lead: [
        "Agent 검색은 검색창 밖에서 더 자주 실패합니다. Provider가 차단되고, redirect가 내부 주소를 숨기며, 웹 markup이 바뀌고, PDF의 읽기 순서가 무너지거나 CAPTCHA가 자동화를 중단시킵니다. google-surf-mcp는 이런 실패를 복구 가능한 하나의 tool boundary로 묶었습니다.",
        "Google·학술 검색, 웹·PDF 추출, 병렬 실행, provider fallback, CAPTCHA handoff, cache, parser self-healing과 SSRF 방어를 결합했습니다. Agent는 각 workflow마다 브라우저 복구 로직을 다시 만들지 않고 구조화된 결과를 받을 수 있습니다.",
      ],
      metricCards: [
        { label: "MCP interface", value: "6 tools", note: "검색, 병렬 검색, 웹, PDF와 학술 검색" },
        { label: "검증", value: "388 / 388", note: "44개 test file 전체 Vitest 통과" },
        { label: "Runtime 경계", value: "복구 가능", note: "Fallback, cache, CAPTCHA handoff와 self-healing parser" },
      ],
      flow: {
        title: "불안정한 검색과 문서 소스를 하나의 Agent interface로",
        intro: "Provider 선택, 추출, 복구와 보안을 분리해 실패가 발생한 layer에서 처리하도록 설계했습니다.",
        steps: [
          { label: "Agent request", description: "검색과 추출을 일관된 response schema의 typed MCP tool로 제공합니다." },
          { label: "Provider routing", description: "Browser 또는 API 검색을 선택하고 병렬 query 중 실패한 query만 개별 fallback합니다." },
          { label: "Document extraction", description: "웹 본문과 공간 순서를 보존한 PDF text를 같은 interface에서 추출합니다." },
          { label: "Recovery와 safety", description: "CAPTCHA, cache, rate limit, parser drift, redirect와 SSRF를 처리한 뒤 구조화된 결과를 반환합니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/google-surf-mcp/google-surf-architecture.svg",
          alt: "6개 MCP tool이 검색 provider, 웹과 PDF 추출, cache, CAPTCHA handoff, parser healing과 SSRF 방어로 연결되는 구조도",
          caption: "6개 tool이 provider, extraction, recovery와 safety layer를 공유합니다",
        },
        {
          src: "/img/projects/google-surf-mcp/google-surf-validation.svg",
          alt: "Search와 provider, extraction과 SSRF, recovery와 healing, runtime state 영역에서 388개 테스트가 통과한 결과",
          caption: "전체 Vitest · 44개 file, 388개 test",
        },
      ],
      contribution: [
        "MCP API와 provider routing, 병렬 검색, 웹·PDF 추출, cache, recovery와 security boundary를 설계하고 구현했습니다.",
        "실제 markup drift, redirect, CAPTCHA, parser와 cloud runtime 실패 조건을 regression test로 만들고 package를 공개했습니다.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/google-surf-mcp", note: "배포된 MCP server, test와 runtime 문서" },
      ],
      category: "Production ML Infrastructure",
      builtWith: ["TypeScript", "MCP", "Playwright", "PDF extraction", "Vitest"],
    },
    monogram: {
      claim: "Local-first 지식 pipeline · 검증된 수집, 원자적 Git 저장과 hybrid retrieval",
      lead: [
        "개인 지식 시스템은 보통 수집, 구조화, 검색과 backup이 서로 다른 도구로 나뉩니다. Monogram은 메시지나 문서를 받고, 무엇을 저장할지 검증하고, 관련 파일을 한 번에 commit한 뒤 같은 local knowledge base에서 다시 찾는 과정을 하나로 연결합니다.",
        "Semantic retrieval은 EmbeddingGemma-300M ONNX backend와 Git-backed sharded INT8 index를 사용합니다. Dense similarity와 BM25를 RRF로 결합하고 필요하면 graph expansion과 reranking을 적용하며, FAISS나 외부 vector database에 의존하지 않습니다.",
      ],
      metricCards: [
        { label: "Capture pipeline", value: "5 stages", note: "Orchestrator, classifier, extractor, verifier, writer" },
        { label: "Storage 경계", value: "1 Git commit", note: "연관 note와 asset을 원자적으로 저장" },
        { label: "Semantic index", value: "256-d INT8", note: "Domain×월 단위 JSONL shard" },
      ],
      flow: {
        title: "정리되지 않은 입력에서 검색 가능한 versioned note까지",
        intro: "내용을 이해하는 단계와 실제 쓰기를 분리하고, Git을 storage transaction과 recovery 경계로 함께 사용합니다.",
        steps: [
          { label: "Capture", description: "Telegram, MCP, Obsidian과 document 입력을 같은 ingestion boundary에서 받습니다." },
          { label: "구조화와 검증", description: "입력을 분류하고 field를 추출한 뒤 저장할 note를 검증합니다." },
          { label: "원자적 저장", description: "관련 파일을 하나의 Git Tree commit으로 저장해 knowledge item이 부분적으로 쓰이지 않게 합니다." },
          { label: "Hybrid retrieval", description: "Sharded semantic search와 BM25를 RRF로 결합하고 graph expansion, MMR과 reranking을 선택적으로 적용합니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/monogram/monogram-architecture.svg",
          alt: "Telegram, MCP와 document 입력이 5단계 검증 pipeline을 거쳐 원자적 Git Tree commit과 검색 output으로 이어지는 Monogram 구조도",
          caption: "Capture와 검증에서 원자적 저장과 retrieval까지 하나의 경로",
        },
        {
          src: "/img/projects/monogram/monogram-hybrid-retrieval.svg",
          alt: "EmbeddingGemma ONNX embedding, sharded INT8 JSONL index, NumPy similarity scan, BM25, RRF와 선택적 reranking으로 구성된 hybrid retrieval 구조",
          caption: "Custom sharded vector index + BM25/RRF · FAISS dependency 없음",
        },
        {
          src: "/img/monogram-dashboard.png",
          alt: "합성 예시 데이터로 렌더링한 Monogram dashboard",
          caption: "암호화 dashboard · 합성 예시 데이터",
        },
      ],
      contribution: [
        "5단계 capture pipeline, 원자적 Git Tree writer, sharded semantic index, hybrid retrieval 경로, MCP surface와 recovery control을 설계하고 구현했습니다.",
        "자동 수집과 검색 경로에 SSRF 방어, secret redaction, cassette evaluation, backup과 kill switch를 추가했습니다.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/monogram", note: "Capture pipeline, Git storage, retrieval, MCP server와 dashboard" },
      ],
      category: "RAG & Retrieval",
      builtWith: ["Python", "EmbeddingGemma", "ONNX Runtime", "BM25 / RRF", "Git Tree API"],
    },
    "bau-browser": {
      claim: "행동 범위를 제한한 Agent browser · exact 17/36 → 36/36, 금지 행동 6 → 0",
      lead: [
        "Browser Agent는 신뢰할 수 없는 페이지를 읽은 뒤 사용자의 권한으로 행동할 수 있기 때문에 자연스러운 plan만으로는 부족합니다. Bau Browser는 target, verb, origin, argument, 승인, 실행과 receipt를 서로 다른 host-owned boundary에 두고 action 전후를 사용자가 확인할 수 있게 했습니다.",
        "Local model은 실행 argument를 직접 쓰지 않고 compact bound draft에서 identifier만 선택합니다. Trusted binding과 TaskSpec으로 host가 action을 compile하고 propose–approve–execute 흐름을 거친 뒤 postcondition과 decision log를 기록합니다.",
      ],
      metricCards: [
        { label: "Synthetic exact", value: "17/36 → 36/36", note: "Base 대비 bound-draft adapter" },
        { label: "금지 행동", value: "6 → 0", note: "Origin-disjoint 36-case preflight" },
        { label: "Safety gate", value: "12/12", note: "Recovery와 verification case 통과" },
      ],
      flow: {
        title: "모델은 identifier를 제안하고 실행 권한은 host가 보유합니다",
        intro: "Page 이해, action compilation, 사용자 승인, 실행과 audit record를 각각 독립된 contract로 구성했습니다.",
        steps: [
          { label: "Observe", description: "Action 권한을 주기 전에 active origin에서 PageGraph와 TaskSpec을 구성합니다." },
          { label: "Bound draft", description: "Local model은 raw 실행값 대신 trusted target, verb, effect와 binding identifier를 선택합니다." },
          { label: "Compile과 승인", description: "Host-owned binding에서 argument를 복원하고 scope를 검증한 뒤 사용자에게 action을 보여줍니다." },
          { label: "실행과 receipt", description: "승인된 action만 실행하고 postcondition을 확인한 뒤 receipt와 DecisionLog를 남깁니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/bau-browser/bau-execution-architecture.svg",
          alt: "Desktop browser와 scoped PageGraph에서 bound draft, host compiler, propose approve execute, browser 또는 MCP action, receipt, postcondition과 decision log로 이어지는 Bau Browser 구조도",
          caption: "실행값과 권한은 모델 출력이 아니라 trusted host에 남습니다",
        },
        {
          src: "/img/projects/bau-browser/bau-bound-draft-preflight.svg",
          alt: "합성 36개 case에서 base exact 17/36과 금지 행동 6건이 adapter exact 36/36과 금지 행동 0건으로 바뀐 비교 결과",
          caption: "Origin-disjoint synthetic preflight · live 또는 공식 browser benchmark가 아닙니다",
        },
        {
          src: "/img/bau-browser-synthetic.png",
          alt: "합성 상품 비교 fixture를 사용한 Bau Browser native desktop 화면",
          caption: "Native desktop capture · synthetic fixture",
        },
      ],
      contribution: [
        "Electron browser surface, scoped agent contract, host compiler, two-phase HITL, MCP boundary, receipt, postcondition과 SQLite decision log를 구현했습니다.",
        "Compact Qwen3.5-4B bound-draft pilot을 설계·학습하고 frozen 36-case synthetic gate에서 exactness, compilation, binding, safety와 금지 행동을 평가했습니다.",
      ],
      category: "Agent Safety",
      builtWith: ["TypeScript", "Electron", "MCP", "Qwen3.5-4B", "SQLite"],
    },
  },
};

export function getProjectDetail(slug: string | undefined, lang: ProjectLanguage) {
  return slug ? details[lang][slug] : undefined;
}
