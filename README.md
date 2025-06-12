# React Native Test App

A React Native application built with the Expo framework. This project is configured to support development via both the Expo Go app and custom development builds.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [Git](https://git-scm.com/)
-   [EAS CLI](https://docs.expo.dev/eas/getting-started/#install-eas-cli) (for creating custom builds)
    ```sh
    npm install -g eas-cli
    ```
-   **For iOS development:** A Mac with [Xcode](https://developer.apple.com/xcode/)
-   **For Android development:** [Android Studio](https://developer.android.com/studio)

## Installation

1.  Clone the repo
    ```sh
    git clone git@github.com:andreea-ghenu-welink/rn-test-app.git
    ```
2.  Navigate to the project directory
    ```sh
    cd rn-test-app
    ```
3.  Install NPM packages
    ```sh
    npm install
    ```

## Development Workflow

This project supports two main workflows for development.

### Path 1: Using Expo Go (Quick Start)

This method is best for quick prototyping and testing changes without needing to build the app.

1.  **Start the development server:**
    ```bash
    npm start
    ```
2.  **Connect your device:** Scan the QR code shown in the terminal with the Expo Go app (available on the App Store and Google Play Store).

### Path 2: Using a Development Build (Recommended)

This method gives you full native capabilities and is the standard for production-level apps.

1.  **Build the app:** First, you need to create a custom build of the app using EAS. Choose the command for your target platform.
    ```bash
    # For an Android device/emulator
    npm run build:dev:android

    # For an iOS simulator
    npm run build:dev:simulator

    # For a physical iOS device
    npm run build:dev:ios
    ```
2.  **Install the app:** Follow the link or scan the QR code provided by EAS to install the generated `.apk` or `.app` file onto your device or simulator.

3.  **Start the development server:** Run the specific server for development builds.
    ```bash
    npm run start:dev
    ```
4.  **Connect your device:** Open the newly installed app on your device. It will automatically connect to the development server.

## Available Scripts

Here is a complete list of the available scripts in this project.

| Command                   | Description                                                      |
| :------------------------ | :--------------------------------------------------------------- |
| **Start Development Servers** |                                                                  |
| `npm start`               | Starts the Metro server for use with the **Expo Go** app.        |
| `npm run start:dev`       | Starts the Metro server for use with a custom **Development Build**. |
| **Run on Expo Go (Shortcuts)** |                                                                  |
| `npm run start:android`  | Opens the app on a connected Android device/emulator using Expo Go. |
| `npm run start:ios`      | Opens the app on a connected iOS device/simulator using Expo Go. |
| `npm run start:web`         | Opens the app in a web browser.                                  |
| **Build with EAS for Development** |                                                                  |
| `npm run build:dev`       | Builds for both Android and iOS physical devices.                |
| `npm run build:dev:android` | Builds an `.apk` for Android devices and emulators.              |
| `npm run build:dev:ios`   | Builds an `.ipa` for physical iOS devices.                       |
| `npm run build:dev:simulator` | Builds an `.app` for the iOS simulator.                          |