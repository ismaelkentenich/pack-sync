import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FirebaseAuth from "firebase/auth";
import type { Persistence } from "firebase/auth";

type ReactNativeAsyncStorage = {
  getItem(key: string): Promise<string | null>;

  setItem(key: string, value: string): Promise<void>;

  removeItem(key: string): Promise<void>;
};

type ReactNativePersistenceFactory = (
  storage: ReactNativeAsyncStorage,
) => Persistence;

type FirebaseAuthWithReactNativePersistence =
  typeof FirebaseAuth & {
    getReactNativePersistence?: ReactNativePersistenceFactory;
  };

export function getFirebaseReactNativePersistence(): Persistence {
  const firebaseAuth =
    FirebaseAuth as FirebaseAuthWithReactNativePersistence;

  const factory = firebaseAuth.getReactNativePersistence;

  if (!factory) {
    throw new Error(
      "Firebase React Native persistence is unavailable.",
    );
  }

  return factory(AsyncStorage);
}
