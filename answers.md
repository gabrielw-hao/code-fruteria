## 1. How much time did you spend on the engineering task?

8-12hours engineering hours

feature

- upgraded to react 18.2
- upgraded dependencies antd 5.27.3
- updated component usage (antd, ag-grid)
- add styled-components
- login with nodejs express jwt auth
- enhance grid layout selection
- pagination
- user profile details
- refresh light and dark themes
- add unit test for panels

fix:

- panel resizing
- panel drag-and-drop
- fruit selection dropdown options
- theme switching
- z-index issue
- antd message toast notification

refactor:

- context ThemeProvider
- readability panels css style to use styled-components
- reusable shared colour constant
- optimize useMemo useCallback
- add .gitignore to exclude node_modules and package-lock.json
- prettier singleQuote

## 2. What would you add to your solution if you’d had more time?

- Storybook UI component library
- End-to-end (E2E) testing e.g Cypress
- Skeleton loading and loading state
- i18n keys
- Workflow
- useTransition / backend api pagination for data
- Hot keys for shortcut feature
- User permission control

## 3. What do you think is the most useful feature added to the latest version of JS/TS?

Added a custom grid layout selection

## 4. How would you track down a performance issue in production?

Browser devtools lighthouse, performance, memory leak snapshot, UI too lag after a period of time, rerender issue, setInterval / timeout issue, eventListener, garbage collection
