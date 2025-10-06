# Copilot Instructions for discord-wh-manager-v2 (GEMINI)

## Purpose
This file provides explicit instructions for GitHub Copilot and other AI coding agents to work effectively in this project. It is based on the GEMINI.md documentation and the codebase structure and conventions.

---

## 1. Technology Stack
- **Framework:** SvelteKit (**Svelte 5**). This project uses Svelte 5, which introduces significant changes from Svelte 4, including Runes for reactivity. Please refer to the [Svelte 5 migration guide](https://svelte.dev/docs/svelte/v5-migration-guide) and write Svelte 5 compatible code. Avoid using Svelte 4 syntax.
- **Frontend:**
  - UI Components: shadcn-svelte (code in `src/lib/components/ui/`, read-only, follow https://shadcn-svelte.com/docs)
  - Styling: Tailwind CSS v4 + Tailwind Variants
  - Icons: Lucide Svelte
- **Backend/Data:**
  - Data Store: Firebase Firestore (CRUD, client-side only)
  - No server-side SvelteKit features (`+page.server.ts`, `+server.ts` are NOT used)
  - Static site only
- **Build/Tooling:**
  - Bundler: Vite
  - Language: TypeScript
  - Package Manager: pnpm
  - Linting/Formatting: ESLint, Prettier

---

## 2. Project Structure
- Follow SvelteKit conventions.
- Key folders:
  - `src/lib/components/app/`: Composite components (layouts, nav, etc.)
  - `src/lib/components/ui/`: Generic, reusable UI components (read-only, do not modify unless explicitly allowed)
  - `src/lib/assets/`: Static assets
  - `src/lib/hooks/`: SvelteKit hooks
  - `src/lib/utils.ts` and `src/lib/utilsFn/`: Utility functions (read-only)
  - `src/routes/`: SvelteKit routes
  - `static/`: Public static files
  - `app.html`: Main HTML template
  - `package.json`: Only update via pnpm

---

## 3. Coding Rules
- **Respect the codebase and tech stack.**
- **Write Svelte 5 compatible code.** Use Runes for reactivity (e.g., `$state`, `$derived`, `$effect`). Do not use Svelte 4's `let`, `export let`, or lifecycle functions like `onMount` unless necessary for specific cases not covered by Runes.
- **Understand the project structure and existing code before making changes.**
- **Follow codebase style and conventions.**
- **Do not use SvelteKit server-side features.**
- **Do not modify files in `src/lib/components/ui/` or `src/lib/utils.ts` unless explicitly allowed.**
- **Do not modify `package.json` directly; use `pnpm i [name]` for updates.**
- **In Svelte, use `onclick` instead of `on:click` or other event bindings.**
- **Files should be more than 200 lines where possible.**
- **If you find anything that improves understanding, update GEMINI.md.**

---

## 4. References
- [Svelte 5 Docs](https://svelte.dev/docs/svelte/overview)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide) (**MUST READ**)
- [SvelteKit Docs](https://svelte.dev/docs/kit/introduction)
- [shadcn-svelte Docs](https://shadcn-svelte.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/)

---

## 5. Example Workflow for Copilot
1. **Read GEMINI.md and these Copilot Instructions before starting.**
2. **Review the Svelte 5 migration guide to understand the new reactivity model.**
3. **Check the codebase for existing patterns and styles, especially the use of Runes.**
4. **Respect read-only files and folders.**
5. **Use SvelteKit client-side features only.**
6. **For UI components, follow shadcn-svelte conventions.**
7. **For CRUD/data, use Firebase Firestore client-side.**
8. **Update documentation if you add new conventions or improve understanding.**
---

## 6. Additional Notes
- This project is designed for static hosting and does not use any server-side logic.
- All CRUD/data operations must be performed on the client using Firebase Firestore.
- UI components in `src/lib/components/ui/` are considered read-only and should not be modified unless explicitly allowed.
- Utility files in `src/lib/utils.ts` and `src/lib/utilsFn/` are also read-only.
- Always follow the style and structure of the existing codebase.

---

## 7. Contact
For questions about conventions or architecture, refer to GEMINI.md or contact the project owner.

---

## 8. MCP Server
- https://mcp.svelte.dev/mcp