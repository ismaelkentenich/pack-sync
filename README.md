<div align="center">

# 📦 PackSync

### Offline-first package scanning and delivery synchronization for React Native.

A mobile engineering project built with **Expo, React Native and TypeScript**, focused on reliable package scanning, local-first workflows, network-aware synchronization, multi-user data isolation, accessible UI components, and production-oriented mobile architecture.

<br />

![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-Offline_First-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Storybook](https://img.shields.io/badge/Storybook-10-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-29-C21325?style=for-the-badge&logo=jest&logoColor=white)

</div>

---

## 📖 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Engineering Highlights](#-engineering-highlights)
- [📱 Core Features](#-core-features)
- [🧰 Tech Stack](#-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [📂 Project Structure](#-project-structure)
- [📷 Package Scanning](#-package-scanning)
- [🔄 Offline-First Synchronization](#-offline-first-synchronization)
- [🌐 Webhook Integration](#-webhook-integration)
- [🧪 Testing the Webhook](#-testing-the-webhook)
- [🔐 Authentication](#-authentication)
- [💾 Local Persistence](#-local-persistence)
- [🧭 Navigation](#-navigation)
- [🎨 Design System & Component Development](#-design-system--component-development)
- [🌎 Internationalization](#-internationalization)
- [♿ Accessibility](#-accessibility)
- [🧪 Testing Strategy](#-testing-strategy)
- [🧹 Code Quality](#-code-quality)
- [🚀 Getting Started](#-getting-started)
- [🧪 Testing the Webhook](#-testing-the-webhook)
- [📜 Available Scripts](#-available-scripts)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🔒 Security Notes](#-security-notes)
- [👤 Author](#-author)

---

## 🎯 Overview

**PackSync** is a React Native application for scanning, managing, and synchronizing delivery packages.

The project is designed around an **offline-first mobile workflow**.

Packages can be scanned and updated even when the device has no network connection. Data is persisted locally using SQLite and synchronized with a remote HTTP endpoint when connectivity becomes available again.

```text
Scan Package
     │
     ▼
Local SQLite
     │
     ▼
Pending Sync
     │
 ┌───┴────────────┐
 │                │
Offline         Online
 │                │
 ▼                ▼
Keep Local     HTTP Sync
                  │
             ┌────┴────┐
             │         │
          Success    Failure
             │         │
             ▼         ▼
            Sent     Pending
                       │
                       ▼
                   Retry Later
```

PackSync is also an engineering-focused project exploring production-oriented mobile practices such as:

- Offline-first architecture
- Local persistence
- Network recovery
- Application lifecycle handling
- Multi-user data isolation
- Domain-driven boundaries
- File-based navigation
- Accessible component design
- Internationalization
- Component-driven development
- Automated testing
- Pre-commit quality gates

---

## ✨ Engineering Highlights

### 📡 Offline-First by Design

The core package workflow does not depend on an active network connection.

Package data is stored locally first:

```text
User Action
    │
    ▼
Application
    │
    ▼
SQLite
    │
    ▼
UI Updated
    │
    ▼
Remote Sync
```

This allows scanning and package management to continue during unreliable or unavailable connectivity.

---

### 📷 QR Code & Barcode Scanning

Package registration is integrated with **Expo Camera**.

The scanner handles camera permissions and supports package capture using QR codes and compatible barcode formats.

The scanning flow also suppresses repeated detections of the same code within a short interval, avoiding unnecessary repeated processing while the same barcode remains visible to the camera.

---

### 🔄 Network-Aware Synchronization

Pending packages can be reconciled automatically when connectivity becomes available.

Synchronization can be triggered when:

- An authenticated session becomes available while online
- The device reconnects after being offline
- The application returns to the foreground
- A package synchronization is explicitly requested

This provides a more resilient experience for users operating in environments where network availability may change frequently.

---

### 👤 Multi-User Data Isolation

Package persistence is scoped to the authenticated user.

The local SQLite layer isolates package records using the authenticated user identifier, helping prevent one user's package collection from appearing in another user's session.

---

### 🧩 Feature-Oriented Architecture

Application code is organized primarily by feature.

Each major feature can contain its own:

- Domain contracts
- Services
- Stores
- Screens
- Components
- Hooks
- Tests

Infrastructure concerns such as Firebase, SQLite, and webhook communication remain outside the feature UI layer.

---

### 🎨 Component-Driven UI

Reusable primitives and composite components are maintained separately from feature screens.

Examples include:

```text
Primitives
├── Button
├── Input
├── Card
├── Badge
├── ScreenContainer
└── AnimatedCircleBackground

Composites
├── Header
├── ModalWrapper
└── CustomAlert
```

These components can be explored independently using Storybook.

---

### 🌗 Light & Dark Theme Architecture

PackSync includes a token-based theme system with separate light and dark theme definitions.

The UI consumes reusable foundations such as:

- Colors
- Typography
- Spacing
- Radius
- Sizing

This reduces duplicated visual constants and keeps application styling consistent.

---

### 🧪 Automated Testing

The project includes tests across multiple layers rather than focusing only on UI rendering.

Tests cover areas such as:

- Package services
- SQLite repositories
- Synchronization gateways
- Network recovery
- Zustand stores
- Scanner behavior
- UI primitives
- Feature components
- Accessibility properties
- Domain utilities

---

## 📱 Core Features

- 📷 QR code and barcode scanning with Expo Camera
- 💾 Offline-first package persistence with SQLite
- 🔄 Automatic pending-package synchronization
- 📡 Network reconnection recovery
- 📱 Foreground synchronization
- 📦 Package status management
- 👤 Firebase Authentication
- 🔐 Persisted authentication session
- 🧑‍🤝‍🧑 Multi-user package isolation
- 🧭 Expo Router file-based navigation
- 🌗 Light and dark theme architecture
- 🌎 Internationalization with i18next
- ⚡ Virtualized lists with Shopify FlashList
- 🎬 Reanimated-powered visual motion
- ♿ Accessible UI components and labels
- 📚 Storybook component development
- 🧪 Jest + React Native Testing Library
- 🧹 ESLint + Prettier + TypeScript validation
- 🪝 Husky + lint-staged quality gates

---

## 🧰 Tech Stack

### Mobile Core

| Technology            | Purpose                                   |
| --------------------- | ----------------------------------------- |
| **React Native 0.86** | Native mobile application                 |
| **Expo SDK 57**       | React Native framework and native tooling |
| **React 19**          | Component architecture                    |
| **TypeScript 6**      | Static typing and application contracts   |
| **Expo Router**       | File-based navigation                     |

### State & Data

| Technology               | Purpose                       |
| ------------------------ | ----------------------------- |
| **Zustand**              | Application and feature state |
| **Expo SQLite**          | Offline package persistence   |
| **React Native NetInfo** | Connectivity monitoring       |
| **Fetch API**            | Package synchronization       |

### Authentication

| Technology                  | Purpose                      |
| --------------------------- | ---------------------------- |
| **Firebase Authentication** | User authentication          |
| **AsyncStorage**            | Firebase session persistence |

### Native Experience

| Technology                         | Purpose                     |
| ---------------------------------- | --------------------------- |
| **Expo Camera**                    | QR/barcode scanning         |
| **Expo Haptics**                   | Haptic interaction feedback |
| **React Native Reanimated**        | Animations                  |
| **React Native Gesture Handler**   | Gesture infrastructure      |
| **React Native Safe Area Context** | Safe-area handling          |
| **Gorhom Bottom Sheet**            | Bottom-sheet interactions   |

### UI

| Technology              | Purpose                        |
| ----------------------- | ------------------------------ |
| **Lucide React Native** | Iconography                    |
| **Shopify FlashList**   | Performant lists               |
| **i18next**             | Internationalization           |
| **Storybook**           | Isolated component development |

### Testing & Quality

| Technology                       | Purpose                                  |
| -------------------------------- | ---------------------------------------- |
| **Jest**                         | Unit and integration testing             |
| **React Native Testing Library** | User-oriented component testing          |
| **Vitest**                       | Storybook/browser testing infrastructure |
| **Playwright**                   | Browser testing infrastructure           |
| **ESLint**                       | Static analysis                          |
| **Prettier**                     | Formatting                               |
| **Husky**                        | Git hooks                                |
| **lint-staged**                  | Staged-file validation                   |

---

## 🏗️ Architecture

PackSync separates application features from infrastructure concerns.

```text
                              PackSync
                                 │
                     ┌───────────┴───────────┐
                     │                       │
                 Expo Router              Providers
                     │                       │
                     ▼                       ▼
                  Screens          Theme / Auth / Sheets
                     │
                     ▼
                  Features
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
     Screens      Components     Stores
        │                         │
        └────────────┬────────────┘
                     ▼
                  Services
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
       Domain              Infrastructure
       Contracts                 │
                          ┌───────┼────────┐
                          │       │        │
                          ▼       ▼        ▼
                       SQLite  Firebase  Webhook
```

### Domain Layer

Feature contracts describe application behavior independently from infrastructure details.

For example:

```text
PackageService
      │
      ├── PackageRepository
      │        │
      │        └── SQLitePackageRepository
      │
      └── PackageSyncGateway
               │
               └── WebhookPackageSyncGateway
```

This allows persistence and synchronization implementations to evolve without coupling them directly to screens.

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── (auth)/
│   ├── (app)/
│   │   └── (tabs)/
│   └── _layout.tsx
│
├── components/
│   ├── primitives/
│   └── composites/
│
├── contexts/
│
├── features/
│   ├── auth/
│   ├── home/
│   ├── menu/
│   ├── packages/
│   └── scanner/
│
├── hooks/
│
├── i18n/
│   └── locales/
│
├── infrastructure/
│   ├── database/
│   ├── firebase/
│   └── webhook/
│
├── store/
├── test/
├── theme/
└── utils/
```

### `src/app`

Contains the **Expo Router** route tree and root providers.

The route layer remains intentionally thin and delegates rendering to feature screens.

---

### `src/features`

Contains application behavior grouped by feature.

```text
features/
├── auth
├── home
├── menu
├── packages
└── scanner
```

The package feature is currently the richest domain and contains:

```text
packages/
├── components/
├── domain/
├── hooks/
├── screens/
├── services/
├── store/
└── utils/
```

---

### `src/components`

Contains reusable components shared across features.

```text
components/
├── primitives/
└── composites/
```

Primitives represent lower-level design-system elements, while composites combine multiple primitives into reusable interaction patterns.

---

### `src/infrastructure`

Contains integrations with external or platform-specific systems:

```text
infrastructure/
├── database/
├── firebase/
└── webhook/
```

This keeps infrastructure details outside feature presentation code.

---

### `src/theme`

Contains design foundations and theme definitions:

```text
theme/
├── foundations/
├── themes/
├── ThemeProvider.tsx
├── responsiveScale.ts
└── useAppTheme.ts
```

---

### `src/test`

Provides reusable test factories, mocks, and helpers.

This prevents individual tests from repeatedly recreating common package, auth, network, and repository scenarios.

---

## 📷 Package Scanning

Package scanning is implemented with **Expo Camera**.

The primary flow is:

```text
User opens Scan
       │
       ▼
Camera Permission
       │
  ┌────┴─────┐
  │          │
Denied     Granted
  │          │
  ▼          ▼
Settings   Camera
             │
             ▼
       Barcode Detected
             │
             ▼
       Duplicate Guard
             │
             ▼
       Persist Package
             │
             ▼
        Sync if Online
```

For realistic testing, a physical Android or iOS device is recommended.

The scanner is especially useful for testing mobile-specific behavior such as:

- Runtime permissions
- Camera lifecycle
- Rapid repeated detection
- Haptic feedback
- Offline package capture
- Network recovery

---

## 🔄 Offline-First Synchronization

PackSync treats local persistence as part of the main application workflow rather than as an optional cache.

A package contains both its business status and synchronization state.

Synchronization states currently include:

```text
pending
sent
```

When a package is scanned or updated, it becomes pending:

```text
Package Changed
      │
      ▼
Saved in SQLite
      │
      ▼
deliveryStatus = pending
      │
      ▼
sent_at = null
```

If synchronization succeeds:

```text
HTTP Success
     │
     ▼
deliveryStatus = sent
     │
     ▼
sent_at = current timestamp
```

If synchronization fails:

```text
HTTP / Network Failure
        │
        ▼
Keep Package Pending
        │
        ▼
Retry Later
```

---

### Automatic Reconciliation

The `useNetworkSync` hook coordinates synchronization around mobile lifecycle and connectivity changes.

Pending packages can be reconciled when:

```text
Authenticated Startup
        │
        ├── Online ───────► Sync Pending
        │
        ▼
    App Running
        │
   ┌────┴───────────┐
   │                │
Reconnect       Foreground
   │                │
   └───────┬────────┘
           ▼
      Sync Pending
```

Synchronization is scoped to the authenticated user.

---

## 🌐 Webhook Integration

Package synchronization is implemented by:

```text
src/infrastructure/webhook/WebhookPackageSyncGateway.ts
```

The gateway performs:

```http
POST <PACKAGE_SYNC_URL>
Content-Type: application/json
```

### Synchronization Endpoint: `PACKAGE_SYNC_URL`

The synchronization configuration variable is named:

```env
PACKAGE_SYNC_URL=
```

PackSync sends an HTTP `POST` using `fetch` to push package synchronization updates.

Configure an HTTP or HTTPS webhook endpoint:

```env
PACKAGE_SYNC_URL=https://api.example.com/package-sync
```

Do not configure `ws://` or `wss://` protocols.

---

## 🧪 Testing the Webhook

For local development, you do **not** need to use a specific webhook URL.

PackSync only requires an HTTP endpoint capable of receiving the `POST` requests sent by the synchronization gateway.

One convenient option for development is the **DevToolLab Webhook Receiver & Inspector**:

https://devtoollab.com/tools/webhook-receiver

DevToolLab can generate a temporary webhook URL that you can configure in PackSync to inspect synchronization requests without creating a backend.

After generating an endpoint, configure it in your `.env` file:

```env
PACKAGE_SYNC_URL=https://backend.devtoollab.com/webhook/<generated-id>
```

> `<generated-id>` is only a placeholder. Always use the URL generated for your own webhook session.

### Testing with DevToolLab

1. Open the DevToolLab Webhook Receiver & Inspector.
2. Generate a new webhook endpoint.
3. Copy the generated webhook URL.
4. Add the URL to the PackSync `.env` file:

```env
PACKAGE_SYNC_URL=https://backend.devtoollab.com/webhook/<generated-id>
```

5. Restart Expo so the environment configuration is reloaded:

```bash
yarn start --clear
```

6. Sign in to PackSync.
7. Scan a new package or update an existing package.
8. Allow the synchronization process to run.
9. Return to DevToolLab and inspect the HTTP request received from PackSync.

### What to Validate

The webhook inspector can be used to verify:

- Whether PackSync actually sent the synchronization request
- The HTTP method used by the request
- Request headers
- The JSON payload
- Package codes and status values
- Synchronization timestamps
- Repeated synchronization attempts
- Behavior after reconnecting to the network

### Testing the Offline-First Flow

The webhook inspector is especially useful for validating PackSync's offline-first behavior.

A complete test scenario is:

```text
Sign In
   │
   ▼
Disable Network
   │
   ▼
Scan / Update Package
   │
   ▼
Package Stored Locally
   │
   ▼
Sync Status: Pending
   │
   ▼
Restore Network
   │
   ▼
Network Listener Detects Reconnection
   │
   ▼
Pending Packages Synchronized
   │
   ▼
HTTP POST
   │
   ▼
DevToolLab Receives Request
```

To test this flow:

1. Sign in while the device is online.
2. Disable Wi-Fi and mobile data.
3. Scan a package or update an existing package.
4. Confirm that the package remains available locally.
5. Restore the network connection.
6. Wait for PackSync to detect the reconnection and process pending synchronization.
7. Open DevToolLab.
8. Confirm that the expected `POST` request was received.
9. Inspect the payload and verify the package information.

This scenario validates one of PackSync's main architectural goals:

> **Local operations should remain available without connectivity, while synchronization resumes when the network becomes available again.**

### Example Development Flow

```text
┌──────────────────────┐
│       PackSync       │
│                      │
│ Scan / Update Package│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│        SQLite        │
│                      │
│   Local Persistence  │
└──────────┬───────────┘
           │
           │ Network available
           ▼
┌──────────────────────┐
│  Synchronization     │
│      Gateway         │
└──────────┬───────────┘
           │
           │ HTTP POST
           ▼
┌──────────────────────┐
│     DevToolLab       │
│                      │
│  Webhook Inspector   │
└──────────────────────┘
```

DevToolLab is only a development and debugging tool. PackSync is not coupled to it and can use any compatible HTTP endpoint.

> Do not commit generated webhook URLs to the repository. Treat them as temporary environment-specific configuration.

---

### Request Payload

A synchronization request follows this structure:

```json
{
  "code": "PKG-001",
  "clientName": "John Doe",
  "status": "delivered",
  "deliveryStatus": "pending",
  "scanned_at": "2026-08-28T14:30:00.000Z"
}
```

`clientName` is only included when applicable to the package status.

---

## 🔐 Authentication

PackSync uses **Firebase Authentication**.

Authentication configuration is loaded from environment variables:

```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

The application restores the persisted Firebase session during startup before enabling authenticated application routes.

Conceptually:

```text
Application Startup
        │
        ▼
Restore Firebase Session
        │
   ┌────┴─────┐
   │          │
Guest    Authenticated
   │          │
   ▼          ▼
 Auth       App
 Routes    Routes
```

Expo Router protected routes are used to separate authenticated and unauthenticated navigation.

---

## 💾 Local Persistence

PackSync uses **Expo SQLite** as its local persistence layer.

The database stores package information such as:

- Package code
- Package status
- Synchronization status
- Receiver information
- Scan timestamps
- Synchronization timestamps
- Authenticated-user ownership

The database layer supports:

```text
Create
Read
Update
Batch Update
Pending Queries
User Isolation
Synchronization State
Migrations
```

This enables the package workflow to continue even when the backend is temporarily unreachable.

---

## 🧭 Navigation

Navigation is implemented with **Expo Router**.

The main route structure is:

```text
src/app/
├── _layout.tsx
│
├── (auth)/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── sign-up.tsx
│
└── (app)/
    ├── _layout.tsx
    │
    └── (tabs)/
        ├── _layout.tsx
        ├── index.tsx
        ├── scanner.tsx
        ├── menu.tsx
        │
        └── packages/
            ├── _layout.tsx
            ├── index.tsx
            └── [code].tsx
```

The authenticated tab navigation contains:

```text
Home
Scan
Packages
Menu
```

Feature screens remain separate from route files, keeping the routing layer small.

---

## 🎨 Design System & Component Development

PackSync includes a reusable component layer and a token-based theme architecture.

### Design Foundations

Shared foundations include:

```text
Colors
Typography
Spacing
Sizing
Radius
Themes
```

### Storybook

Reusable UI components can be developed independently using Storybook.

Start the web Storybook:

```bash
yarn storybook:web
```

Open:

```text
http://localhost:6006
```

Run React Native Storybook on iOS:

```bash
yarn storybook:ios
```

Run on Android:

```bash
yarn storybook:android
```

Regenerate React Native stories:

```bash
yarn storybook-generate
```

Build the web Storybook:

```bash
yarn build-storybook
```

Storybook is useful for:

- Visual component development
- Isolated interaction states
- Theme validation
- Accessibility inspection
- Component documentation
- UI regression prevention

---

## 🌎 Internationalization

PackSync uses:

```text
i18next
+
react-i18next
+
expo-localization
```

Current locale resources include:

- 🇧🇷 Portuguese — `pt-BR`
- 🇺🇸 English — `en-US`

Internationalization covers interface areas such as:

- Navigation
- Authentication
- Scanner
- Package management
- Alerts
- Accessible labels
- Error feedback

---

## ♿ Accessibility

Accessibility is considered in reusable components and feature interactions.

Current examples include:

- Accessibility roles for interactive elements
- Localized accessibility labels
- Modal accessibility semantics
- Minimum touch targets
- Camera permission feedback
- Reduced-motion support
- Decorative animated backgrounds removed from the accessibility tree
- Accessibility-focused component tests
- Storybook accessibility tooling

The animated background uses the user's reduced-motion preference to avoid unnecessary continuous motion when reduced motion is requested.

---

## 🧪 Testing Strategy

PackSync uses **Jest** and **React Native Testing Library** for application tests.

Testing spans several layers:

```text
                  Tests
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
   Components     Stores       Services
       │            │            │
       ▼            ▼            ▼
 Interaction      State        Domain
 Accessibility   Behavior      Logic
       │
       └────────────┬────────────┘
                    ▼
              Infrastructure
                    │
           ┌────────┴────────┐
           ▼                 ▼
         SQLite           Webhook
```

### Covered Areas

The repository includes tests for areas such as:

- Authentication state
- Package state
- Package services
- SQLite repository behavior
- Multi-user persistence
- Webhook synchronization
- Network synchronization
- Scanner behavior
- UI primitives
- Feature components
- Utility functions
- Accessibility properties

Run all tests:

```bash
yarn test
```

Watch mode:

```bash
yarn test:watch
```

Generate coverage:

```bash
yarn test:coverage
```

Run tests related to changed files:

```bash
yarn test:related
```

---

## 🧹 Code Quality

PackSync includes automated development tooling to keep the codebase consistent.

```text
                  Source Code
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
      ESLint        Prettier      TypeScript
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                     Jest
                       │
                       ▼
                Git Quality Gate
```

### ESLint

```bash
yarn lint
```

Automatically fix supported issues:

```bash
yarn lint:fix
```

### TypeScript

```bash
yarn typecheck
```

### Formatting

```bash
yarn format
```

Check formatting without modifying files:

```bash
yarn format:check
```

### Complete Validation

```bash
yarn validate
```

Runs:

```text
Prettier
   ↓
ESLint
   ↓
TypeScript
   ↓
Jest
```

### Git Hooks

Husky and lint-staged validate staged changes before commits.

This helps prevent formatting, linting, typing, and test regressions from entering the repository.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- **Node.js 20+**
- **Yarn 1.22.x**
- **Git**
- **Expo development environment**
- **Xcode** for iOS development
- **Android Studio** for Android development
- **CocoaPods** for native iOS dependencies
- A configured **Firebase project**

A physical device is recommended for camera testing.

---

### 1. Clone the Repository

```bash
git clone https://github.com/ismaelkentenich/pack-sync.git
cd pack-sync
```

---

### 2. Install Dependencies

PackSync uses Yarn.

```bash
yarn install
```

---

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PACKAGE_SYNC_URL=https://your-webhook-endpoint.example/webhook/<id>

FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

Replace the placeholders with your own Firebase project configuration and synchronization endpoint.

---

### 4. Start Expo

```bash
yarn start
```

---

### 5. Run iOS

```bash
yarn ios
```

---

### 6. Run Android

```bash
yarn android
```

---

### Web

```bash
yarn web
```

---

### Clear Metro Cache

If environment variables or native configuration changed:

```bash
yarn start --clear
```

---

## 🧪 Testing the Webhook

PackSync does not require a specific webhook provider.

Any reachable HTTP endpoint that accepts the synchronization `POST` request can be used.

For development, one convenient option is:

**DevToolLab Webhook Receiver & Inspector**

```text
https://devtoollab.com/tools/webhook-receiver
```

It generates a temporary endpoint that can be used to inspect requests sent by PackSync.

Example:

```env
PACKAGE_SYNC_URL=https://backend.devtoollab.com/webhook/<generated-id>
```

> Use your own generated endpoint. Do not commit temporary webhook IDs to the repository.

### Testing Flow

```text
DevToolLab
    │
    ▼
Generate Endpoint
    │
    ▼
Copy URL
    │
    ▼
Configure .env
    │
    ▼
Restart Expo
    │
    ▼
Scan / Update Package
    │
    ▼
PackSync Sends POST
    │
    ▼
Inspect Request
```

You can inspect:

- HTTP method
- Request headers
- JSON payload
- Package code
- Package status
- Timestamps
- Repeated synchronization attempts

---

### Test the Offline Flow

1. Start PackSync while online.
2. Authenticate.
3. Disable the device network.
4. Scan or update a package.
5. Confirm that the package remains available locally.
6. Restore connectivity.
7. Allow PackSync to reconcile pending packages.
8. Check the webhook receiver for the synchronization request.

This demonstrates the project's main offline-first workflow.

---

## 📜 Available Scripts

| Command                   | Description                          |
| ------------------------- | ------------------------------------ |
| `yarn start`              | Start Expo                           |
| `yarn ios`                | Run the iOS development build        |
| `yarn android`            | Run the Android development build    |
| `yarn web`                | Run Expo Web                         |
| `yarn prebuild`           | Generate native projects             |
| `yarn lint`               | Run ESLint                           |
| `yarn lint:fix`           | Fix supported ESLint issues          |
| `yarn typecheck`          | Run TypeScript checks                |
| `yarn format`             | Format the codebase                  |
| `yarn format:check`       | Validate formatting                  |
| `yarn test`               | Run Jest                             |
| `yarn test:watch`         | Run Jest in watch mode               |
| `yarn test:coverage`      | Generate test coverage               |
| `yarn test:related`       | Run tests related to changed files   |
| `yarn validate`           | Run the complete validation pipeline |
| `yarn validate:commit`    | Run commit validation                |
| `yarn storybook:web`      | Start Storybook for web              |
| `yarn storybook:ios`      | Run Storybook on iOS                 |
| `yarn storybook:android`  | Run Storybook on Android             |
| `yarn storybook-generate` | Regenerate React Native stories      |
| `yarn build-storybook`    | Build Storybook                      |

---

## 🛠️ Troubleshooting

### Environment Variables Are Not Updated

Restart Metro:

```bash
yarn start --clear
```

For native development builds, rebuilding the application may also be required.

---

### Packages Are Not Synchronizing

Check that:

- The device has network connectivity
- `PACKAGE_SYNC_URL` exists in `.env`
- The endpoint accepts HTTP `POST` requests
- The endpoint is reachable from the device
- The authenticated session is valid
- The package synchronization state is `pending`

Check Metro logs for:

```text
[PackageSync]
```

---

### Webhook Returns an HTTP Error

Webhook HTTP failures are logged with:

```text
[PackageSync][Webhook] request:http-error
```

---

### Network Request Fails

Network-level failures use:

```text
[PackageSync][Webhook] request:network-error
```

The package remains local and pending for a future synchronization attempt.

---

### Scanner Does Not Work

Check:

- Camera permission is granted
- The device has a usable camera
- The barcode format is supported by Expo Camera
- The application is running in an environment with camera support

A physical device provides the most realistic scanner testing environment.

---

### Native Build Problems

Because PackSync uses native Expo modules, a development build is recommended for complete testing.

Generate native projects when necessary:

```bash
yarn prebuild
```

Then run:

```bash
yarn ios
```

or:

```bash
yarn android
```

Avoid unnecessary prebuilds if native files contain manual changes that are not represented in Expo configuration.

---

## 🔒 Security Notes

Do not commit production secrets, credentials, private keys, or environment-specific configuration.

The project ignores `.env` files from version control.

```text
.env
*.env
.env.*
```

Keep in mind that mobile client configuration should never be treated as a secure secret merely because it comes from an environment variable.

Anything required by the mobile application at runtime can potentially be inspected from a distributed application bundle.

Firebase client configuration is normally shipped with client applications. Access control must still be enforced through authentication and correctly configured backend security rules.

Production webhook endpoints should also be treated as environment-specific configuration.

Temporary webhook URLs generated through testing tools should never be committed to the repository.

---

## 🧠 Engineering Highlights

PackSync demonstrates several mobile engineering concepts in a single project:

- **React Native 0.86 + React 19**
- **Expo SDK 57**
- **TypeScript-first architecture**
- **Expo Router file-based navigation**
- **Offline-first application design**
- **SQLite local persistence**
- **Network-aware synchronization**
- **Foreground reconciliation**
- **Package synchronization state**
- **Feature-oriented architecture**
- **Repository pattern**
- **Gateway abstraction**
- **Service layer**
- **Zustand state management**
- **Multi-user package isolation**
- **Firebase Authentication**
- **QR and barcode scanning**
- **Camera runtime permissions**
- **Haptic feedback**
- **Shopify FlashList**
- **Design-system primitives**
- **Light and dark theme architecture**
- **Reduced-motion support**
- **Internationalization**
- **Accessible interaction semantics**
- **Bottom-sheet interactions**
- **Storybook-driven UI development**
- **Jest and Testing Library**
- **SQLite infrastructure testing**
- **Network synchronization testing**
- **ESLint + Prettier + TypeScript**
- **Husky pre-commit validation**

---

## 📦 Main Dependencies

```json
{
  "expo": "^57.0.9",
  "react": "19.2.3",
  "react-native": "0.86.3",
  "expo-router": "~57.0.17",
  "expo-camera": "~57.0.4",
  "expo-sqlite": "~57.0.1",
  "firebase": "^12.5.0",
  "zustand": "^5.0.8",
  "@shopify/flash-list": "2.0.2",
  "@react-native-community/netinfo": "12.0.1",
  "@gorhom/bottom-sheet": "^5.2.6",
  "react-native-reanimated": "4.5.1",
  "i18next": "^26.4.0",
  "storybook": "10.5.10",
  "jest": "~29.7.0"
}
```

---

## 👤 Author

**Ismael Andrade**

GitHub: `@ismaelkentenich`

---

<div align="center">

## 📦 PackSync

**Scan locally. Sync reliably.**

Built with **Expo • React Native • TypeScript**

</div>
