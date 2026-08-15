# Portfolio Copy Contract

Public pages explain the work to readers. Internal evidence files validate claims but do not dictate public prose.

## Public copy

- Write each project as problem, method, and impact in plain language.
- Lead with the project's identity and the user's intended positioning.
- Define a technical term on first use or replace it with a reader-facing phrase.
- Keep experiment lineage, discarded variants, failed ablations, and audit caveats out of cards and project articles unless the user explicitly asks for a research postmortem.
- Use evidence to prevent false claims. Do not turn evidence limitations into self-rebuttal inside public copy.
- If a claim conflicts with an evidence note or the user's description, stop and surface the conflict. Do not silently replace the claim with a weaker narrative.

## Blocked patterns

- Do not copy evidence-ledger rejection language into public pages.
- Do not present internal version names such as `PECC v6`, `LAPC v7`, or similar experiment IDs as reader-facing explanations.
- Do not foreground phrases such as `failed to improve`, `negative ablation`, `remains unclaimed`, or `do not claim` in public project copy.
- Do not append a caveat or self-rebuttal to every achievement sentence.
- Do not replace a user-approved project identity with an audit-oriented label without asking.

Run `npm run guard` before build, commit, or deployment.
