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
  },
};

export function getProjectDetail(slug: string | undefined, lang: ProjectLanguage) {
  return slug ? details[lang][slug] : undefined;
}
