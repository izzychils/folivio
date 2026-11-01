# folivio

Your experience deserves better presentation.

Folivio turns a person's real background into a CV, a portfolio and the language to
talk about their work. This repository is the **frontend only**. Accounts, workspaces,
documents and published portfolios live in `localStorage`, so the whole product runs
without a server, an API key or a database.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run build
```

The sign-in screen has a **sample account** button. It seeds a complete workspace
(profile, four CVs, a portfolio, letters) so every screen has something real to show.

## Stack

Next.js 16 App Router, React 19, Tailwind CSS 4, `lucide-react` icons, no component
library. Type is Inter, Instrument Serif and JetBrains Mono, loaded through
`next/font`. Everything else is local.

## Routes

| Route | What it is |
| --- | --- |
| `/` | Marketing site: hero document, templates, intelligence layer, FAQ |
| `/auth/sign-in`, `/auth/sign-up` | Local accounts, hashed with Web Crypto |
| `/dashboard` | Overview: readiness, recent documents, next actions |
| `/dashboard/studio` | CV library, create, duplicate, import, export |
| `/studio/[id]` | Full screen editor with live A4 preview and checks |
| `/dashboard/profile` | The career profile every document is built from |
| `/dashboard/portfolio` | Portfolio builder, live public view, publish controls |
| `/dashboard/assistant` | Guided profile builder and interview preparation |
| `/dashboard/match` | Job description matching, gaps and ATS signal |
| `/dashboard/letters` | Cover letters, statements, bios, LinkedIn summaries |
| `/dashboard/settings` | Name, password, theme, export, reset, delete |
| `/print/cv/[id]` | A4 print target, used for Save as PDF |
| `/p/[slug]` | Public portfolio page |

## Data

One namespace, one version, so a future migration has a single place to look:

| Key | Holds |
| --- | --- |
| `folivio.v1.accounts` | local accounts: id, name, email, salt, password hash |
| `folivio.v1.session` | `{ userId, startedAt }` |
| `folivio.v1.workspace.<userId>` | profile, CVs, portfolio, letters, activity |
| `folivio.v1.published` | slug to portfolio snapshot, read by `/p/[slug]` |
| `folivio.v1.assistant.<userId>` | guided builder conversation |
| `folivio.v1.theme` | `light`, `dark` or `system` |

The shapes in [types.ts](src/lib/types.ts) are the contract. [storage.ts](src/lib/storage.ts)
is the only module that reads or writes the browser, and [workspace.tsx](src/lib/workspace.tsx)
is the only module that mutates a workspace.

## The intelligence layer

[intelligence.ts](src/lib/intelligence.ts) is deterministic and runs in the browser:
keyword overlap between a CV and a job description, ATS structure and readability
checks, achievement rewriting, letter drafting, career path and gap analysis, interview
questions. Nothing is sent anywhere and no model is called.

It is written as pure functions over plain data on purpose. Swapping a heuristic for an
LLM call later means changing the body of one function, not the screens.

### The rule the product is built around

Folivio never invents a degree, an employer, a date, a certification or a number. The
assistant asks and records; the rewriter only restructures text the user supplied; the
match view reports what is missing instead of filling it. Copy across the app states
this plainly, and the checks call out a thin section rather than padding it.

## Documents

Six templates live in [sheet.tsx](src/components/cv/sheet.tsx): modern, traditional,
academic, executive, creative and technical. They share one document model, one A4
geometry and one print path, so the preview, the page count and the printed PDF cannot
drift apart. Design tokens (accent, paper, ink, type scale) are in
[globals.css](src/app/globals.css); inputs use a borderless field with a focus ring
rather than a permanent outline.

## Adding a backend later

The seams are deliberate:

1. Replace the `read*` / `write*` functions in `storage.ts` with API calls that return
   the same shapes. Almost no component changes.
2. Replace `session.tsx` with real auth. It already exposes `user`, `ready`, and a
   result object from every mutation, which is what a real form needs.
3. Move `POST` handlers behind the same function names in `intelligence.ts` if the
   generation moves server side.
4. `/p/[slug]` currently reads the published index from the visitor's own browser. That
   is fine for a demo but means a published portfolio is only visible on the device that
   published it. A backend replaces `readPublishedOne` with a fetch and the page works
   for everyone.

Nothing in the UI assumes a network failure mode it does not have, so no error states
are faked today. `settings` and the auth screens are the first places to wire up once
there is a server.
