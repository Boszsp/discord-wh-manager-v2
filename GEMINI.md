# GEMINI Project Documentation (discord-wh-manager-v2)

This document provides an overview of the project's technology stack, code structure. The architecture is built around a modern SvelteKit frontend, with plans to Discord Webhook Manager Link & Customable template for reuse able content style.

This web app is svelte static so it don't have server function

Feature

- Server Data Management: CRUD server data(title) use as webhook's group
- Webhook Data Mangement: CRUD WH link data(url , title)
- Tempalte: resusealbe content body use as webhook fetch(post) content `{content:template}` ,Ex.`# Hello {name}`//you can set `name` to any value

---

## 1. Technology Stack

Our project is built on a modern, fast, and type-safe stack.

- **Framework:** **SvelteKit** with **Svelte 5**
- **Frontend:**
  - **UI Components:** **shadcn-svelte**. The source code for these components is located in `src/lib/components/ui/`. This is not a typical library; we have full control over the code. Refer to the official documentation at `https://shadcn-svelte.com/docs` for usage and conventions.
  - **Styling:** **Tailwind CSS v4** with the Tailwind Variants plugin
  - **Icons:** **Lucide Svelte**
- **Backend & Data Management:**
  - **Data Store:** **Firebase Firestore** is used for all CRUD operations.
  - **Architecture:** The application is a **static site**. All interactions with Firebase are done on the **client-side**.
  - **Server Logic:** SvelteKit's server-side features (`+page.server.ts`, `+server.ts`) are **not used**, ensuring the final output is a purely static application that can be deployed to any static hosting provider.
- **Build & Tooling:**
  - **Bundler:** **Vite**
  - **Language:** **TypeScript**
  - **Package Manager:** **pnpm**
  - **Linting & Formatting:** **ESLint** and **Prettier**

---

## 2. Code Structure

The project follows the standard SvelteKit directory structure, which provides a clear separation between public-facing routes, server-side logic, and reusable library code.

```bash
discord-wh-manager-v2/
├── src/
│   ├── lib/
│   │   ├── assets/              # Static assets like icons
│   │   ├── components/
│   │   │   ├── app/             # Application-specific composite components (layouts, nav)
│   │   │   │   ├── channel/     # Components related to webhook channels
│   │   │   │   │   ├── channel-create-dialog.svelte  # Dialog for creating a new webhook channel
│   │   │   │   │   ├── channel-form-content.svelte   # Form content for webhook message
│   │   │   │   │   ├── channel-form-embed-fields.svelte # Form for embed fields
│   │   │   │   │   ├── channel-form-embeds.svelte    # Form for embeds
│   │   │   │   │   ├── channel-form-profile-thread.svelte # Form for profile and thread
│   │   │   │   │   ├── channel-form.svelte           # Main form for webhook message
│   │   │   │   │   └── channel-preview.svelte        # Preview of the webhook message
│   │   │   │   ├── container/
│   │   │   │   ├── form/
│   │   │   │   ├── layout/
│   │   │   │   ├── nav/
│   │   │   │   ├── preview/
│   │   │   │   └── server/      # Components related to servers (groups of webhooks)
│   │   │   └── ui/              # Generic, reusable UI components (Button, Card, etc.) (Resistrict to modify,read-only)
│   │   ├── hooks/               # SvelteKit hooks
│   │   └── utils.ts             # Utility functions (Resistrict to modify,read-only)
│   │   ├── +layout.svelte       # Root layout component
│   │   └── +page.svelte         # Main page component
│   └── app.html                 # Main HTML template
├── static/                      # Publicly served static files (logo, robots.txt)
├── svelte.config.js
├── vite.config.ts
├── package.json                 # (Resistrict to modify,read-only) (allow update by `pnpm i [name]` only)
└── README.md
```

## 3. Additional Docs You Must Read!!

- https://svelte.dev/docs/kit/introduction
- https://svelte.dev/docs/svelte/overview
- https://shadcn-svelte.com/docs #For component in /ui
- https://tailwindcss.com/
- https://svelte.dev/docs/svelte/v5-migration-guide

## 4. Rule

- respect old code , code base , tech stack
- check code base provide and write new code base on codebase style
- you must understand project structure before do anything
- you must understand old code/codebase before do anything
- you must how to use tech stack used in this project (may search or read the docs)
- if have anything may improve your understand you can update data into GEMINI.md
- in 1 file should have morethan 200 lines
- in svelte no `on:click` or other event just write only `onclick`

## 5. MCP Server

- https://mcp.svelte.dev/mcp

## 6. My Directives

Based on the project documentation, here are my operating instructions to ensure I perform effectively.

### Core Principles

- **Respect Existing Code:** I must adhere to the existing codebase, style, and technology stack.
- **Understand First:** Before making any changes, I must thoroughly understand the project structure and the existing code.

### Knowledge & Tools

- **Tech Stack:** I will work within the defined technology stack: SvelteKit, Svelte 5, shadcn-svelte, Tailwind CSS, and Firebase.
- **Consult Documentation:** I must use the provided links to the official documentation for Svelte, SvelteKit, and shadcn-svelte when necessary.
- **Use MCP Server:** I will utilize the MCP server at `https://mcp.svelte.dev/mcp` to help write better Svelte code.
- **Update `GEMINI.md`:** If I discover information that could improve my understanding of the project, I will update this file.

### Specific Coding Rules

- **Svelte Events:** In Svelte components, I must use the `onclick` attribute for events, not `on:click`.
- **File Length:** I will adhere to the guideline that a single file should not have more than 200 lines.

### Typesaurus & Data Layer

- **Use Collection-Bound Functions:** I must use the collection-bound functions provided by Typesaurus (e.g., `db.servers.query()`) instead of the standalone functions (e.g., `query(db.servers, ...)`).
- **Use `Ref` Objects for Mutations:** For `update` and `remove` operations, I must first create a `Ref` object using `db.collection.id()` and pass the `Ref` to the function.
- **Respect Schema Type Definitions:** I must pay close attention to the type definitions in `db.schema.ts`. If a function returns data that includes fields not present in the base Zod schema (like `create_by`), I must ensure the function's return type accurately reflects the shape of the returned object. If the necessary types are not exported from the schema file, I will create local types in the relevant `curdFn` file.
- **Respect File Restrictions:** If instructed not to edit a specific file (e.g., `db.schema.ts`), I must find a solution that works around this constraint, such as defining local types or asking for clarification if I am blocked.
