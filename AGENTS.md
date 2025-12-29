# Agent Guidelines

You must adhere to the following rules and workflows when working in this repository.  

## 1. Specification-First Development
- **Source of Truth**: The specifications in the `specifications/` directory (aggregated in `SPEC.md`) are the absolute source of truth.  
- **Ambiguity**: If a requirement is ambiguous or missing, you **MUST** request a specification update before proceeding. Do not make unauthorized decisions.  
- **Spec Generator**: After modifying any file in `specifications/`, you must run `npm run spec` to update `SPEC.md`.  

## 2. Strict Environment Rules (from `specifications/env.spec.md`)
You must strictly follow the architectural and linting constraints defined in `specifications/env.spec.md`.  

### Architecture & Organization
- **One Component Per File**: Each file should contain only one React component.  
- **Directory Structure**:  
- **UI Components**: Must be in `/src/components` (or subdirectories).  
- **Providers**: Must be in `/src/providers`.  
- **Hooks**: Must be in `/src/hooks` and named with `use` prefix.  
- **Utilities**: Must be in `/src/utils`.  
- **Encapsulation**: All components, hooks, and utilities must be in their own folder and exported via an `index.ts`.  

### Coding Standards
- **No `useEffect` in Components**: `useEffect` is strictly forbidden in components. It must be encapsulated within custom hooks.  
- **Design System Usage**:  
- **No raw `<button>` tags**: Use the designated Design System Button component.  
- **No raw `<h1>`-`<h6>` tags**: Use the Design System Text component.  
- **No raw `<p>` tags**: Use the Design System Text component.  
- *Exception*: These raw tags are only allowed within `/src/components/DesignSystem`.  
- **E2E State**:  
- Do not access `window.__*__` directly. Use `src/utils/env-utils.ts` helpers (`exposeE2EState`, `getE2EState`).  
- State is only exposed when `VITE_E2E_MODE=true` and `import.meta.env.DEV` is true.  

### Linting & Formatting
- **Zero Tolerance**: ESLint (`npm run lint`) and Prettier (`npm run format`) must pass at all times.  
- **Type-Aware Linting**: ESLint is configured to catch TypeScript errors.  
- **No Warnings**: All ESLint rules are set to `error`.  

## 3. Testing Workflow
1. **Update Specification**: Define the behavior in `specifications/*.spec.md`.  
2. **Mock/Stub**: Create necessary files/functions to allow tests to compile.  
3. **Write Tests**:  
- **Unit Tests**: Place in `unit/` mirroring the spec structure.  
- **E2E Tests**: Place in `e2e/` mirroring the spec structure.  
4. **Fail First**: Verify tests fail as expected.  
5. **Implement**: Write the code to pass the tests.  
6. **Verify**: Run `npm run test:unit` or `npm run test:e2e:headless`.  

## 4. Standard Commands
Use the standardized commands defined in `env.spec.md`:  
- `npm run dev`: Start dev server.  
- `npm run test:unit`: Run unit tests.  
- `npm run test:e2e:headless`: Run E2E tests (headless).  
- `npm run lint:fix`: Fix linting errors.  
- `npm run format:fix`: Fix formatting errors.  

