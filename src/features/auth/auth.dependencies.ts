import { FirebaseAuthRepository } from "@infrastructure/firebase/FirebaseAuthRepository";
import { auth } from "@infrastructure/firebase/config";
import { AuthService } from "./services/AuthService";

const authRepository = new FirebaseAuthRepository(auth);

export const authService = new AuthService(authRepository);
