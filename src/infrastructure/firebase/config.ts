import {
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import {
  Auth,
  getAuth,
  initializeAuth,
} from "firebase/auth";
import { Platform } from "react-native";
import { ENV } from "@config/env";
import { getFirebaseReactNativePersistence } from "./firebaseAuthPersistence";

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
};

export const firebaseApp =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

function createFirebaseAuth(): Auth {
  if (Platform.OS === "web") {
    return getAuth(firebaseApp);
  }

  try {
    return initializeAuth(firebaseApp, {
      persistence: getFirebaseReactNativePersistence(),
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "auth/already-initialized"
    ) {
      return getAuth(firebaseApp);
    }

    throw error;
  }
}

export const auth = createFirebaseAuth();
