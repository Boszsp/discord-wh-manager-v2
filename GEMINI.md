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

* **Framework:** **SvelteKit** with **Svelte 5**
* **Frontend:**
    * **UI Components:** **shadcn-svelte**. The source code for these components is located in `src/lib/components/ui/`. This is not a typical library; we have full control over the code. Refer to the official documentation at `https://shadcn-svelte.com/docs` for usage and conventions.
    * **Styling:** **Tailwind CSS v4** with the Tailwind Variants plugin
    * **Icons:** **Lucide Svelte**
* **Backend & Data Management:**
    * **Data Store:** **Firebase Firestore** is used for all CRUD operations.
    * **Architecture:** The application is a **static site**. All interactions with Firebase are done on the **client-side**.
    * **Server Logic:** SvelteKit's server-side features (`+page.server.ts`, `+server.ts`) are **not used**, ensuring the final output is a purely static application that can be deployed to any static hosting provider.
* **Build & Tooling:**
    * **Bundler:** **Vite**
    * **Language:** **TypeScript**
    * **Package Manager:** **pnpm**
    * **Linting & Formatting:** **ESLint** and **Prettier**


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

## 3. Additional Docs You Must Read
- https://svelte.dev/docs/kit/introduction
- https://svelte.dev/docs/svelte/overview
- https://shadcn-svelte.com/docs #For component in /ui
- https://tailwindcss.com/

## 4. Rule 
- you must understand project structure before do anything
- you must understand old code/codebase before do anything
- you must how to use tech stack used in this project (may search or read the docs)
- if have anything may improve your understand you can update data into GEMINI.md
- in 1 file should have morethan 300 lines