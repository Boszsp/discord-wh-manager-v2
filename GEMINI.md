# GEMINI Project Documentation (discord-wh-manager-v2)

This document provides an overview of the project's technology stack, code structure. The architecture is built around a modern SvelteKit frontend, with plans to Discord Webhook Manager Link & Customable template for reuse able content style.

---

## 1. Technology Stack

Our project is built on a modern, fast, and type-safe stack.

* **Framework:** **SvelteKit** with **Svelte 5**
* **Frontend:**
    * **UI Components:** **shadcn-svelte**, custom Svelte components
    * **Styling:** **Tailwind CSS v4** with the Tailwind Variants plugin
    * **Icons:** **Lucide Svelte**
* **Backend & API:**
    * **Server Logic:** Handled within SvelteKit's server-side routes (`+server.ts`) and hooks.
    * **API Communication:** RESTful APIs using native `fetch`.
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
├── package.json                 # (Resistrict to modify,read-only)
└── README.md
```