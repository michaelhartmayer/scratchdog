# Environment Specification

1. NodeJS  
    1.1. Commands  
        1.1.1. npm run dev  
            1.1.1.1. Serve on port 8023  
        1.1.2. npm run test:unit  
            1.1.2.1. Run unit tests  
            1.1.2.2. Measure code coverage  
            1.1.2.3. Generate test report  
            1.1.2.4. Exclude e2e directory  
        1.1.3. npm run test:e2e:headless  
            1.1.3.1. Run end-to-end tests headless  
            1.1.3.2. Generate test report  
        1.1.4. npm run test:e2e:headed  
            1.1.4.1. Run end-to-end tests headed  
            1.1.4.2. Generate test report  
        1.1.5. npm run build  
            1.1.5.1. Build for production  
            1.1.5.2. Minify assets  
            1.1.5.3. Generate production report  
        1.1.6. npm run lint  
            1.1.6.1. Run ESLint and report  
        1.1.7. npm run lint:fix  
            1.1.7.1. Run ESLint and fix  
        1.1.8. npm run format  
            1.1.8.1. Run Prettier and report  
        1.1.9. npm run format:fix  
            1.1.9.1. Run Prettier and fix  
        1.1.10. npm run spec  
            1.1.10.1. Run SPEC.md generator  
2. ESLint  
    2.1. Rules  
        2.1.1. Specific Rules  
            2.1.1.1. One react component per file  
            2.1.1.2. All components are organized  
                2.1.1.2.1. UI components must be in /src/components  
                2.1.1.2.2. Providers must be in /src/providers  
                2.1.1.2.3. All components must be in a folder of the same name and exported by an index.ts file  
            2.1.1.3. Hooks must be in /src/hooks  
                2.1.1.3.1. All hooks must be in a folder of the same name and exported by an index.ts file  
                2.1.1.3.2. All hooks must be named with the prefix "use"  
            2.1.1.4. Utilities must be in /src/utils  
                2.1.1.4.1. All utilities must be in a folder of the same name and exported by an index.ts file  
            2.1.1.5. Components are not allowed to use html buttons  
                2.1.1.5.1. The only folder that buttons are allowed in are in /src/components/DesignSystem and child folders  
            2.1.1.6 Components are not allowed to use html h1-h6 tags  
                2.1.1.6.1. The only folder that h1-h6 tags are allowed in are in /src/components/DesignSystem and child folders  
            2.1.1.7 Components are not allowed to use html p tags  
                2.1.1.7.1. The only folder that p tags are allowed in are in /src/components/DesignSystem and child folders  
            2.1.1.8 Components are not allowed to use useEffect.  
                2.1.1.8.1. useEffect may only be used in a hook  
                2.1.1.8.2. useEffect may not be used in a component  
            2.1.1.9 Direct access to `window.__*__` pattern is not allowed outside of `/src/utils/env-utils`  
            2.1.1.10 CommonJS syntax and extensions are not allowed in `.eslint-rules/`  
                2.1.1.10.1. require() and module.exports are not allowed  
                2.1.1.10.2. .cjs and .mjs file extensions are not allowed  
            2.1.1.11 Tagged Requirements  
                2.1.1.11.1. /** @mustTestDrMarioGamestate */  
                    2.1.1.11.1.1. This tag must be present before `test()` functions in E2E tests that require game state verification.  
                    2.1.1.11.1.2. When this tag is present, the test must use `getE2EState()` to verify the internal game state. Direct access to `__DRMARIO_STATE__` is not allowed.  
        2.1.2. All custom ESLint rules must be unit tested  
            2.1.2.1. All custom ESLint rules must be in .eslint-rules/  
            2.1.2.2. Each eslint rule must have its own folder  
            2.1.2.3. Each eslint rule must have its tests written in its respective folder  
            2.1.2.4. ESLint rules must use ESM syntax (import/export), not CommonJS (require/module.exports)  
        2.1.3. ESLint rules may not be disabled  
        2.1.4. ESLint rules may not be ignored  
        2.1.5. ESLint Rule Scope  
            2.1.5.1. ESLint rules must test everything in /src  
            2.1.5.2. ESLint rules must test all eslint rules  
                2.1.5.2.1. All rules located in .eslint-rules/ must be tested  
            2.1.5.3. ESLint rules must test all unit tests  
                2.1.5.3.1. All unit tests located in /unit/ must be tested  
            2.1.5.4. ESLint rules must test all e2e tests  
                2.1.5.4.1. All e2e tests located in /e2e/ must be tested  
        2.1.6. No ESLint rule may warn  
            2.1.6.1. ESLint rules must not use `warn` level  
            2.1.6.2. ESLint rules must only use `error` level  
        2.1.7. ESLint must be configured to perform type-aware linting.  
    2.2. Type-Aware Linting  
        2.2.1. ESLint must utilize the project's TypeScript configuration to validate types and property access.  
        2.2.2. All TypeScript diagnostic errors (e.g. property not found on type) must be reported as ESLint errors during `npm run lint`.  

3. Vite  
4. PixiJS  
    4.1. @pixi/sound for Audio Management  
5. React  
6. Vitest  
7. Playwright  
    7.1. E2E Test State Exposure  
        7.1.1. Canvas-based games must expose internal state for E2E testing  
        7.1.2. State exposure uses the `VITE_E2E_MODE` environment variable  
            7.1.2.1. State is only exposed when `import.meta.env.DEV` is true  
            7.1.2.2. State is only exposed when `import.meta.env.VITE_E2E_MODE` is true  
        7.1.3. Exposed state uses double-underscore naming convention (e.g. `__GAME_STATE__`)  
        7.1.4. E2E test commands must set `VITE_E2E_MODE=true`  
            7.1.4.1. `npm run test:e2e:headless` must set `VITE_E2E_MODE=true`  
            7.1.4.2. `npm run test:e2e:headed` must set `VITE_E2E_MODE=true`  
        7.1.5. Production builds must NOT include state exposure code  
        7.1.6. State exposure must use helper functions from `/src/utils/env-utils`  
            7.1.6.1. `isE2EMode()` returns true when running in E2E test mode  
            7.1.6.2. `exposeE2EState(key: string, state: unknown)` exposes state to window  
            7.1.6.3. `getE2EState(key: string)` retrieves exposed state (for use in Playwright)  

8. TypeScript  
    8.1. Project Structure  
        8.1.1. Every TypeScript file in the repository must be covered by a `tsconfig.json`.  
        8.1.2. The `/src` directory must have its own configuration (e.g. `tsconfig.app.json`).  
        8.1.3. The `/e2e` directory must be included in a TypeScript project and share global type definitions (like `getE2EState`).  
    8.2. Strictness  
        8.2.1. Strict mode must be enabled (`"strict": true`).  
        8.2.2. No implicit any is allowed.  
9. Prettier  
    9.1. Prettier is used for code formatting  
    9.2. Prettier is configured to use the React configuration  
    9.3. Prettier is configured to use the TypeScript configuration  
    9.4. Prettier is configured to use the Vite configuration  
    9.5. Custom prettier rules  
        9.5.1. spec.md files properly indent specifications by sub-section  
            9.5.1.1. indent using 4 spaces  
            9.5.1.2. do not use tabs  
            9.5.1.3. do not use extra spaces  
            9.5.1.4. do not use extra newlines  
            9.5.1.5. use two spaces at the end of each line for soft breaks  
10. Husky  
    10.1. Pre-commit hooks  
        10.1.1. Run ESLint and Fix  
        10.1.2. Run Prettier and Fix  
        10.1.3. Scripts  
            10.1.3.1. Run the [SPEC.md](Environment Specification.11) generator  
11. SPEC.md Generator  
    11.1. Dynamically reads all specification markdown files located in the specifications folder and creates a single top-level SPEC.md file  
        11.1.1. The SPEC.md file is created in the root of the project  
        11.1.2. The SPEC.md file is designed to look really good in a markdown viewer (specifically GitHub)  
        11.1.3. HTML is used to create a table of contents  
12. Network  
    12.1. Allowed Hosts  
        12.1.1. add "scratchdog.jellytests.com" to `server.allowedHosts` in vite.config.js.  

