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
  kind?: "image" | "video";
  poster?: string;
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
    "probabilistic-bid-mlops": {
      claim: "Client-level bid probability and uncertainty · q1000 forecasts · Monte Carlo decisions",
      lead: [
        "A bid recommendation was not useful if a client could not see how likely it was to win or how much uncertainty surrounded it. Regional competition and client conditions changed the meaning of the same point estimate, while a small analyst team could not review more than 1,000 clients consistently. The project therefore needed to produce bid probability, downside risk, and a recommendation together rather than return one number.",
      ],
      metricCards: [
        { label: "Distribution interface", value: "q1000", note: "Quantiles from 0.001 through 0.999" },
        { label: "Internal bid KPI", value: "+30%", note: "Compared with the prior single-quantile model" },
        { label: "Inference", value: "136 s → 25 s", note: "Vectorized simulation and evaluation" },
      ],
      flow: {
        title: "From heterogeneous price histories to a deployable decision",
        intro: "The interface keeps model families interchangeable while the deployment gate keeps an evaluated candidate from becoming a write without evidence.",
        steps: [
          { label: "Common coordinate", description: "Map heterogeneous price histories and a 63-feature schema into one affine target coordinate." },
          { label: "Distribution models", description: "Generate q1000 candidates with XGBoost and CatBoost quantile models plus routed TabICLv2 predictors." },
          { label: "Regional simulation", description: "Estimate candidate validity and lowest-price probability under region-specific Monte Carlo contracts." },
          { label: "Policy evaluation", description: "Combine time-split evaluation, historical rank signals, and operating constraints." },
          { label: "Evidence-gated deployment", description: "Verify manifests, calibration semantics, artifact size, SHA256, and dry-run output before an approved write." },
        ],
      },
      figures: [
        {
          src: "/img/projects/probabilistic-bid-mlops/decision-pipeline.png",
          alt: "Architecture diagram showing common feature coordinates, quantile models, a q1000 distribution interface, regional Monte Carlo simulation, policy evaluation, and evidence-gated deployment",
          caption: "One path from 1,000-quantile forecasts to verified candidate deployment",
        },
        {
          src: "/img/projects/probabilistic-bid-mlops/uq-model-map.png",
          alt: "Model map separating active quantile and TabICLv2 candidates from evaluated uncertainty-model families and their distribution, decision, and operational evaluation roles",
          caption: "Active candidates and research implementations are evaluated through distinct quality layers",
        },
      ],
      resultTables: [
        {
          title: "Operational contract",
          columns: ["Layer", "Implementation", "Decision output"],
          rows: [
            ["Forecast", "XGBoost / CatBoost quantiles, TabICLv2 routing", "1,000-quantile distribution"],
            ["Simulation", "Region-specific Monte Carlo", "Validity and lowest-price probability"],
            ["Evaluation", "Time split, CRPS, pinball, operational KPI", "Candidate policy"],
            ["Deployment", "Manifest + SHA256 + dry run + approval", "Verified artifact only"],
          ],
        },
      ],
      contribution: [
        "Unified the model zoo behind a q1000 contract and connected about 80,000 candidate bids per notice to region-specific decision simulation.",
        "Built the training, evaluation, routed inference, reporting, artifact provenance, dry-run, and approval-gated deployment path that serves more than 1,000 clients.",
      ],
      category: "Tabular ML · UQ · Decision Systems",
      builtWith: ["Python", "XGBoost", "CatBoost", "TabICLv2", "Quantile regression", "Monte Carlo simulation", "SHA256 manifests"],
    },
    "document-ai-ocr": {
      claim: "Document AI for HWP and PDF notices · key-field F1 0.985 · about 2,000 notices/day",
      lead: [
        "Key inputs for model training and joint-bid matching, such as discipline shares and construction-capacity criteria, existed only inside attached HWP and PDF notices rather than in the listing API. Manually opening about 2,000 new notices each day could not support real-time feature creation or client matching. The required system had to structure those documents automatically while keeping every amount and ratio reproducible.",
      ],
      metricCards: [
        { label: "Key-field extraction", value: "F1 0.985", note: "HWP/HWPX and PDF procurement notices" },
        { label: "Daily throughput", value: "About 2,000", note: "New notices processed automatically" },
        { label: "Numeric boundary", value: "Deterministic", note: "Amounts, ratios, and units validated in code" },
      ],
      flow: {
        title: "Separate document recovery, field copying, and arithmetic",
        intro: "Each stage has one responsibility, making extraction errors observable and numeric outputs reproducible.",
        steps: [
          { label: "Direct download", description: "Fetch the source URL without browser automation and retain the original bytes." },
          { label: "Format routing", description: "Use magic bytes to distinguish HWP, HWPX, PDF, and ZIP rather than trusting the filename." },
          { label: "Text recovery", description: "Apply rhwp, hwp5, or liteparse through format-specific paths with bounded retries." },
          { label: "Source-field copy", description: "Ask Gemini 2.5 Flash-Lite to copy fields from the recovered text without calculation." },
          { label: "Deterministic calculation", description: "Parse amounts, ratios, and units in code, then append structured output and error logs." },
        ],
      },
      figures: [
        {
          src: "/img/projects/document-ai-ocr/ocr-pipeline.png",
          alt: "Document AI pipeline from direct download and magic-byte format routing through HWP and PDF parsers, source-field copying, deterministic numeric parsing, and recoverable batch controls",
          caption: "Browserless format routing with a strict boundary between language extraction and numeric calculation",
        },
        {
          src: "/img/projects/document-ai-ocr/ocr-results.png",
          alt: "Document extraction result cards showing 199 of 199 documents extracted, 2.14 million tokens processed, about 90 percent license-ratio agreement, and documented batch cost of about 82 cents",
          caption: "Anonymized measured batch · HWP/HWPX, PDF, and ZIP documents",
        },
      ],
      resultTables: [
        {
          title: "Measured extraction batch",
          columns: ["Measure", "Result", "Why it matters"],
          rows: [
            ["Documents", "199 / 199", "No failed extraction in the measured batch"],
            ["Content", "2,140,021 tokens", "Large documents preserved instead of reduced to snippets"],
            ["License-ratio GT", "About 90%", "Deterministic ratio handling after source-field extraction"],
            ["Documented cost", "About $0.82", "Batch-scale use of a lightweight model"],
          ],
        },
      ],
      contribution: [
        "Designed the direct-download, magic-byte routing, parser fallback, and deterministic numeric-processing boundary.",
        "Built concurrent batching with stage-specific timeouts, retries, incremental CSV output, and structured error attribution.",
      ],
      category: "Document AI · Information Extraction",
      builtWith: ["Python", "HWP/HWPX", "PDF", "Gemini 2.5 Flash-Lite", "ThreadPool", "Deterministic parsing"],
    },
    "procurement-nlp": {
      claim: "Procurement-title NLP API · Macro-F1 0.9639 · category F1 0.90 · about 50 ms CPU",
      lead: [
        "Incoming notices had to be routed immediately by bid eligibility and work category using only the title. Detailed labels were scarce, and the production environment had no inference GPU. The project therefore needed to build a domain taxonomy without exhaustive annotation and serve both decisions quickly on CPU.",
      ],
      metricCards: [
        { label: "Bid eligibility", value: "Macro-F1 0.9639", note: "Accuracy 96.4%" },
        { label: "Detailed categories", value: "F1 0.90", note: "Weakly supervised multiclass model" },
        { label: "CPU deployment", value: "~50 ms", note: "Static INT8 ONNX · about 330 MB" },
      ],
      flow: {
        title: "From scarce labels to a CPU-served label system",
        intro: "The teacher does more than classify: its domain representation becomes the basis for ontology discovery and work-category supervision.",
        steps: [
          { label: "Bidability teacher", description: "Fine-tune KLUE RoBERTa-large with LoRA, focal loss, R-Drop, and FGM." },
          { label: "Ontology discovery", description: "Project 1024-dimensional CLS representations through UMAP and HDBSCAN, then refine clusters with human review." },
          { label: "Weak labels", description: "Combine hard-rule overrides with SBERT 0.9 and domain-RoBERTa 0.1 Max-Sim confidence." },
          { label: "Multiclass student", description: "Train a class-weighted LoRA model over the dynamically constructed label set." },
          { label: "INT8 batch serving", description: "Merge adapters, apply static ONNX quantization, and execute two models concurrently in FastAPI." },
        ],
      },
      figures: [
        {
          src: "/img/projects/procurement-nlp/nlp-pipeline.png",
          alt: "Weakly supervised procurement NLP pipeline from a RoBERTa LoRA bidability teacher through ontology discovery, Max-Sim weak labels, a multiclass student, and INT8 ONNX CPU serving",
          caption: "Domain representation, ontology construction, weak supervision, and deployment in one pipeline",
        },
        {
          src: "/img/projects/procurement-nlp/nlp-benchmark.png",
          alt: "Bar chart comparing Macro-F1 and accuracy on a 500-record bidability evaluation, with the fine-tuned RoBERTa classifier reaching 0.9639 Macro-F1 and 96.4 percent accuracy",
          caption: "500-record bidability evaluation · Macro-F1 and accuracy",
        },
      ],
      resultTables: [
        {
          title: "Bidability evaluation",
          columns: ["Approach", "Macro-F1", "Accuracy"],
          rows: [
            ["LLM few-shot", "0.351", "54.0%"],
            ["Fine-tuned RoBERTa + LoRA", "0.9639", "96.4%"],
            ["RAFT", "0.350", "53.8%"],
            ["Three-agent path", "0.9639", "96.4%"],
          ],
          caption: "All rows use the same 500-record binary evaluation set.",
        },
      ],
      contribution: [
        "Designed the representation-to-ontology and Max-Sim weak-label path for work-category supervision.",
        "Trained the binary and multiclass LoRA classifiers, exported static INT8 ONNX artifacts, and connected parallel inference to a FastAPI batch endpoint.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/nlp-analysis-agent", note: "Preprocessing, training, ontology discovery, weak labeling, quantization, and serving" },
      ],
      category: "Korean NLP · Weak Supervision · CPU Serving",
      builtWith: ["RoBERTa-large", "LoRA", "SBERT", "UMAP", "HDBSCAN", "ONNX Runtime INT8", "FastAPI"],
    },
    "r2ccp-bid-prediction": {
      claim: "Multimodal R2CCP forecasting · 8 context models · 500K Monte Carlo decisions",
      lead: [
        "PQ bids are evaluated by both technical and price scores. As the technical score falls, viable price bands split around invalid regions, so actual bid behavior becomes multimodal rather than forming one central peak. A useful decision system had to preserve those separated regions and estimate the win probability of each candidate rate instead of returning one point or one merged interval.",
      ],
      metricCards: [
        { label: "Modeling dataset", value: "69,934 records", note: "Chronological train and validation split" },
        { label: "Validation", value: "13,984 samples", note: "90.73% weighted conformal coverage" },
        { label: "Operational result", value: "+35% KPI", note: "Group-company PQ bid performance" },
      ],
      flow: {
        title: "Preserve the distribution, then simulate the decision",
        intro: "Context-specific calibration keeps distinct modes separate before simulation evaluates candidate actions.",
        steps: [
          { label: "Context routing", description: "Combine ranking position Q1/Q2 with four bid-rate-difference quartiles." },
          { label: "R2CCP distribution", description: "Train eight entropy-regularized context models on a chronological split." },
          { label: "Per-bin conformal set", description: "Retain only bins above the calibrated threshold and preserve disjoint intervals." },
          { label: "Monte Carlo decision", description: "Sample competing outcomes 500,000 times and estimate the win probability of each candidate rate." },
        ],
      },
      figures: [
        {
          src: "/img/projects/r2ccp-bid-prediction/r2ccp-method.png",
          alt: "Synthetic bimodal distribution comparing a collapsed cumulative interval with per-bin conformal regions that preserve the low-density gap between modes",
          caption: "Synthetic illustration of the interval-collapse fix",
        },
        {
          src: "/img/projects/r2ccp-bid-prediction/r2ccp-coverage.png",
          alt: "Coverage chart for eight Q by BRD context models over 13,984 chronological validation samples with 90.73 percent weighted coverage",
          caption: "Chronological validation · 13,984 samples · weighted coverage 90.73%",
        },
      ],
      resultTables: [
        {
          title: "Eight-context chronological validation",
          columns: ["Context", "Coverage", "Average interval length"],
          rows: [
            ["Q1-BRD1", "91.39%", "0.0149"], ["Q1-BRD2", "92.23%", "0.0194"],
            ["Q1-BRD3", "88.07%", "0.0166"], ["Q1-BRD4", "91.21%", "0.0169"],
            ["Q2-BRD1", "86.14%", "0.0220"], ["Q2-BRD2", "81.41%", "0.0208"],
            ["Q2-BRD3", "93.92%", "0.0285"], ["Q2-BRD4", "94.77%", "0.0534"],
          ],
          caption: "Weighted coverage: 12,688 / 13,984 = 90.73%.",
        },
      ],
      contribution: [
        "Diagnosed multimodal interval collapse and rebuilt inference with per-bin conformal thresholds and entropy regularization.",
        "Designed the eight-context chronological evaluation and connected distribution forecasts to 500,000-iteration candidate simulation used in bid decisions.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/ensemble-bid-prediction", note: "R2CCP modeling, calibration, context routing, and simulation" },
      ],
      category: "Conformal Prediction · Multimodal Forecasting",
      builtWith: ["Python", "R2CCP", "Conformal prediction", "Entropy regularization", "Monte Carlo simulation"],
    },
    wsss: {
      claim: "Contract WSSS research · 53.31% COCO-Val mIoU · +1.5 pp over WeCLIP+",
      lead: [
        "A client commissioned a study to improve WeCLIP+, then the state of the art, using only image-level labels. The pseudo-masks used for training accumulated wrong pixels at object boundaries and in the background, and those errors were amplified during self-training. The research question was whether only the unreliable pixels could be identified and repaired instead of rebuilding every mask.",
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
        {
          src: "/img/wsss-architecture.png",
          alt: "Weakly supervised segmentation architecture using frozen CLIP and DINOv2 representations, selective pseudo-mask repair, and self-training",
          caption: "Frozen visual representations, reliability mapping, selective pixel repair, and retraining",
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
      category: "Weak Supervision · Semantic Segmentation",
      builtWith: ["PyTorch", "CLIP", "DINOv2", "Semantic segmentation", "COCO-Val 2014"],
    },
    "emh-agent": {
      claim: "Cost-aware 3-year validation · TQC +183.9% vs. IVV +99.6%",
      lead: [
        "Could a model make investment decisions more consistently than emotion-driven human judgment? To test that question fairly, the agent had to use only information available on each date and be evaluated after realistic trading, slippage, and financing costs. The goal was a reproducible decision process, not a backtest that benefited from future information.",
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
      category: "Reinforcement Learning · Portfolio Decision",
      builtWith: ["Python", "TQC", "Point-in-time data", "Gymnasium", "Stable-Baselines3"],
    },
    vargo: {
      claim: "Agent routing hits an identification wall · verified execution reaches the deployable ceiling",
      lead: [
        "The best combination of agent scaffold, memory, retry, and verifier changed from task to task. Could task text, embeddings, or hidden states identify that best configuration before any candidate was run? If not, the practical question became how much of the performance gap could be recovered by executing and verifying a limited number of candidates.",
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
          value: "54% → 85%",
          note: "Recovered oracle gap; 100% in the K=11 deployable pool",
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
        "Implemented routing baselines, activation probes, contamination controls, and verified-execution capture evaluation; the resulting paper is under review at TMLR.",
      ],
      category: "Agent Evaluation · Decision Science",
      builtWith: ["Python", "ALFWorld", "Agent routing", "Verifier cascade", "Reproducible evaluation"],
    },
    eat: {
      claim: "E-AT for calibrated medical-image classification · macro-F1 0.8647 · ECE 1.03% vs. CR-SAM 1.7%",
      lead: [
        "In medical image classification, a correct label is not enough if the confidence cannot be trusted. Two models with similar accuracy can create very different risk when one remains overconfident on its mistakes. The research therefore asked whether classification quality and confidence calibration could be improved within the same training objective.",
      ],
      metricCards: [
        {
          label: "ISIC",
          value: "4 classes",
          note: "Balanced · ConvNeXtV2-Tiny · 384 px",
        },
        {
          label: "Macro-F1",
          value: "0.8647",
          note: "Best classification result",
        },
        {
          label: "Minimum ECE",
          value: "1.03%",
          note: "CR-SAM (AAAI 2024): 1.7%",
        },
      ],
      flow: {
        title: "One objective for classification and calibrated confidence",
        intro: "E-AT couples sample difficulty, perturbation, and prediction consistency instead of calibrating only after training.",
        steps: [
          {
            label: "Image and class label",
            description: "Run a clean stochastic forward pass and measure target-class confidence on each ISIC image.",
          },
          {
            label: "Focal difficulty",
            description: "Give difficult samples more weight through focal loss rather than treating every example equally.",
          },
          {
            label: "Adaptive FGM",
            description: "Scale a bounded perturbation with sample difficulty and evaluate a second stochastic prediction.",
          },
          {
            label: "R-Drop update",
            description: "Optimize classification and bidirectional prediction consistency together in one update.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/eat/eat-isic-results.svg",
          alt: "E-AT result summary on balanced four-class ISIC: macro-F1 0.8647 and minimum expected calibration error 1.03 percent at separate checkpoints",
          caption: "Balanced four-class ISIC · ConvNeXtV2-Tiny 384 px",
        },
        {
          src: "/img/projects/eat/eat-method.svg",
          alt: "E-AT training diagram linking focal sample difficulty, adaptive FGM perturbation, and bidirectional R-Drop consistency",
          caption: "Focal loss, adaptive FGM, and bidirectional R-Drop are optimized together",
        },
      ],
      resultTables: [
        {
          title: "ISIC result",
          columns: ["Metric", "E-AT result", "Selection"],
          rows: [
            ["Macro-F1 ↑", "0.8647", "Classification checkpoint"],
            ["ECE ↓", "1.03%", "Calibration checkpoint"],
            ["CR-SAM ECE ↓", "1.7%", "AAAI 2024 reference"],
          ],
          caption: "Macro-F1 and ECE report their respective best checkpoints.",
        },
      ],
      contribution: [
        "Designed the E-AT objective that couples focal difficulty, adaptive FGM, and bidirectional R-Drop.",
        "Built the balanced ISIC training and evaluation pipeline and tracked macro-F1 and ECE separately.",
      ],
      category: "Calibration · Medical Vision",
      builtWith: ["PyTorch", "ConvNeXtV2-Tiny", "Focal loss", "R-Drop", "FGM", "ISIC 2019"],
    },
    "langgraph-travel-agent": {
      claim: "Travel advisor delivered to a U.S. agency · concurrent supplier search with resumable human review",
      lead: [
        "A U.S. travel agency asked for an agent that could turn a natural-language request into flight, hotel, attraction, and restaurant options that respected each customer's budget and schedule. In the manual workflow, missing information, supplier searches, package comparison, CRM updates, and follow-up communication were repeated across separate tools. The system needed to preserve context from the first request through human review and customer contact.",
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
      category: "Agent Workflow · API Orchestration",
      builtWith: ["Python", "LangGraph", "FastAPI", "AsyncIO", "Amadeus / Hotelbeds"],
    },
    myshot: {
      claim: "Smartphone video to 3D swing and shot outcome · clubhead-speed median error 6.1%",
      lead: [
        "Golf coaching and equipment are expensive, and practicing alone makes it difficult to see both what is wrong with a swing and how that movement changes ball speed, direction, and carry. Most pose tools stop at drawing body motion. I wanted one smartphone video to connect swing correction with the outcome of the shot.",
      ],
      metricCards: [
        { label: "Clubhead speed", value: "6.1%", note: "Median error on GolfPose Vicon motion" },
        { label: "3D reconstruction", value: "35.6 mm", note: "MPJPE · X-Factor MAE 3.1°" },
        { label: "Carry ground truth", value: "25 pairs", note: "Built from 50 AIHub swing clips" },
      ],
      flow: {
        title: "From one phone video to posture, speed, direction, and carry",
        intro: "The system treats body motion, club motion, and the ball as one sequence, then separates measured signals from calibrated and physics-based estimates.",
        steps: [
          { label: "Golfer, club, and ball", description: "Track the three targets through address, top, impact, and finish instead of analyzing the golfer alone." },
          { label: "2D to 3D motion", description: "Lift RTMPose joints with a temporal MotionAGFormer model trained with GolfPose Vicon and pseudo-3D swing data." },
          { label: "Swing mechanics", description: "Compute joint movement, X-Factor, swing power, club path, and clubhead speed across the full motion." },
          { label: "Personal calibration", description: "Use physique and per-club carry or ball-speed records as calibration inputs rather than forcing one population model on every golfer." },
          { label: "Shot outcome and reliability", description: "Estimate ball speed, start direction, and carry with a physics-based ball-flight model, while pose disagreement and jitter flag unreliable frames." },
        ],
      },
      figures: [
        {
          src: "/img/projects/myshot/myshot-vision-tracking.mp4",
          poster: "/img/projects/myshot/myshot-vision-tracking.png",
          kind: "video",
          alt: "An anonymized swing video with golfer, club, and ball boxes, a pose skeleton, changing joint angles, and the tracked ball path",
          caption: "Frame-aligned AIHub research-data example · face anonymized · golfer, club, ball, pose, and angle tracking",
        },
        {
          src: "/img/projects/myshot/myshot-golfdb-2d-to-3d.png",
          alt: "An anonymized four-phase golf swing example showing the source frame, detected 2D joints, and reconstructed 3D skeleton at address, top, impact, and finish",
          caption: "Single-camera input · 2D joints · current-model 3D reconstruction",
        },
        {
          src: "/img/projects/myshot/myshot-cmu-xfactor.png",
          alt: "Six small-multiple plots comparing predicted and ground-truth normalized X-Factor curves on independent CMU golf motion-capture trials",
          caption: "Independent CMU motion capture · six trials · mean absolute correlation 0.95",
        },
      ],
      contribution: [
        "Built the path from target tracking and 2D-to-3D motion to joint metrics, clubhead speed, personal calibration, and a physics-based ball-flight model.",
        "Found that body-only 30 fps motion was too weak for direct carry regression, then redesigned the system around ball and club tracking plus per-club calibration.",
      ],
      category: "Object Detection · Human Pose · 3D Vision · Ball-flight Prediction",
      builtWith: ["YOLO11", "RTMPose", "MotionAGFormer", "Physics-based ball flight", "Reliability scoring"],
    },
    "google-surf-mcp": {
      claim: "Search, web, and academic PDF infrastructure for AI agents · MCP TOPLIST Top 1%",
      lead: [
        "An LLM agent needs more than search-result links; it must read current web pages and the body of academic PDFs before it can answer with useful evidence. Existing tools separated web search, academic search, and parsing, while weak PDF extraction and provider failures made the workflow slow and unreliable. I built one search interface that could retrieve, read, and recover from those failures for the agent.",
      ],
      metricCards: [
        { label: "MCP interface", value: "6 tools", note: "Search, parallel search, web, PDF, and academic retrieval" },
        { label: "Validation", value: "388 / 388", note: "Full Vitest suite across 44 test files" },
        { label: "MCP TOPLIST", value: "Top 1%", note: "Published npm package" },
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
      category: "MCP · Search Infrastructure",
      builtWith: ["TypeScript", "MCP", "Playwright", "PDF extraction", "Vitest"],
    },
    monogram: {
      claim: "One share action to capture, organize, and search personal knowledge",
      lead: [
        "Useful ideas from news, social media, arXiv, YouTube, and reports were becoming scattered across apps and bookmarks, then disappearing when I needed them again. I wanted one share action to capture any source, preserve why it mattered, organize it automatically, and make it searchable later. The goal was a personal knowledge system that both I and my agents could reuse.",
      ],
      metricCards: [
        { label: "Capture pipeline", value: "5 stages", note: "Orchestrator, classifier, extractor, verifier, writer" },
        { label: "Storage boundary", value: "1 Git commit", note: "Related notes and assets written atomically" },
        { label: "Agent access", value: "13 MCP tools", note: "The same knowledge can be reused as agent context" },
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
      category: "PKM · Knowledge Automation",
      builtWith: ["Python", "EmbeddingGemma", "ONNX Runtime", "BM25 / RRF", "Git Tree API"],
    },
    "bau-browser": {
      claim: "Agentic Browser · a local-first desktop where users control private data and agent authority",
      lead: [
        "Chrome felt heavier and less controllable than the browsing workflow I wanted, and adding an agent raised a second problem: users could not easily see where browsing data went or which actions the agent was allowed to take. I wanted a desktop browser that kept personal data local and made agent permissions, approvals, and execution records visible to the user.",
      ],
      metricCards: [
        { label: "Action binding", value: "36/36", note: "Correct action and arguments on new-domain tasks" },
        { label: "Out-of-scope actions", value: "0", note: "User-defined origin and action scope enforced" },
        { label: "Safety gate", value: "12/12", note: "Recovery and verification cases passed" },
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
          src: "/img/bau-browser-synthetic.png",
          alt: "Native Bau Browser desktop capture using a synthetic product-comparison fixture",
          caption: "Native desktop capture · synthetic fixture",
        },
      ],
      contribution: [
        "Built the Electron browser surface, scoped agent contracts, host compiler, two-phase HITL, MCP boundary, receipts, postconditions, and SQLite decision log.",
        "Designed and trained the compact Qwen3.5-4B bound-draft pilot, then evaluated the frozen 36-case synthetic gate across exactness, compilation, binding, safety, and forbidden actions.",
      ],
      category: "Agentic Browser · Agent Safety",
      builtWith: ["TypeScript", "Electron", "MCP", "Qwen3.5-4B", "SQLite"],
    },
  },
  ko: {
    "probabilistic-bid-mlops": {
      claim: "고객사별 낙찰확률과 불확실성 · q1000 예측 · Monte Carlo 의사결정",
      lead: [
        "추천값 하나만으로는 고객사에게 낙찰 가능성과 위험을 함께 설명할 수 없었습니다. 같은 예측값도 지역·공고별 경쟁환경에 따라 의미가 달랐고, 소수의 분석 인력이 1,000개 이상의 고객사를 일관된 기준으로 검토하기도 어려웠습니다. 하나의 숫자를 반환하는 모델이 아니라 추천값, 낙찰확률과 불확실성을 함께 제공하는 의사결정 시스템이 필요했습니다.",
      ],
      metricCards: [
        { label: "분포 interface", value: "q1000", note: "0.001부터 0.999까지 1,000개 분위수" },
        { label: "내부 낙찰 KPI", value: "+30%", note: "기존 단일 분위모델 대비" },
        { label: "추론시간", value: "136초 → 25초", note: "Simulation·평가 연산 벡터화" },
      ],
      flow: {
        title: "서로 다른 가격 이력에서 배포 가능한 의사결정까지",
        intro: "모델 계열은 동일한 분포 interface로 교체할 수 있게 하고, 배포 gate는 평가된 후보가 근거 없이 write되는 것을 막습니다.",
        steps: [
          { label: "공통 좌표", description: "서로 다른 가격 이력과 63개 feature schema를 하나의 affine target coordinate로 변환합니다." },
          { label: "분포 모델", description: "XGBoost·CatBoost 분위회귀와 routed TabICLv2로 q1000 후보를 생성합니다." },
          { label: "지역별 simulation", description: "지역별 Monte Carlo contract로 후보 유효확률과 최저가 확률을 계산합니다." },
          { label: "Policy 평가", description: "시간분리 평가, 과거 순위 신호와 운영 제약을 결합합니다." },
          { label: "근거 기반 배포", description: "Manifest, calibration semantics, artifact size, SHA256와 dry-run을 확인한 뒤 승인된 후보만 배포합니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/probabilistic-bid-mlops/decision-pipeline.png",
          alt: "공통 feature 좌표, 분위모델, q1000 분포 interface, 지역별 Monte Carlo, policy 평가와 근거 기반 배포로 이어지는 의사결정 파이프라인",
          caption: "1,000분위 확률예측을 검증된 후보 배포로 연결하는 전체 경로",
        },
        {
          src: "/img/projects/probabilistic-bid-mlops/uq-model-map.png",
          alt: "active 분위회귀와 TabICLv2 후보, 평가한 UQ 모델 계열, 분포·의사결정·운영 품질 평가를 구분한 모델 지도",
          caption: "Active candidate와 연구·평가 모델을 구분한 UQ model map",
        },
      ],
      resultTables: [
        {
          title: "운영 contract",
          columns: ["Layer", "구현", "의사결정 output"],
          rows: [
            ["Forecast", "XGBoost / CatBoost quantile, TabICLv2 routing", "1,000분위 분포"],
            ["Simulation", "지역별 Monte Carlo", "유효확률과 최저가 확률"],
            ["Evaluation", "Time split, CRPS, pinball, 운영 KPI", "후보 policy"],
            ["Deployment", "Manifest + SHA256 + dry-run + approval", "검증된 artifact"],
          ],
        },
      ],
      contribution: [
        "Model zoo를 q1000 contract로 통일하고 공고당 약 8만 개 후보를 지역별 의사결정 simulation과 연결했습니다.",
        "1,000개 이상 고객사에 제공되는 학습, 평가, routed inference, 리포트, artifact provenance, dry-run과 승인 후 배포 경로를 구축했습니다.",
      ],
      category: "Tabular ML · UQ · Decision Systems",
      builtWith: ["Python", "XGBoost", "CatBoost", "TabICLv2", "Quantile Regression", "Monte Carlo Simulation", "SHA256 Manifest"],
    },
    "document-ai-ocr": {
      claim: "HWP·PDF 공고문 Document AI · 주요 필드 F1 0.985 · 일 약 2,000건",
      lead: [
        "모델 학습과 공동도급 매칭에 필요한 분야별 지분과 시공능력 기준은 공고 API가 아니라 첨부된 HWP·PDF 안에만 있었습니다. 하루 약 2,000개의 신규 문서를 사람이 직접 열어보는 방식으로는 feature 생성과 고객사 매칭을 실시간으로 처리할 수 없었습니다. 문서를 자동으로 구조화하면서도 금액과 비율은 다시 계산하고 확인할 수 있는 처리 경로가 필요했습니다.",
      ],
      metricCards: [
        { label: "주요 필드 추출", value: "F1 0.985", note: "HWP/HWPX·PDF 나라장터 공고문" },
        { label: "일 처리량", value: "약 2,000건", note: "신규 공고 자동 처리" },
        { label: "수치 검증", value: "Deterministic", note: "금액·비율·단위를 코드로 검증" },
      ],
      flow: {
        title: "문서 복원, 필드 복사와 수치 계산을 분리합니다",
        intro: "각 단계에 한 가지 책임만 두어 extraction 오류의 위치를 찾고 수치 결과를 다시 계산할 수 있게 했습니다.",
        steps: [
          { label: "직접 다운로드", description: "브라우저 자동화 없이 URL에서 원본 byte를 내려받습니다." },
          { label: "포맷 routing", description: "파일명 대신 magic byte로 HWP, HWPX, PDF와 ZIP을 구분합니다." },
          { label: "원문 복원", description: "rhwp, hwp5와 liteparse를 포맷별 경로와 bounded retry로 실행합니다." },
          { label: "필드 복사", description: "Gemini 2.5 Flash-Lite가 복원된 원문에서 필요한 필드만 복사합니다." },
          { label: "결정론적 계산", description: "금액, 비율과 단위를 코드로 계산하고 구조화 output과 error log를 증분 저장합니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/document-ai-ocr/ocr-pipeline.png",
          alt: "직접 다운로드와 magic-byte routing에서 HWP·PDF parser, 원문 필드 복사, 결정론적 수치 parsing과 복구 가능한 batch control로 이어지는 Document AI 파이프라인",
          caption: "언어 추출과 수치 계산의 책임을 분리한 browserless document pipeline",
        },
        {
          src: "/img/projects/document-ai-ocr/ocr-results.png",
          alt: "199개 중 199개 문서 추출, 214만 tokens 처리, 약 90% 업종별 비율 일치와 약 0.82달러 batch cost를 보여주는 결과 카드",
          caption: "익명화된 HWP/HWPX·PDF·ZIP 측정 batch",
        },
      ],
      resultTables: [
        {
          title: "측정 extraction batch",
          columns: ["지표", "결과", "의미"],
          rows: [
            ["문서", "199 / 199", "측정 batch에서 extraction 실패 0건"],
            ["원문", "2,140,021 tokens", "긴 문서를 snippet으로 축약하지 않고 보존"],
            ["업종별 비율 GT", "약 90%", "원문 필드 추출 후 결정론적 비율 처리"],
            ["기록된 비용", "약 $0.82", "경량 모델을 이용한 batch 처리"],
          ],
        },
      ],
      contribution: [
        "직접 다운로드, magic-byte routing, parser fallback과 결정론적 수치 처리의 경계를 설계했습니다.",
        "단계별 timeout, retry, 증분 CSV와 구조화 error attribution을 포함한 동시 batch 처리를 구현했습니다.",
      ],
      category: "Document AI · Information Extraction",
      builtWith: ["Python", "HWP/HWPX", "PDF", "Gemini 2.5 Flash-Lite", "ThreadPool", "Deterministic Parsing"],
    },
    "procurement-nlp": {
      claim: "공고명 NLP API · Macro-F1 0.9639 · 세부분야 F1 0.90 · CPU 약 50ms",
      lead: [
        "실시간으로 들어오는 공고를 담당 부서에 곧바로 연결하려면 공고명만으로 입찰 가능 여부와 세부 분야를 판단해야 했습니다. 하지만 하천·소방·정보통신 같은 세부분야 라벨은 거의 없었고 운영 환경에는 추론용 GPU도 없었습니다. 모든 공고를 수작업으로 라벨링하지 않고 도메인 분류체계를 만들며, 두 가지 판단을 CPU에서 빠르게 제공하는 pipeline이 필요했습니다.",
      ],
      metricCards: [
        { label: "입찰가능성", value: "Macro-F1 0.9639", note: "Accuracy 96.4%" },
        { label: "세부분야", value: "F1 0.90", note: "Weakly supervised multiclass model" },
        { label: "CPU 배포", value: "약 50ms", note: "Static INT8 ONNX · 약 330MB" },
      ],
      flow: {
        title: "부족한 라벨에서 CPU 서빙 가능한 분류체계까지",
        intro: "Teacher의 도메인 표현을 분류에만 쓰지 않고 ontology discovery와 업무 카테고리 supervision의 출발점으로 사용했습니다.",
        steps: [
          { label: "입찰가능성 teacher", description: "KLUE RoBERTa-large를 LoRA, focal loss, R-Drop과 FGM으로 fine-tuning합니다." },
          { label: "Ontology discovery", description: "1024차원 CLS 표현을 UMAP·HDBSCAN으로 묶고 사람이 cluster를 검토합니다." },
          { label: "Weak labels", description: "Hard-rule override와 SBERT 0.9·domain RoBERTa 0.1 Max-Sim confidence를 결합합니다." },
          { label: "Multiclass student", description: "동적으로 만든 label set에서 class-weighted LoRA model을 학습합니다." },
          { label: "INT8 batch serving", description: "Adapter를 merge하고 static ONNX quantization 후 두 모델을 FastAPI에서 병렬 실행합니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/procurement-nlp/nlp-pipeline.png",
          alt: "RoBERTa LoRA 입찰가능성 teacher에서 ontology discovery, Max-Sim 약라벨, multiclass student와 INT8 ONNX CPU serving으로 이어지는 약지도학습 NLP 파이프라인",
          caption: "도메인 표현, ontology, weak supervision과 배포를 연결한 전체 경로",
        },
        {
          src: "/img/projects/procurement-nlp/nlp-benchmark.png",
          alt: "500건 입찰가능성 평가에서 fine-tuned RoBERTa classifier가 Macro-F1 0.9639와 Accuracy 96.4%를 기록한 비교 막대그래프",
          caption: "500건 입찰가능성 평가 · Macro-F1과 Accuracy",
        },
      ],
      resultTables: [
        {
          title: "입찰가능성 평가",
          columns: ["접근", "Macro-F1", "Accuracy"],
          rows: [
            ["LLM few-shot", "0.351", "54.0%"],
            ["Fine-tuned RoBERTa + LoRA", "0.9639", "96.4%"],
            ["RAFT", "0.350", "53.8%"],
            ["Three-agent path", "0.9639", "96.4%"],
          ],
          caption: "모든 행은 같은 500건 binary evaluation set을 사용했습니다.",
        },
      ],
      contribution: [
        "업무 카테고리 supervision을 위한 representation-to-ontology와 Max-Sim weak-label path를 설계했습니다.",
        "Binary·multiclass LoRA classifier를 학습하고 static INT8 ONNX로 변환해 FastAPI batch endpoint에 병렬 추론을 연결했습니다.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/nlp-analysis-agent", note: "전처리, 학습, ontology discovery, weak labeling, quantization과 serving" },
      ],
      category: "Korean NLP · Weak Supervision · CPU Serving",
      builtWith: ["RoBERTa-large", "LoRA", "SBERT", "UMAP", "HDBSCAN", "ONNX Runtime INT8", "FastAPI"],
    },
    "r2ccp-bid-prediction": {
      claim: "다봉형 입찰 분포를 보존하는 R2CCP · 8개 문맥 모델 · 50만 회 Monte Carlo 의사결정",
      lead: [
        "PQ 입찰은 기술점수와 가격점수를 함께 평가합니다. 기술점수가 낮아질수록 유효한 가격대가 입찰 불가능 구간을 사이에 두고 갈라져 실제 투찰행태가 하나의 봉우리가 아닌 다봉분포로 나타났습니다. 하나의 예측값이나 합쳐진 구간이 아니라 서로 떨어진 유효구간을 보존하고 후보별 낙찰확률을 계산하는 시스템이 필요했습니다.",
      ],
      metricCards: [
        { label: "Modeling dataset", value: "69,934건", note: "시간순 train / validation split" },
        { label: "Validation", value: "13,984건", note: "가중 conformal coverage 90.73%" },
        { label: "운영 결과", value: "+35% KPI", note: "그룹사 PQ 낙찰 성과" },
      ],
      flow: {
        title: "분포를 보존한 뒤 의사결정을 simulation합니다",
        intro: "문맥별 calibration으로 서로 떨어진 mode를 보존한 뒤 후보 행동의 결과를 simulation합니다.",
        steps: [
          { label: "Context routing", description: "순위 위치 Q1/Q2와 입찰률 차이 4분위를 결합합니다." },
          { label: "R2CCP distribution", description: "시간순 split에서 entropy-regularized 8개 문맥 모델을 학습합니다." },
          { label: "Per-bin conformal set", description: "보정된 threshold를 넘는 bin만 남겨 서로 떨어진 interval을 보존합니다." },
          { label: "Monte Carlo decision", description: "경쟁 결과를 500,000회 표본화해 후보 입찰률별 승리확률을 계산합니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/r2ccp-bid-prediction/r2ccp-method.png",
          alt: "다봉형 합성 분포에서 누적 interval collapse와 두 mode 사이 저밀도 구간을 보존하는 per-bin conformal region을 비교한 그림",
          caption: "Interval-collapse 수정 방법을 설명하는 합성 분포",
        },
        {
          src: "/img/projects/r2ccp-bid-prediction/r2ccp-coverage.png",
          alt: "시간순 validation 13,984건에서 가중 coverage 90.73%를 기록한 Q와 BRD 조합 8개 문맥 모델의 coverage chart",
          caption: "시간순 validation 13,984건 · 가중 coverage 90.73%",
        },
      ],
      resultTables: [
        {
          title: "8개 문맥 시간순 validation",
          columns: ["Context", "Coverage", "평균 interval 길이"],
          rows: [
            ["Q1-BRD1", "91.39%", "0.0149"], ["Q1-BRD2", "92.23%", "0.0194"],
            ["Q1-BRD3", "88.07%", "0.0166"], ["Q1-BRD4", "91.21%", "0.0169"],
            ["Q2-BRD1", "86.14%", "0.0220"], ["Q2-BRD2", "81.41%", "0.0208"],
            ["Q2-BRD3", "93.92%", "0.0285"], ["Q2-BRD4", "94.77%", "0.0534"],
          ],
          caption: "가중 coverage: 12,688 / 13,984 = 90.73%.",
        },
      ],
      contribution: [
        "다봉 분포의 interval collapse를 찾고 per-bin conformal threshold와 entropy regularization으로 추론 구조를 다시 설계했습니다.",
        "8개 문맥의 시간순 평가와 분포예측을 실제 투찰 의사결정에 사용하는 500,000회 후보 simulation에 연결했습니다.",
      ],
      evidenceLinks: [
        { label: "Source code", href: "https://github.com/HarimxChoi/ensemble-bid-prediction", note: "R2CCP modeling, calibration, context routing과 simulation" },
      ],
      category: "Conformal Prediction · Multimodal Forecasting",
      builtWith: ["Python", "R2CCP", "Conformal Prediction", "Entropy Regularization", "Monte Carlo Simulation"],
    },
    wsss: {
      claim: "WSSS SOTA 연구용역 · COCO-Val mIoU 53.31% · WeCLIP+ 대비 +1.5%p",
      lead: [
        "클라이언트로부터 이미지 단위 정답만 사용해 당시 SOTA였던 WeCLIP+의 성능을 개선하는 연구용역을 의뢰받았습니다. 자동으로 만든 pseudo-mask에는 객체 경계와 배경의 잘못된 pixel이 포함됐고, 이 오류는 self-training을 반복할수록 누적됐습니다. 전체 mask를 다시 만드는 대신 신뢰하기 어려운 pixel만 찾아 복원할 수 있는지가 핵심 연구 질문이었습니다.",
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
        {
          src: "/img/wsss-architecture.png",
          alt: "고정한 CLIP과 DINOv2 표현, 선택적 pseudo-mask 복원과 self-training으로 구성된 weakly supervised segmentation 구조",
          caption: "Frozen representation, reliability map, 선택적 pixel 복원과 재학습",
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
      category: "Weak Supervision · Semantic Segmentation",
      builtWith: ["PyTorch", "CLIP", "DINOv2", "Semantic segmentation", "COCO-Val 2014"],
    },
    "emh-agent": {
      claim: "비용을 반영한 3년 검증 · TQC +183.9% vs. IVV +99.6%",
      lead: [
        "AI가 사람의 감정에 흔들리지 않고 더 일관된 투자 판단을 내릴 수 있을지 궁금했습니다. 이 질문을 제대로 확인하려면 미래 정보를 보지 않고, 각 시점까지 누적된 정보만으로 판단하며 거래비용과 slippage까지 반영해야 했습니다. 결과 숫자만 좋은 backtest가 아니라 같은 조건에서 다시 실행할 수 있는 투자 의사결정 과정을 만들고자 했습니다.",
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
      category: "Reinforcement Learning · Portfolio Decision",
      builtWith: ["Python", "TQC", "Point-in-time data", "Gymnasium", "Stable-Baselines3"],
    },
    vargo: {
      claim: "Agent routing의 identification wall · 실행·검증으로 deployable ceiling 도달",
      lead: [
        "Agent의 scaffold, memory, retry와 verifier 조합은 task마다 최적값이 달랐습니다. 그렇다면 task text, embedding이나 hidden state만 보고 실행 전에 가장 좋은 구성을 선택할 수 있을까? 그것이 어렵다면 제한된 후보를 직접 실행하고 검증하는 방식이 최적 성능과의 차이를 얼마나 회복할 수 있는지가 핵심 연구 질문이었습니다.",
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
          value: "54% → 85%",
          note: "최적 격차 회수율 · 11개 배포 후보군에서는 100%",
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
        "Routing baseline, activation probe, contamination control과 verified-execution capture 평가를 구현했으며, 이 결과를 바탕으로 작성한 논문은 TMLR review 중입니다.",
      ],
      category: "Agent Evaluation · Decision Science",
      builtWith: ["Python", "ALFWorld", "Agent routing", "Verifier cascade", "Reproducible evaluation"],
    },
    eat: {
      claim: "의료 이미지 E-AT 연구 · macro-F1 0.8647 · ECE 1.03% vs. CR-SAM 1.7%",
      lead: [
        "의료 이미지 모델은 정답을 맞히는 것만큼 틀릴 때 얼마나 확신하는지도 중요합니다. 정확도가 비슷해도 틀린 예측에 높은 confidence를 주는 모델은 사람이 결과를 과신하게 만들 수 있습니다. 분류 성능을 유지하면서 예측 confidence의 신뢰도까지 같은 학습 과정에서 개선할 수 있는지를 연구했습니다.",
      ],
      metricCards: [
        {
          label: "ISIC",
          value: "4 classes",
          note: "Balanced · ConvNeXtV2-Tiny · 384 px",
        },
        {
          label: "Macro-F1",
          value: "0.8647",
          note: "Best classification result",
        },
        {
          label: "Minimum ECE",
          value: "1.03%",
          note: "CR-SAM (AAAI 2024): 1.7%",
        },
      ],
      flow: {
        title: "분류 성능과 믿을 수 있는 confidence를 함께 학습하기",
        intro: "학습이 끝난 뒤 calibration만 보정하는 대신 sample difficulty, perturbation과 prediction consistency를 하나의 objective로 연결했습니다.",
        steps: [
          {
            label: "이미지와 class label",
            description: "Clean stochastic forward에서 target class confidence와 각 ISIC 이미지의 difficulty를 계산합니다.",
          },
          {
            label: "Focal difficulty",
            description: "모든 샘플을 같은 비중으로 보지 않고 어려운 샘플이 loss에 더 크게 반영되도록 합니다.",
          },
          {
            label: "Adaptive FGM",
            description: "Sample difficulty에 맞춘 제한된 perturbation으로 두 번째 stochastic prediction을 계산합니다.",
          },
          {
            label: "R-Drop update",
            description: "분류 loss와 두 prediction의 bidirectional consistency를 한 번의 update로 함께 최적화합니다.",
          },
        ],
      },
      figures: [
        {
          src: "/img/projects/eat/eat-isic-results.svg",
          alt: "균형 4-class ISIC에서 E-AT가 서로 다른 checkpoint에서 macro-F1 0.8647과 minimum ECE 1.03%를 기록한 결과",
          caption: "Balanced 4-class ISIC · ConvNeXtV2-Tiny 384 px",
        },
        {
          src: "/img/projects/eat/eat-method.svg",
          alt: "Focal sample difficulty, adaptive FGM perturbation과 bidirectional R-Drop consistency를 연결한 E-AT 학습 구조",
          caption: "Focal loss, adaptive FGM과 bidirectional R-Drop을 하나의 objective로 학습했습니다",
        },
      ],
      resultTables: [
        {
          title: "ISIC 결과",
          columns: ["Metric", "E-AT 결과", "Selection"],
          rows: [
            ["Macro-F1 ↑", "0.8647", "Classification checkpoint"],
            ["ECE ↓", "1.03%", "Calibration checkpoint"],
            ["CR-SAM ECE ↓", "1.7%", "AAAI 2024 reference"],
          ],
          caption: "Macro-F1과 ECE는 각각의 best checkpoint 기준입니다.",
        },
      ],
      contribution: [
        "Focal difficulty, adaptive FGM과 bidirectional R-Drop을 연결한 E-AT objective를 설계했습니다.",
        "균형 ISIC 학습·평가 pipeline을 만들고 macro-F1과 ECE를 분리해 추적했습니다.",
      ],
      category: "Calibration · Medical Vision",
      builtWith: ["PyTorch", "ConvNeXtV2-Tiny", "Focal loss", "R-Drop", "FGM", "ISIC 2019"],
    },
    "langgraph-travel-agent": {
      claim: "미국 여행사 납품 · 공급사 병렬 검색과 중단 후 재개가 가능한 여행 상담 Agent",
      lead: [
        "미국 여행사는 고객의 자연어 요청을 받아 예산과 일정에 맞는 항공편·숙소·관광지·맛집을 찾아주는 Agent를 요청했습니다. 기존 상담에서는 누락 정보 확인, 공급사 검색, 패키지 비교, CRM 저장과 후속 연락을 서로 다른 도구에서 반복해야 했습니다. 첫 요청부터 상담자 검토와 고객 연락까지 같은 맥락을 유지하는 workflow가 필요했습니다.",
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
      category: "Agent Workflow · API Orchestration",
      builtWith: ["Python", "LangGraph", "FastAPI", "AsyncIO", "Amadeus / Hotelbeds"],
    },
    myshot: {
      claim: "스마트폰 영상에서 3D 스윙과 샷 결과까지 · 클럽헤드 속도 중앙오차 6.1%",
      lead: [
        "골프 레슨과 장비는 비용이 높고, 혼자 연습할 때는 자세가 왜 잘못됐는지뿐 아니라 그 움직임이 공의 속도·방향·비거리에 어떤 영향을 주는지 알기 어렵습니다. 일반 pose tool은 몸의 움직임을 보여주는 데서 끝납니다. 스마트폰 영상 하나로 스윙 교정과 실제 샷 결과를 함께 분석하고 싶었습니다.",
      ],
      metricCards: [
        { label: "클럽헤드 속도", value: "6.1%", note: "GolfPose Vicon motion 중앙오차" },
        { label: "3D 복원", value: "35.6 mm", note: "MPJPE · X-Factor MAE 3.1°" },
        { label: "Carry GT", value: "25 pairs", note: "AIHub 스윙 영상 50개에서 구축" },
      ],
      flow: {
        title: "휴대폰 영상 하나에서 자세·속도·방향·비거리까지",
        intro: "몸, 클럽과 공의 움직임을 하나의 sequence로 처리하고, 직접 측정한 신호와 개인 보정·물리 계산 결과를 구분해 연결했습니다.",
        steps: [
          { label: "골퍼·클럽·공 추적", description: "골퍼만 보지 않고 address, top, impact와 finish 전 구간에서 세 target을 함께 추적합니다." },
          { label: "2D에서 3D motion으로", description: "RTMPose 관절을 GolfPose Vicon과 pseudo-3D swing data로 학습한 MotionAGFormer로 변환합니다." },
          { label: "스윙 mechanics", description: "관절 움직임, X-Factor, swing power, club path와 clubhead speed를 전체 motion에서 계산합니다." },
          { label: "개인 calibration", description: "모든 골퍼에게 하나의 식을 적용하지 않고 사용자 체격과 클럽별 carry·ball-speed 기록을 보정값으로 사용합니다." },
          { label: "샷 결과와 reliability", description: "Physics-based ball-flight model로 ball speed, 시작 방향과 carry를 계산하고 pose disagreement와 jitter로 불안정한 frame을 구분합니다." },
        ],
      },
      figures: [
        {
          src: "/img/projects/myshot/myshot-vision-tracking.mp4",
          poster: "/img/projects/myshot/myshot-vision-tracking.png",
          kind: "video",
          alt: "익명화한 골프 스윙 영상에 골퍼·클럽·공 box, pose skeleton, 관절각과 공의 이동 경로를 함께 표시한 예시",
          caption: "Frame-aligned AIHub 연구 데이터 예시 · 얼굴 익명화 · 골퍼·클럽·공·pose·관절각 tracking",
        },
        {
          src: "/img/projects/myshot/myshot-golfdb-2d-to-3d.png",
          alt: "익명화한 골프 스윙의 address, top, impact, finish에서 원본 frame, 2D 관절과 3D skeleton 복원 결과를 비교한 예시",
          caption: "단안 영상 입력 · 2D 관절 · 현재 모델의 3D 복원",
        },
        {
          src: "/img/projects/myshot/myshot-cmu-xfactor.png",
          alt: "독립 CMU 골프 motion-capture 6개에서 예측 X-Factor와 정답 곡선을 비교한 그래프",
          caption: "독립 CMU motion capture · 6 trials · 평균 절대상관 0.95",
        },
      ],
      contribution: [
        "Target tracking과 2D-to-3D motion부터 관절지표, clubhead speed, 개인 calibration과 physics-based ball-flight model까지 연결했습니다.",
        "30fps body motion만으로 carry를 직접 회귀하는 신호가 약한 것을 확인하고 ball·club tracking과 클럽별 calibration 중심으로 구조를 바꿨습니다.",
      ],
      category: "Object Detection · Human Pose · 3D Vision · Ball-flight Prediction",
      builtWith: ["YOLO11", "RTMPose", "MotionAGFormer", "Physics-based ball flight", "Reliability scoring"],
    },
    "google-surf-mcp": {
      claim: "AI Agent 검색·웹·학술 PDF 인프라 · MCP TOPLIST Top 1%",
      lead: [
        "LLM Agent가 유용한 답을 내려면 검색 결과 링크뿐 아니라 최신 웹페이지와 학술 PDF의 본문까지 읽을 수 있어야 합니다. 기존 tool은 일반검색·학술검색·본문 추출이 분리돼 느렸고, 검색 품질과 PDF parsing도 불안정했습니다. Agent가 하나의 interface에서 근거를 검색하고 읽으며 실패까지 복구할 수 있는 검색 인프라가 필요했습니다.",
      ],
      metricCards: [
        { label: "MCP interface", value: "6 tools", note: "검색, 병렬 검색, 웹, PDF와 학술 검색" },
        { label: "검증", value: "388 / 388", note: "44개 test file 전체 Vitest 통과" },
        { label: "MCP TOPLIST", value: "Top 1%", note: "npm package 공개" },
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
      category: "MCP · Search Infrastructure",
      builtWith: ["TypeScript", "MCP", "Playwright", "PDF extraction", "Vitest"],
    },
    monogram: {
      claim: "공유 한 번으로 수집·정리·검색까지 연결하는 개인 지식관리(PKM) 시스템",
      lead: [
        "뉴스, SNS, arXiv, YouTube와 학술 리포트에서 본 정보가 여러 앱과 북마크에 흩어져 필요할 때 다시 찾기 어려웠습니다. 어떤 형태의 지식이든 공유 버튼 한 번으로 수집하고, 왜 중요했는지와 출처를 보존하며 자동으로 정리·분류·검색하고 싶었습니다. 사람과 Agent가 같은 지식을 다시 사용할 수 있는 개인 지식관리 시스템이 목표였습니다.",
      ],
      metricCards: [
        { label: "Capture pipeline", value: "5 stages", note: "Orchestrator, classifier, extractor, verifier, writer" },
        { label: "Storage 경계", value: "1 Git commit", note: "연관 note와 asset을 원자적으로 저장" },
        { label: "Agent access", value: "13 MCP tools", note: "동일한 지식을 Agent context로 재사용" },
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
      category: "PKM · Knowledge Automation",
      builtWith: ["Python", "EmbeddingGemma", "ONNX Runtime", "BM25 / RRF", "Git Tree API"],
    },
    "bau-browser": {
      claim: "Agentic Browser · 프라이버시와 Agent 실행권한을 사용자가 직접 통제하는 local-first desktop",
      lead: [
        "Chrome이 무겁고 불편하다고 느꼈고, Agent를 브라우저에 붙이는 순간 사용자의 프라이버시와 행동 통제권이 더 중요해진다고 생각했습니다. 기존 방식에서는 browsing data가 어디로 가는지, Agent가 어떤 사이트에서 무엇을 할 수 있는지 확인하기 어려웠습니다. 개인 데이터를 local에 두고 Agent의 권한·승인·실행기록을 사용자가 직접 관리하는 desktop browser를 만들고 싶었습니다.",
      ],
      metricCards: [
        { label: "행동·인수 생성", value: "36/36", note: "새로운 도메인 task에서 정확히 생성" },
        { label: "허용 범위 밖 행동", value: "0건", note: "사용자가 지정한 origin·action scope 준수" },
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
          src: "/img/bau-browser-synthetic.png",
          alt: "합성 상품 비교 fixture를 사용한 Bau Browser native desktop 화면",
          caption: "Native desktop capture · synthetic fixture",
        },
      ],
      contribution: [
        "Electron browser surface, scoped agent contract, host compiler, two-phase HITL, MCP boundary, receipt, postcondition과 SQLite decision log를 구현했습니다.",
        "Compact Qwen3.5-4B bound-draft pilot을 설계·학습하고 frozen 36-case synthetic gate에서 exactness, compilation, binding, safety와 금지 행동을 평가했습니다.",
      ],
      category: "Agentic Browser · Agent Safety",
      builtWith: ["TypeScript", "Electron", "MCP", "Qwen3.5-4B", "SQLite"],
    },
  },
};

export function getProjectDetail(slug: string | undefined, lang: ProjectLanguage) {
  return slug ? details[lang][slug] : undefined;
}
