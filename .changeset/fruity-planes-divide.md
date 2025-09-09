---
'lisere': patch
---

Build optimizations and improved developer experience

- Optimize bundle size by using `import type` statements for type-only imports from React
- Update TypeScript configuration to ES2022 target for modern JavaScript output
- Add source maps and declaration maps for better debugging experience
- Improve TypeScript strict mode settings with `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`
- Switch to modern `bundler` module resolution for better compatibility with modern build tools
