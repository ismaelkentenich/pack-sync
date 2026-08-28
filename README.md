# 📦 PackSync

PackSync is a React Native application for scanning, managing, and synchronizing delivery packages.

The project is built with **Expo**, **React Native**, and **TypeScript**, with an **offline-first** architecture backed by SQLite. Packages can be scanned and managed locally even without a network connection, then synchronized with a remote HTTP webhook when connectivity is available.

## Features

- QR code and barcode scanning with `expo-camera`
- Offline-first package storage with SQLite
- Automatic synchronization of pending packages
- Synchronization retry after network reconnection
- Synchronization when the app returns to the foreground
- Package status management
- Firebase Authentication
- Persisted authentication session
- Multi-user package isolation
- Expo Router navigation
- Light and dark themes
- Internationalization with i18next
- Storybook for UI component development
- Unit tests with Jest and React Native Testing Library
- Pre-commit validation with Husky and lint-staged

## Tech Stack

| Area                  | Technology                          |
| --------------------- | ----------------------------------- |
| Mobile                | React Native 0.86                   |
| Framework             | Expo SDK 57                         |
| Language              | TypeScript                          |
| Navigation            | Expo Router                         |
| State Management      | Zustand                             |
| Local Database        | Expo SQLite                         |
| Authentication        | Firebase Authentication             |
| Camera / Scanner      | Expo Camera                         |
| Network State         | React Native NetInfo                |
| HTTP Sync             | Fetch API                           |
| Internationalization  | i18next / react-i18next             |
| Lists                 | Shopify FlashList                   |
| UI Icons              | Lucide React Native                 |
| Component Development | Storybook                           |
| Testing               | Jest / React Native Testing Library |
| Code Quality          | ESLint / Prettier / TypeScript      |
| Git Hooks             | Husky / lint-staged                 |

## Requirements

Before running the project, make sure you have:

- Node.js 20+
- Yarn 1.22.x
- Expo development environment
- Xcode for iOS development
- Android Studio for Android development
- CocoaPods for native iOS dependencies
- A Firebase project configured for authentication

For camera and QR/barcode testing, using a physical device is recommended.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ismaelkentenich/pack-sync.git
cd pack-sync
```

### 2. Install dependencies

This project uses Yarn.

```bash
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
WEBSOCKET_URL=https://your-webhook-endpoint.example/webhook/<id>

FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
```

Replace the Firebase placeholders with the values from your Firebase project.

### About `WEBSOCKET_URL`

Despite its current name, `WEBSOCKET_URL` is **not a persistent WebSocket connection**.

The application currently imports this environment variable in `WebhookPackageSyncGateway` and sends an HTTP `POST` request using `fetch`.

Therefore, the configured value must be an **HTTP webhook / synchronization endpoint**:

```env
WEBSOCKET_URL=https://your-webhook-endpoint.example/webhook/<id>
```

The URL is not tied to a specific provider. Any compatible HTTP endpoint that accepts the package synchronization request can be used.

For development and debugging, you can use a webhook receiver/inspector such as **DevToolLab Webhook Receiver & Inspector** to generate a temporary endpoint and inspect the requests sent by PackSync.

The name is kept because it is the environment variable currently expected by the application.

A future refactor could rename it to something clearer, such as:

```env
WEBHOOK_URL=...
```

or:

```env
PACKAGE_SYNC_URL=...
```

Changing the name requires updating the application imports and environment typings as well.

## Running the Application

Start the Expo development server:

```bash
yarn start
```

Run the native iOS development build:

```bash
yarn ios
```

Run the native Android development build:

```bash
yarn android
```

Run the web version:

```bash
yarn web
```

If environment variables were changed, restart Expo. Clearing the Metro cache can also help:

```bash
yarn start --clear
```

## Package Synchronization

PackSync follows an offline-first synchronization model.

A package is stored locally in SQLite and contains both its business status and synchronization state.

The synchronization state is represented by values such as:

- `pending`
- `sent`

When a package changes, its previous synchronization state is invalidated. The package becomes pending again and its previous `sent_at` timestamp is cleared.

Conceptually:

```text
Package scanned or updated
        │
        ▼
Saved locally in SQLite
        │
        ▼
deliveryStatus = pending
        │
        ├── Offline ───────────────► Keep package locally
        │
        └── Online
              │
              ▼
        HTTP POST to webhook
              │
        ┌─────┴─────┐
        │           │
     Success      Failure
        │           │
        ▼           ▼
      sent        pending
        │           │
        ▼           └── Retry later
   sent_at set
```

### Automatic synchronization

The `useNetworkSync` hook automatically attempts to reconcile pending packages for the authenticated user.

Synchronization can happen when:

1. an authenticated session is restored while the device is online;
2. the device reconnects after being offline;
3. the application returns to the foreground and connectivity is available.

Packages remain stored locally while offline.

The synchronization logic also verifies that the authenticated user has not changed before reconciling packages.

## Webhook Request

Package synchronization is implemented by:

```text
src/infrastructure/webhook/WebhookPackageSyncGateway.ts
```

The gateway sends:

```http
POST <WEBSOCKET_URL>
Content-Type: application/json
```

The request body follows this structure:

```json
{
  "code": "PKG-001",
  "clientName": "John Doe",
  "status": "delivered",
  "deliveryStatus": "pending",
  "scanned_at": "2026-08-28T14:30:00.000Z"
}
```

`clientName` is only included for delivered packages and is derived from the receiver name.

The exact status values are defined by the package domain enums.

### Successful synchronization

When the endpoint returns a successful HTTP response (`response.ok === true`), the package is marked as sent locally.

The repository updates:

```text
deliveryStatus = sent
sent_at = <current timestamp>
```

### Failed synchronization

If the endpoint returns a non-success HTTP status or the request fails because of a network error, synchronization is considered unsuccessful.

The package remains pending so it can be retried later.

The gateway also logs HTTP and network failures using the `[PackageSync][Webhook]` prefix.

## Testing the Webhook

For local development, you do **not** need to use a specific webhook URL.

You only need an HTTP endpoint capable of receiving the `POST` requests sent by PackSync.

One option is the **DevToolLab Webhook Receiver & Inspector**:

```text
https://devtoollab.com/tools/webhook-receiver
```

It can generate a unique webhook URL that you can temporarily configure in PackSync.

For example, after generating an endpoint:

```env
WEBSOCKET_URL=https://backend.devtoollab.com/webhook/<generated-id>
```

> `<generated-id>` is only an example placeholder. Use the URL generated for your own webhook session.

### Testing with DevToolLab

1. Open the DevToolLab Webhook Receiver & Inspector.
2. Generate a webhook endpoint.
3. Copy the generated URL.
4. Add it to the PackSync `.env` file:

```env
WEBSOCKET_URL=https://backend.devtoollab.com/webhook/<generated-id>
```

5. Restart Expo so the environment configuration is reloaded:

```bash
yarn start --clear
```

6. Sign in to PackSync.
7. Scan or update a package.
8. Allow the synchronization process to run.
9. Return to the webhook inspector and inspect the HTTP request received from PackSync.

A webhook inspector is useful for validating:

- whether PackSync actually sent the request;
- the HTTP method;
- request headers;
- the JSON payload;
- timestamps;
- package status values;
- repeated synchronization attempts.

### Testing the offline-first flow

You can also use the webhook receiver while testing network recovery:

1. Start the application while online.
2. Disable the device network connection.
3. Scan or update a package.
4. Confirm that the package remains pending locally.
5. Restore the network connection.
6. PackSync should attempt to synchronize pending packages.
7. Check the webhook receiver to verify the new request.

### Using another backend

DevToolLab is only a convenient development/testing tool. It is **not a PackSync requirement**.

You can configure any compatible backend:

```env
WEBSOCKET_URL=https://api.example.com/package-sync
```

For example, the endpoint could be provided by:

- a custom REST API;
- an API Gateway endpoint;
- a serverless function;
- an automation platform;
- a webhook testing service;
- a local backend exposed to the device.

The endpoint must be reachable from the device running PackSync and accept the HTTP request expected by `WebhookPackageSyncGateway`.

> Do not configure a `ws://` or `wss://` endpoint with the current implementation. Despite the `WEBSOCKET_URL` variable name, synchronization currently uses an HTTP request rather than the WebSocket protocol.

## Authentication

Authentication is implemented with Firebase Authentication.

The Firebase configuration is loaded from environment variables:

```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
```

On React Native, authentication persistence uses AsyncStorage.

The application restores the previous session during startup before enabling authenticated routes and package synchronization.

## Local Database

PackSync uses Expo SQLite for local persistence.

The database is initialized when the application starts.

The local persistence layer is responsible for:

- storing scanned packages;
- querying packages by authenticated user;
- tracking package status;
- tracking synchronization state;
- recording scan timestamps;
- recording successful synchronization timestamps;
- invalidating synchronization state after package updates.

This allows the core package workflow to continue while the device is offline.

## Navigation

The application uses **Expo Router** with file-based routing.

The main route structure is:

```text
src/app/
├── _layout.tsx
├── (auth)/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── sign-up.tsx
└── (app)/
    ├── _layout.tsx
    └── (tabs)/
        ├── _layout.tsx
        ├── index.tsx
        ├── scanner.tsx
        ├── menu.tsx
        └── packages/
            ├── _layout.tsx
            ├── index.tsx
            └── [code].tsx
```

Authenticated routes are protected from the root layout.

The main tab navigation contains:

- Home
- Scan
- Packages
- Menu

## Project Architecture

The project is organized primarily by feature, with infrastructure concerns separated from application/domain code.

```text
src/
├── app/                    # Expo Router routes and layouts
├── components/
│   ├── primitives/         # Reusable low-level UI components
│   └── composites/         # Reusable composed UI components
├── contexts/               # Shared React contexts
├── features/
│   ├── auth/               # Authentication feature
│   ├── home/               # Home/dashboard feature
│   ├── menu/               # Menu feature
│   ├── packages/           # Package domain and management
│   └── scanner/            # QR/barcode scanner
├── hooks/                  # Shared hooks
├── i18n/                   # Internationalization
├── infrastructure/
│   ├── database/           # SQLite persistence
│   ├── firebase/           # Firebase infrastructure
│   └── webhook/            # Package sync HTTP gateway
├── store/                  # Shared application state
├── test/                   # Shared test helpers
└── theme/                  # Design tokens and themes
```

The package feature separates domain contracts from infrastructure implementations.

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

This keeps synchronization and persistence details outside the package domain contracts.

## Scanner

The scanner is implemented with `expo-camera`.

It supports QR codes and compatible barcode formats recognized by Expo Camera.

For the most realistic test environment:

1. run PackSync on a physical Android or iOS device;
2. grant camera permission;
3. open the Scan tab;
4. point the camera at a supported QR code or barcode;
5. confirm that the package is persisted locally.

## Storybook

PackSync includes Storybook for developing and testing UI components independently from application screens.

### Web Storybook

```bash
yarn storybook:web
```

Storybook will normally be available at:

```text
http://localhost:6006
```

### iOS Storybook

```bash
yarn storybook:ios
```

### Android Storybook

```bash
yarn storybook:android
```

### Regenerate React Native stories

```bash
yarn storybook-generate
```

### Build the web Storybook

```bash
yarn build-storybook
```

## Testing

Run all unit tests:

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

The project includes tests for areas such as:

- package services;
- SQLite repositories;
- webhook synchronization;
- network reconciliation;
- package UI components;
- domain utilities.

## Code Quality

Run ESLint:

```bash
yarn lint
```

Automatically fix supported lint issues:

```bash
yarn lint:fix
```

Run TypeScript validation:

```bash
yarn typecheck
```

Check formatting:

```bash
yarn format:check
```

Format the project:

```bash
yarn format
```

Run the complete validation pipeline:

```bash
yarn validate
```

The validation command runs:

```text
Prettier check
    ↓
ESLint
    ↓
TypeScript
    ↓
Jest
```

For commit validation:

```bash
yarn validate:commit
```

## Development Build

Because PackSync uses native Expo modules, development builds are recommended for full native testing.

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

Avoid running `expo prebuild` unnecessarily if you have manual native changes that have not been accounted for in Expo configuration.

## Troubleshooting

### Environment variable changes are not reflected

Restart Metro with a clean cache:

```bash
yarn start --clear
```

For native development builds, rebuilding the application may also be necessary.

### Packages are not synchronizing

Check:

- the device has internet connectivity;
- `WEBSOCKET_URL` exists in `.env`;
- the configured endpoint accepts HTTP `POST` requests;
- the authenticated session is valid;
- the package has `deliveryStatus = pending`;
- Metro logs for messages beginning with `[PackageSync]`.

### Webhook returns an HTTP error

`WebhookPackageSyncGateway` logs HTTP failures with:

```text
[PackageSync][Webhook] request:http-error
```

The log contains information such as:

- package ID;
- package code;
- HTTP status.

### Network request fails

Network-level failures are logged with:

```text
[PackageSync][Webhook] request:network-error
```

The package remains pending and can be retried when connectivity is restored.

### Scanner does not work

Check:

- camera permission was granted;
- the device has a usable camera;
- the barcode format is supported by Expo Camera;
- the application is running in an environment with camera support.

A physical device is recommended for scanner testing.

## Useful Commands

| Command                  | Description                          |
| ------------------------ | ------------------------------------ |
| `yarn start`             | Start Expo                           |
| `yarn ios`               | Run iOS development build            |
| `yarn android`           | Run Android development build        |
| `yarn web`               | Run Expo Web                         |
| `yarn prebuild`          | Generate native projects             |
| `yarn lint`              | Run ESLint                           |
| `yarn lint:fix`          | Fix supported ESLint issues          |
| `yarn typecheck`         | Run TypeScript checks                |
| `yarn format`            | Format source files                  |
| `yarn format:check`      | Validate formatting                  |
| `yarn test`              | Run Jest                             |
| `yarn test:watch`        | Run Jest in watch mode               |
| `yarn test:coverage`     | Generate test coverage               |
| `yarn validate`          | Run the complete validation pipeline |
| `yarn storybook:web`     | Start Storybook for web              |
| `yarn storybook:ios`     | Run Storybook on iOS                 |
| `yarn storybook:android` | Run Storybook on Android             |
| `yarn build-storybook`   | Build Storybook                      |

## Security Notes

Do not commit production secrets or private environment configuration.

The `.env` file should remain outside version control.

Although Firebase client configuration is normally shipped with client applications, access must still be protected with correctly configured Firebase Authentication and backend security rules.

Webhook URLs can also provide access to external integrations. Treat production synchronization endpoints as environment-specific configuration and avoid exposing them unnecessarily.

Webhook receiver URLs generated by third-party tools should be treated as temporary development configuration. Do not commit generated endpoint IDs or production synchronization URLs to the repository.

## License

This project is currently maintained as a private/personal project unless otherwise specified.
