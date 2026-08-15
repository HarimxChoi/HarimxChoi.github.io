# Portfolio and resume rebuild plan

## 1. Objective

Rebuild the public career materials around one identity:

> Machine Learning Engineer interested in vectorizing reality, predicting outcomes, and estimating uncertainty.

The redesign separates information by depth instead of repeating every detail everywhere.

| Surface | Reader should get | Target depth |
| --- | --- | --- |
| GitHub profile | identity and selected work | 20–30 seconds |
| Portfolio home | project map and one-line value | 1–2 minutes |
| Resume | role fit, ownership, and selected evidence | 2–3 pages |
| LinkedIn | readable career narrative and project summaries | 3–5 minutes |
| Project page | technical problem, design, results, and evidence | visual-first, only as long as needed |
| Portfolio deck | visual interview narrative | 20–30 slides per language |

WarpQuant is the fixed reference page and is not rewritten in this project. It is the reference for clarity and evidence, not a mandatory page length.

## 2. Recovery points before changes

- Public GitHub Pages baseline: commit `6f7e24f`.
- Remote backup tag: `portfolio-pre-redesign-2026-08-16`.
- Remote backup branch: `feat/portfolio-pre-redesign-backup`.
- Local bundle: `C:\Users\user\resume\_backups\HarimxChoi.github.io-pre-redesign-2026-08-16.bundle`.
- Local redesign baseline: branch `feat/list-redesign`, commit `44dcbd6`.
- Before editing any external profile, save its current text and project list under the private career repository.

## 3. Shared writing system

### 3.1 Identity

- Primary title: `Machine Learning Engineer`.
- North-star sentence, Korean: `현실을 벡터화하고, 예측하고, 불확실성을 추정하는 것에 관심이 있습니다.`
- North-star sentence, English: `I am interested in vectorizing reality, making predictions, and estimating uncertainty.`
- Use plain chronological prose for About sections.
- Move dense metrics, implementation details, and experiment lineage into project pages.

### 3.2 Project summary pattern

Every card, resume entry, and LinkedIn entry is derived from the same four fields:

1. Problem: what was difficult for the user, organization, or model.
2. Approach: what Harim designed or changed.
3. Result: what became faster, more accurate, more reliable, or newly possible.
4. Evidence: the page, chart, demo, log, paper, or repository that supports the result.

The public version removes internal experiment names, checkpoint names, numbered variants, and audit vocabulary. It keeps the actual method, model family, dataset, metric, and result.

Example tone:

> **WSSS SOTA research · +1.5 pp mIoU over the previous SOTA**  
> 이미지 단위 정답만으로 segmentation을 학습할 때, 자동 생성된 mask에서 신뢰하기 어려운 pixel만 찾아 복원한 뒤 다시 학습하는 방법입니다. CLIP과 DINOv2의 사전학습 표현을 backbone으로 활용하고, pseudo-label refinement와 segmentation 학습 경로를 설계했습니다.

This is the target balance: the first sentence is understandable without reading a paper, while the second sentence preserves the technical mechanism.

### 3.3 Tags

Use one visible category per project:

- Production ML
- Prediction & Uncertainty
- Computer Vision
- Agent Systems
- Model Efficiency
- Automation & Products

Put implementation details on one `Built with` line. Do not render a cloud of technology tags.

### 3.4 Dates

- Company work keeps the real project period and `Associated with` company.
- Independent work uses the real year, `Present`, or `Independent Research`.
- Cards may omit dates when chronology is not useful.
- Private work is not moved to a false period to avoid overlap with employment.

## 4. Visual-first project-page contract

Every project page except WarpQuant uses the same reader-facing structure, but it does not need to match WarpQuant's length.

1. Hero: title, one result-led sentence, category, role/status.
2. Main visual: the strongest result or qualitative output appears before long prose.
3. Plain-language explanation: what problem this solves in two or three sentences.
4. Technical explanation: models, training/inference design, data, and evaluation in a compact block.
5. Method visual: architecture, workflow, or model diagram.
6. Results: only the comparison table, curve, or examples needed to support the main claim.
7. My contribution: a short ownership statement.
8. Evidence links: repository, paper, demo, log, or downloadable artifact.
9. Reproduction notes: optional and collapsible when they would interrupt the main story.

The prose must not read like an audit report. Evidence constrains facts but internal rejection language, defensive caveats, self-rebuttal, experiment IDs, and checkpoint lineage do not appear in public copy.

Default page length is four to seven minutes. A page becomes longer only when the method or evidence genuinely needs more space. The first viewport must communicate the project without requiring the reader to scroll through setup details.

## 5. Visual contract

Every project page must contain at least two meaningful visuals, and the strongest visual is treated as the main output rather than decoration:

- Visual A: architecture, data flow, model design, or workflow.
- Visual B: result curve, comparison table, qualitative output, demo, or operational before/after.

When evidence supports it, add a third visual for a qualitative example, ablation, or a real interface. Decorative stock imagery does not count.

All visuals need:

- a descriptive caption;
- the dataset, sample size, or operating context when relevant;
- readable labels in both light and dark themes;
- an English and Korean caption;
- a private source pointer in the content manifest to the generating log, table, script, or original capture; public captions stay clean.

If a suitable image does not exist, generate it from local experiment data or code structure. Do not invent a result to fill a visual slot.

## 6. Project inventory and planned visuals

### 6.1 Model Efficiency

#### WarpQuant

- Status: fixed reference page; no content rewrite.
- Existing visuals and result tables remain the design benchmark.

### 6.2 Prediction & Uncertainty

#### Public Procurement Decision ML at Sejong

- Story: a fragmented procurement pipeline became an operated probabilistic decision system.
- Visual A: collection → OCR → features → 199-quantile models → Monte Carlo → recommendation → candidate deployment.
- Visual B: model comparison using CRPS, pinball loss, and the operational three-way KPI.
- Visual C: Airflow DAG or parallel-GPU execution and the 136s → 25s inference path.
- Evidence search: Sejong code, runbooks, evaluation artifacts, Airflow definitions, local logs, and Drive reports.

#### R2CCP

- Story: a multimodal distribution collapsed into one interval; the inference and calibration path was redesigned.
- Visual A: public implementation versus redesigned interval construction.
- Visual B: coverage, interval shape, or KPI comparison across contexts.
- Evidence search: ensemble-bid-prediction repository, saved plots, backtests, and experiment tables.

#### EAT

- Story: train confidence to match correctness across CNN and Transformer image classifiers.
- Visual A: ISIC ECE training curve.
- Visual B: ISIC F1 curve and best-checkpoint comparison.
- Visual C: reliability diagram or CIFAR-100 calibration comparison.
- Evidence search: EAT experiment folders, checkpoints, tensorboard/CSV logs, and remote artifacts copied locally.

#### EMH Agent

- Story: make portfolio decisions with point-in-time data and explicit execution boundaries.
- Visual A: information → policy → proposal → approval → execution/reconciliation architecture.
- Visual B: period-by-period return comparison table and cumulative-return curve.
- Visual C: drawdown or rolling-return comparison.
- Evidence search: EMH/FinAgent artifacts, score rows, portfolio snapshots, and generated reports.

### 6.3 Computer Vision

#### WSSS

- Story: repair unreliable pseudo-label regions before retraining weakly supervised segmentation.
- Visual A: pseudo-label refinement architecture.
- Visual B: training/validation mIoU curve.
- Visual C: input → baseline mask → refined mask → ground-truth qualitative examples.
- Evidence search: training logs, COCO evaluation outputs, mask renders, local checkpoints, and Drive artifacts.

#### MyShot

- Story: turn a single golf video into measurable 3D pose and body-rotation signals.
- Visual A: 2D pose overlay on a real golf frame.
- Visual B: the same frame reconstructed with the saved 3D transformation model.
- Visual C: MPJPE/X-Factor comparison or domain-shift result.
- Evidence search: saved model, inference scripts, rendered skeletons, validation outputs, and source videos on the desktop/Drive.

#### Document Vision and CAD Automation at Sanha

- Story: convert inconsistent construction documents and survey inputs into editable engineering outputs.
- Visual A: document/OCR/layout pipeline with review routing.
- Visual B: source document → structured fields → generated CAD or quantity output.
- Visual C: operating-time before/after.
- Evidence search: Sanha backups, CAD add-in outputs, OCR examples, screenshots, and internal templates.

#### Retail Product Image Automation at Nielsen

- Story: automate product-image attributes and barcode database construction.
- Visual A: product image → attribute/barcode extraction → database flow.
- Visual B: representative input/output grid or processing-time comparison.
- Evidence search: surviving local code, screenshots, old reports, and Drive exports.

### 6.4 Agent Systems

#### google-surf-mcp

- Story: one dependable search and document-extraction interface for AI agents.
- Visual A: MCP request → search → web/PDF extraction → structured response architecture.
- Visual B: existing search/extraction demo.
- Visual C: parser recovery, CAPTCHA handoff, or latency/concurrency comparison.

#### Monogram

- Story: turn fragmented personal inputs into inspectable, searchable, Git-backed knowledge.
- Visual A: ingestion → five-stage processing → atomic Git storage → retrieval/MCP flow.
- Visual B: dashboard capture.
- Visual C: hybrid retrieval or knowledge-graph view generated from the implementation.

#### Bau Browser

- Story: let agents act in a browser while every consequential action remains scoped and reviewable.
- Visual A: origin/action scope and two-stage human approval flow.
- Visual B: native desktop capture.
- Visual C: decision log or prompt-injection benchmark result.

#### LangGraph Travel Agent

- Story: deliver a resumable multi-tool travel workflow to a U.S. travel agency.
- Visual A: complete LangGraph state/agent/tool architecture.
- Visual B: external API sequence and approval-gated messaging flow.
- Visual C: itinerary, CRM, SMS, or checkpointed run output.

#### Vargo

- Story: show why the best agent configuration cannot reliably be identified before execution and how verification changes the decision path.
- Visual A: the attached wall-floor identification graph.
- Visual B: oracle gap / verifier-cascade main paper figure.
- Visual C: experiment matrix or sealed evaluation design.
- Evidence search: Vargo paper figures, artifact bundle, result tables, and experiment manifests.

#### Construction Cost Agent at Hanmac

- Story: retrieve construction standards and prices, then draft takeoff sheets and official correspondence.
- Visual A: OCR/data → FAISS retrieval → LangChain/LangGraph workflow.
- Visual B: retrieved evidence and generated quantity/correspondence sample.
- Evidence search: unitLLM/unitPrice snapshots, generated Excel/PDF outputs, and workflow code.

### 6.5 Production NLP

#### Korean Procurement NLP at Hanmac

- Story: replace manual notice classification with a compact CPU-served Korean document model.
- Visual A: weak-label/teacher-student training and ONNX serving pipeline.
- Visual B: class-level evaluation, confusion matrix, or operational before/after.
- Visual C: model-size/latency comparison.
- Evidence search: bidNLP repository, ONNX model metadata, FastAPI batch path, and evaluation logs.

### 6.6 Automation & Products

#### anti_bot_scraper

- Story: collect browser-only map data reliably under navigation and anti-bot constraints.
- Visual A: grid/navigation/concurrency architecture.
- Visual B: crawl progress or collected-output example.

#### map-bookmarker

- Story: turn a fragile browser workflow into a resumable desktop tool for non-developers.
- Visual A: state/resume workflow.
- Visual B: GUI and packaged output.

#### VotingLab

- Story: connect public data, classification, PDF generation, and personalized outreach into one workflow.
- Visual A: end-to-end automation flow.
- Visual B: generated report and duplicate-safe outreach output.

Supporting projects found during the authenticated 35-repository inventory will be added to this list instead of being silently dropped. The home page may show a selected subset, but every included portfolio project receives a detailed page and remains reachable from an archive/index.

## 7. Website information architecture

### Home

- Name and `Machine Learning Engineer` only.
- North-star sentence.
- Six categories with a selected project list.
- Each card: title, one sentence, one category, and one outcome.
- No dense skill cloud and no repeated metric paragraph.

### Project index

- All detailed projects, filterable by the six categories.
- Work projects and independent projects are visually distinct without ranking one above the other.

### Project detail

- Reusable data schema for sections, metrics, figures, tables, code, downloads, and references.
- WarpQuant keeps its dedicated component.
- Every other page uses the shared detailed-report component and project-specific structured data.

### Career

- Four concise roles.
- Each role describes the operating scope in two to four lines.
- Detailed achievements link to relevant work-project pages instead of repeating every number.

## 8. Resume family

All three resumes share one career source and differ only in summary, skills order, and selected projects.

### General ML

- Positioning: prediction, uncertainty, and end-to-end ML systems.
- Selected projects: Sejong, R2CCP, Korean Procurement NLP, google-surf-mcp, WSSS or WarpQuant.

### Computer Vision

- Positioning: real-world vision under incomplete labels, domain shift, and uncertain predictions.
- Selected projects: WSSS, MyShot, EAT, Sanha Document Vision, Nielsen Product Vision.

### Quantization + FDE

- Positioning: efficient models and full-stack delivery in customer or operating environments.
- Selected projects: WarpQuant, Sejong, Bau Browser, Monogram, google-surf-mcp, LangGraph Travel Agent.

### Resume density rules

- Two or three pages.
- Summary: three short paragraphs or four sentences at most.
- Experience: two to four bullets per role.
- Project: one category, two bullets, one result.
- Skills: four compact lines; no repeated technology tags under every bullet.
- Detailed experiments and secondary metrics link to the portfolio.

## 9. Bilingual portfolio files

Create two editable decks from the website source:

- `harim-choi-ml-portfolio-ko.pptx`
- `harim-choi-ml-portfolio-en.pptx`

Planned structure:

1. Identity and north-star statement.
2. Career timeline.
3. Project map by category.
4. One to three slides for each major project using the same problem/design/result narrative.
5. Selected work-project cases.
6. Links to full project pages, GitHub, and contact.

The decks reuse the same charts and captions as the site. They are not screenshots of web pages. Both versions undergo slide-level overflow and visual checks.

## 10. External profiles

### GitHub profile

- Bio: `Machine Learning Engineer | Prediction, uncertainty, and systems | Seoul`.
- Website: `https://harimxchoi.github.io`.
- README: two-line identity, six selected projects, portfolio/LinkedIn/contact links.
- Refresh pinned project descriptions and repository topics after the site copy is stable.

### LinkedIn

- About: three readable chronological paragraphs; no metric list.
- Experience: company scope and role in two to four lines.
- Projects: problem → approach → result in one paragraph plus one to three media links.
- Add every major portfolio project, but avoid duplicating the full technical report.

### Saramin, Remember, Wanted, PeopleNJob

- Use the General ML resume as the canonical Korean base.
- Adapt to field limits without changing the underlying facts.
- Keep career entries concise and link to the portfolio for technical depth.
- Save before/after snapshots in the private career repository.

Browser edits that publish profile text or transmit resume files are executed only after a grouped action-time confirmation immediately before the save/upload actions.

## 11. Execution phases

### Phase A: inventory

1. Enumerate all 35 GitHub repositories using authenticated owner access.
2. Map every resume/project claim to its local repository, Drive folder, artifact, chart, or demo.
3. Index image/video/log/table assets with provenance and reuse rights.
4. Mark missing visuals that must be rendered from existing data.

### Phase B: content model

1. Extend the project schema beyond summary/bullets.
2. Add bilingual sections, metrics, figures, tables, downloads, references, and related projects.
3. Build shared components for diagrams, result tables, galleries, and evidence links.

### Phase C: project pages

1. Complete work projects and existing ten pages first.
2. Add supporting public/private projects from the inventory.
3. Produce at least two visuals per page.
4. Review every Korean and English page for natural language and duplicate claims.

### Phase D: resume and deck

1. Rewrite the shared career source.
2. Generate General ML, Computer Vision, and Quantization/FDE resumes.
3. Build Korean and English portfolio decks from the same source.
4. Render and inspect every page/slide.

### Phase E: profiles

1. Update GitHub README, bio, website, descriptions, topics, and pins.
2. Update LinkedIn About, experience, skills, and projects.
3. Update Saramin, Remember, Wanted, and PeopleNJob.

### Phase F: publication

1. Run repository guards, type checks, and static build.
2. Inspect desktop and mobile rendering for every route.
3. Validate internal links, downloads, media loading, and bilingual route parity.
4. Merge the verified redesign into public `main`.
5. Confirm the GitHub Pages deployment and smoke-test the live site.
6. Push the private career artifacts and retain rollback instructions.

## 12. Acceptance criteria

- WarpQuant remains byte-for-byte unchanged unless the user later requests otherwise.
- Every published project has the full problem/design/result/evidence structure.
- Every project has at least two non-decorative visuals.
- Every visual has a source pointer and bilingual caption.
- Home cards use one category and one outcome only.
- No false date shifts are used to hide employment overlap.
- All three resumes share the same career facts.
- Korean and English site routes contain the same project set and evidence.
- All generated DOCX/PPTX files pass structural and visual inspection.
- `npm run guard`, `npm run build`, link checks, and responsive smoke tests pass.
- Public deployment can be rolled back to the saved tag, branch, or bundle.

## 13. Pre-registered falsifiers and open search

The current structure is one working hypothesis. It should be revised if any of the following occurs:

- Readers still cannot identify the main contribution within 15 seconds of a card or resume entry.
- Two visuals repeat the same information instead of explaining method and result separately.
- A detailed page becomes a raw experiment dump rather than a coherent technical story.
- A resume variant requires more than six projects to demonstrate fit.
- A work project and an independent project cannot be distinguished without reading the full page.
- A chart cannot be regenerated or traced to a real artifact.

Still open to seek:

- additional private repositories or Drive artifacts not yet present in the 35-repository inventory;
- better qualitative WSSS, MyShot, OCR, and agent-run examples;
- additional Sejong simulation and parallel-GPU visualizations;
- interview-facing demos that can be embedded without requiring account access;
- whether the portfolio home should show six selected projects or one featured project per category;
- whether smaller automation projects deserve full pages or a grouped product-systems page after their evidence is inventoried.
