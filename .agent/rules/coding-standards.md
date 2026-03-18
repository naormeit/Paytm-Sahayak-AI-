# Sahayak AI Coding Standards

## 1. Type Safety
- **Frontend (TypeScript):** Strict type checking must be enabled (`"strict": true` in `tsconfig.json`). Avoid `any`; use generics and explicit interfaces.
- **Backend (Python):** Use type hints for all function arguments and return types. Use Pydantic models for data validation.

## 2. Paytm-Themed UI Guidelines
- **Brand Colors:** Use the primary Paytm Brand Blue (`#00BAF2`) for primary actions, buttons, and active states. Always define this in `tailwind.config.ts`.
- **Components:** Create reusable UI components. Follow clean and minimalistic design language. Make sure hover states and disabled states are properly styled.
- **Icons:** Use `lucide-react` for consistent, clean SVG icons.

## 3. General Architecture
- Implement modular design within the monorepo.
- Separate business logic (inside `packages/ai-engine`) from API routing and serialization (inside `apps/server`).
- Let `apps/web` communicate only with `apps/server`, which acts as an entry point for `ai-engine` capabilities.
